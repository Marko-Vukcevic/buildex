<script>
	// Login-Page im selben visuellen Stil wie die Übersicht:
	// - weisser Hintergrund (statt cream-gelb)
	// - schlanke Card in der Mitte
	// - BUILDEX-Diamant-Logo oben
	// - Mockup-Style Buttons und Felder
	import { enhance } from '$app/forms';
	let { data, form } = $props();
</script>

<svelte:head>
	<title>Anmeldung – BUILDEX</title>
</svelte:head>

<div class="auth-page">
	<div class="auth-container">
		<div class="logo">
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
		align-items: center;
		justify-content: center;
		padding: 24px;
		background: var(--c-bg); /* gleicher hellgrauer Hintergrund wie Dashboard */
	}
	.auth-container {
		width: 100%;
		max-width: 420px;
		background: white;
		border-radius: 16px;
		padding: 48px 40px;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
		text-align: center;
	}
	.logo {
		width: 72px;
		height: 72px;
		margin: 0 auto 20px;
	}
	.logo svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	h1 {
		margin: 0 0 4px;
		font-size: 1.6rem;
		font-weight: 700;
		color: var(--c-text);
	}
	.subtitle {
		color: var(--c-text-muted);
		margin: 0 0 28px;
		font-size: 0.9rem;
	}
	.form {
		display: flex;
		flex-direction: column;
		gap: 12px;
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
		padding: 13px 16px;
		border: 1px solid var(--c-border);
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
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
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
		margin: 8px 0 4px;
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
		font-family: inherit;
		align-self: center;
		min-width: 160px;
		margin-top: 4px;
	}
	.anmelden-btn:hover {
		background: var(--c-yellow-dark);
	}
	.demo-hint {
		margin-top: 24px;
		padding: 10px 14px;
		background: #fafafa;
		border: 1px solid var(--c-border);
		border-radius: 8px;
		font-size: 0.8rem;
		color: var(--c-text-muted);
	}
	.demo-hint code {
		background: white;
		padding: 1px 5px;
		border-radius: 3px;
		color: var(--c-text);
		border: 1px solid var(--c-border);
	}
</style>
