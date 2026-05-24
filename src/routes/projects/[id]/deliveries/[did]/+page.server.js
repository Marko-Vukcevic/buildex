import { error, redirect, fail } from '@sveltejs/kit';
import { getProject } from '$lib/server/projects.js';
import { getDelivery, updateDelivery, deleteDelivery, DELIVERY_STATUS } from '$lib/server/deliveries.js';
import { listMaterials } from '$lib/server/materials.js';

export async function load({ params }) {
	const project = await getProject(params.id);
	if (!project) throw error(404, 'Projekt nicht gefunden.');
	const delivery = await getDelivery(params.did);
	if (!delivery) throw error(404, 'Lieferung nicht gefunden.');
	const materials = await listMaterials();
	return { project, delivery, materials, statusOptions: DELIVERY_STATUS };
}

export const actions = {
	update: async ({ request, params }) => {
		const data = Object.fromEntries(await request.formData());
		const result = await updateDelivery(params.did, { ...data, projectId: params.id });
		if (!result.ok) return fail(400, { errors: result.errors, values: data });
		throw redirect(303, `/projects/${params.id}`);
	},
	delete: async ({ params }) => {
		await deleteDelivery(params.did);
		throw redirect(303, `/projects/${params.id}`);
	}
};
