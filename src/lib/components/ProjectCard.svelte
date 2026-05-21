<script>
	let { project } = $props();

	function formatDate(d) {
		if (!d) return '';
		// "2026-01" → "01.2026"
		const [y, m] = d.split('-');
		return `${m}.${y}`;
	}

	const dateRange = $derived.by(() => {
		const start = formatDate(project.startDate);
		const end = formatDate(project.endDate);
		if (start && end) return `${start} – ${end}`;
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
		<p class="meta">📍 {project.address}</p>
	{/if}
	{#if dateRange}
		<p class="meta">📅 {dateRange}</p>
	{/if}
	<div class="card-foot">
		<span class="open">ÖFFNEN →</span>
	</div>
</a>

<style>
	.card {
		display: flex;
		flex-direction: column;
		background: var(--c-surface);
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-4) var(--sp-5);
		text-decoration: none;
		color: inherit;
		transition: box-shadow 0.15s, transform 0.15s, border-color 0.15s;
		box-shadow: var(--shadow-card);
	}

	.card:hover {
		box-shadow: var(--shadow-card-hover);
		border-color: var(--c-border-strong);
		transform: translateY(-1px);
	}

	.card-head {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--sp-3);
		margin-bottom: var(--sp-2);
	}

	h2 {
		margin: 0;
		font-size: 1.05rem;
		font-weight: 600;
	}

	.meta {
		margin: var(--sp-1) 0;
		color: var(--c-text-muted);
		font-size: 0.875rem;
	}

	.card-foot {
		margin-top: var(--sp-3);
		padding-top: var(--sp-3);
		border-top: 1px solid var(--c-border);
		display: flex;
		justify-content: flex-end;
	}

	.open {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--c-warning);
		letter-spacing: 0.04em;
	}
</style>
