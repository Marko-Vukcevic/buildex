<script>
	import { enhance } from '$app/forms';
	let { data, form } = $props();
	let project = $derived(data.project);
	let delivery = $derived(data.delivery);
	let materials = $derived(data.materials);

	let selectedKey = $state(form?.values?.materialKey ?? delivery.materialKey);
	let unit = $state(form?.values?.unit ?? delivery.unit);
	let materialName = $state(form?.values?.material ?? delivery.material);

	function onMaterialChange(e) {
		const key = e.target.value;
		const mat = materials.find((m) => m.key === key);
		if (mat) {
			unit = mat.unit;
			materialName = mat.name;
		}
	}
</script>

<svelte:head>
	<title>Lieferung bearbeiten – BUILDEX</title>
</svelte:head>

<div class="page">
	<a href="/projects/{project.id}" class="back">← Zurück zu {project.name}</a>
	<h1>Lieferung bearbeiten</h1>
	<p class="muted">CO₂-Bilanz aktuell: {delivery.co2Kg} kg</p>

	<form method="POST" action="?/update" use:enhance class="form" novalidate>
		<label>
			<span>Material *</span>
			<select name="materialKey" required value={selectedKey} onchange={onMaterialChange}>
				<option value="">— wählen —</option>
				{#each materials as m}
					<option value={m.key}>{m.name} ({m.unit})</option>
				{/each}
			</select>
		</label>
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
					value={form?.values?.quantity ?? delivery.quantity}
				/>
				{#if form?.errors?.quantity}<small class="err">{form.errors.quantity}</small>{/if}
			</label>
			<label>
				<span>Einheit *</span>
				<input name="unit" type="text" required bind:value={unit} />
				{#if form?.errors?.unit}<small class="err">{form.errors.unit}</small>{/if}
			</label>
		</div>

		<label>
			<span>Liefertermin *</span>
			<input
				name="scheduledDate"
				type="date"
				required
				value={form?.values?.scheduledDate ?? delivery.scheduledDate}
			/>
			{#if form?.errors?.scheduledDate}<small class="err">{form.errors.scheduledDate}</small>{/if}
		</label>

		<label>
			<span>Lieferant</span>
			<input
				name="supplier"
				type="text"
				value={form?.values?.supplier ?? delivery.supplier}
			/>
		</label>

		<label>
			<span>Status</span>
			<select name="status">
				{#each data.statusOptions as s}
					<option value={s} selected={(form?.values?.status ?? delivery.status) === s}>{s}</option>
				{/each}
			</select>
		</label>

		<label>
			<span>Bemerkungen</span>
			<textarea name="notes" rows="3">{form?.values?.notes ?? delivery.notes}</textarea>
		</label>

		<div class="form-actions">
			<a href="/projects/{project.id}" class="btn btn-secondary">Abbrechen</a>
			<button
				type="submit"
				formaction="?/delete"
				class="btn btn-danger"
				onclick={(e) => {
					if (!confirm('Lieferung wirklich löschen?')) e.preventDefault();
				}}
			>
				Löschen
			</button>
			<button type="submit" formaction="?/update" class="btn btn-primary">Speichern</button>
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
