// Server-Load-Funktion für die Übersichtsseite (/).
// Wird auf dem Server ausgeführt, holt die Projektliste aus MongoDB und gibt sie an die Page-Komponente.

import { getProjectsCollection } from '$lib/server/db.js';

export async function load() {
	const projects = await getProjectsCollection();
	// Neuste zuerst. _id sortiert grob nach Erstellungszeit (ObjectId hat Timestamp eingebaut).
	const docs = await projects.find().sort({ _id: -1 }).toArray();

	// _id ist eine MongoDB ObjectId-Instanz — kann nicht direkt durchs Netz an den Client.
	// Wir konvertieren zu plain Objects mit String-IDs.
	return {
		projects: docs.map((p) => ({
			id: p._id.toString(),
			name: p.name ?? '',
			address: p.address ?? '',
			startDate: p.startDate ?? '',
			endDate: p.endDate ?? '',
			status: p.status ?? 'offen'
		}))
	};
}
