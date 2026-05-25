<script>
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<svelte:head>
	<title>Registrieren – BUILDEX</title>
</svelte:head>

<div class="auth-page">
	<div class="card">
		<div class="brand">
			<div class="logo">B</div>
			<h1>BUILDEX</h1>
		</div>
		<p class="muted">Lege dein Bauleiter-Konto an.</p>

		<form method="POST" use:enhance class="form" novalidate>
			<label>
				<span>E-Mail *</span>
				<input
					name="email"
					type="email"
					autocomplete="email"
					required
					value={form?.values?.email ?? ''}
					placeholder="bauleiter@firma.ch"
				/>
				{#if form?.errors?.email}<small class="err">{form.errors.email}</small>{/if}
			</label>

			<label>
				<span>Benutzername *</span>
				<input
					name="username"
					type="text"
					autocomplete="username"
					required
					minlength="3"
					maxlength="30"
					value={form?.values?.username ?? ''}
					placeholder="z.B. mvukcevic"
				/>
				{#if form?.errors?.username}<small class="err">{form.errors.username}</small>{/if}
			</label>

			<label>
				<span>Firmenname</span>
				<input
					name="company"
					type="text"
					autocomplete="organization"
					value={form?.values?.company ?? ''}
					placeholder="Bauunternehmung XY AG"
				/>
				{#if form?.errors?.company}<small class="err">{form.errors.company}</small>{/if}
			</label>

			<label>
				<span>Passwort * <small class="hint">(mind. 6 Zeichen)</small></span>
				<input name="password" type="password" autocomplete="new-password" required minlength="6" />
				{#if form?.errors?.password}<small class="err">{form.errors.password}</small>{/if}
			</label>

			<button type="submit" class="btn-primary">Konto erstellen</button>

			<p class="switch">
				Schon ein Account? <a href="/login">Anmelden →</a>
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
	.hint {
		font-weight: 400;
		color: var(--c-text-faint, #94a3b8);
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
