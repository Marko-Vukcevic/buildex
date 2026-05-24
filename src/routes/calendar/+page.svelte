<script>
	let { data } = $props();
	let days = $derived(data.days);

	const STATUS_COLOR = {
		bestellt: '#94a3b8',
		bestaetigt: '#f59e0b',
		unterwegs: '#3b82f6',
		angekommen: '#10b981',
		verrechnet: '#6b7280'
	};

	function rangeLabel(start, end) {
		const s = new Date(start + 'T12:00:00');
		const e = new Date(end + 'T12:00:00');
		const startStr = s.toLocaleDateString('de-CH', { day: '2-digit', month: 'short' });
		const endStr = e.toLocaleDateString('de-CH', {
			day: '2-digit',
			month: 'short',
			year: 'numeric'
		});
		return `${startStr} – ${endStr}`;
	}
</script>

<svelte:head>
	<title>Wochenkalender – BUILDEX</title>
</svelte:head>

<header class="header">
	<div>
		<h1>Wochenkalender</h1>
		<p class="muted">{data.totalDeliveries} Lieferungen in dieser Woche</p>
	</div>
	<div class="nav">
		<a class="btn btn-secondary" href="?week={data.prevWeek}">← Vorwoche</a>
		<a class="btn btn-secondary" href="?week={data.thisWeek}">Heute</a>
		<span class="range">{rangeLabel(data.weekStart, data.weekEnd)}</span>
		<a class="btn btn-secondary" href="?week={data.nextWeek}">Folgewoche →</a>
	</div>
</header>

{#if data.totalConflicts > 0}
	<div class="conflict-banner">
		⚠ {data.totalConflicts} Tag{data.totalConflicts > 1 ? 'e' : ''} mit Lieferungs-Konflikt
		(mehr als 3 Lieferungen auf derselben Baustelle am gleichen Tag — Koordination prüfen!)
	</div>
{/if}

<div class="grid">
	{#each days as day (day.date)}
		<div class="day" class:today={day.isToday} class:has-conflict={day.conflicts.length > 0}>
			<div class="day-head">
				<div class="weekday">{day.weekday}</div>
				<div class="daynum">{day.dayNum}</div>
				<div class="month">{day.month}</div>
				{#if day.isToday}<div class="today-tag">Heute</div>{/if}
			</div>

			{#if day.conflicts.length > 0}
				<div class="day-conflict">
					{#each day.conflicts as c}
						<div title="Konflikt: {c.count} Lieferungen auf {c.projectName} am gleichen Tag">
							⚠ {c.projectName}: {c.count}×
						</div>
					{/each}
				</div>
			{/if}

			<div class="cards">
				{#each day.deliveries as d (d.id)}
					<a
						href="/projects/{d.projectId}/deliveries/{d.id}"
						class="card"
						class:overdue={d.overdue}
						class:conflict={d.inConflict}
						style="border-left-color: {STATUS_COLOR[d.status]};"
					>
						<div class="card-project">{d.projectName}</div>
						<div class="card-material">{d.material}</div>
						<div class="card-meta">
							{d.quantity} {d.unit} · {d.supplier || '–'}
						</div>
						<div class="card-status" style="color: {STATUS_COLOR[d.status]};">
							{d.status}
						</div>
					</a>
				{/each}
				{#if day.deliveries.length === 0}
					<div class="empty-day">–</div>
				{/if}
			</div>
		</div>
	{/each}
</div>

<style>
	.header {
		padding: var(--sp-6) var(--sp-6) var(--sp-4);
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: space-between;
		gap: var(--sp-4);
	}
	h1 {
		margin: 0 0 var(--sp-1);
		font-size: 1.75rem;
	}
	.muted {
		color: var(--c-text-muted);
		margin: 0;
	}
	.nav {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
	}
	.range {
		font-weight: 600;
		padding: 0 var(--sp-3);
	}

	.conflict-banner {
		margin: 0 var(--sp-6) var(--sp-4);
		padding: var(--sp-3) var(--sp-4);
		background: #fef2f2;
		border: 1px solid #fca5a5;
		border-radius: var(--radius-sm);
		color: #991b1b;
		font-size: 0.9rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: var(--sp-2);
		padding: 0 var(--sp-6) var(--sp-7);
	}

	.day {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-3);
		min-height: 320px;
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
	}
	.day.today {
		border-color: var(--c-yellow);
		box-shadow: 0 0 0 2px rgba(251, 192, 45, 0.15);
	}
	.day.has-conflict {
		background: #fff7ed;
		border-color: #fb923c;
	}

	.day-head {
		text-align: center;
		padding-bottom: var(--sp-2);
		border-bottom: 1px solid var(--c-border);
		position: relative;
	}
	.weekday {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--c-text-muted);
	}
	.daynum {
		font-size: 1.5rem;
		font-weight: 700;
		line-height: 1;
		margin: var(--sp-1) 0;
	}
	.month {
		font-size: 0.75rem;
		color: var(--c-text-muted);
		text-transform: uppercase;
	}
	.today-tag {
		display: inline-block;
		margin-top: var(--sp-1);
		padding: 2px 8px;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		background: var(--c-yellow);
		color: #422006;
		border-radius: 999px;
	}

	.day-conflict {
		background: #fee2e2;
		color: #991b1b;
		padding: var(--sp-2);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.cards {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
		flex: 1;
	}
	.card {
		display: block;
		padding: var(--sp-2);
		background: #fafafa;
		border: 1px solid var(--c-border);
		border-left: 3px solid #94a3b8;
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: var(--c-text);
		font-size: 0.8rem;
		line-height: 1.3;
		transition: background 0.1s;
	}
	.card:hover {
		background: #f1f5f9;
	}
	.card.overdue {
		background: #fef2f2;
		border-color: #fca5a5;
	}
	.card-project {
		font-weight: 600;
		font-size: 0.8rem;
		margin-bottom: 2px;
	}
	.card-material {
		color: var(--c-text);
		margin-bottom: 2px;
	}
	.card-meta {
		color: var(--c-text-muted);
		font-size: 0.7rem;
	}
	.card-status {
		margin-top: var(--sp-1);
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}
	.empty-day {
		text-align: center;
		color: var(--c-text-muted);
		padding-top: var(--sp-4);
		font-size: 0.85rem;
	}

	@media (max-width: 1024px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
