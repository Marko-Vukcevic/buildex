<script>
	// Persistente Sidebar — Figma-Mockup-Style: gelber Hintergrund, weisse Icons.
	// Zeigt eingeloggten User (oder Gast-Modus mit Login-Link).
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
	<!-- BUILDEX-Logo: Diamant-Pattern auf gelbem Hintergrund (näher am Figma) -->
	<div class="brand">
		<div class="logo" aria-label="BUILDEX">
			<svg viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
				<rect width="44" height="44" rx="6" fill="#1a1a1a"/>
				<g stroke="#fbc02d" stroke-width="2.2" fill="none" stroke-linejoin="round">
					<!-- Diamant-Pattern: stilisiertes B als Doppel-Diamond -->
					<path d="M22 7 L33 16 L33 28 L22 37 L11 28 L11 16 Z"/>
					<path d="M22 14 L28 19 L28 25 L22 30 L16 25 L16 19 Z"/>
					<line x1="22" y1="7" x2="22" y2="14"/>
					<line x1="22" y1="30" x2="22" y2="37"/>
				</g>
			</svg>
		</div>
		<div class="brand-text">
			<div class="user-name">{displayName}</div>
			<div class="company">{displayCompany}</div>
		</div>
	</div>

	<nav>
		{#each navItems as item (item.href)}
			<a href={item.href} class="nav-link" class:active={isActive(item.href)}>
				<span class="icon" aria-hidden="true">
					{#if item.icon === 'list'}
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>
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
				<span>{item.label}</span>
			</a>
		{/each}
	</nav>

	<div class="footer">
		{#if user}
			<div class="role">Angemeldet als {user.role}</div>
			<a href="/logout" class="footer-link">Abmelden →</a>
		{:else}
			<div class="role">Gast-Modus</div>
			<a href="/login" class="footer-link">Anmelden →</a>
		{/if}
		<div class="version">v0.3.0 – Prototype</div>
	</div>
</aside>

<style>
	aside {
		/* Volle gelbe Sidebar wie im Figma-Mockup */
		background: var(--c-yellow);
		border-right: 1px solid var(--c-yellow-dark);
		display: flex;
		flex-direction: column;
		padding: var(--sp-5);
		position: sticky;
		top: 0;
		height: 100vh;
		color: var(--c-text);
	}

	.brand {
		display: flex;
		gap: var(--sp-3);
		align-items: center;
		margin-bottom: var(--sp-6);
		padding-bottom: var(--sp-4);
		border-bottom: 1px solid rgba(0, 0, 0, 0.08);
	}

	.logo {
		width: 44px;
		height: 44px;
		flex-shrink: 0;
	}
	.logo :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}

	.user-name {
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--c-text);
	}

	.company {
		color: rgba(0, 0, 0, 0.65);
		font-size: 0.8rem;
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
		gap: var(--sp-3);
		padding: 10px 12px;
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: rgba(0, 0, 0, 0.75);
		font-size: 0.9rem;
		font-weight: 600;
		transition: background 0.15s, color 0.15s;
	}

	.nav-link:hover {
		background: rgba(255, 255, 255, 0.35);
		color: var(--c-text);
	}

	.nav-link.active {
		background: white;
		color: var(--c-text);
		font-weight: 700;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
	}

	.icon {
		width: 18px;
		height: 18px;
		display: inline-flex;
	}

	.icon :global(svg) {
		width: 100%;
		height: 100%;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.footer {
		padding-top: var(--sp-4);
		border-top: 1px solid rgba(0, 0, 0, 0.08);
		font-size: 0.75rem;
		color: rgba(0, 0, 0, 0.6);
		line-height: 1.6;
	}
	.role {
		font-weight: 600;
		color: rgba(0, 0, 0, 0.75);
	}
	.footer-link {
		display: inline-block;
		margin: 2px 0;
		color: rgba(0, 0, 0, 0.7);
		text-decoration: none;
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
			border-bottom: 1px solid var(--c-yellow-dark);
		}
		nav {
			flex-direction: row;
			overflow-x: auto;
		}
		.footer {
			display: none;
		}
	}
</style>
