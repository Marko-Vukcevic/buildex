<script>
	// ProjectCard im Figma-Mockup-Stil:
	// - weisse Card mit subtilem Schatten
	// - Title oben, Status als kleines Badge daneben (dezent)
	// - Adresse + Projektdauer als grau Untertext
	// - "ÖFFNEN" Link unten in Material-Blau
	let { project } = $props();

	function formatDate(d) {
		if (!d) return '';
		const [y, m] = d.split('-');
		return `${m}.${y}`;
	}

	const dateRange = $derived.by(() => {
		const start = formatDate(project.startDate);
		const end = formatDate(project.endDate);
		if (start && end) return `${start} - ${end}`;
		if (start) return `ab ${start}`;
		if (end) return `bis ${end}`;
		return '';
	});
</script>

<a href="/projects/{project.id}" class="card">
	<div class="card-head">
		<h2>{project.name}</h2>
		<span class="badge badge-{project.status}">{project.status}</span>
	</div>

	{#if project.address}
		<p class="meta address">{project.address}</p>
	{/if}
	{#if dateRange}
		<p class="meta">Projektdauer: {dateRange}</p>
	{/if}

	<div class="card-foot">
		<span class="open">ÖFFNEN</span>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: white;
		border-radius: 8px;
		padding: 20px 24px 16px;
		text-decoration: none;
		color: inherit;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04);
		transition: box-shadow 0.15s, transform 0.15s;
	}

	.card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		transform: translateY(-1px);
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 12px;
		margin-bottom: 12px;
	}

	h2 {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--c-text);
		line-height: 1.3;
	}

	.meta {
		margin: 0 0 6px;
		color: var(--c-text-muted);
		font-size: 0.85rem;
		line-height: 1.4;
	}
	.address {
		margin-top: 4px;
	}

	.card-foot {
		margin-top: 16px;
		padding-top: 12px;
		border-top: 1px solid var(--c-border);
	}

	.open {
		font-size: 0.78rem;
		font-weight: 600;
		color: #1a73e8; /* Material-Blau wie im Mockup */
		letter-spacing: 0.06em;
	}
</style>
