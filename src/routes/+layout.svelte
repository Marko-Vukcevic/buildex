<script>
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import '../app.css';

	let { data, children } = $props();

	// Auf Login/Register-Pages kein Sidebar-Layout
	const AUTH_PAGES = ['/login', '/register'];
	let isAuthPage = $derived(AUTH_PAGES.includes(data.pathname));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{#if isAuthPage}
	{@render children()}
{:else}
	<div class="app">
		<Sidebar user={data.user} />
		<main class="content">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.app {
		display: grid;
		grid-template-columns: 240px 1fr;
		min-height: 100vh;
	}
	.content {
		background: #fafafa;
		min-width: 0;
	}
	@media (max-width: 720px) {
		.app {
			grid-template-columns: 1fr;
		}
	}
</style>
