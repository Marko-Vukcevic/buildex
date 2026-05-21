import { redirect, fail } from '@sveltejs/kit';
import { createProject } from '$lib/server/projects.js';

export const actions = {
	default: async ({ request }) => {
		const data = Object.fromEntries(await request.formData());
		const result = await createProject(data);
		if (!result.ok) {
			return fail(400, { errors: result.errors, values: data });
		}
		throw redirect(303, `/projects/${result.id}`);
	}
};
