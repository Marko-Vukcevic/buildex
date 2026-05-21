// Lädt Projektliste mit optionalen Filtern aus URL-Query-Parametern.
// /?search=Stein&status=laufend → gefilterte Liste.

import { listProjects, projectStats } from '$lib/server/projects.js';

export async function load({ url }) {
	const search = url.searchParams.get('search') ?? '';
	const status = url.searchParams.get('status') ?? '';
	const [projects, stats] = await Promise.all([
		listProjects({ search, status }),
		projectStats()
	]);
	return {
		projects,
		stats,
		filters: { search, status }
	};
}
