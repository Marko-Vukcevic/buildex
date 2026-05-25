<script>
	// Persistente Sidebar im Figma-Mockup-Stil:
	// - Weisser Hintergrund, schmal (~220px)
	// - Avatar oben mit Username + Companyname
	// - Active Nav-Item: gelbe Pille die rechts über die Sidebar hinausragt
	import { page } from '$app/state';

	let { user = null } = $props();

	const navItems = [
		{ href: '/', label: 'Projektüberblick', icon: 'list' },
		{ href: '/projects/new', label: 'Neues Projekt', icon: 'plus' },
		{ href: '/calendar', label: 'Wochenkalender', icon: 'calendar' },
		{ href: '/stats', label: 'Statistiken', icon: 'chart' },
		{ href: '/account', label: 'Konto Einstellungen', icon: 'gear' }
	];

	function isActive(href) {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}

	let displayName = $derived(user?.username ?? 'Max Muster');
	let displayCompany = $derived(user?.company ?? 'Bauunternehmung XY AG');
</script>

<aside>
	<!-- Profil oben: Avatar + Name + Firmenname (wie im Figma) -->
	<div class="profile">
		<div class="avatar" aria-hidden="true">
			<svg viewBox="0 0 24 24" fill="#fbc02d">
				<circle cx="12" cy="12" r="12"/>
				<path d="M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 8c-3.3 0-6 1.5-6 4v1h12v-1c0-2.5-2.7-4-6-4Z" fill="white"/>
			</svg>
		</div>
		<div class="profile-text">
			<div class="user-name">{displayName}</div>
			<div class="company">{displayCompany}</div>
		</div>
	</div>

	<div class="divider"></div>

	<nav>
		{#each navItems as item (item.href)}
			<a href={item.href} class="nav-link" class:active={isActive(item.href)}>
				<span class="icon" aria-hidden="true">
					{#if item.icon === 'list'}
						<!-- Projekt-Icon (Lupe + Dokument, wie im Mockup) -->
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="14" height="14" rx="2"/><circle cx="14.5" cy="14.5" r="3.5"/><line x1="17" y1="17" x2="20" y2="20"/></svg>
					{:else if item.icon === 'plus'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
					{:else if item.icon === 'calendar'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
					{:else if item.icon === 'chart'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18M7 14l4-4 4 4 5-7"/></svg>
					{:else if item.icon === 'gear'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
					{/if}
				</span>
				<span class="label">
					{#if item.icon === 'gear'}
						<span class="label-main">Konto</span>
						<span class="label-sub">Einstellungen</span>
					{:else}
						{item.label}
					{/if}
				</span>
			</a>
		{/each}
	</nav>

	<div class="footer">
		{#if user}
			<a href="/logout" class="footer-link">Abmelden →</a>
		{:else}
			<a href="/login" class="footer-link">Anmelden →</a>
		{/if}
	</div>
</aside>

<style>
	aside {
		background: white;
		border-right: 1px solid var(--c-border);
		display: flex;
		flex-direction: column;
		padding: 24px 0 24px 24px;
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: visible; /* Damit die gelbe Aktiv-Pille rechts hinausragen kann */
	}

	.profile {
		display: flex;
		gap: 12px;
		align-items: center;
		padding-right: 24px;
		margin-bottom: 16px;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		flex-shrink: 0;
	}
	.avatar :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}

	.profile-text { min-width: 0; }
	.user-name {
		font-weight: 600;
		font-size: 0.95rem;
		color: var(--c-text);
		line-height: 1.2;
	}
	.company {
		color: var(--c-text-muted);
		font-size: 0.8rem;
		line-height: 1.3;
	}

	.divider {
		border-top: 1px solid var(--c-border);
		margin: 0 24px 16px 0;
	}

	nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: 14px;
		padding: 12px 16px;
		text-decoration: none;
		color: var(--c-text);
		font-size: 0.9rem;
		font-weight: 500;
		transition: background 0.15s;
		position: relative;
		/* Pille die rechts über die Sidebar hinausragt: */
		border-top-left-radius: 999px;
		border-bottom-left-radius: 999px;
		margin-right: -1px; /* überdeckt die border-right */
	}

	.nav-link:hover:not(.active) {
		background: #f5f5f5;
	}

	.nav-link.active {
		background: var(--c-yellow);
		color: var(--c-text);
		font-weight: 600;
		/* Schatten leicht nach rechts, damit die Pille deutlich hervortritt */
		box-shadow: 2px 0 6px rgba(251, 192, 45, 0.25);
	}

	.icon {
		width: 22px;
		height: 22px;
		flex-shrink: 0;
		display: inline-flex;
	}

	.icon :global(svg) {
		width: 100%;
		height: 100%;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.label {
		display: flex;
		flex-direction: column;
		line-height: 1.2;
	}
	.label-main {
		font-weight: 600;
	}
	.label-sub {
		font-size: 0.72rem;
		color: var(--c-text-muted);
		font-weight: 400;
	}
	.nav-link.active .label-sub {
		color: rgba(0, 0, 0, 0.6);
	}

	.footer {
		padding: 12px 24px 0 0;
		border-top: 1px solid var(--c-border);
		margin-top: 16px;
	}

	.footer-link {
		display: inline-block;
		color: var(--c-text-muted);
		text-decoration: none;
		font-size: 0.85rem;
	}
	.footer-link:hover {
		color: var(--c-text);
		text-decoration: underline;
	}

	@media (max-width: 720px) {
		aside {
			position: static;
			height: auto;
			border-right: none;
			border-bottom: 1px solid var(--c-border);
			padding: 16px;
		}
		nav {
			flex-direction: row;
			overflow-x: auto;
		}
		.nav-link {
			border-radius: var(--radius-sm);
			margin: 0;
		}
		.footer {
			display: none;
		}
	}
</style>
