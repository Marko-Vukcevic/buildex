<script>
	let { form } = $props();
</script>

<svelte:head>
	<title>Neues Projekt – BUILDEX</title>
</svelte:head>

<header class="header">
	<a href="/" class="back">← Zurück zur Übersicht</a>
	<h1>Neues Projekt anlegen</h1>
	<p class="subtitle">Erfasse die Eckdaten – Details kannst du später ergänzen.</p>
</header>

<div class="layout">
	<form method="POST" class="form">
		{#if form?.errors?._}
			<div class="alert alert-error">{form.errors._}</div>
		{/if}

		<label>
			<span>Projektname *</span>
			<input
				name="name"
				type="text"
				required
				value={form?.values?.name ?? ''}
				placeholder="z.B. Wohnüberbauung Steinegg"
				autofocus
			/>
			{#if form?.errors?.name}<small class="err">{form.errors.name}</small>{/if}
		</label>

		<label>
			<span>Adresse / Baustelle</span>
			<input
				name="address"
				type="text"
				value={form?.values?.address ?? ''}
				placeholder="Badenerstrasse 26, 8952 Schlieren"
			/>
			{#if form?.errors?.address}<small class="err">{form.errors.address}</small>{/if}
		</label>

		<div class="row">
			<label>
				<span>Start</span>
				<input name="startDate" type="month" value={form?.values?.startDate ?? ''} />
			</label>
			<label>
				<span>Ende (geplant)</span>
				<input name="endDate" type="month" value={form?.values?.endDate ?? ''} />
				{#if form?.errors?.endDate}<small class="err">{form.errors.endDate}</small>{/if}
			</label>
		</div>

		<label>
			<span>Status</span>
			<select name="status">
				{#each ['offen', 'laufend', 'pausiert', 'abgeschlossen'] as s}
					<option value={s} selected={(form?.values?.status ?? 'offen') === s}>{s}</option>
				{/each}
			</select>
		</label>

		<label>
			<span>Notizen</span>
			<textarea
				name="notes"
				rows="4"
				placeholder="Z.B. Besonderheiten, Anforderungen, interne Vermerke …"
				>{form?.values?.notes ?? ''}</textarea
			>
			{#if form?.errors?.notes}<small class="err">{form.errors.notes}</small>{/if}
		</label>

		<div class="form-actions">
			<a href="/" class="btn btn-secondary">Abbrechen</a>
			<button type="submit" class="btn btn-primary">Projekt anlegen</button>
		</div>
	</form>
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
	h1 {
		margin: 0 0 var(--sp-1);
	}
	.subtitle {
		margin: 0;
		color: var(--c-text-muted);
	}

	.layout {
		padding: 0 var(--sp-6) var(--sp-7);
		max-width: 720px;
	}

	.form {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-5);
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
