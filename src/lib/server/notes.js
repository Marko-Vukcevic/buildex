// Daten-Operationen für die `notes`-Collection.
// Notizen-Timeline pro Projekt. Bewusst nur Add + List (kein Edit/Delete für historische Integrität).

import { ObjectId } from 'mongodb';
import { getNotesCollection } from './db.js';

export async function listNotesForProject(projectId) {
	const col = await getNotesCollection();
	const docs = await col.find({ projectId }).sort({ createdAt: -1 }).toArray();
	return docs.map(toPlainNote);
}

export async function addNote(data) {
	const errors = validate(data);
	if (errors) return { ok: false, errors };
	const col = await getNotesCollection();
	const insertResult = await col.insertOne({
		projectId: data.projectId,
		text: data.text.trim(),
		author: (data.author ?? 'Max Muster').trim(),
		createdAt: new Date()
	});
	return { ok: true, id: insertResult.insertedId.toString() };
}

export async function deleteNote(id) {
	if (!ObjectId.isValid(id)) return { ok: false };
	const col = await getNotesCollection();
	const res = await col.deleteOne({ _id: new ObjectId(id) });
	return { ok: res.deletedCount === 1 };
}

function validate(data) {
	const errors = {};
	if (!data.projectId) errors.projectId = 'Projekt-ID fehlt.';
	if (!data.text || !data.text.trim()) errors.text = 'Notiz darf nicht leer sein.';
	else if (data.text.length > 1000) errors.text = 'Maximal 1000 Zeichen.';
	if (data.author && data.author.length > 100) errors.author = 'Autor max 100 Zeichen.';
	return Object.keys(errors).length === 0 ? null : errors;
}

function toPlainNote(doc) {
	return {
		id: doc._id.toString(),
		projectId: doc.projectId,
		text: doc.text ?? '',
		author: doc.author ?? '',
		createdAt: doc.createdAt?.toISOString?.() ?? null
	};
}
