import { error, redirect, fail } from '@sveltejs/kit';
import { getProject, updateProject, deleteProject } from '$lib/server/projects.js';
import {
	listDeliveriesForProject,
	deliverySummaryForProject,
	setDeliveryStatus,
	deleteDelivery,
	DELIVERY_STATUS
} from '$lib/server/deliveries.js';
import { listNotesForProject, addNote, deleteNote } from '$lib/server/notes.js';

export async function load({ params }) {
	const project = await getProject(params.id);
	if (!project) throw error(404, 'Projekt nicht gefunden.');
	const [deliveries, deliverySummary, notes] = await Promise.all([
		listDeliveriesForProject(params.id),
		deliverySummaryForProject(params.id),
		listNotesForProject(params.id)
	]);
	return {
		project,
		deliveries,
		deliverySummary,
		notes,
		statusOptions: DELIVERY_STATUS
	};
}

export const actions = {
	update: async ({ request, params }) => {
		const data = Object.fromEntries(await request.formData());
		const result = await updateProject(params.id, data);
		if (!result.ok) return fail(400, { errors: result.errors, values: data });
		return { success: true };
	},
	delete: async ({ params }) => {
		await deleteProject(params.id);
		throw redirect(303, '/');
	},
	addNote: async ({ request, params }) => {
		const formData = await request.formData();
		const result = await addNote({
			projectId: params.id,
			text: formData.get('text'),
			author: formData.get('author') || 'Max Muster'
		});
		if (!result.ok) return fail(400, { noteErrors: result.errors });
		return { noteAdded: true };
	},
	deleteNote: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('noteId');
		await deleteNote(id);
		return { success: true };
	},
	deleteDelivery: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('deliveryId');
		await deleteDelivery(id);
		return { success: true };
	},
	setDeliveryStatus: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('deliveryId');
		const status = formData.get('status');
		await setDeliveryStatus(id, status);
		return { success: true };
	}
};
