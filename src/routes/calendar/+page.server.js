// Kalender-Loader im Mockup-Stil:
// - Wochen-Grid (Mo-Fr Default, optional Mo-So)
// - Mini-Kalender: aktueller Monat mit count pro Tag (für die Punkte unter Datum)
// - Tages-Detail: gewählter Tag (Default heute oder erster der Woche)
// - Konflikt-Detection unverändert

import { listDeliveriesInRange } from '$lib/server/deliveries.js';
import { listProjects } from '$lib/server/projects.js';

export async function load({ url }) {
	const weekParam = url.searchParams.get('week');
	const dayParam = url.searchParams.get('day'); // ausgewählter Tag für Detail-Panel
	const today = new Date();

	const monday = weekParam ? parseDate(weekParam) : startOfWeek(today);
	const sunday = addDays(monday, 6);

	const fromISO = isoDate(monday);
	const toISO = isoDate(sunday);

	// Für Mini-Kalender: ganzer Monat
	const monthStart = new Date(monday.getFullYear(), monday.getMonth(), 1);
	const monthEnd = new Date(monday.getFullYear(), monday.getMonth() + 1, 0);

	const [weekDeliveries, monthDeliveries, projects] = await Promise.all([
		listDeliveriesInRange(fromISO, toISO),
		listDeliveriesInRange(isoDate(monthStart), isoDate(monthEnd)),
		listProjects()
	]);

	const projectMap = Object.fromEntries(projects.map((p) => [p.id, p]));

	// Tage der Woche
	const days = [];
	for (let i = 0; i < 7; i++) {
		const day = addDays(monday, i);
		const dayISO = isoDate(day);
		const dayDeliveries = weekDeliveries.filter((d) => d.scheduledDate === dayISO);

		const byProject = {};
		for (const d of dayDeliveries) byProject[d.projectId] = (byProject[d.projectId] || 0) + 1;
		const conflicts = Object.entries(byProject)
			.filter(([, count]) => count > 3)
			.map(([pid, count]) => ({
				projectId: pid,
				projectName: projectMap[pid]?.name ?? '?',
				count
			}));

		const enriched = dayDeliveries.map((d) => ({
			...d,
			projectName: projectMap[d.projectId]?.name ?? '(Projekt gelöscht)',
			projectStatus: projectMap[d.projectId]?.status ?? '',
			inConflict: byProject[d.projectId] > 3
		}));

		days.push({
			date: dayISO,
			weekday: day.toLocaleDateString('de-CH', { weekday: 'short' }),
			weekdayLong: day.toLocaleDateString('de-CH', { weekday: 'long' }),
			dayNum: day.getDate(),
			month: day.toLocaleDateString('de-CH', { month: 'short' }),
			isToday: dayISO === isoDate(today),
			deliveries: enriched,
			conflicts
		});
	}

	// Mini-Kalender-Daten: ganzer Monat als Grid mit count
	const monthDays = buildMonthGrid(monday.getFullYear(), monday.getMonth(), monthDeliveries);

	// Tag fürs Detail-Panel
	const detailDateISO = dayParam ||
		(days.find((d) => d.isToday)?.date ?? days[0].date);
	const detailDay = days.find((d) => d.date === detailDateISO) ?? days[0];

	// Anreichern fürs Detail-Panel
	const detailDeliveries = (weekDeliveries.filter((d) => d.scheduledDate === detailDay.date))
		.map((d) => ({
			...d,
			projectName: projectMap[d.projectId]?.name ?? '?'
		}))
		.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

	const prevWeek = isoDate(addDays(monday, -7));
	const nextWeek = isoDate(addDays(monday, 7));
	const thisWeek = isoDate(startOfWeek(new Date()));

	return {
		weekStart: fromISO,
		weekEnd: toISO,
		monthLabel: monday.toLocaleDateString('de-CH', { month: 'long' }),
		monthYear: monday.getFullYear(),
		days,
		monthDays,
		detailDay: {
			...detailDay,
			fullDate: new Date(detailDay.date + 'T12:00:00').toLocaleDateString('de-CH', {
				weekday: 'long',
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
		},
		detailDeliveries,
		prevWeek,
		nextWeek,
		thisWeek,
		totalDeliveries: weekDeliveries.length,
		totalConflicts: days.reduce((s, d) => s + d.conflicts.length, 0)
	};
}

function buildMonthGrid(year, month, deliveries) {
	// Mini-Kalender Sonntag-zuerst (wie im Mockup: SUN MON TUE WED THU FRI SAT)
	const firstDay = new Date(year, month, 1);
	const lastDay = new Date(year, month + 1, 0);
	const result = [];
	// vorausgehende Tage des Vor-Monats
	const startWeekday = firstDay.getDay(); // 0 = Sonntag
	for (let i = startWeekday; i > 0; i--) {
		const d = new Date(year, month, 1 - i);
		result.push({ day: d.getDate(), iso: isoDate(d), inMonth: false, count: 0 });
	}
	// Aktueller Monat
	for (let d = 1; d <= lastDay.getDate(); d++) {
		const date = new Date(year, month, d);
		const iso = isoDate(date);
		const count = deliveries.filter((x) => x.scheduledDate === iso).length;
		result.push({
			day: d,
			iso,
			inMonth: true,
			count,
			isToday: iso === isoDate(new Date())
		});
	}
	// Fülltage des nächsten Monats bis 42-Felder (6 Wochen)
	while (result.length < 42) {
		const last = result[result.length - 1];
		const next = new Date(last.iso + 'T12:00:00');
		next.setDate(next.getDate() + 1);
		result.push({ day: next.getDate(), iso: isoDate(next), inMonth: false, count: 0 });
	}
	return result;
}

function startOfWeek(d) {
	const date = new Date(d);
	const day = date.getDay();
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
