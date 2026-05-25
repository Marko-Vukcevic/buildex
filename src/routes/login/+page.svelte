<script>
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Anmelden – BUILDEX</title>
</svelte:head>

<div class="auth-page">
	<div class="card">
		<div class="brand">
			<div class="logo">B</div>
			<h1>BUILDEX</h1>
		</div>
		<p class="muted">Anmelden und deine Baustellen verwalten.</p>

		<form method="POST" use:enhance class="form">
			<input type="hidden" name="redirectTo" value={data.redirectTo} />

			{#if form?.errors?._}
				<div class="alert-err">{form.errors._}</div>
			{/if}

			<label>
				<span>E-Mail</span>
				<input
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.values?.email ?? ''}
				/>
				{#if form?.errors?.email}<small class="err">{form.errors.email}</small>{/if}
			</label>

			<label>
				<span>Passwort</span>
				<input name="password" type="password" autocomplete="current-password" required />
				{#if form?.errors?.password}<small class="err">{form.errors.password}</small>{/if}
			</label>

			<button type="submit" class="btn-primary">Anmelden</button>

			<div class="demo-hint">
				<strong>Demo-Login:</strong> <code>demo@buildex.ch</code> / <code>demo123</code>
			</div>

			<p class="switch">
				Noch kein Account? <a href="/register">Jetzt registrieren →</a>
			</p>
		</form>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--sp-5);
		background: linear-gradient(135deg, #fef3c7 0%, #fafafa 100%);
	}
	.card {
		width: 100%;
		max-width: 420px;
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-6);
		box-shadow: var(--shadow-card);
	}
	.brand {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		margin-bottom: var(--sp-2);
	}
	.logo {
		width: 44px;
		height: 44px;
		border-radius: 50%;
		background: var(--c-yellow);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 800;
		font-size: 1.4rem;
	}
	h1 {
		margin: 0;
		font-size: 1.5rem;
		letter-spacing: 0.05em;
	}
	.muted {
		color: var(--c-text-muted);
		margin: 0 0 var(--sp-5);
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: var(--sp-4);
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
	input {
		padding: 10px 12px;
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
	}
	input:focus {
		outline: none;
		border-color: var(--c-yellow);
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
	}
	.err {
		color: var(--c-danger);
		font-size: 0.8rem;
	}
	.alert-err {
		background: #fef2f2;
		border: 1px solid #fca5a5;
		color: #991b1b;
		padding: var(--sp-3);
		border-radius: var(--radius-sm);
		font-size: 0.9rem;
	}
	.btn-primary {
		background: var(--c-yellow);
		color: #422006;
		border: none;
		padding: 12px;
		border-radius: var(--radius-sm);
		font-weight: 600;
		font-size: 1rem;
		cursor: pointer;
	}
	.btn-primary:hover {
		background: #f0b526;
	}
	.demo-hint {
		background: #f0fdf4;
		border: 1px solid #86efac;
		border-radius: var(--radius-sm);
		padding: var(--sp-3);
		font-size: 0.85rem;
		color: #166534;
	}
	.demo-hint code {
		background: white;
		padding: 1px 5px;
		border-radius: 3px;
		font-size: 0.85rem;
	}
	.switch {
		text-align: center;
		font-size: 0.85rem;
		color: var(--c-text-muted);
		margin: 0;
	}
	.switch a {
		color: var(--c-text);
		font-weight: 600;
		text-decoration: none;
	}
	.switch a:hover {
		text-decoration: underline;
	}
</style>
