import { error, redirect, fail } from '@sveltejs/kit';
import { getProject } from '$lib/server/projects.js';
import { createDelivery, DELIVERY_STATUS } from '$lib/server/deliveries.js';
import { listMaterials } from '$lib/server/materials.js';

export async function load({ params }) {
	const project = await getProject(params.id);
	if (!project) throw error(404, 'Projekt nicht gefunden.');
	const materials = await listMaterials();
	return { project, materials, statusOptions: DELIVERY_STATUS };
}

export const actions = {
	default: async ({ request, params }) => {
		const data = Object.fromEntries(await request.formData());
		const result = await createDelivery({ ...data, projectId: params.id });
		if (!result.ok) return fail(400, { errors: result.errors, values: data });
		throw redirect(303, `/projects/${params.id}`);
	}
};
