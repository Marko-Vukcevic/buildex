<script>
	// Persistente Navigation links. Aktive Route wird hervorgehoben.
	import { page } from '$app/state';

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
</script>

<aside>
	<div class="brand">
		<div class="logo">B</div>
		<div class="brand-text">
			<div class="user-name">Max Muster</div>
			<div class="company">Bauunternehmung XY AG</div>
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
		<div class="role">Rolle: Lieferant</div>
		<div class="version">v0.1.0 – Prototype</div>
	</div>
</aside>

<style>
	aside {
		background: white;
		border-right: 1px solid var(--c-border);
		display: flex;
		flex-direction: column;
		padding: var(--sp-5);
		position: sticky;
		top: 0;
		height: 100vh;
	}

	.brand {
		display: flex;
		gap: var(--sp-3);
		align-items: center;
		margin-bottom: var(--sp-6);
	}

	.logo {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--c-yellow);
		color: var(--c-text);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 1.4rem;
		flex-shrink: 0;
	}

	.user-name {
		font-weight: 600;
		font-size: 0.95rem;
	}

	.company {
		color: var(--c-text-muted);
		font-size: 0.8rem;
	}

	nav {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		padding: 10px 12px;
		border-radius: var(--radius-sm);
		text-decoration: none;
		color: var(--c-text-muted);
		font-size: 0.9rem;
		font-weight: 500;
		transition: background 0.15s, color 0.15s;
	}

	.nav-link:hover {
		background: #f5f5f5;
		color: var(--c-text);
	}

	.nav-link.active {
		background: var(--c-yellow);
		color: var(--c-text);
		font-weight: 600;
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
		border-top: 1px solid var(--c-border);
		font-size: 0.75rem;
		color: var(--c-text-faint);
		line-height: 1.6;
	}
	.role {
		font-weight: 600;
		color: var(--c-text-muted);
	}

	@media (max-width: 720px) {
		aside {
			position: static;
			height: auto;
			border-right: none;
			border-bottom: 1px solid var(--c-border);
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
