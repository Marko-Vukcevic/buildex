<script>
	// Wochenkalender im Figma-Mockup-Stil (26:627):
	// - Linke Spalte: Mini-Kalender mit Punkten unter Tagen (Anzahl Lieferungen)
	// - Mitte: Wochen-Grid mit Stunden 07:00-18:00 vertikal, Mo-So horizontal
	// - Rechte Spalte: Detail-Panel des gewählten Tags mit Lieferungs-Karten
	// - Top-Bar: Heute-Button, Vor/Zurück, Day/Week/Month/Year Tabs, Such-Feld
	// - Konflikt-Banner unverändert sichtbar wenn vorhanden
	let { data } = $props();

	// Pastell-Farben pro Status (Mockup-Stil)
	const STATUS_STYLE = {
		bestellt: { bg: '#f5f5f5', border: '#9ca3af', text: '#374151' },
		bestaetigt: { bg: '#fff7ed', border: '#fb923c', text: '#9a3412' },
		unterwegs: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
		angekommen: { bg: '#dcfce7', border: '#10b981', text: '#065f46' },
		verrechnet: { bg: '#e5e7eb', border: '#6b7280', text: '#374151' }
	};

	function colorFor(d) {
		if (d.overdue) return { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' };
		return STATUS_STYLE[d.status] || STATUS_STYLE.bestellt;
	}

	const HOURS = Array.from({ length: 12 }, (_, i) => 7 + i); // 07:00 - 18:00

	function eventHour(scheduledDate) {
		// Wir haben keine Uhrzeit im Datenmodell — verteilen Lieferungen pseudo über den Tag
		// auf Basis ihrer ID, damit Karten nicht alle aufeinander liegen.
		const id = scheduledDate;
		let h = 0;
		for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
		return 8 + (h % 8); // 08:00-15:00
	}

	function shortRange(start, end) {
		const s = new Date(start + 'T12:00:00');
		const e = new Date(end + 'T12:00:00');
		const sStr = s.toLocaleDateString('de-CH', { day: '2-digit', month: 'short' });
		const eStr = e.toLocaleDateString('de-CH', { day: '2-digit', month: 'short', year: 'numeric' });
		return `${sStr} – ${eStr}`;
	}
</script>

<svelte:head>
	<title>Wochenkalender – BUILDEX</title>
</svelte:head>

<div class="page">
	<!-- Top-Bar wie im Mockup -->
	<header class="top-bar">
		<div class="nav-left">
			<a class="round-btn" href="?week={data.prevWeek}" aria-label="Vorwoche">‹</a>
			<a class="pill-btn" href="?week={data.thisWeek}">Heute</a>
			<a class="round-btn" href="?week={data.nextWeek}" aria-label="Folgewoche">›</a>
		</div>

		<div class="view-tabs">
			<button type="button">Day</button>
			<button type="button" class="active">Week</button>
			<button type="button">Month</button>
			<button type="button">Year</button>
		</div>

		<div class="search">
			<svg viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
			<input type="search" placeholder="Search" aria-label="Suche im Kalender" />
		</div>
	</header>

	{#if data.totalConflicts > 0}
		<div class="conflict-banner">
			⚠ {data.totalConflicts} Tag{data.totalConflicts > 1 ? 'e' : ''} mit Lieferungs-Konflikt (mehr als 3 Lieferungen auf derselben Baustelle am gleichen Tag — Koordination prüfen!)
		</div>
	{/if}

	<div class="grid-layout">
		<!-- LINKS: Mini-Kalender -->
		<aside class="mini-cal">
			<div class="mini-head">
				<div>
					<span class="month-name">{data.monthLabel}</span>
					<span class="month-year">{data.monthYear}</span>
				</div>
				<div class="month-nav">
					<a href="?week={data.prevWeek}" aria-label="Voriger Monat">‹</a>
					<a href="?week={data.nextWeek}" aria-label="Nächster Monat">›</a>
				</div>
			</div>

			<div class="mini-weekdays">
				<span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
			</div>

			<div class="mini-grid">
				{#each data.monthDays as d (d.iso)}
					<a
						href="?week={data.weekStart}&day={d.iso}"
						class="mini-day"
						class:out-month={!d.inMonth}
						class:today={d.isToday}
						class:selected={d.iso === data.detailDay.date}
					>
						<span class="num">{d.day}</span>
						{#if d.count > 0}
							<span class="dots" aria-label="{d.count} Lieferungen">
								{#each Array(Math.min(d.count, 3)) as _, i}
									<i class="dot" class:dot-yellow={i === 0} class:dot-blue={i === 1} class:dot-red={i === 2}></i>
								{/each}
							</span>
						{/if}
					</a>
				{/each}
			</div>
		</aside>

		<!-- MITTE: Wochen-Grid -->
		<section class="week-grid-wrapper">
			<div class="range-label">{shortRange(data.weekStart, data.weekEnd)} · {data.totalDeliveries} Lieferungen</div>

			<div class="week-grid">
				<!-- Header-Zeile mit Wochentagen -->
				<div class="time-col-head"></div>
				{#each data.days as d (d.date)}
					<a class="day-head" class:is-today={d.isToday} class:has-conflict={d.conflicts.length > 0} href="?week={data.weekStart}&day={d.date}">
						<div class="day-weekday">{d.weekdayLong}</div>
						<div class="day-num">{d.dayNum}</div>
					</a>
				{/each}

				<!-- Stunden-Zeilen -->
				{#each HOURS as h}
					<div class="hour-label">{String(h).padStart(2, '0')}:00</div>
					{#each data.days as day (day.date)}
						<div class="hour-cell" class:current-day={day.isToday}>
							{#each day.deliveries.filter((dd) => eventHour(dd.id) === h) as dd (dd.id)}
								{@const c = colorFor(dd)}
								<a
									href="/projects/{dd.projectId}/deliveries/{dd.id}"
									class="event"
									style="background: {c.bg}; border-left: 3px solid {c.border}; color: {c.text};"
									title="{dd.material} · {dd.quantity} {dd.unit} · {dd.projectName}"
								>
									<div class="event-time">{String(h).padStart(2, '0')}:00</div>
									<div class="event-title">{dd.projectName}</div>
									<div class="event-sub">{dd.material}</div>
								</a>
							{/each}
						</div>
					{/each}
				{/each}
			</div>
		</section>

		<!-- RECHTS: Tages-Detail-Panel -->
		<aside class="detail-panel">
			<div class="detail-head">
				<div>
					<div class="detail-weekday">{data.detailDay.weekdayLong}</div>
					<div class="detail-date">{data.detailDay.fullDate}</div>
				</div>
				<a class="next-day-btn" href="?week={data.weekStart}" aria-label="Aktualisieren">↻</a>
			</div>

			<div class="detail-list">
				{#if data.detailDeliveries.length === 0}
					<div class="empty-day">Keine Lieferungen für diesen Tag.</div>
				{:else}
					{#each data.detailDeliveries as d (d.id)}
						{@const c = colorFor(d)}
						<a
							href="/projects/{d.projectId}/deliveries/{d.id}"
							class="detail-card"
							style="background: {c.bg}; border-left: 3px solid {c.border};"
						>
							<div class="dc-time">{String(eventHour(d.id)).padStart(2, '0')}:00</div>
							<div class="dc-body">
								<div class="dc-title">{d.material}</div>
								<div class="dc-row">Projekt: <strong>{d.projectName}</strong></div>
								<div class="dc-row">Lieferant: {d.supplier || '–'}</div>
								<div class="dc-row">Menge: {d.quantity} {d.unit} · CO₂: {(d.co2Kg / 1000).toFixed(1)} t</div>
								<div class="dc-status" style="color: {c.text};">{d.status}{d.overdue ? ' · überfällig' : ''}</div>
							</div>
						</a>
					{/each}
				{/if}
			</div>
		</aside>
	</div>
</div>

<style>
	.page {
		padding: 24px 32px;
	}

	/* TOP-BAR */
	.top-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		margin-bottom: 20px;
		flex-wrap: wrap;
	}
	.nav-left {
		display: flex;
		gap: 8px;
		align-items: center;
	}
	.round-btn {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: white;
		border: 1px solid var(--c-border);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		color: var(--c-text);
		text-decoration: none;
		font-size: 1.2rem;
		font-weight: 600;
	}
	.round-btn:hover { background: #f5f5f5; }
	.pill-btn {
		padding: 8px 18px;
		background: white;
		border: 1px solid var(--c-border);
		border-radius: 999px;
		color: var(--c-text);
		text-decoration: none;
		font-weight: 500;
		font-size: 0.9rem;
	}
	.pill-btn:hover { background: #f5f5f5; }

	.view-tabs {
		display: flex;
		gap: 4px;
		background: white;
		border-radius: 999px;
		padding: 4px;
		border: 1px solid var(--c-border);
	}
	.view-tabs button {
		background: none;
		border: none;
		padding: 6px 14px;
		border-radius: 999px;
		font-family: inherit;
		font-size: 0.85rem;
		color: var(--c-text-muted);
		cursor: pointer;
	}
	.view-tabs button.active {
		background: var(--c-yellow);
		color: var(--c-text);
		font-weight: 600;
	}
	.view-tabs button:hover:not(.active) {
		color: var(--c-text);
	}

	.search {
		display: flex;
		align-items: center;
		gap: 8px;
		background: white;
		border: 1px solid var(--c-border);
		border-radius: 999px;
		padding: 6px 16px;
		min-width: 200px;
	}
	.search svg { width: 16px; height: 16px; flex-shrink: 0; }
	.search input {
		border: none;
		background: none;
		outline: none;
		font-family: inherit;
		font-size: 0.9rem;
		flex: 1;
	}

	.conflict-banner {
		margin-bottom: 16px;
		padding: 10px 16px;
		background: #fef2f2;
		border: 1px solid #fca5a5;
		border-radius: 8px;
		color: #991b1b;
		font-size: 0.85rem;
	}

	/* 3-Spalten-Layout */
	.grid-layout {
		display: grid;
		grid-template-columns: 280px 1fr 320px;
		gap: 20px;
		align-items: start;
	}

	/* LINKS: Mini-Kalender */
	.mini-cal {
		background: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.06);
	}
	.mini-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}
	.month-name {
		font-size: 1.2rem;
		font-weight: 700;
	}
	.month-year {
		color: #ef4444;
		font-size: 1.2rem;
		font-weight: 600;
		margin-left: 4px;
	}
	.month-nav { display: flex; gap: 6px; }
	.month-nav a {
		color: var(--c-text-muted);
		text-decoration: none;
		font-size: 1.2rem;
		width: 24px;
		height: 24px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
	}
	.month-nav a:hover { background: #f5f5f5; }

	.mini-weekdays {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
		margin-bottom: 6px;
	}
	.mini-weekdays span {
		font-size: 0.65rem;
		text-align: center;
		color: var(--c-text-muted);
		font-weight: 600;
		letter-spacing: 0.04em;
	}

	.mini-grid {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 2px;
	}
	.mini-day {
		aspect-ratio: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		color: var(--c-text);
		font-size: 0.85rem;
		border-radius: 50%;
		position: relative;
		padding-top: 6px;
	}
	.mini-day .num { line-height: 1; }
	.mini-day:hover { background: #f5f5f5; }
	.mini-day.out-month { color: #d1d5db; }
	.mini-day.today {
		background: var(--c-yellow);
		font-weight: 700;
	}
	.mini-day.selected:not(.today) {
		background: rgba(251, 192, 45, 0.15);
		font-weight: 600;
	}
	.dots {
		display: flex;
		gap: 1px;
		margin-top: 2px;
		height: 4px;
	}
	.dot {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		display: inline-block;
	}
	.dot-yellow { background: #f59e0b; }
	.dot-blue { background: #3b82f6; }
	.dot-red { background: #ef4444; }

	/* MITTE: Wochen-Grid */
	.week-grid-wrapper {
		background: white;
		border-radius: 12px;
		padding: 16px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.06);
	}
	.range-label {
		font-size: 0.85rem;
		color: var(--c-text-muted);
		margin-bottom: 12px;
	}
	.week-grid {
		display: grid;
		grid-template-columns: 50px repeat(7, 1fr);
		border-top: 1px solid var(--c-border);
		border-left: 1px solid var(--c-border);
	}
	.time-col-head {
		border-right: 1px solid var(--c-border);
		border-bottom: 1px solid var(--c-border);
		background: white;
	}
	.day-head {
		text-align: left;
		padding: 8px 10px;
		border-right: 1px solid var(--c-border);
		border-bottom: 1px solid var(--c-border);
		text-decoration: none;
		color: var(--c-text);
		font-size: 0.8rem;
		background: white;
	}
	.day-head:hover { background: #fafafa; }
	.day-head.is-today { background: rgba(251, 192, 45, 0.1); }
	.day-head.has-conflict { background: #fff7ed; }
	.day-weekday { color: var(--c-text-muted); font-weight: 500; }
	.day-num { font-size: 1.1rem; font-weight: 700; line-height: 1.2; }

	.hour-label {
		font-size: 0.7rem;
		color: var(--c-text-muted);
		text-align: right;
		padding: 4px 6px 0 0;
		border-right: 1px solid var(--c-border);
		border-bottom: 1px solid var(--c-border);
		min-height: 60px;
		background: white;
	}
	.hour-cell {
		border-right: 1px solid var(--c-border);
		border-bottom: 1px solid var(--c-border);
		padding: 2px;
		min-height: 60px;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.hour-cell.current-day { background: rgba(251, 192, 45, 0.04); }

	.event {
		display: block;
		padding: 4px 6px;
		border-radius: 4px;
		text-decoration: none;
		font-size: 0.7rem;
		line-height: 1.2;
	}
	.event-time { font-weight: 700; font-size: 0.65rem; opacity: 0.85; }
	.event-title { font-weight: 600; }
	.event-sub { opacity: 0.8; }

	/* RECHTS: Detail-Panel */
	.detail-panel {
		background: white;
		border-radius: 12px;
		padding: 20px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.06);
	}
	.detail-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 16px;
		padding-bottom: 16px;
		border-bottom: 1px solid var(--c-border);
	}
	.detail-weekday {
		font-size: 1rem;
		font-weight: 700;
		text-transform: capitalize;
	}
	.detail-date {
		font-size: 0.8rem;
		color: var(--c-text-muted);
		margin-top: 2px;
	}
	.next-day-btn {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: var(--c-yellow);
		color: var(--c-text);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		text-decoration: none;
		font-size: 0.9rem;
	}

	.detail-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
		max-height: 70vh;
		overflow-y: auto;
	}
	.empty-day {
		text-align: center;
		color: var(--c-text-muted);
		font-size: 0.85rem;
		padding: 24px 0;
	}
	.detail-card {
		display: flex;
		gap: 12px;
		padding: 12px;
		border-radius: 8px;
		text-decoration: none;
		color: var(--c-text);
	}
	.detail-card:hover {
		filter: brightness(0.98);
	}
	.dc-time {
		font-weight: 700;
		font-size: 0.85rem;
		min-width: 44px;
	}
	.dc-body { flex: 1; min-width: 0; }
	.dc-title {
		font-weight: 700;
		font-size: 0.9rem;
		margin-bottom: 4px;
	}
	.dc-row {
		font-size: 0.78rem;
		color: var(--c-text);
		opacity: 0.85;
		line-height: 1.35;
	}
	.dc-status {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 6px;
	}

	/* Responsive: rechte Spalte unter Grid */
	@media (max-width: 1280px) {
		.grid-layout {
			grid-template-columns: 240px 1fr;
		}
		.detail-panel {
			grid-column: 1 / -1;
		}
	}
	@media (max-width: 900px) {
		.grid-layout {
			grid-template-columns: 1fr;
		}
		.mini-cal, .detail-panel {
			max-width: 400px;
			margin: 0 auto;
		}
	}
</style>
