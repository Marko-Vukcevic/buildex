<script>
	import favicon from '$lib/assets/favicon.svg';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="app">
	<Sidebar />
	<main class="content">
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: grid;
		grid-template-columns: 240px 1fr;
		min-height: 100vh;
	}
	.content {
		background: #fafafa;
		min-width: 0; /* prevent overflow from child grids */
	}
	@media (max-width: 720px) {
		.app {
			grid-template-columns: 1fr;
		}
	}
</style>
