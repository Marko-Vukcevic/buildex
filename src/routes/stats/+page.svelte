<script>
	let { data } = $props();

	const statusOrder = ['offen', 'laufend', 'pausiert', 'abgeschlossen'];

	// Maximal-Wert für die Balken-Visualisierung
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
	h2 {
		margin: 0 0 var(--sp-4);
		font-size: 1.1rem;
	}

	.bars {
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	.bar-row {
		display: grid;
		grid-template-columns: 140px 1fr 40px;
		gap: var(--sp-3);
		align-items: center;
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
	.bar-offen {
		background: var(--c-info);
	}
	.bar-laufend {
		background: var(--c-yellow);
	}
	.bar-pausiert {
		background: var(--c-text-muted);
	}
	.bar-abgeschlossen {
		background: var(--c-success);
	}
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
	}
</style>
