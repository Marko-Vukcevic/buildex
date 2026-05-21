<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	let { data } = $props();

	const statusOptions = ['', 'offen', 'laufend', 'pausiert', 'abgeschlossen'];
</script>

<svelte:head>
	<title>BUILDEX – Projektüberblick</title>
</svelte:head>

<header class="header">
	<div>
		<h1>Projektüberblick</h1>
		<p class="subtitle">Verwalte alle Baustellen und Ausschreibungen an einem Ort.</p>
	</div>
	<a href="/projects/new" class="btn btn-primary">+ Neues Projekt</a>
</header>

<section class="stats">
	<div class="stat">
		<div class="stat-value">{data.stats.total}</div>
		<div class="stat-label">Projekte gesamt</div>
	</div>
	<div class="stat">
		<div class="stat-value">{data.stats.byStatus.laufend ?? 0}</div>
		<div class="stat-label">Laufend</div>
	</div>
	<div class="stat">
		<div class="stat-value">{data.stats.byStatus.offen ?? 0}</div>
		<div class="stat-label">Offen</div>
	</div>
	<div class="stat">
		<div class="stat-value">{data.stats.byStatus.abgeschlossen ?? 0}</div>
		<div class="stat-label">Abgeschlossen</div>
	</div>
</section>

<form method="GET" class="filters" data-sveltekit-keepfocus>
	<input
		type="search"
		name="search"
		placeholder="Suche nach Name oder Adresse…"
		value={data.filters.search}
	/>
	<select name="status">
		{#each statusOptions as opt}
			<option value={opt} selected={data.filters.status === opt}>
				{opt === '' ? 'Alle Stati' : opt}
			</option>
		{/each}
	</select>
	<button type="submit" class="btn btn-secondary">Anwenden</button>
	{#if data.filters.search || data.filters.status}
		<a href="/" class="btn-reset">Reset</a>
	{/if}
</form>

{#if data.projects.length === 0}
	<div class="empty">
		{#if data.filters.search || data.filters.status}
			<p>Keine Projekte gefunden mit diesen Filtern.</p>
			<a href="/" class="btn btn-secondary">Filter zurücksetzen</a>
		{:else}
			<p>Noch keine Projekte erfasst.</p>
			<a href="/projects/new" class="btn btn-primary">Erstes Projekt erfassen</a>
		{/if}
	</div>
{:else}
	<div class="grid">
		{#each data.projects as project (project.id)}
			<ProjectCard {project} />
		{/each}
	</div>
{/if}

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--sp-4);
		padding: var(--sp-6) var(--sp-6) var(--sp-3);
	}
	h1 {
		margin: 0 0 var(--sp-1);
		font-size: 1.75rem;
	}
	.subtitle {
		margin: 0;
		color: var(--c-text-muted);
		font-size: 0.95rem;
	}

	.stats {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
		gap: var(--sp-3);
		padding: 0 var(--sp-6) var(--sp-4);
	}
	.stat {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-4) var(--sp-5);
		box-shadow: var(--shadow-card);
	}
	.stat-value {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--c-text);
		line-height: 1;
	}
	.stat-label {
		margin-top: var(--sp-1);
		color: var(--c-text-muted);
		font-size: 0.85rem;
	}

	.filters {
		display: flex;
		gap: var(--sp-3);
		align-items: center;
		padding: 0 var(--sp-6) var(--sp-5);
		flex-wrap: wrap;
	}
	input[type='search'] {
		flex: 1;
		min-width: 220px;
		padding: 10px 14px;
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
	}
	select {
		padding: 10px 14px;
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-sm);
		background: white;
		font-size: 0.95rem;
		min-width: 160px;
	}
	input:focus,
	select:focus {
		outline: none;
		border-color: var(--c-yellow);
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
	}

	.btn-reset {
		text-decoration: underline;
		color: var(--c-text-muted);
		font-size: 0.875rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--sp-4);
		padding: 0 var(--sp-6) var(--sp-7);
	}

	.empty {
		text-align: center;
		padding: var(--sp-7) var(--sp-4);
		color: var(--c-text-muted);
	}
	.empty p {
		margin-bottom: var(--sp-4);
	}
</style>
