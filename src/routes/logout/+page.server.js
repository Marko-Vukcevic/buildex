import { redirect } from '@sveltejs/kit';
import { clearSession } from '$lib/server/session.js';

// Logout via GET-Link funktioniert auch — wir akzeptieren beides.
export async function load({ cookies }) {
	clearSession(cookies);
	throw redirect(303, '/login');
}

export const actions = {
	default: async ({ cookies }) => {
		clearSession(cookies);
		throw redirect(303, '/login');
	}
};
