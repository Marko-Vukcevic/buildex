<script>
	let { data } = $props();
	let user = $derived(data.user);

	function dateString(iso) {
		if (!iso) return '–';
		return new Date(iso).toLocaleDateString('de-CH', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Konto Einstellungen – BUILDEX</title>
</svelte:head>

<header class="header">
	<h1>Konto Einstellungen</h1>
	<p class="subtitle">Deine Profil-Daten und Account-Informationen.</p>
</header>

{#if !user}
	<div class="card warn">
		<h3>Nicht angemeldet</h3>
		<p>Du bist aktuell im Gast-Modus. Melde dich an oder registriere ein neues Konto, um deine Daten zu speichern.</p>
		<div class="actions">
			<a href="/login" class="btn-primary">Anmelden</a>
			<a href="/register" class="btn-secondary">Registrieren</a>
		</div>
	</div>
{:else}
	<div class="card">
		<h3>Business Profile</h3>
		<dl>
			<dt>Benutzername</dt>
			<dd>{user.username}</dd>
			<dt>E-Mail</dt>
			<dd>{user.email}</dd>
			<dt>Firmenname</dt>
			<dd>{user.company || '—'}</dd>
			<dt>Rolle</dt>
			<dd>{user.role}</dd>
			<dt>Mitglied seit</dt>
			<dd>{dateString(user.createdAt)}</dd>
		</dl>
		<p class="hint">
			Hinweis: Bearbeiten der Profil-Daten ist Teil der nächsten Iteration. Aktuell stammen die Daten
			aus dem Registrierungsformular.
		</p>
		<a href="/logout" class="btn-danger">Abmelden</a>
	</div>
{/if}

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
		margin: 0 var(--sp-6) var(--sp-4);
	}
	.card.warn {
		background: #fff7ed;
		border-color: #fdba74;
	}
	h3 {
		margin: 0 0 var(--sp-4);
		font-size: 1.1rem;
	}
	dl {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: var(--sp-3);
		margin: 0 0 var(--sp-4);
	}
	dt {
		font-size: 0.85rem;
		color: var(--c-text-muted);
		font-weight: 600;
	}
	dd {
		margin: 0;
		font-size: 0.95rem;
	}
	.hint {
		font-size: 0.85rem;
		color: var(--c-text-muted);
		padding: var(--sp-3);
		background: #fafafa;
		border-radius: var(--radius-sm);
		border-left: 3px solid var(--c-yellow);
		margin-bottom: var(--sp-4);
	}
	.actions {
		display: flex;
		gap: var(--sp-3);
		margin-top: var(--sp-4);
	}
	.btn-primary,
	.btn-secondary,
	.btn-danger {
		display: inline-block;
		padding: 10px 16px;
		border-radius: var(--radius-sm);
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
		border: none;
		cursor: pointer;
	}
	.btn-primary {
		background: var(--c-yellow);
		color: #422006;
	}
	.btn-secondary {
		background: white;
		border: 1px solid var(--c-border-strong);
		color: var(--c-text);
	}
	.btn-danger {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fca5a5;
	}
</style>
