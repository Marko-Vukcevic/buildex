<script>
	// Projekt-Detail-Page im Figma-Mockup-Stil (Mockup 2 - Projekt Muster):
	// - Title "Projektname" gross + "Baustelle: Adresse" Subtitle
	// - Filter/Edit-Icon rechts oben (gelbe Pille)
	// - Sub-Navigation links: Lieferungen / Notizen / Stammdaten
	// - Tabelle mit Document-Icon + Status-Pille (Mockup-Stil)
	// - KPI-Kacheln behalten (Funktionalität)
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let project = $derived(data.project);
	let deliveries = $derived(data.deliveries);
	let summary = $derived(data.deliverySummary);
	let notes = $derived(data.notes);
	let editing = $state(false);
	let activeTab = $state('lieferungen');
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

<div class="page">
	<!-- Header wie im Mockup: Title + Subtitle + Filter-Icon rechts -->
	<header class="detail-header">
		<div>
			<a href="/" class="back">← Zurück zur Übersicht</a>
			<h1>{project.name}</h1>
			<p class="baustelle">Baustelle: {project.address || '—'} <span class="badge badge-{project.status}">{project.status}</span></p>
		</div>
		<button type="button" class="filter-btn" onclick={() => (editing = !editing)} aria-label="Bearbeiten">
			<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<line x1="4" y1="6" x2="20" y2="6"/>
				<line x1="4" y1="12" x2="14" y2="12"/>
				<line x1="4" y1="18" x2="8" y2="18"/>
				<circle cx="17" cy="12" r="2"/>
				<circle cx="11" cy="18" r="2"/>
			</svg>
		</button>
	</header>

	{#if form?.success || form?.noteAdded}
		<div class="alert-success">{form?.noteAdded ? 'Notiz hinzugefügt.' : 'Aktualisiert.'}</div>
	{/if}

	<!-- KPI-Kacheln (Funktionalität, im Mockup zusätzlich) -->
	<section class="kpi-strip">
		<div class="kpi">
			<span class="kpi-value">{summary.total}</span>
			<span class="kpi-label">Lieferungen total</span>
		</div>
		<div class="kpi" class:warn={summary.overdue > 0}>
			<span class="kpi-value">{summary.overdue}</span>
			<span class="kpi-label">Überfällig</span>
		</div>
		<div class="kpi">
			<span class="kpi-value">{summary.byStatus.unterwegs + summary.byStatus.bestaetigt}</span>
			<span class="kpi-label">Unterwegs / bestätigt</span>
		</div>
		<div class="kpi co2">
			<span class="kpi-value">{fmtKg(summary.co2Total)}</span>
			<span class="kpi-label">CO₂-Bilanz</span>
		</div>
	</section>

	<!-- Hauptkarte mit Sub-Tabs + Content (wie Mockup mit Bestellungseingänge-Tab) -->
	<div class="main-card">
		<nav class="sub-tabs">
			<button class:active={activeTab === 'lieferungen'} onclick={() => (activeTab = 'lieferungen')}>
				Bestellungseingänge
				<span class="tab-sub">{summary.total} Lieferungen, {summary.overdue} überfällig</span>
			</button>
			<button class:active={activeTab === 'notizen'} onclick={() => (activeTab = 'notizen')}>
				Notizen-Verlauf
				<span class="tab-sub">{notes.length} Einträge</span>
			</button>
			<button class:active={activeTab === 'stammdaten'} onclick={() => (activeTab = 'stammdaten')}>
				Stammdaten
				<span class="tab-sub">{project.startDate ? `${formatDate(project.startDate)} – ${formatDate(project.endDate)}` : 'Daten bearbeiten'}</span>
			</button>
		</nav>

		<div class="tab-content">

			{#if activeTab === 'lieferungen'}
				<div class="tab-head">
					<h2>Bestellungseingänge</h2>
					<a class="new-btn" href="/projects/{project.id}/deliveries/new">+ Neue Lieferung</a>
				</div>

				{#if deliveries.length === 0}
					<div class="empty">
						Noch keine Lieferungen für dieses Projekt erfasst.
						<a href="/projects/{project.id}/deliveries/new">Erste Lieferung erfassen →</a>
					</div>
				{:else}
					<table class="deliveries-tbl">
						<thead>
							<tr>
								<th>Material</th>
								<th>Menge/Tonnen</th>
								<th>Abgefragter Liefertermin</th>
								<th>Lieferant</th>
								<th>CO₂</th>
								<th>Status</th>
								<th>Doc</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{#each deliveries as d (d.id)}
								<tr class:overdue={d.overdue}>
									<td class="material-cell">{d.material}</td>
									<td>{d.quantity} {d.unit}</td>
									<td class="date-cell">
										{deliveryDate(d.scheduledDate)}
										{#if d.overdue}<span class="overdue-tag">überfällig</span>{/if}
									</td>
									<td>{d.supplier || '–'}</td>
									<td>{fmtKg(d.co2Kg)}</td>
									<td>
										<form method="POST" action="?/setDeliveryStatus" use:enhance class="inline">
											<input type="hidden" name="deliveryId" value={d.id} />
											<select name="status" onchange={(e) => e.target.form.requestSubmit()} class="status-select status-{d.status}">
												{#each data.statusOptions as s}
													<option value={s} selected={d.status === s}>{STATUS_LABEL[s]}</option>
												{/each}
											</select>
										</form>
									</td>
									<td class="doc-cell">
										<a href="/projects/{project.id}/deliveries/{d.id}" class="doc-icon" title="Lieferschein öffnen">
											<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
												<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
												<path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
											</svg>
										</a>
									</td>
									<td>
										<form method="POST" action="?/deleteDelivery" use:enhance class="inline"
											onsubmit={(e) => { if (!confirm('Lieferung wirklich löschen?')) e.preventDefault(); }}>
											<input type="hidden" name="deliveryId" value={d.id} />
											<button class="del-btn" title="Löschen">✕</button>
										</form>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}

			{:else if activeTab === 'notizen'}
				<div class="tab-head">
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
					<button type="submit" class="note-save" disabled={!noteText.trim()}>Notiz speichern</button>
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
										<form method="POST" action="?/deleteNote" use:enhance class="inline timeline-del"
											onsubmit={(e) => { if (!confirm('Notiz löschen?')) e.preventDefault(); }}>
											<input type="hidden" name="noteId" value={n.id} />
											<button class="del-btn" title="Löschen">✕</button>
										</form>
									</div>
									<p>{n.text}</p>
								</div>
							</li>
						{/each}
					</ul>
				{/if}

			{:else if activeTab === 'stammdaten'}
				<div class="tab-head">
					<h2>Stammdaten</h2>
					{#if !editing}
						<button class="new-btn" onclick={() => (editing = true)}>Bearbeiten</button>
					{/if}
				</div>

				{#if !editing}
					<dl class="stamm">
						<dt>Projektname</dt><dd>{project.name}</dd>
						<dt>Status</dt><dd><span class="badge badge-{project.status}">{project.status}</span></dd>
						<dt>Adresse</dt><dd>{project.address || '–'}</dd>
						<dt>Start</dt><dd>{formatDate(project.startDate)}</dd>
						<dt>Ende</dt><dd>{formatDate(project.endDate)}</dd>
						<dt>Erstellt</dt><dd>{dateString(project.createdAt)}</dd>
						<dt>Zuletzt geändert</dt><dd>{dateString(project.updatedAt)}</dd>
						{#if project.notes}
							<dt>Projekt-Beschrieb</dt><dd>{project.notes}</dd>
						{/if}
					</dl>
					<form method="POST" action="?/delete" use:enhance class="del-form"
						onsubmit={(e) => { if (!confirm(`Projekt "${project.name}" wirklich löschen?`)) e.preventDefault(); }}>
						<button type="submit" class="btn-danger">Projekt löschen</button>
					</form>
				{:else}
					<form method="POST" action="?/update" class="edit-form" use:enhance>
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
							<button type="button" class="btn-secondary" onclick={() => (editing = false)}>Abbrechen</button>
							<button type="submit" class="btn-primary">Änderungen speichern</button>
						</div>
					</form>
				{/if}
			{/if}

		</div>
	</div>
</div>

<style>
	.page {
		padding: 24px 32px;
	}

	/* Header */
	.detail-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24px;
	}
	.back {
		display: inline-block;
		color: var(--c-text-muted);
		text-decoration: none;
		font-size: 0.85rem;
		margin-bottom: 8px;
	}
	.back:hover { color: var(--c-text); }
	h1 {
		margin: 0 0 6px;
		font-size: 1.75rem;
		font-weight: 700;
	}
	.baustelle {
		margin: 0;
		color: var(--c-text-muted);
		font-size: 0.95rem;
	}
	.filter-btn {
		background: var(--c-yellow);
		border: none;
		border-radius: 999px;
		padding: 12px 20px;
		cursor: pointer;
		color: var(--c-text);
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	.filter-btn svg { width: 22px; height: 22px; stroke-linecap: round; }
	.filter-btn:hover { background: var(--c-yellow-dark); }

	.alert-success {
		background: #dcfce7;
		border: 1px solid #86efac;
		color: #065f46;
		padding: 10px 16px;
		border-radius: 8px;
		font-size: 0.9rem;
		margin-bottom: 16px;
	}

	/* KPI-Streifen */
	.kpi-strip {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 16px;
		margin-bottom: 24px;
	}
	.kpi {
		background: white;
		border-radius: 8px;
		padding: 16px 20px;
		display: flex;
		flex-direction: column;
		gap: 4px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.06);
	}
	.kpi.warn { background: #fff7ed; }
	.kpi.co2 { background: #f0fdf4; }
	.kpi-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--c-text);
		line-height: 1;
	}
	.kpi-label {
		color: var(--c-text-muted);
		font-size: 0.8rem;
	}

	/* Hauptkarte */
	.main-card {
		background: white;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0,0,0,0.06);
		overflow: hidden;
	}
	.sub-tabs {
		display: flex;
		border-bottom: 1px solid var(--c-border);
	}
	.sub-tabs button {
		background: none;
		border: none;
		font-family: inherit;
		padding: 16px 24px;
		text-align: left;
		flex: 1;
		max-width: 280px;
		cursor: pointer;
		display: flex;
		flex-direction: column;
		gap: 4px;
		color: var(--c-text-muted);
		border-bottom: 3px solid transparent;
		font-size: 0.95rem;
		font-weight: 600;
	}
	.sub-tabs button:hover { background: #fafafa; color: var(--c-text); }
	.sub-tabs button.active {
		color: var(--c-text);
		border-bottom-color: var(--c-yellow);
	}
	.tab-sub {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--c-text-muted);
	}
	.sub-tabs button.active .tab-sub {
		color: var(--c-text-muted);
	}

	.tab-content {
		padding: 24px;
	}
	.tab-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}
	.tab-head h2 {
		margin: 0;
		font-size: 1.25rem;
	}
	.new-btn {
		background: var(--c-yellow);
		color: var(--c-text);
		border: none;
		padding: 10px 18px;
		border-radius: 8px;
		font-weight: 600;
		font-size: 0.85rem;
		cursor: pointer;
		text-decoration: none;
		font-family: inherit;
	}
	.new-btn:hover { background: var(--c-yellow-dark); }

	.muted {
		color: var(--c-text-muted);
		font-size: 0.85rem;
	}

	.empty {
		text-align: center;
		padding: 32px;
		color: var(--c-text-muted);
		background: #fafafa;
		border-radius: 8px;
	}
	.empty a {
		display: inline-block;
		margin-left: 8px;
		color: #1a73e8;
		text-decoration: none;
	}

	/* Tabelle */
	.deliveries-tbl {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.85rem;
	}
	.deliveries-tbl th {
		text-align: left;
		padding: 12px 16px;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--c-text-muted);
		font-weight: 600;
		border-bottom: 1px solid var(--c-border);
	}
	.deliveries-tbl td {
		padding: 14px 16px;
		border-bottom: 1px solid var(--c-border);
		vertical-align: middle;
	}
	.deliveries-tbl tr:last-child td { border-bottom: none; }
	.material-cell { font-weight: 600; }
	.date-cell { white-space: nowrap; }
	tr.overdue { background: #fef2f2; }
	.overdue-tag {
		display: inline-block;
		margin-left: 6px;
		padding: 2px 7px;
		font-size: 0.65rem;
		font-weight: 700;
		text-transform: uppercase;
		background: #dc2626;
		color: white;
		border-radius: 999px;
	}
	.inline { display: inline; }
	.status-select {
		padding: 4px 8px;
		border-radius: 999px;
		border: 1px solid var(--c-border);
		background: white;
		font-family: inherit;
		font-size: 0.75rem;
		font-weight: 600;
		cursor: pointer;
	}
	.status-select.status-bestellt { background: #f5f5f5; color: #374151; }
	.status-select.status-bestaetigt { background: #fff7ed; color: #9a3412; border-color: #fdba74; }
	.status-select.status-unterwegs { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
	.status-select.status-angekommen { background: #dcfce7; color: #065f46; border-color: #86efac; }
	.status-select.status-verrechnet { background: #e5e7eb; color: #374151; }

	.doc-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 6px;
		background: rgba(251, 192, 45, 0.12);
		color: #6b6b6b;
		text-decoration: none;
	}
	.doc-icon:hover {
		background: var(--c-yellow);
		color: var(--c-text);
	}
	.doc-icon svg { width: 18px; height: 18px; stroke-linecap: round; stroke-linejoin: round; }

	.del-btn {
		background: none;
		border: none;
		color: #dc2626;
		font-size: 1rem;
		cursor: pointer;
		padding: 4px 8px;
	}
	.del-btn:hover { color: #991b1b; }

	/* Notizen */
	.note-form {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 20px;
	}
	.note-form textarea {
		width: 100%;
		padding: 10px 12px;
		border: 1px solid var(--c-border-strong);
		border-radius: 6px;
		font-family: inherit;
		font-size: 0.9rem;
		resize: vertical;
	}
	.note-save {
		align-self: flex-end;
		background: var(--c-yellow);
		color: var(--c-text);
		border: none;
		padding: 8px 16px;
		border-radius: 6px;
		font-weight: 600;
		cursor: pointer;
		font-family: inherit;
	}
	.note-save:disabled { opacity: 0.4; cursor: not-allowed; }

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
		gap: 12px;
		padding-bottom: 16px;
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
	.timeline-body { flex: 1; }
	.timeline-meta {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 4px;
		font-size: 0.85rem;
	}
	.timeline-del { margin-left: auto; }
	.timeline-body p {
		margin: 0;
		line-height: 1.5;
		color: var(--c-text);
	}

	/* Stammdaten + Edit */
	.stamm {
		display: grid;
		grid-template-columns: 180px 1fr;
		gap: 12px 24px;
		margin: 0 0 24px;
	}
	.stamm dt {
		color: var(--c-text-muted);
		font-size: 0.85rem;
		font-weight: 600;
	}
	.stamm dd { margin: 0; font-size: 0.95rem; }

	.del-form { margin-top: 16px; }
	.btn-danger {
		background: #fef2f2;
		color: #991b1b;
		border: 1px solid #fca5a5;
		padding: 10px 18px;
		border-radius: 8px;
		font-weight: 600;
		cursor: pointer;
		font-family: inherit;
	}
	.btn-danger:hover { background: #fee2e2; }

	.edit-form {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.edit-form label {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.edit-form label > span {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--c-text-muted);
	}
	.edit-form input,
	.edit-form select,
	.edit-form textarea {
		padding: 10px 12px;
		border: 1px solid var(--c-border-strong);
		border-radius: 6px;
		font-family: inherit;
		font-size: 0.95rem;
		background: white;
	}
	.edit-form input:focus,
	.edit-form select:focus,
	.edit-form textarea:focus {
		outline: none;
		border-color: var(--c-yellow);
		box-shadow: 0 0 0 3px rgba(251, 192, 45, 0.2);
	}
	.row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
	.err { color: var(--c-danger); font-size: 0.8rem; }
	.form-actions {
		display: flex;
		gap: 12px;
		justify-content: flex-end;
		padding-top: 12px;
		border-top: 1px solid var(--c-border);
	}
	.btn-primary, .btn-secondary {
		padding: 10px 18px;
		border-radius: 8px;
		font-weight: 600;
		font-size: 0.9rem;
		cursor: pointer;
		border: 1px solid transparent;
		font-family: inherit;
	}
	.btn-primary { background: var(--c-yellow); color: var(--c-text); }
	.btn-secondary { background: white; border-color: var(--c-border-strong); color: var(--c-text); }
</style>
