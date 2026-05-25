<script>
	// Dashboard im Figma-Mockup-Stil:
	// - Kein Title-Block (Mockup hat keinen "Projektüberblick"-Header in Main, das ist Sidebar-Active)
	// - Grosse Suchleiste oben rechts mit gelbem Lupe-Icon
	// - 3-spaltiges Card-Grid
	// - KPI-Kacheln dezent oben (für unsere Stats-Erweiterung)
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	let { data } = $props();

	const statusOptions = ['', 'offen', 'laufend', 'pausiert', 'abgeschlossen'];
</script>

<svelte:head>
	<title>BUILDEX – Projektüberblick</title>
</svelte:head>

<div class="page">
	<header class="top-bar">
		<form method="GET" class="search-form" data-sveltekit-keepfocus>
			<svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="#fbc02d" stroke-width="2.4" stroke-linecap="round">
				<circle cx="11" cy="11" r="7" />
				<path d="m20 20-3.5-3.5" />
			</svg>
			<input
				type="search"
				name="search"
				placeholder="Suchen"
				value={data.filters.search}
				aria-label="Projekte suchen"
			/>
			<select name="status" aria-label="Status-Filter">
				{#each statusOptions as opt}
					<option value={opt} selected={data.filters.status === opt}>
						{opt === '' ? 'Alle Stati' : opt}
					</option>
				{/each}
			</select>
			<button type="submit">Anwenden</button>
		</form>
		<a href="/projects/new" class="new-btn">+ Neues Projekt</a>
	</header>

	<!-- KPI-Streifen dezent (für Funktionalität, Mockup hat keine, aber zählt als Erweiterung) -->
	<section class="kpi-strip">
		<div class="kpi">
			<span class="kpi-value">{data.stats.total}</span>
			<span class="kpi-label">Projekte gesamt</span>
		</div>
		<div class="kpi">
			<span class="kpi-value">{data.stats.byStatus.laufend ?? 0}</span>
			<span class="kpi-label">Laufend</span>
		</div>
		<div class="kpi">
			<span class="kpi-value">{data.stats.byStatus.offen ?? 0}</span>
			<span class="kpi-label">Offen</span>
		</div>
		<div class="kpi">
			<span class="kpi-value">{data.stats.byStatus.abgeschlossen ?? 0}</span>
			<span class="kpi-label">Abgeschlossen</span>
		</div>
	</section>

	{#if data.projects.length === 0}
		<div class="empty">
			{#if data.filters.search || data.filters.status}
				<p>Keine Projekte gefunden mit diesen Filtern.</p>
				<a href="/" class="reset-link">Filter zurücksetzen</a>
			{:else}
				<p>Noch keine Projekte erfasst.</p>
				<a href="/projects/new" class="new-btn">Erstes Projekt erfassen</a>
			{/if}
		</div>
	{:else}
		<div class="grid">
			{#each data.projects as project (project.id)}
				<ProjectCard {project} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		padding: 32px 40px;
	}

	.top-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		margin-bottom: 24px;
		flex-wrap: wrap;
	}

	.search-form {
		display: flex;
		gap: 8px;
		align-items: center;
		flex: 1;
		max-width: 600px;
		min-width: 320px;
		position: relative;
	}

	.search-icon {
		width: 22px;
		height: 22px;
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		z-index: 1;
		pointer-events: none;
	}

	.search-form input[type='search'] {
		flex: 1;
		padding: 12px 14px 12px 46px;
		border: 1px solid var(--c-border);
		border-radius: 8px;
		font-size: 0.95rem;
		font-family: inherit;
		background: white;
	}

	.search-form select {
		padding: 12px 14px;
		border: 1px solid var(--c-border);
		border-radius: 8px;
		background: white;
		font-size: 0.95rem;
		min-width: 140px;
		font-family: inherit;
	}

	.search-form input:focus,
	.search-form select:focus {
		outline: none;
		border-color: var(--c-yellow);
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
	}

	.search-form button {
		padding: 12px 20px;
		background: var(--c-yellow);
		color: var(--c-text);
		border: none;
		border-radius: 8px;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		font-family: inherit;
	}
	.search-form button:hover {
		background: var(--c-yellow-dark);
	}

	.new-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 12px 20px;
		background: var(--c-yellow);
		color: var(--c-text);
		border: none;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
		white-space: nowrap;
	}
	.new-btn:hover {
		background: var(--c-yellow-dark);
	}

	.kpi-strip {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: 16px;
		margin-bottom: 28px;
	}

	.kpi {
		background: white;
		border-radius: 8px;
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
	}

	.kpi-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--c-text);
		line-height: 1;
	}

	.kpi-label {
		color: var(--c-text-muted);
		font-size: 0.8rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
		gap: 20px;
	}

	.empty {
		text-align: center;
		padding: 80px 16px;
		color: var(--c-text-muted);
	}
	.empty p {
		margin-bottom: 16px;
	}

	.reset-link {
		display: inline-block;
		color: #1a73e8;
		text-decoration: none;
		font-weight: 600;
	}
	.reset-link:hover {
		text-decoration: underline;
	}
</style>
