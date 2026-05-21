// Daten-Operationen für die `projects`-Collection. Zentralisiert alle DB-Aufrufe.
// Vorteil: die Routen müssen nichts über MongoDB-Interna wissen.

import { ObjectId } from 'mongodb';
import { getProjectsCollection } from './db.js';

const VALID_STATUS = ['offen', 'laufend', 'pausiert', 'abgeschlossen'];

/**
 * Holt alle Projekte, optional gefiltert nach Suchbegriff oder Status.
 */
export async function listProjects({ search = '', status = '' } = {}) {
	const col = await getProjectsCollection();
	const query = {};
	if (status) query.status = status;
	if (search) {
		// Case-insensitive Match in name oder address.
		const re = new RegExp(escapeRegex(search), 'i');
		query.$or = [{ name: re }, { address: re }];
	}
	const docs = await col.find(query).sort({ _id: -1 }).toArray();
	return docs.map(toPlainProject);
}

/**
 * Holt ein einzelnes Projekt anhand der MongoDB ObjectId.
 * Liefert null wenn nicht gefunden oder ID ungültig.
 */
export async function getProject(id) {
	if (!ObjectId.isValid(id)) return null;
	const col = await getProjectsCollection();
	const doc = await col.findOne({ _id: new ObjectId(id) });
	return doc ? toPlainProject(doc) : null;
}

/**
 * Validiert + erstellt ein Projekt. Wirft eine ValidationError-ähnliche Antwort,
 * wenn Eingaben nicht stimmen.
 */
export async function createProject(data) {
	const errors = validate(data);
	if (errors) return { ok: false, errors };

	const col = await getProjectsCollection();
	const insertResult = await col.insertOne({
		name: data.name.trim(),
		address: (data.address ?? '').trim(),
		startDate: data.startDate ?? '',
		endDate: data.endDate ?? '',
		status: data.status || 'offen',
		notes: (data.notes ?? '').trim(),
		createdAt: new Date(),
		updatedAt: new Date()
	});
	return { ok: true, id: insertResult.insertedId.toString() };
}

/**
 * Aktualisiert ein bestehendes Projekt.
 */
export async function updateProject(id, data) {
	if (!ObjectId.isValid(id)) return { ok: false, errors: { _: 'Ungültige Projekt-ID.' } };
	const errors = validate(data);
	if (errors) return { ok: false, errors };

	const col = await getProjectsCollection();
	const res = await col.updateOne(
		{ _id: new ObjectId(id) },
		{
			$set: {
				name: data.name.trim(),
				address: (data.address ?? '').trim(),
				startDate: data.startDate ?? '',
				endDate: data.endDate ?? '',
				status: data.status || 'offen',
				notes: (data.notes ?? '').trim(),
				updatedAt: new Date()
			}
		}
	);
	if (res.matchedCount === 0) {
		return { ok: false, errors: { _: 'Projekt nicht gefunden.' } };
	}
	return { ok: true };
}

/**
 * Löscht ein Projekt.
 */
export async function deleteProject(id) {
	if (!ObjectId.isValid(id)) return { ok: false, error: 'Ungültige ID' };
	const col = await getProjectsCollection();
	const res = await col.deleteOne({ _id: new ObjectId(id) });
	return { ok: res.deletedCount === 1 };
}

/**
 * Aggregierte Statistiken für das Dashboard (Erweiterung).
 */
export async function projectStats() {
	const col = await getProjectsCollection();
	const total = await col.countDocuments({});
	const byStatusAgg = await col
		.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
		.toArray();
	const byStatus = Object.fromEntries(byStatusAgg.map((r) => [r._id || 'offen', r.count]));

	// Letzte 5 Projekte (für Sidebar oder Stats-Page)
	const recent = await col.find().sort({ _id: -1 }).limit(5).toArray();
	return {
		total,
		byStatus,
		recent: recent.map(toPlainProject)
	};
}

// --- Helpers ---

function validate(data) {
	const errors = {};
	if (!data.name || !data.name.trim()) {
		errors.name = 'Projektname ist Pflicht.';
	} else if (data.name.length > 100) {
		errors.name = 'Maximal 100 Zeichen.';
	}
	if (data.status && !VALID_STATUS.includes(data.status)) {
		errors.status = 'Ungültiger Status.';
	}
	if (data.startDate && data.endDate && data.startDate > data.endDate) {
		errors.endDate = 'Ende muss nach Start liegen.';
	}
	if (data.address && data.address.length > 200) {
		errors.address = 'Adresse maximal 200 Zeichen.';
	}
	if (data.notes && data.notes.length > 2000) {
		errors.notes = 'Notizen maximal 2000 Zeichen.';
	}
	return Object.keys(errors).length === 0 ? null : errors;
}

function toPlainProject(doc) {
	return {
		id: doc._id.toString(),
		name: doc.name ?? '',
		address: doc.address ?? '',
		startDate: doc.startDate ?? '',
		endDate: doc.endDate ?? '',
		status: doc.status ?? 'offen',
		notes: doc.notes ?? '',
		createdAt: doc.createdAt?.toISOString?.() ?? null,
		updatedAt: doc.updatedAt?.toISOString?.() ?? null
	};
}

function escapeRegex(s) {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
