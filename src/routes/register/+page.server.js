import { fail, redirect } from '@sveltejs/kit';
import { registerUser } from '$lib/server/users.js';
import { setSession } from '$lib/server/session.js';

export async function load({ locals }) {
	if (locals.user) throw redirect(303, '/');
	return {};
}

export const actions = {
	default: async ({ request, cookies }) => {
		const data = Object.fromEntries(await request.formData());
		const result = await registerUser(data);
		if (!result.ok) {
			return fail(400, {
				errors: result.errors,
				values: { email: data.email, username: data.username, company: data.company }
			});
		}
		setSession(cookies, result.userId);
		throw redirect(303, '/');
	}
};
