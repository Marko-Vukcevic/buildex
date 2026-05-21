<script>
	// `data` ist alles was load() in +page.server.js zurückgegeben hat.
	let { data } = $props();
</script>

<svelte:head>
	<title>BUILDEX – Projektübersicht</title>
</svelte:head>

<header class="topbar">
	<div class="brand">
		<div class="logo">B</div>
		<div>
			<div class="name">Max Muster</div>
			<div class="company">Bauunternehmung XY AG</div>
		</div>
	</div>
	<a class="cta" href="/projects/new">+ Neues Projekt</a>
</header>

<main>
	<h1>Projektüberblick</h1>

	{#if data.projects.length === 0}
		<div class="empty">
			<p>Noch keine Projekte erfasst.</p>
			<a class="cta" href="/projects/new">Erstes Projekt erfassen</a>
		</div>
	{:else}
		<div class="grid">
			{#each data.projects as project (project.id)}
				<article class="card">
					<header class="card-head">
						<h2>{project.name}</h2>
						<span class="badge badge-{project.status}">{project.status}</span>
					</header>
					<p class="addr">{project.address}</p>
					<p class="dates">
						{#if project.startDate || project.endDate}
							Projektdauer: {project.startDate} {project.endDate ? `– ${project.endDate}` : ''}
						{/if}
					</p>
				</article>
			{/each}
		</div>
	{/if}
</main>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
		background: #fafafa;
		color: #1a1a1a;
	}

	.topbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem 2rem;
		background: white;
		border-bottom: 1px solid #eee;
	}

	.brand {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.logo {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: #fbc02d;
		color: #1a1a1a;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 1.25rem;
	}

	.name {
		font-weight: 600;
	}

	.company {
		color: #777;
		font-size: 0.85rem;
	}

	main {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.card {
		background: white;
		border: 1px solid #eee;
		border-radius: 8px;
		padding: 1.25rem;
		transition: box-shadow 0.15s;
	}

	.card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.5rem;
	}

	.card h2 {
		margin: 0;
		font-size: 1.1rem;
	}

	.badge {
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		border-radius: 12px;
		background: #fbc02d;
		color: #1a1a1a;
		text-transform: uppercase;
	}

	.badge-abgeschlossen {
		background: #c8e6c9;
		color: #2e7d32;
	}

	.badge-pausiert {
		background: #e0e0e0;
		color: #555;
	}

	.addr,
	.dates {
		margin: 0.25rem 0;
		color: #555;
		font-size: 0.9rem;
	}

	.cta {
		background: #fbc02d;
		color: #1a1a1a;
		padding: 0.6rem 1.1rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.cta:hover {
		background: #f9a825;
	}

	.empty {
		text-align: center;
		padding: 3rem 1rem;
		color: #777;
	}

	.empty p {
		margin-bottom: 1rem;
	}
</style>
