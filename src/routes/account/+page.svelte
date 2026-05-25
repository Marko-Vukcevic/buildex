<script>
	// Account-Settings im Figma-Mockup-Stil (6042:1034 + 6042:1094):
	// - Zweispaltiges Layout: links Sub-Navigation mit 8 Items, rechts Content
	// - Aktive Sub-Item: schwarz fett + vertikaler dunkler Strich rechts
	// - Inaktive Items: hellgrau
	// - Default ist "Geschäftsprofil" (zeigt eingeloggte User-Daten)
	let { data } = $props();
	let user = $derived(data.user);

	let activeTab = $state('geschaeftsprofil');

	const tabs = [
		{ key: 'geschaeftsprofil', label: 'Geschäftsprofil' },
		{ key: 'benutzer', label: 'Benutzer' },
		{ key: 'datenschutz', label: 'Datenschutz' },
		{ key: 'kalender', label: 'Kalendereinstellungen' },
		{ key: 'produkte', label: 'Produkte' },
		{ key: 'meldungen', label: 'Meldungen' },
		{ key: 'erinnerungen', label: 'Erinnerungen' },
		{ key: 'backup', label: 'Data Backup' }
	];

	// Demo-Material-Stammdaten als "Produkte"-Cards (entsprechen Mockup 6042:1034)
	const demoProdukte = [
		{ name: 'Beton NPKC', adresse: 'Badenerstrasse 26, 8952 Schlieren', dauer: '06.2022 - 11.2026' },
		{ name: 'Beton NPKA', adresse: 'Badenerstrasse 26, 8952 Schlieren', dauer: '06.2022 - 11.2026' },
		{ name: 'Beton NPKB', adresse: 'Badenerstrasse 26, 8952 Schlieren', dauer: '06.2022 - 11.2026' },
		{ name: 'Beton NPKE', adresse: 'Badenerstrasse 26, 8952 Schlieren', dauer: '06.2022 - 11.2026' },
		{ name: 'Beton NPKD', adresse: 'Badenerstrasse 26, 8952 Schlieren', dauer: '06.2022 - 11.2026' }
	];

	// Demo-Kalender-Toggles
	const kalenderOptions = [
		{ label: 'E-Mail-Benachrichtigung bei neuer Lieferung', on: true },
		{ label: 'Push-Notification 24h vor Liefertermin', on: false },
		{ label: 'Wochenkalender automatisch auf Montag öffnen', on: true },
		{ label: 'Konflikt-Warnung bei mehr als 3 Lieferungen', on: false },
		{ label: 'Wochenend-Lieferungen ausblenden', on: true },
		{ label: 'Vergangene Lieferungen nach 30 Tagen archivieren', on: false }
	];

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
	<title>Einstellungen – BUILDEX</title>
</svelte:head>

<div class="page">
	<header class="page-head">
		<h1>Einstellungen</h1>
		<p class="subtitle">Profil-Daten, Benachrichtigungen, Produkte und Datenoptionen verwalten.</p>
	</header>

	<div class="settings-layout">
		<nav class="sub-nav">
			{#each tabs as tab (tab.key)}
				<button
					type="button"
					class:active={activeTab === tab.key}
					onclick={() => (activeTab = tab.key)}
				>
					{tab.label}
				</button>
			{/each}
		</nav>

		<section class="content">
			{#if activeTab === 'geschaeftsprofil'}
				<h2>Geschäftsprofil</h2>
				<p class="content-sub">Deine Profil-Daten und Account-Informationen.</p>

				{#if !user}
					<div class="warn">
						<strong>Nicht angemeldet</strong>
						<p>Du bist aktuell im Gast-Modus. Melde dich an oder registriere ein neues Konto.</p>
						<div class="actions">
							<a href="/login" class="btn-primary">Anmelden</a>
							<a href="/register" class="btn-secondary">Registrieren</a>
						</div>
					</div>
				{:else}
					<dl class="profile">
						<dt>Benutzername</dt><dd>{user.username}</dd>
						<dt>E-Mail</dt><dd>{user.email}</dd>
						<dt>Firmenname</dt><dd>{user.company || '—'}</dd>
						<dt>Rolle</dt><dd>{user.role}</dd>
						<dt>Mitglied seit</dt><dd>{dateString(user.createdAt)}</dd>
					</dl>
					<a href="/logout" class="btn-danger">Abmelden</a>
				{/if}

			{:else if activeTab === 'benutzer'}
				<h2>Benutzer</h2>
				<p class="content-sub">Verwalte zusätzliche Benutzer und deren Rollen.</p>
				<div class="placeholder">
					Multi-User-Verwaltung wird in Phase 2 implementiert. Aktuell ist BUILDEX als Single-User-Demo angelegt.
				</div>

			{:else if activeTab === 'datenschutz'}
				<h2>Datenschutz</h2>
				<p class="content-sub">Cookie-Einstellungen, Datenexport, Account-Löschung.</p>
				<div class="placeholder">
					Datenschutz-Optionen werden in Phase 2 detailliert implementiert. Aktuell speichert BUILDEX nur Session-Cookies für den Login.
				</div>

			{:else if activeTab === 'kalender'}
				<h2>Kalendereinstellungen</h2>
				<p class="content-sub">Steuere wie der Wochenkalender Lieferungen und Benachrichtigungen anzeigt.</p>
				<ul class="toggle-list">
					{#each kalenderOptions as opt}
						<li>
							<span>{opt.label}</span>
							<div class="toggle" class:on={opt.on}>
								<div class="dot"></div>
							</div>
						</li>
					{/each}
				</ul>

			{:else if activeTab === 'produkte'}
				<h2>Produkte</h2>
				<p class="content-sub">Material-Stammdaten der Lieferanten (Demo).</p>
				<div class="produkte-grid">
					{#each demoProdukte as prod}
						<div class="produkt-card">
							<h3>{prod.name}</h3>
							<p class="prod-sub">{prod.adresse}</p>
							<p class="prod-meta">Projektdauer: {prod.dauer}</p>
							<button type="button" class="oeffnen">ÖFFNEN</button>
						</div>
					{/each}
					<button type="button" class="add-card" aria-label="Neues Produkt">+</button>
				</div>

			{:else if activeTab === 'meldungen'}
				<h2>Meldungen</h2>
				<p class="content-sub">System-Mitteilungen und Status-Notifications.</p>
				<div class="placeholder">Keine offenen Meldungen.</div>

			{:else if activeTab === 'erinnerungen'}
				<h2>Erinnerungen</h2>
				<p class="content-sub">Automatische Reminders für Lieferungen und Termine.</p>
				<div class="placeholder">Erinnerungs-Workflow wird in Phase 2 implementiert.</div>

			{:else if activeTab === 'backup'}
				<h2>Data Backup</h2>
				<p class="content-sub">Manuelles Backup der Projekt-Datenbank als JSON-Export.</p>
				<div class="placeholder">Backup-Export wird in Phase 2 implementiert (geplant: einmal monatlich automatisch).</div>
			{/if}
		</section>
	</div>
</div>

<style>
	.page {
		padding: 32px 40px;
	}
	.page-head h1 {
		margin: 0 0 4px;
		font-size: 1.5rem;
	}
	.subtitle {
		color: var(--c-text-muted);
		margin: 0 0 24px;
		font-size: 0.9rem;
	}

	.settings-layout {
		display: grid;
		grid-template-columns: 220px 1fr;
		gap: 32px;
		background: white;
		border-radius: 12px;
		padding: 32px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
		min-height: 460px;
	}

	.sub-nav {
		display: flex;
		flex-direction: column;
		gap: 0;
		border-right: 1px solid var(--c-border);
		padding-right: 0;
	}
	.sub-nav button {
		text-align: left;
		background: none;
		border: none;
		padding: 10px 16px 10px 0;
		color: var(--c-text-muted);
		font-family: inherit;
		font-size: 0.95rem;
		cursor: pointer;
		position: relative;
	}
	.sub-nav button:hover {
		color: var(--c-text);
	}
	.sub-nav button.active {
		color: var(--c-text);
		font-weight: 700;
	}
	.sub-nav button.active::after {
		content: '';
		position: absolute;
		right: -1px;
		top: 8px;
		bottom: 8px;
		width: 2px;
		background: var(--c-text);
	}

	.content {
		padding: 0 8px;
	}
	.content h2 {
		margin: 0 0 4px;
		font-size: 1.25rem;
	}
	.content-sub {
		color: var(--c-text-muted);
		margin: 0 0 24px;
		font-size: 0.9rem;
	}

	.warn {
		background: #fff7ed;
		border: 1px solid #fdba74;
		border-radius: 8px;
		padding: 20px;
	}
	.warn strong { display: block; font-size: 1rem; margin-bottom: 4px; }
	.warn p { margin: 0 0 12px; color: var(--c-text); font-size: 0.9rem; }
	.actions { display: flex; gap: 12px; }

	.profile {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 12px 24px;
		margin: 0 0 24px;
	}
	.profile dt {
		color: var(--c-text-muted);
		font-size: 0.85rem;
		font-weight: 600;
	}
	.profile dd { margin: 0; font-size: 0.95rem; }

	.btn-primary, .btn-secondary, .btn-danger {
		display: inline-block;
		padding: 10px 18px;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		font-size: 0.9rem;
		border: none;
		cursor: pointer;
	}
	.btn-primary { background: var(--c-yellow); color: var(--c-text); }
	.btn-secondary { background: white; border: 1px solid var(--c-border-strong); color: var(--c-text); }
	.btn-danger { background: #fef2f2; color: #991b1b; border: 1px solid #fca5a5; }

	.placeholder {
		padding: 32px;
		background: #fafafa;
		border-radius: 8px;
		color: var(--c-text-muted);
		font-size: 0.9rem;
		text-align: center;
		border: 1px dashed var(--c-border);
	}

	.toggle-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.toggle-list li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px 0;
		border-bottom: 1px solid var(--c-border);
	}
	.toggle-list li:last-child { border-bottom: none; }
	.toggle-list li span {
		color: var(--c-text);
		font-size: 0.9rem;
	}
	.toggle {
		width: 42px;
		height: 22px;
		border-radius: 999px;
		background: #d4d4d4;
		position: relative;
		cursor: pointer;
		transition: background 0.15s;
	}
	.toggle.on { background: var(--c-yellow); }
	.toggle .dot {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
		transition: left 0.15s;
	}
	.toggle.on .dot { left: 22px; }

	.produkte-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 16px;
	}
	.produkt-card {
		background: white;
		border-radius: 8px;
		padding: 16px 20px 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
		display: flex;
		flex-direction: column;
	}
	.produkt-card h3 {
		margin: 0 0 4px;
		font-size: 1rem;
		font-weight: 700;
	}
	.prod-sub {
		margin: 0 0 8px;
		color: var(--c-text-muted);
		font-size: 0.75rem;
	}
	.prod-meta {
		margin: 0 0 12px;
		color: var(--c-text-muted);
		font-size: 0.8rem;
	}
	.oeffnen {
		background: none;
		border: none;
		color: #1a73e8;
		font-weight: 600;
		font-size: 0.75rem;
		letter-spacing: 0.06em;
		cursor: pointer;
		padding: 0;
		text-align: left;
		font-family: inherit;
		margin-top: auto;
	}
	.add-card {
		background: rgba(251, 192, 45, 0.2);
		border: none;
		border-radius: 50%;
		width: 56px;
		height: 56px;
		font-size: 2rem;
		font-weight: 300;
		color: var(--c-text);
		cursor: pointer;
		align-self: center;
		justify-self: center;
		margin: auto;
	}
	.add-card:hover {
		background: var(--c-yellow);
	}

	@media (max-width: 720px) {
		.settings-layout {
			grid-template-columns: 1fr;
		}
		.sub-nav {
			flex-direction: row;
			overflow-x: auto;
			border-right: none;
			border-bottom: 1px solid var(--c-border);
		}
		.sub-nav button.active::after {
			right: 50%;
			top: auto;
			bottom: -1px;
			width: 30%;
			height: 2px;
			transform: translateX(50%);
		}
	}
</style>
