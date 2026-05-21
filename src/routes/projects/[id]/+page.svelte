<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let project = $derived(data.project);
	let editing = $state(false);

	function formatDate(d) {
		if (!d) return '–';
		const [y, m] = d.split('-');
		return `${m}.${y}`;
	}

	function dateString(iso) {
		if (!iso) return '–';
		const d = new Date(iso);
		return d.toLocaleDateString('de-CH', { year: 'numeric', month: '2-digit', day: '2-digit' });
	}
</script>

<svelte:head>
	<title>{project.name} – BUILDEX</title>
</svelte:head>

<header class="header">
	<a href="/" class="back">← Zurück zur Übersicht</a>
	<div class="title-row">
		<h1>{project.name}</h1>
		<span class="badge badge-{project.status}">{project.status}</span>
	</div>
	<p class="address">{project.address || 'Keine Adresse hinterlegt'}</p>
</header>

{#if form?.success}
	<div class="alert alert-success" style="margin: 0 var(--sp-6) var(--sp-4);">
		Projekt aktualisiert.
	</div>
{/if}

<div class="layout">
	<section class="main-pane">
		{#if !editing}
			<div class="info-grid">
				<div class="info-item">
					<div class="info-label">Status</div>
					<div class="info-value"><span class="badge badge-{project.status}">{project.status}</span></div>
				</div>
				<div class="info-item">
					<div class="info-label">Adresse</div>
					<div class="info-value">{project.address || '–'}</div>
				</div>
				<div class="info-item">
					<div class="info-label">Start</div>
					<div class="info-value">{formatDate(project.startDate)}</div>
				</div>
				<div class="info-item">
					<div class="info-label">Ende</div>
					<div class="info-value">{formatDate(project.endDate)}</div>
				</div>
				<div class="info-item">
					<div class="info-label">Erstellt</div>
					<div class="info-value">{dateString(project.createdAt)}</div>
				</div>
				<div class="info-item">
					<div class="info-label">Zuletzt geändert</div>
					<div class="info-value">{dateString(project.updatedAt)}</div>
				</div>
			</div>

			{#if project.notes}
				<div class="notes">
					<h3>Notizen</h3>
					<p>{project.notes}</p>
				</div>
			{/if}

			<div class="actions">
				<button class="btn btn-primary" onclick={() => (editing = true)}>Bearbeiten</button>
				<form
					method="POST"
					action="?/delete"
					use:enhance={() => {
						return ({ result, update }) => {
							if (result.type === 'redirect') return update();
							return update();
						};
					}}
					onsubmit={(e) => {
						if (!confirm(`Projekt "${project.name}" wirklich löschen?`)) {
							e.preventDefault();
						}
					}}
				>
					<button type="submit" class="btn btn-danger">Löschen</button>
				</form>
			</div>
		{:else}
			<form method="POST" action="?/update" class="form" use:enhance>
				<label>
					<span>Projektname *</span>
					<input
						name="name"
						type="text"
						required
						value={form?.values?.name ?? project.name}
					/>
					{#if form?.errors?.name}<small class="err">{form.errors.name}</small>{/if}
				</label>

				<label>
					<span>Adresse</span>
					<input
						name="address"
						type="text"
						value={form?.values?.address ?? project.address}
					/>
					{#if form?.errors?.address}<small class="err">{form.errors.address}</small>{/if}
				</label>

				<div class="row">
					<label>
						<span>Start</span>
						<input
							name="startDate"
							type="month"
							value={form?.values?.startDate ?? project.startDate}
						/>
					</label>
					<label>
						<span>Ende</span>
						<input
							name="endDate"
							type="month"
							value={form?.values?.endDate ?? project.endDate}
						/>
						{#if form?.errors?.endDate}<small class="err">{form.errors.endDate}</small>{/if}
					</label>
				</div>

				<label>
					<span>Status</span>
					<select name="status">
						{#each ['offen', 'laufend', 'pausiert', 'abgeschlossen'] as s}
							<option
								value={s}
								selected={(form?.values?.status ?? project.status) === s}>{s}</option
							>
						{/each}
					</select>
				</label>

				<label>
					<span>Notizen</span>
					<textarea name="notes" rows="4">{form?.values?.notes ?? project.notes}</textarea>
				</label>

				<div class="form-actions">
					<button type="button" class="btn btn-secondary" onclick={() => (editing = false)}>
						Abbrechen
					</button>
					<button type="submit" class="btn btn-primary">Änderungen speichern</button>
				</div>
			</form>
		{/if}
	</section>
</div>

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
	.back:hover {
		color: var(--c-text);
	}
	.title-row {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		margin-bottom: var(--sp-2);
	}
	h1 {
		margin: 0;
		font-size: 1.75rem;
	}
	.address {
		margin: 0;
		color: var(--c-text-muted);
	}

	.layout {
		padding: 0 var(--sp-6) var(--sp-7);
	}
	.main-pane {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-5);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--sp-4);
		margin-bottom: var(--sp-5);
	}
	.info-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--c-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: var(--sp-1);
	}
	.info-value {
		font-size: 1rem;
		color: var(--c-text);
	}

	.notes {
		padding-top: var(--sp-5);
		border-top: 1px solid var(--c-border);
		margin-bottom: var(--sp-5);
	}
	.notes h3 {
		margin: 0 0 var(--sp-2);
		font-size: 0.95rem;
	}
	.notes p {
		margin: 0;
		color: var(--c-text-muted);
		line-height: 1.5;
		white-space: pre-line;
	}

	.actions {
		display: flex;
		gap: var(--sp-3);
		padding-top: var(--sp-4);
		border-top: 1px solid var(--c-border);
	}

	.form {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
	}
	label {
		display: flex;
		flex-direction: column;
		gap: var(--sp-1);
	}
	label > span {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--c-text-muted);
	}
	input,
	select,
	textarea {
		padding: 10px 12px;
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		font-family: inherit;
		background: white;
	}
	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--c-yellow);
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-3);
	}
	.err {
		color: var(--c-danger);
		font-size: 0.8rem;
	}
	.form-actions {
		display: flex;
		gap: var(--sp-3);
		justify-content: flex-end;
		padding-top: var(--sp-3);
		border-top: 1px solid var(--c-border);
	}
</style>
