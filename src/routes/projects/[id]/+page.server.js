import { error, redirect, fail } from '@sveltejs/kit';
import { getProject, updateProject, deleteProject } from '$lib/server/projects.js';

export async function load({ params }) {
	const project = await getProject(params.id);
	if (!project) throw error(404, 'Projekt nicht gefunden.');
	return { project };
}

export const actions = {
	update: async ({ request, params }) => {
		const data = Object.fromEntries(await request.formData());
		const result = await updateProject(params.id, data);
		if (!result.ok) {
			return fail(400, { errors: result.errors, values: data });
		}
		return { success: true };
	},
	delete: async ({ params }) => {
		await deleteProject(params.id);
		throw redirect(303, '/');
	}
};
