<script>
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let project = $derived(data.project);
	let deliveries = $derived(data.deliveries);
	let summary = $derived(data.deliverySummary);
	let notes = $derived(data.notes);
	let editing = $state(false);
	let noteText = $state('');

	const STATUS_LABEL = {
		bestellt: 'bestellt',
		bestaetigt: 'bestätigt',
		unterwegs: 'unterwegs',
		angekommen: 'angekommen',
		verrechnet: 'verrechnet'
	};

	function formatDate(d) {
		if (!d) return '–';
		const [y, m] = d.split('-');
		return `${m}.${y}`;
	}

	function deliveryDate(iso) {
		if (!iso) return '–';
		return new Date(iso + 'T12:00:00').toLocaleDateString('de-CH', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		});
	}

	function dateString(iso) {
		if (!iso) return '–';
		return new Date(iso).toLocaleDateString('de-CH', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
	}

	function dateTimeString(iso) {
		if (!iso) return '–';
		return new Date(iso).toLocaleString('de-CH', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function fmtKg(kg) {
		if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t`;
		return `${kg} kg`;
	}
</script>

<svelte:head>
	<title>{project.name} – BUILDEX</title>
</svelte:head>

<header class="header">
	<a href="/" class="back">← Zurück zur Übersicht</a>
	<div class="title-row">
		<h1>{project.name}</h1>
		<span class="badge badge-{project.status}">{project.status}</span>
	</div>
	<p class="address">{project.address || 'Keine Adresse hinterlegt'}</p>
</header>

{#if form?.success || form?.noteAdded}
	<div class="alert alert-success" style="margin: 0 var(--sp-6) var(--sp-4);">
		{form?.noteAdded ? 'Notiz hinzugefügt.' : 'Aktualisiert.'}
	</div>
{/if}

<div class="layout">
	<!-- Projekt-Stammdaten + KPIs -->
	<section class="main-pane">
		{#if !editing}
			<div class="info-grid">
				<div class="info-item">
					<div class="info-label">Status</div>
					<div class="info-value"><span class="badge badge-{project.status}">{project.status}</span></div>
				</div>
				<div class="info-item">
					<div class="info-label">Adresse</div>
					<div class="info-value">{project.address || '–'}</div>
				</div>
				<div class="info-item">
					<div class="info-label">Start</div>
					<div class="info-value">{formatDate(project.startDate)}</div>
				</div>
				<div class="info-item">
					<div class="info-label">Ende</div>
					<div class="info-value">{formatDate(project.endDate)}</div>
				</div>
				<div class="info-item">
					<div class="info-label">Erstellt</div>
					<div class="info-value">{dateString(project.createdAt)}</div>
				</div>
				<div class="info-item">
					<div class="info-label">Zuletzt geändert</div>
					<div class="info-value">{dateString(project.updatedAt)}</div>
				</div>
			</div>

			{#if project.notes}
				<div class="project-notes">
					<h3>Projekt-Beschrieb</h3>
					<p>{project.notes}</p>
				</div>
			{/if}

			<div class="actions">
				<button class="btn btn-primary" onclick={() => (editing = true)}>Bearbeiten</button>
				<form
					method="POST"
					action="?/delete"
					use:enhance
					onsubmit={(e) => {
						if (!confirm(`Projekt "${project.name}" wirklich löschen? Alle Lieferungen und Notizen werden mitgelöscht.`)) {
							e.preventDefault();
						}
					}}
				>
					<button type="submit" class="btn btn-danger">Löschen</button>
				</form>
			</div>
		{:else}
			<form method="POST" action="?/update" class="form" use:enhance>
				<label>
					<span>Projektname *</span>
					<input name="name" type="text" required value={form?.values?.name ?? project.name} />
					{#if form?.errors?.name}<small class="err">{form.errors.name}</small>{/if}
				</label>
				<label>
					<span>Adresse</span>
					<input name="address" type="text" value={form?.values?.address ?? project.address} />
				</label>
				<div class="row">
					<label>
						<span>Start</span>
						<input name="startDate" type="month" value={form?.values?.startDate ?? project.startDate} />
					</label>
					<label>
						<span>Ende</span>
						<input name="endDate" type="month" value={form?.values?.endDate ?? project.endDate} />
						{#if form?.errors?.endDate}<small class="err">{form.errors.endDate}</small>{/if}
					</label>
				</div>
				<label>
					<span>Status</span>
					<select name="status">
						{#each ['offen', 'laufend', 'pausiert', 'abgeschlossen'] as s}
							<option value={s} selected={(form?.values?.status ?? project.status) === s}>{s}</option>
						{/each}
					</select>
				</label>
				<label>
					<span>Projekt-Beschrieb</span>
					<textarea name="notes" rows="4">{form?.values?.notes ?? project.notes}</textarea>
				</label>
				<div class="form-actions">
					<button type="button" class="btn btn-secondary" onclick={() => (editing = false)}>
						Abbrechen
					</button>
					<button type="submit" class="btn btn-primary">Änderungen speichern</button>
				</div>
			</form>
		{/if}
	</section>

	<!-- KPI-Kacheln: Lieferungen + CO2 -->
	<section class="kpi-grid">
		<div class="kpi-card">
			<div class="kpi-label">Lieferungen total</div>
			<div class="kpi-value">{summary.total}</div>
		</div>
		<div class="kpi-card" class:warn={summary.overdue > 0}>
			<div class="kpi-label">Überfällig</div>
			<div class="kpi-value">{summary.overdue}</div>
		</div>
		<div class="kpi-card">
			<div class="kpi-label">Unterwegs / bestätigt</div>
			<div class="kpi-value">{summary.byStatus.unterwegs + summary.byStatus.bestaetigt}</div>
		</div>
		<div class="kpi-card co2">
			<div class="kpi-label">CO₂-Bilanz</div>
			<div class="kpi-value">{fmtKg(summary.co2Total)}</div>
			<div class="kpi-foot">aus {summary.total} Lieferungen</div>
		</div>
	</section>

	<!-- Lieferungen -->
	<section class="block">
		<div class="block-head">
			<h2>Lieferungen</h2>
			<a class="btn btn-primary" href="/projects/{project.id}/deliveries/new">+ Neue Lieferung</a>
		</div>

		{#if deliveries.length === 0}
			<div class="empty">
				Noch keine Lieferungen für dieses Projekt erfasst.
				<a href="/projects/{project.id}/deliveries/new">Erste Lieferung erfassen →</a>
			</div>
		{:else}
			<table class="deliveries">
				<thead>
					<tr>
						<th>Liefertermin</th>
						<th>Material</th>
						<th>Menge</th>
						<th>Lieferant</th>
						<th>CO₂</th>
						<th>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{#each deliveries as d (d.id)}
						<tr class:overdue={d.overdue}>
							<td>
								{deliveryDate(d.scheduledDate)}
								{#if d.overdue}<span class="overdue-tag">überfällig</span>{/if}
							</td>
							<td>{d.material}</td>
							<td>{d.quantity} {d.unit}</td>
							<td>{d.supplier || '–'}</td>
							<td>{fmtKg(d.co2Kg)}</td>
							<td>
								<form method="POST" action="?/setDeliveryStatus" use:enhance class="inline">
									<input type="hidden" name="deliveryId" value={d.id} />
									<select name="status" onchange={(e) => e.target.form.requestSubmit()}>
										{#each data.statusOptions as s}
											<option value={s} selected={d.status === s}>{STATUS_LABEL[s]}</option>
										{/each}
									</select>
								</form>
							</td>
							<td class="row-actions">
								<a href="/projects/{project.id}/deliveries/{d.id}" title="Bearbeiten">✎</a>
								<form
									method="POST"
									action="?/deleteDelivery"
									use:enhance
									onsubmit={(e) => {
										if (!confirm('Lieferung wirklich löschen?')) e.preventDefault();
									}}
									class="inline"
								>
									<input type="hidden" name="deliveryId" value={d.id} />
									<button class="link-danger" title="Löschen">✕</button>
								</form>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</section>

	<!-- Notizen-Timeline -->
	<section class="block">
		<div class="block-head">
			<h2>Notizen-Verlauf</h2>
			<span class="muted">{notes.length} Einträge</span>
		</div>

		<form method="POST" action="?/addNote" class="note-form" use:enhance={() => {
			return ({ update }) => {
				noteText = '';
				return update();
			};
		}}>
			<textarea
				name="text"
				bind:value={noteText}
				placeholder="Neue Notiz hinzufügen (z.B. Statiker hat freigegeben, Wettermeldung beachten...)"
				rows="2"
				required
			></textarea>
			{#if form?.noteErrors?.text}<small class="err">{form.noteErrors.text}</small>{/if}
			<button type="submit" class="btn btn-secondary" disabled={!noteText.trim()}>
				Notiz speichern
			</button>
		</form>

		{#if notes.length === 0}
			<div class="empty">Noch keine Notizen.</div>
		{:else}
			<ul class="timeline">
				{#each notes as n (n.id)}
					<li class="timeline-item">
						<div class="timeline-marker"></div>
						<div class="timeline-body">
							<div class="timeline-meta">
								<strong>{n.author}</strong>
								<span class="muted">· {dateTimeString(n.createdAt)}</span>
								<form
									method="POST"
									action="?/deleteNote"
									use:enhance
									class="inline timeline-del"
									onsubmit={(e) => {
										if (!confirm('Notiz löschen?')) e.preventDefault();
									}}
								>
									<input type="hidden" name="noteId" value={n.id} />
									<button class="link-danger" title="Löschen">✕</button>
								</form>
							</div>
							<p>{n.text}</p>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</section>
</div>

<style>
	.header {
		padding: var(--sp-6) var(--sp-6) var(--sp-4);
	}
	.back {
		display: inline-block;
		margin-bottom: var(--sp-3);
		color: var(--c-text-muted);
		text-decoration: none;
		font-size: 0.875rem;
	}
	.back:hover {
		color: var(--c-text);
	}
	.title-row {
		display: flex;
		align-items: center;
		gap: var(--sp-3);
		margin-bottom: var(--sp-2);
	}
	h1 {
		margin: 0;
		font-size: 1.75rem;
	}
	.address {
		margin: 0;
		color: var(--c-text-muted);
	}

	.layout {
		padding: 0 var(--sp-6) var(--sp-7);
		display: flex;
		flex-direction: column;
		gap: var(--sp-5);
	}
	.main-pane,
	.block {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-5);
	}

	.info-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--sp-4);
		margin-bottom: var(--sp-5);
	}
	.info-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--c-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: var(--sp-1);
	}
	.info-value {
		font-size: 1rem;
		color: var(--c-text);
	}

	.project-notes {
		padding-top: var(--sp-5);
		border-top: 1px solid var(--c-border);
		margin-bottom: var(--sp-5);
	}
	.project-notes h3 {
		margin: 0 0 var(--sp-2);
		font-size: 0.95rem;
	}
	.project-notes p {
		margin: 0;
		color: var(--c-text-muted);
		line-height: 1.5;
		white-space: pre-line;
	}

	.actions {
		display: flex;
		gap: var(--sp-3);
		padding-top: var(--sp-4);
		border-top: 1px solid var(--c-border);
	}

	/* KPI-Kacheln */
	.kpi-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: var(--sp-3);
	}
	.kpi-card {
		background: white;
		border: 1px solid var(--c-border);
		border-radius: var(--radius-md);
		padding: var(--sp-4);
	}
	.kpi-card.warn {
		background: #fff7ed;
		border-color: #fdba74;
	}
	.kpi-card.co2 {
		background: #f0fdf4;
		border-color: #86efac;
	}
	.kpi-label {
		font-size: 0.75rem;
		color: var(--c-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: var(--sp-1);
	}
	.kpi-value {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--c-text);
	}
	.kpi-foot {
		font-size: 0.75rem;
		color: var(--c-text-muted);
		margin-top: var(--sp-1);
	}

	/* Block (Lieferungen + Notizen) */
	.block-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--sp-4);
	}
	.block-head h2 {
		margin: 0;
		font-size: 1.2rem;
	}
	.muted {
		color: var(--c-text-muted);
		font-size: 0.85rem;
	}
	.empty {
		text-align: center;
		padding: var(--sp-5);
		color: var(--c-text-muted);
		background: var(--c-bg-subtle, #fafafa);
		border-radius: var(--radius-sm);
	}
	.empty a {
		display: inline-block;
		margin-left: var(--sp-2);
		color: var(--c-link, #2563eb);
	}

	/* Lieferungen-Tabelle */
	table.deliveries {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}
	table.deliveries th,
	table.deliveries td {
		text-align: left;
		padding: var(--sp-3) var(--sp-2);
		border-bottom: 1px solid var(--c-border);
	}
	table.deliveries th {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--c-text-muted);
		font-weight: 600;
	}
	tr.overdue {
		background: #fef2f2;
	}
	.overdue-tag {
		display: inline-block;
		margin-left: var(--sp-2);
		padding: 2px 8px;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		background: #dc2626;
		color: white;
		border-radius: 999px;
	}
	.row-actions {
		display: flex;
		gap: var(--sp-2);
		align-items: center;
	}
	.row-actions a {
		color: var(--c-text-muted);
		text-decoration: none;
		font-size: 1rem;
	}
	.row-actions a:hover {
		color: var(--c-text);
	}
	.inline {
		display: inline;
	}
	.link-danger {
		background: none;
		border: none;
		color: #dc2626;
		cursor: pointer;
		font-size: 1rem;
		padding: 0;
	}
	.link-danger:hover {
		color: #991b1b;
	}

	/* Notizen-Timeline */
	.note-form {
		display: flex;
		flex-direction: column;
		gap: var(--sp-2);
		margin-bottom: var(--sp-4);
	}
	.note-form textarea {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-sm);
		font-family: inherit;
		font-size: 0.9rem;
		resize: vertical;
	}
	.note-form button {
		align-self: flex-end;
	}

	.timeline {
		list-style: none;
		padding: 0;
		margin: 0;
		position: relative;
	}
	.timeline::before {
		content: '';
		position: absolute;
		left: 7px;
		top: 8px;
		bottom: 8px;
		width: 2px;
		background: var(--c-border);
	}
	.timeline-item {
		display: flex;
		gap: var(--sp-3);
		padding-bottom: var(--sp-4);
		position: relative;
	}
	.timeline-marker {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--c-yellow);
		border: 2px solid white;
		box-shadow: 0 0 0 1px var(--c-border);
		flex-shrink: 0;
		margin-top: 4px;
		position: relative;
		z-index: 1;
	}
	.timeline-body {
		flex: 1;
	}
	.timeline-meta {
		display: flex;
		align-items: center;
		gap: var(--sp-2);
		margin-bottom: var(--sp-1);
		font-size: 0.85rem;
	}
	.timeline-del {
		margin-left: auto;
	}
	.timeline-body p {
		margin: 0;
		line-height: 1.5;
		color: var(--c-text);
	}

	/* Form */
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
	input,
	select,
	textarea {
		padding: 10px 12px;
		border: 1px solid var(--c-border-strong);
		border-radius: var(--radius-sm);
		font-size: 0.95rem;
		font-family: inherit;
		background: white;
	}
	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--c-yellow);
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
	}
	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--sp-3);
	}
	.err {
		color: var(--c-danger);
		font-size: 0.8rem;
	}
	.form-actions {
		display: flex;
		gap: var(--sp-3);
		justify-content: flex-end;
		padding-top: var(--sp-3);
		border-top: 1px solid var(--c-border);
	}
</style>
