// Daten-Operationen für die `deliveries`-Collection.
// Eine Delivery gehört zu einem Projekt (projectId-Referenz).

import { ObjectId } from 'mongodb';
import { getDeliveriesCollection } from './db.js';
import { getMaterial } from './materials.js';

export const DELIVERY_STATUS = ['bestellt', 'bestaetigt', 'unterwegs', 'angekommen', 'verrechnet'];
export const STATUS_LABEL = {
	bestellt: 'bestellt',
	bestaetigt: 'bestätigt',
	unterwegs: 'unterwegs',
	angekommen: 'angekommen',
	verrechnet: 'verrechnet'
};

/**
 * Alle Lieferungen für ein Projekt.
 */
export async function listDeliveriesForProject(projectId) {
	const col = await getDeliveriesCollection();
	const docs = await col.find({ projectId }).sort({ scheduledDate: 1 }).toArray();
	return docs.map(toPlainDelivery);
}

/**
 * Alle Lieferungen über alle Projekte in einem Zeitraum (für Kalender).
 */
export async function listDeliveriesInRange(fromDate, toDate) {
	const col = await getDeliveriesCollection();
	const docs = await col
		.find({ scheduledDate: { $gte: fromDate, $lte: toDate } })
		.sort({ scheduledDate: 1 })
		.toArray();
	return docs.map(toPlainDelivery);
}

export async function getDelivery(id) {
	if (!ObjectId.isValid(id)) return null;
	const col = await getDeliveriesCollection();
	const doc = await col.findOne({ _id: new ObjectId(id) });
	return doc ? toPlainDelivery(doc) : null;
}

export async function createDelivery(data) {
	const errors = validate(data);
	if (errors) return { ok: false, errors };

	const co2 = await calculateAndStoreCo2(data.materialKey, Number(data.quantity));
	const col = await getDeliveriesCollection();
	const insertResult = await col.insertOne({
		projectId: data.projectId,
		material: data.material?.trim() || '',
		materialKey: data.materialKey || '',
		quantity: Number(data.quantity) || 0,
		unit: data.unit?.trim() || '',
		supplier: data.supplier?.trim() || '',
		scheduledDate: data.scheduledDate || '',
		status: data.status || 'bestellt',
		notes: (data.notes ?? '').trim(),
		co2Kg: co2,
		createdAt: new Date(),
		updatedAt: new Date()
	});
	return { ok: true, id: insertResult.insertedId.toString() };
}

export async function updateDelivery(id, data) {
	if (!ObjectId.isValid(id)) return { ok: false, errors: { _: 'Ungültige ID.' } };
	const errors = validate(data);
	if (errors) return { ok: false, errors };

	const co2 = await calculateAndStoreCo2(data.materialKey, Number(data.quantity));
	const col = await getDeliveriesCollection();
	const res = await col.updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: {
				material: data.material?.trim() || '',
				materialKey: data.materialKey || '',
				quantity: Number(data.quantity) || 0,
				unit: data.unit?.trim() || '',
				supplier: data.supplier?.trim() || '',
				scheduledDate: data.scheduledDate || '',
				status: data.status || 'bestellt',
				notes: (data.notes ?? '').trim(),
				co2Kg: co2,
				updatedAt: new Date()
			}
		}
	);
	if (res.matchedCount === 0) {
		return { ok: false, errors: { _: 'Lieferung nicht gefunden.' } };
	}
	return { ok: true };
}

/**
 * Quick-Update nur des Status (für Status-Workflow-Buttons).
 */
export async function setDeliveryStatus(id, status) {
	if (!ObjectId.isValid(id)) return { ok: false, error: 'Ungültige ID.' };
	if (!DELIVERY_STATUS.includes(status)) return { ok: false, error: 'Ungültiger Status.' };
	const col = await getDeliveriesCollection();
	const res = await col.updateOne(
		{ _id: new ObjectId(id) },
		{ $set: { status, updatedAt: new Date() } }
	);
	return { ok: res.matchedCount === 1 };
}

export async function deleteDelivery(id) {
	if (!ObjectId.isValid(id)) return { ok: false, error: 'Ungültige ID' };
	const col = await getDeliveriesCollection();
	const res = await col.deleteOne({ _id: new ObjectId(id) });
	return { ok: res.deletedCount === 1 };
}

/**
 * Summen pro Projekt: Anzahl Lieferungen, Anzahl überfällig, CO2-Total.
 */
export async function deliverySummaryForProject(projectId) {
	const col = await getDeliveriesCollection();
	const today = new Date().toISOString().slice(0, 10);
	const all = await col.find({ projectId }).toArray();
	const total = all.length;
	const overdue = all.filter(
		(d) => d.scheduledDate && d.scheduledDate < today && d.status !== 'angekommen' && d.status !== 'verrechnet'
	).length;
	const co2Total = all.reduce((s, d) => s + (d.co2Kg || 0), 0);
	const byStatus = {};
	for (const s of DELIVERY_STATUS) byStatus[s] = 0;
	for (const d of all) if (byStatus[d.status] !== undefined) byStatus[d.status]++;
	return { total, overdue, co2Total, byStatus };
}

/**
 * Globale CO2-Summe (für Stats-Page).
 */
export async function globalCo2Stats() {
	const col = await getDeliveriesCollection();
	const all = await col.find({}).toArray();
	const totalCo2 = all.reduce((s, d) => s + (d.co2Kg || 0), 0);
	const byMaterial = {};
	for (const d of all) {
		if (!d.material) continue;
		byMaterial[d.material] = (byMaterial[d.material] || 0) + (d.co2Kg || 0);
	}
	// Top 5 Materialien nach CO2
	const top = Object.entries(byMaterial)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5)
		.map(([name, co2Kg]) => ({ name, co2Kg }));
	return { totalCo2, top };
}

// --- Helpers ---

function validate(data) {
	const errors = {};
	if (!data.projectId) errors.projectId = 'Projekt-ID fehlt.';
	if (!data.material || !data.material.trim()) errors.material = 'Material ist Pflicht.';
	if (!data.quantity || Number(data.quantity) <= 0) errors.quantity = 'Menge muss > 0 sein.';
	if (!data.unit || !data.unit.trim()) errors.unit = 'Einheit ist Pflicht.';
	if (!data.scheduledDate) errors.scheduledDate = 'Liefertermin ist Pflicht.';
	if (data.status && !DELIVERY_STATUS.includes(data.status)) errors.status = 'Ungültiger Status.';
	if (data.supplier && data.supplier.length > 200) errors.supplier = 'Lieferant max 200 Zeichen.';
	if (data.notes && data.notes.length > 1000) errors.notes = 'Notizen max 1000 Zeichen.';
	return Object.keys(errors).length === 0 ? null : errors;
}

async function calculateAndStoreCo2(materialKey, quantity) {
	if (!materialKey || !quantity || quantity <= 0) return 0;
	const mat = await getMaterial(materialKey);
	if (!mat) return 0;
	return Math.round(mat.co2PerUnit * quantity);
}

function toPlainDelivery(doc) {
	const today = new Date().toISOString().slice(0, 10);
	const overdue =
		doc.scheduledDate &&
		doc.scheduledDate < today &&
		doc.status !== 'angekommen' &&
		doc.status !== 'verrechnet';
	return {
		id: doc._id.toString(),
		projectId: doc.projectId,
		material: doc.material ?? '',
		materialKey: doc.materialKey ?? '',
		quantity: doc.quantity ?? 0,
		unit: doc.unit ?? '',
		supplier: doc.supplier ?? '',
		scheduledDate: doc.scheduledDate ?? '',
		status: doc.status ?? 'bestellt',
		notes: doc.notes ?? '',
		co2Kg: doc.co2Kg ?? 0,
		overdue,
		createdAt: doc.createdAt?.toISOString?.() ?? null,
		updatedAt: doc.updatedAt?.toISOString?.() ?? null
	};
}
