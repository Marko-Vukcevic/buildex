<script>
	import { enhance } from '$app/forms';
	let { form } = $props();
</script>

<svelte:head>
	<title>Registrieren – BUILDEX</title>
</svelte:head>

<div class="auth-page">
	<div class="logo-float">
		<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-label="BUILDEX">
			<circle cx="40" cy="40" r="40" fill="#fbc02d"/>
			<g stroke="#1a1a1a" stroke-width="3.5" fill="none" stroke-linejoin="round">
				<path d="M40 14 L60 30 L60 50 L40 66 L20 50 L20 30 Z"/>
				<path d="M40 24 L52 33 L52 47 L40 56 L28 47 L28 33 Z"/>
				<line x1="40" y1="14" x2="40" y2="24"/>
				<line x1="40" y1="56" x2="40" y2="66"/>
			</g>
		</svg>
	</div>

	<div class="card">
		<h1>Registrierung</h1>
		<p class="subtitle">Lege dein Bauleiter-Konto an</p>

		<form method="POST" use:enhance class="form" novalidate>
			<input
				name="email"
				type="email"
				autocomplete="email"
				required
				value={form?.values?.email ?? ''}
				placeholder="E-Mail"
			/>
			{#if form?.errors?.email}<small class="err">{form.errors.email}</small>{/if}

			<input
				name="username"
				type="text"
				autocomplete="username"
				required
				minlength="3"
				maxlength="30"
				value={form?.values?.username ?? ''}
				placeholder="Benutzername"
			/>
			{#if form?.errors?.username}<small class="err">{form.errors.username}</small>{/if}

			<input
				name="company"
				type="text"
				autocomplete="organization"
				value={form?.values?.company ?? ''}
				placeholder="Firmenname"
			/>
			{#if form?.errors?.company}<small class="err">{form.errors.company}</small>{/if}

			<input name="password" type="password" autocomplete="new-password" required minlength="6" placeholder="Passwort (mind. 6 Zeichen)" />
			{#if form?.errors?.password}<small class="err">{form.errors.password}</small>{/if}

			<p class="login-line">
				Schon ein Konto? <a href="/login">JETZT ANMELDEN</a>
			</p>

			<button type="submit" class="register-btn">KONTO ERSTELLEN</button>
		</form>
	</div>
</div>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--sp-5);
		background: #fef3c7;
	}
	.logo-float {
		width: 80px;
		height: 80px;
		margin-bottom: -40px;
		z-index: 2;
		filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
	}
	.logo-float svg { width: 100%; height: 100%; display: block; }
	.card {
		width: 100%;
		max-width: 460px;
		background: #fef9d9;
		border-radius: 16px;
		padding: 64px 48px 48px;
		box-shadow: 0 8px 24px rgba(0,0,0,0.08);
		text-align: center;
	}
	h1 {
		margin: 0 0 4px;
		font-size: 1.75rem;
		font-weight: 600;
	}
	.subtitle {
		color: var(--c-text-muted);
		margin: 0 0 var(--sp-6);
		font-size: 0.95rem;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: var(--sp-3);
	}
	input {
		padding: 14px 16px;
		border: 1px solid #e5d97e;
		border-radius: 8px;
		font-size: 0.95rem;
		font-family: inherit;
		background: white;
		width: 100%;
	}
	input:focus {
		outline: none;
		border-color: var(--c-yellow);
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.25);
	}
	.err {
		color: var(--c-danger);
		font-size: 0.8rem;
		text-align: left;
	}
	.login-line {
		font-size: 0.85rem;
		color: var(--c-text-muted);
		margin: var(--sp-2) 0 var(--sp-3);
	}
	.login-line a {
		color: var(--c-yellow-dark);
		font-weight: 700;
		text-decoration: none;
		letter-spacing: 0.04em;
	}
	.register-btn {
		background: var(--c-yellow);
		color: var(--c-text);
		border: none;
		padding: 14px 28px;
		border-radius: 8px;
		font-weight: 700;
		font-size: 1rem;
		letter-spacing: 0.04em;
		cursor: pointer;
		align-self: center;
	}
	.register-btn:hover {
		background: var(--c-yellow-dark);
	}
</style>
