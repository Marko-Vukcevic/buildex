// Server-Action für das Formular zum Anlegen eines neuen Projekts.
// Schreibt nach MongoDB und leitet danach auf die Übersichtsseite zurück.

import { redirect } from '@sveltejs/kit';
import { getProjectsCollection } from '$lib/server/db.js';

export const actions = {
	// `default` wird beim Submit eines <form method="POST">-Forms ohne explizites `?/name` aufgerufen.
	default: async ({ request }) => {
		const data = await request.formData();
		const name = data.get('name')?.toString().trim();
		const address = data.get('address')?.toString().trim() ?? '';
		const startDate = data.get('startDate')?.toString() ?? '';
		const endDate = data.get('endDate')?.toString() ?? '';
		const status = data.get('status')?.toString() ?? 'offen';

		// Minimale Validierung: Name ist Pflicht.
		if (!name) {
			return {
				error: 'Bitte gib einen Projektnamen ein.',
				values: { name, address, startDate, endDate, status }
			};
		}

		const projects = await getProjectsCollection();
		await projects.insertOne({
			name,
			address,
			startDate,
			endDate,
			status,
			createdAt: new Date()
		});

		// Redirect zur Übersicht — Status 303 ist Standard für POST→GET nach Form-Submit.
		throw redirect(303, '/');
	}
};
