<script>
	// `form` enthält Daten, die die Action zurückgibt (z.B. Validierungsfehler).
	let { form } = $props();
</script>

<svelte:head>
	<title>Neues Projekt – BUILDEX</title>
</svelte:head>

<header class="topbar">
	<div class="brand">
		<div class="logo">B</div>
		<a href="/" class="back">← Zurück</a>
	</div>
</header>

<main>
	<h1>Neues Projekt anlegen</h1>

	{#if form?.error}
		<div class="alert alert-error">{form.error}</div>
	{/if}

	<form method="POST" class="form">
		<label>
			<span>Projektname *</span>
			<input name="name" type="text" required value={form?.values?.name ?? ''} placeholder="z.B. Wohnüberbauung Steinegg" />
		</label>

		<label>
			<span>Adresse / Baustelle</span>
			<input name="address" type="text" value={form?.values?.address ?? ''} placeholder="Badenerstrasse 26, 8952 Schlieren" />
		</label>

		<div class="row">
			<label>
				<span>Start</span>
				<input name="startDate" type="month" value={form?.values?.startDate ?? ''} />
			</label>
			<label>
				<span>Ende (geplant)</span>
				<input name="endDate" type="month" value={form?.values?.endDate ?? ''} />
			</label>
		</div>

		<label>
			<span>Status</span>
			<select name="status">
				<option value="offen" selected={form?.values?.status === 'offen' || !form?.values}>offen</option>
				<option value="laufend" selected={form?.values?.status === 'laufend'}>laufend</option>
				<option value="pausiert" selected={form?.values?.status === 'pausiert'}>pausiert</option>
				<option value="abgeschlossen" selected={form?.values?.status === 'abgeschlossen'}>abgeschlossen</option>
			</select>
		</label>

		<div class="actions">
			<a href="/" class="btn-secondary">Abbrechen</a>
			<button type="submit" class="btn-primary">Projekt anlegen</button>
		</div>
	</form>
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
		padding: 1rem 2rem;
		background: white;
		border-bottom: 1px solid #eee;
	}

	.brand {
		display: flex;
		gap: 1rem;
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
	}

	.back {
		color: #555;
		text-decoration: none;
		font-size: 0.95rem;
	}

	.back:hover {
		color: #1a1a1a;
	}

	main {
		max-width: 640px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		margin: 0 0 1.5rem;
	}

	.form {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		border: 1px solid #eee;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	label span {
		font-size: 0.85rem;
		color: #555;
	}

	input,
	select {
		padding: 0.65rem 0.8rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
		font-family: inherit;
		background: white;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #fbc02d;
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.btn-primary {
		background: #fbc02d;
		color: #1a1a1a;
		border: none;
		padding: 0.7rem 1.5rem;
		border-radius: 6px;
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
	}

	.btn-primary:hover {
		background: #f9a825;
	}

	.btn-secondary {
		background: transparent;
		color: #555;
		padding: 0.7rem 1.2rem;
		border-radius: 6px;
		text-decoration: none;
		font-size: 0.95rem;
	}

	.btn-secondary:hover {
		color: #1a1a1a;
	}

	.alert {
		padding: 0.85rem 1rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}

	.alert-error {
		background: #ffebee;
		color: #c62828;
		border: 1px solid #ef9a9a;
	}
</style>
