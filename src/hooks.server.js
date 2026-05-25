// SvelteKit-Hook: läuft bei jeder Anfrage, vor allen Routen.
// Liest die Session-Cookie und hängt den User (falls vorhanden) an event.locals.user.

import { getSessionUserId } from '$lib/server/session.js';
import { getUserById } from '$lib/server/users.js';

export async function handle({ event, resolve }) {
	const userId = getSessionUserId(event.cookies);
	if (userId) {
		try {
			const user = await getUserById(userId);
			event.locals.user = user; // null wenn User in DB nicht (mehr) existiert
		} catch (e) {
			console.error('Session-Lookup fehlgeschlagen:', e);
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}
	return resolve(event);
}
