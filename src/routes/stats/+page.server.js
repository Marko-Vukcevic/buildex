import { projectStats, listProjects } from '$lib/server/projects.js';

export async function load() {
	const [stats, all] = await Promise.all([projectStats(), listProjects()]);
	return { stats, total: all.length };
}
