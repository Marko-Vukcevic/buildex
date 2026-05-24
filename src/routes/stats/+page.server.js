import { projectStats, listProjects } from '$lib/server/projects.js';
import { globalCo2Stats } from '$lib/server/deliveries.js';

export async function load() {
	const [stats, all, co2] = await Promise.all([
		projectStats(),
		listProjects(),
		globalCo2Stats()
	]);
	return { stats, total: all.length, co2 };
}
