import { listDeliveriesInRange } from '$lib/server/deliveries.js';
import { listProjects } from '$lib/server/projects.js';

/**
 * Lädt eine Wochenansicht: Mo-So.
 * URL-Param `?week=YYYY-MM-DD` (= Montag der Woche), Default: aktuelle Woche.
 */
export async function load({ url }) {
	const weekParam = url.searchParams.get('week');
	const monday = weekParam ? parseDate(weekParam) : startOfWeek(new Date());
	const sunday = addDays(monday, 6);

	const fromISO = isoDate(monday);
	const toISO = isoDate(sunday);

	const [deliveries, projects] = await Promise.all([
		listDeliveriesInRange(fromISO, toISO),
		listProjects()
	]);

	// Projekt-Lookup für Anzeige
	const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));

	// Gruppieren nach (Tag, Projekt-ID) für Konflikt-Erkennung
	const days = [];
	for (let i = 0; i < 7; i++) {
		const day = addDays(monday, i);
		const dayISO = isoDate(day);
		const dayDeliveries = deliveries.filter((d) => d.scheduledDate === dayISO);

		// Konflikte: > 3 Lieferungen auf gleicher Baustelle/Tag
		const byProject = {};
		for (const d of dayDeliveries) {
			byProject[d.projectId] = (byProject[d.projectId] || 0) + 1;
		}
		const conflicts = Object.entries(byProject)
			.filter(([, count]) => count > 3)
			.map(([pid, count]) => ({
				projectId: pid,
				projectName: projectMap[pid]?.name ?? '?',
				count
			}));

		// Anreichern mit Projekt-Name + Konflikt-Flag
		const enriched = dayDeliveries.map((d) => ({
			...d,
			projectName: projectMap[d.projectId]?.name ?? '(Projekt gelöscht)',
			projectStatus: projectMap[d.projectId]?.status ?? '',
			inConflict: byProject[d.projectId] > 3
		}));

		days.push({
			date: dayISO,
			weekday: day.toLocaleDateString('de-CH', { weekday: 'short' }),
			dayNum: day.getDate(),
			month: day.toLocaleDateString('de-CH', { month: 'short' }),
			isToday: dayISO === isoDate(new Date()),
			deliveries: enriched,
			conflicts
		});
	}

	const prevWeek = isoDate(addDays(monday, -7));
	const nextWeek = isoDate(addDays(monday, 7));
	const thisWeek = isoDate(startOfWeek(new Date()));

	return {
		weekStart: fromISO,
		weekEnd: toISO,
		days,
		prevWeek,
		nextWeek,
		thisWeek,
		totalDeliveries: deliveries.length,
		totalConflicts: days.reduce((s, d) => s + d.conflicts.length, 0)
	};
}

function startOfWeek(d) {
	const date = new Date(d);
	const day = date.getDay(); // 0 = So, 1 = Mo
	const diff = day === 0 ? -6 : 1 - day;
	date.setDate(date.getDate() + diff);
	date.setHours(0, 0, 0, 0);
	return date;
}
function addDays(d, n) {
	const r = new Date(d);
	r.setDate(r.getDate() + n);
	return r;
}
function isoDate(d) {
	const yyyy = d.getFullYear();
	const mm = String(d.getMonth() + 1).padStart(2, '0');
	const dd = String(d.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
}
function parseDate(s) {
	const [y, m, d] = s.split('-').map(Number);
	return new Date(y, m - 1, d);
}
