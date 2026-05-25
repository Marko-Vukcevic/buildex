<script>
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Anmeldung – BUILDEX</title>
</svelte:head>

<div class="auth-page">
	<!-- BUILDEX Diamant-Logo schwebt halb über der Card (wie im Figma) -->
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
		<h1>Anmeldung</h1>
		<p class="subtitle">Bauunternehmer</p>

		<form method="POST" use:enhance class="form">
			<input type="hidden" name="redirectTo" value={data.redirectTo} />

			{#if form?.errors?._}
				<div class="alert-err">{form.errors._}</div>
			{/if}

			<label class="visually-hidden" for="email-input">E-Mail</label>
			<input
				id="email-input"
				name="email"
				type="email"
				autocomplete="email"
				placeholder="E-Mail"
				required
				value={form?.values?.email ?? ''}
			/>
			{#if form?.errors?.email}<small class="err">{form.errors.email}</small>{/if}

			<label class="visually-hidden" for="pw-input">Passwort</label>
			<input id="pw-input" name="password" type="password" autocomplete="current-password" placeholder="Passwort" required />
			{#if form?.errors?.password}<small class="err">{form.errors.password}</small>{/if}

			<p class="register-line">
				Noch kein Profil? <a href="/register">JETZT REGISTRIEREN</a>
			</p>

			<button type="submit" class="anmelden-btn">ANMELDEN</button>

			<div class="demo-hint">
				<strong>Demo-Login:</strong> <code>demo@buildex.ch</code> / <code>demo123</code>
			</div>
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
		background: #fef3c7; /* Cream-gelb wie Figma-Mockup */
		position: relative;
	}
	.logo-float {
		width: 80px;
		height: 80px;
		margin-bottom: -40px;
		z-index: 2;
		filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
	}
	.logo-float svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.card {
		width: 100%;
		max-width: 460px;
		background: #fef9d9; /* sehr hell-cremiges Gelb wie Figma */
		border-radius: 16px;
		padding: 64px 48px 48px;
		box-shadow: 0 8px 24px rgba(0,0,0,0.08);
		text-align: center;
	}
	h1 {
		margin: 0 0 4px;
		font-size: 1.75rem;
		font-weight: 600;
		color: var(--c-text);
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
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0,0,0,0);
		white-space: nowrap;
		border: 0;
	}
	input {
		padding: 14px 16px;
		border: 1px solid #e5d97e;
		border-radius: 8px;
		font-size: 0.95rem;
		font-family: inherit;
		background: white;
		text-align: left;
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
	.alert-err {
		background: #fef2f2;
		border: 1px solid #fca5a5;
		color: #991b1b;
		padding: 10px 14px;
		border-radius: 8px;
		font-size: 0.9rem;
		text-align: left;
	}
	.register-line {
		font-size: 0.85rem;
		color: var(--c-text-muted);
		margin: var(--sp-2) 0 var(--sp-3);
	}
	.register-line a {
		color: var(--c-yellow-dark);
		font-weight: 700;
		text-decoration: none;
		letter-spacing: 0.04em;
	}
	.register-line a:hover {
		text-decoration: underline;
	}
	.anmelden-btn {
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
		margin-top: var(--sp-2);
	}
	.anmelden-btn:hover {
		background: var(--c-yellow-dark);
	}
	.demo-hint {
		margin-top: var(--sp-5);
		padding: 10px 14px;
		background: white;
		border-radius: 8px;
		font-size: 0.8rem;
		color: var(--c-text-muted);
		border: 1px solid rgba(0,0,0,0.06);
	}
	.demo-hint code {
		background: #f5f5f5;
		padding: 1px 5px;
		border-radius: 3px;
		color: var(--c-text);
	}
</style>
