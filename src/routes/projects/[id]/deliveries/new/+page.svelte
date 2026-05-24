<script>
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let project = $derived(data.project);
	let materials = $derived(data.materials);

	// Wenn Material geändert wird, Einheit automatisch vorausfüllen
	let selectedKey = $state(form?.values?.materialKey ?? '');
	let unit = $state(form?.values?.unit ?? '');
	let materialName = $state(form?.values?.material ?? '');

	function onMaterialChange(e) {
		const key = e.target.value;
		const mat = materials.find((m) => m.key === key);
		if (mat) {
			unit = mat.unit;
			materialName = mat.name;
		}
	}

	const today = new Date().toISOString().slice(0, 10);
</script>

<svelte:head>
	<title>Neue Lieferung – {project.name} – BUILDEX</title>
</svelte:head>

<div class="page">
	<a href="/projects/{project.id}" class="back">← Zurück zu {project.name}</a>
	<h1>Neue Lieferung erfassen</h1>
	<p class="muted">für Projekt {project.name}</p>

	<form method="POST" use:enhance class="form" novalidate>
		<label>
			<span>Material *</span>
			<select name="materialKey" required value={selectedKey} onchange={onMaterialChange}>
				<option value="">— wählen —</option>
				{#each materials as m}
					<option value={m.key}>{m.name} ({m.unit})</option>
				{/each}
			</select>
		</label>

		<!-- versteckte Felder für Material-Name + Einheit, automatisch befüllt -->
		<input type="hidden" name="material" value={materialName} />

		<div class="row">
			<label>
				<span>Menge *</span>
				<input
					name="quantity"
					type="number"
					min="0.1"
					step="0.1"
					required
					value={form?.values?.quantity ?? ''}
				/>
				{#if form?.errors?.quantity}<small class="err">{form.errors.quantity}</small>{/if}
			</label>
			<label>
				<span>Einheit *</span>
				<input name="unit" type="text" required bind:value={unit} placeholder="m³ / t / Stk" />
				{#if form?.errors?.unit}<small class="err">{form.errors.unit}</small>{/if}
			</label>
		</div>

		<label>
			<span>Liefertermin *</span>
			<input
				name="scheduledDate"
				type="date"
				required
				value={form?.values?.scheduledDate ?? today}
			/>
			{#if form?.errors?.scheduledDate}<small class="err">{form.errors.scheduledDate}</small>{/if}
		</label>

		<label>
			<span>Lieferant</span>
			<input
				name="supplier"
				type="text"
				value={form?.values?.supplier ?? ''}
				placeholder="z.B. Holcim AG"
			/>
		</label>

		<label>
			<span>Status</span>
			<select name="status">
				{#each data.statusOptions as s}
					<option value={s} selected={(form?.values?.status ?? 'bestellt') === s}>{s}</option>
				{/each}
			</select>
		</label>

		<label>
			<span>Bemerkungen</span>
			<textarea name="notes" rows="3" placeholder="z.B. Anlieferung erst nach 14:00 möglich"
				>{form?.values?.notes ?? ''}</textarea
			>
		</label>

		{#if form?.errors?.material}<div class="err">{form.errors.material}</div>{/if}

		<div class="form-actions">
			<a href="/projects/{project.id}" class="btn btn-secondary">Abbrechen</a>
			<button type="submit" class="btn btn-primary">Lieferung speichern</button>
		</div>
	</form>
</div>

<style>
	.page {
		padding: var(--sp-6);
		max-width: 720px;
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
	.muted {
		color: var(--c-text-muted);
		margin: 0 0 var(--sp-5);
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-5);
	}
	.row {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: var(--sp-3);
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
