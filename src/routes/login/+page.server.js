import { fail, redirect } from '@sveltejs/kit';
import { loginUser } from '$lib/server/users.js';
import { setSession } from '$lib/server/session.js';

export async function load({ locals, url }) {
	if (locals.user) {
		const redirectTo = url.searchParams.get('redirectTo') || '/';
		throw redirect(303, redirectTo);
	}
	return { redirectTo: url.searchParams.get('redirectTo') || '/' };
}

export const actions = {
	default: async ({ request, cookies, url }) => {
		const data = Object.fromEntries(await request.formData());
		const result = await loginUser(data);
		if (!result.ok) {
			return fail(400, { errors: result.errors, values: { email: data.email } });
		}
		setSession(cookies, result.user.id);
		const redirectTo = data.redirectTo || url.searchParams.get('redirectTo') || '/';
		throw redirect(303, redirectTo);
	}
};
