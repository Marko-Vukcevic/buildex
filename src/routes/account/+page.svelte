<script>
	// Statische Account-Page mit Mock-Daten. Im Mockup hatten wir das Settings-Panel.
	// Im Prototype zeigen wir das Layout — Datenpersistenz dieser Felder ist Phase 2.
</script>

<svelte:head>
	<title>Konto Einstellungen – BUILDEX</title>
</svelte:head>

<header class="header">
	<h1>Konto Einstellungen</h1>
	<p class="subtitle">Stammdaten, Branche und Standardwerte für deinen Account.</p>
</header>

<div class="card">
	<h3>Business Profile</h3>
	<dl>
		<dt>Geschäftsname</dt>
		<dd>Bauunternehmung XY AG</dd>
		<dt>Logo</dt>
		<dd>—</dd>
		<dt>Telefon</dt>
		<dd>+41 79 999 99 23</dd>
		<dt>Industrie</dt>
		<dd>Beton</dd>
	</dl>
	<p class="hint">
		Hinweis: Die Bearbeitung dieser Einstellungen ist Teil der nächsten Iteration. Aktuell stehen die
		Felder hier als statisches Mockup zur Verfügung.
	</p>
</div>

<style>
	.header {
		padding: var(--sp-6) var(--sp-6) var(--sp-4);
	}
	h1 {
		margin: 0 0 var(--sp-1);
	}
	.subtitle {
		margin: 0;
		color: var(--c-text-muted);
	}
	.card {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-5);
		margin: 0 var(--sp-6) var(--sp-7);
		max-width: 720px;
	}
	h3 {
		margin: 0 0 var(--sp-3);
	}
	dl {
		display: grid;
		grid-template-columns: 200px 1fr;
		gap: var(--sp-2) var(--sp-4);
		margin: 0;
	}
	dt {
		color: var(--c-text-muted);
		font-size: 0.875rem;
	}
	dd {
		margin: 0;
	}
	.hint {
		margin-top: var(--sp-5);
		padding-top: var(--sp-4);
		border-top: 1px solid var(--c-border);
		color: var(--c-text-muted);
		font-size: 0.875rem;
		font-style: italic;
	}
</style>
