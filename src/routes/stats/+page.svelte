<script>
	let { data } = $props();

	const statusOrder = ['offen', 'laufend', 'pausiert', 'abgeschlossen'];

	const max = $derived(
		Math.max(1, ...statusOrder.map((s) => data.stats.byStatus[s] ?? 0))
	);

	function pct(s) {
		const v = data.stats.byStatus[s] ?? 0;
		return Math.round((v / max) * 100);
	}

	function count(s) {
		return data.stats.byStatus[s] ?? 0;
	}

	function fmtKg(kg) {
		if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`;
		return `${kg} kg`;
	}

	// CO2-Vergleichswerte (Quelle: BAFU / UN Environment Programme)
	function co2Equivalent(kg) {
		if (kg <= 0) return null;
		// Annahme: 200 g CO2/km für Mittelklasse-Auto, 4'000 kg/Jahr für einen Schweizer Haushalt
		const carKm = Math.round(kg / 0.2);
		const householdYears = (kg / 4000).toFixed(1);
		return { carKm, householdYears };
	}

	const co2Top = $derived(data.co2.top ?? []);
	const co2Max = $derived(Math.max(1, ...co2Top.map((m) => m.co2Kg)));
	const equiv = $derived(co2Equivalent(data.co2.totalCo2));
</script>

<svelte:head>
	<title>Statistiken – BUILDEX</title>
</svelte:head>

<header class="header">
	<a href="/" class="back">← Zurück zur Übersicht</a>
	<h1>Projekt-Statistiken</h1>
	<p class="subtitle">Visuelle Übersicht über deine gesamte Projektpipeline.</p>
</header>

<section class="kpi-row">
	<div class="kpi">
		<div class="kpi-value">{data.total}</div>
		<div class="kpi-label">Projekte gesamt</div>
	</div>
	<div class="kpi">
		<div class="kpi-value" style="color: var(--c-warning);">{count('laufend')}</div>
		<div class="kpi-label">Laufend</div>
	</div>
	<div class="kpi">
		<div class="kpi-value" style="color: var(--c-info);">{count('offen')}</div>
		<div class="kpi-label">Offen</div>
	</div>
	<div class="kpi">
		<div class="kpi-value" style="color: var(--c-success);">{count('abgeschlossen')}</div>
		<div class="kpi-label">Abgeschlossen</div>
	</div>
</section>

<section class="chart-card">
	<h2>Verteilung nach Status</h2>
	<div class="bars">
		{#each statusOrder as s}
			<div class="bar-row">
				<div class="bar-label">
					<span class="badge badge-{s}">{s}</span>
				</div>
				<div class="bar-track">
					<div class="bar-fill bar-{s}" style="width: {pct(s)}%"></div>
				</div>
				<div class="bar-count">{count(s)}</div>
			</div>
		{/each}
	</div>
</section>

<!-- CO2-Sektion -->
<section class="chart-card co2-card">
	<div class="co2-head">
		<h2>CO₂-Bilanz aller Lieferungen</h2>
		<div class="co2-total">{fmtKg(data.co2.totalCo2)}</div>
	</div>

	{#if equiv}
		<p class="equiv">
			Das entspricht etwa <strong>{equiv.carKm.toLocaleString('de-CH')} km</strong> mit einem Mittelklasse-Auto
			oder ca. <strong>{equiv.householdYears} Jahren</strong> CO₂-Ausstoss eines Schweizer Haushalts.
			<br /><span class="muted">Berechnung basiert auf vereinfachten KBOB-Faktoren. Nicht für offizielle Bilanzierung tauglich.</span>
		</p>
	{/if}

	{#if co2Top.length > 0}
		<h3>Top-Materialien nach CO₂-Beitrag</h3>
		<div class="bars">
			{#each co2Top as m}
				<div class="bar-row co2-row">
					<div class="bar-label material-name">{m.name}</div>
					<div class="bar-track">
						<div
							class="bar-fill bar-co2"
							style="width: {Math.round((m.co2Kg / co2Max) * 100)}%"
						></div>
					</div>
					<div class="bar-count">{fmtKg(m.co2Kg)}</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="empty">Noch keine Lieferungen erfasst — CO₂-Bilanz wird angezeigt, sobald Lieferungen vorhanden sind.</p>
	{/if}
</section>

<section class="recent-card">
	<h2>Zuletzt erstellt</h2>
	{#if data.stats.recent.length === 0}
		<p class="empty">Noch keine Projekte erfasst.</p>
	{:else}
		<ul>
			{#each data.stats.recent as p (p.id)}
				<li>
					<a href="/projects/{p.id}">{p.name}</a>
					<span class="badge badge-{p.status}">{p.status}</span>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.header {
		padding: var(--sp-6) var(--sp-6) var(--sp-4);
	}
	.back {
		display: inline-block;
		margin-bottom: var(--sp-3);
		color: var(--c-text-muted);
		text-decoration: none;
		font-size: 0.875rem;
	}
	h1 {
		margin: 0 0 var(--sp-1);
	}
	.subtitle {
		margin: 0;
		color: var(--c-text-muted);
	}

	.kpi-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--sp-3);
		padding: 0 var(--sp-6) var(--sp-4);
	}
	.kpi {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-4) var(--sp-5);
		box-shadow: var(--shadow-card);
	}
	.kpi-value {
		font-size: 2rem;
		font-weight: 700;
		line-height: 1;
	}
	.kpi-label {
		margin-top: var(--sp-2);
		color: var(--c-text-muted);
		font-size: 0.85rem;
	}

	.chart-card,
	.recent-card {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-5);
		margin: 0 var(--sp-6) var(--sp-4);
	}
	.co2-card {
		background: linear-gradient(to bottom, #f0fdf4, white);
		border-color: #86efac;
	}
	.co2-head {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: var(--sp-3);
		margin-bottom: var(--sp-3);
	}
	.co2-head h2 {
		margin: 0;
	}
	.co2-total {
		font-size: 2rem;
		font-weight: 800;
		color: #047857;
		font-variant-numeric: tabular-nums;
	}
	.equiv {
		margin: var(--sp-3) 0 var(--sp-5);
		padding: var(--sp-3) var(--sp-4);
		background: white;
		border-left: 3px solid #10b981;
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
		line-height: 1.5;
	}
	.muted {
		color: var(--c-text-muted);
		font-size: 0.8rem;
	}
	h2 {
		margin: 0 0 var(--sp-4);
		font-size: 1.1rem;
	}
	h3 {
		font-size: 0.95rem;
		margin: var(--sp-4) 0 var(--sp-3);
	}

	.bars {
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	.bar-row {
		display: grid;
		grid-template-columns: 140px 1fr 60px;
		gap: var(--sp-3);
		align-items: center;
	}
	.bar-row.co2-row {
		grid-template-columns: 200px 1fr 80px;
	}
	.material-name {
		font-size: 0.85rem;
		color: var(--c-text);
	}
	.bar-track {
		background: #f0f0f0;
		border-radius: 999px;
		height: 14px;
		overflow: hidden;
	}
	.bar-fill {
		height: 100%;
		border-radius: 999px;
		transition: width 0.4s ease;
	}
	.bar-offen { background: var(--c-info); }
	.bar-laufend { background: var(--c-yellow); }
	.bar-pausiert { background: var(--c-text-muted); }
	.bar-abgeschlossen { background: var(--c-success); }
	.bar-co2 { background: #10b981; }
	.bar-count {
		text-align: right;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.recent-card ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.recent-card li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--sp-3) 0;
		border-bottom: 1px solid var(--c-border);
	}
	.recent-card li:last-child {
		border-bottom: none;
	}
	.recent-card a {
		color: var(--c-text);
		text-decoration: none;
		font-weight: 500;
	}
	.recent-card a:hover {
		text-decoration: underline;
	}
	.empty {
		color: var(--c-text-muted);
		text-align: center;
		padding: var(--sp-4);
	}
</style>
