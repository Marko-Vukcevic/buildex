// Seed-Script für BUILDEX.
// Füllt die Datenbank mit realistischen Demo-Daten: 8 Bauprojekte in der Schweiz,
// 30+ Lieferungen mit verschiedenen Materialien (für CO2-Demo), Notizen-Historie.
//
// Aufruf (vom buildex-Repo-Root):
//   node scripts/seed.js
//   node scripts/seed.js --reset   # löscht vorher alle Collections
//
// Liest MONGODB_URI aus .env.

import { MongoClient } from 'mongodb';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createHash, randomBytes } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));

// .env manuell laden (kein dotenv-Dep nötig)
const envPath = join(__dirname, '..', '.env');
let MONGODB_URI;
try {
	const envText = readFileSync(envPath, 'utf8');
	for (const line of envText.split('\n')) {
		const m = line.match(/^MONGODB_URI\s*=\s*(.+?)\s*$/);
		if (m) {
			MONGODB_URI = m[1].replace(/^["']|["']$/g, '');
			break;
		}
	}
} catch {
	console.error('Konnte .env nicht lesen unter', envPath);
	process.exit(1);
}
if (!MONGODB_URI) {
	console.error('MONGODB_URI nicht in .env gefunden');
	process.exit(1);
}

const RESET = process.argv.includes('--reset');

const MATERIALS = [
	{ key: 'beton_c25', name: 'Beton C25/30', unit: 'm³', co2PerUnit: 270 },
	{ key: 'beton_c30', name: 'Beton C30/37', unit: 'm³', co2PerUnit: 290 },
	{ key: 'bewehrungsstahl', name: 'Bewehrungsstahl', unit: 't', co2PerUnit: 750 },
	{ key: 'konstruktionsstahl', name: 'Konstruktionsstahl', unit: 't', co2PerUnit: 1500 },
	{ key: 'mauerwerk_backstein', name: 'Mauerwerk Backstein', unit: 'm³', co2PerUnit: 280 },
	{ key: 'kies', name: 'Kies', unit: 't', co2PerUnit: 5 },
	{ key: 'sand', name: 'Sand', unit: 't', co2PerUnit: 3 },
	{ key: 'bsh', name: 'Brettschichtholz BSH', unit: 'm³', co2PerUnit: 50 },
	{ key: 'daemmung_xps', name: 'Dämmung XPS', unit: 'm³', co2PerUnit: 80 },
	{ key: 'fertigteile_beton', name: 'Fertigteile Beton', unit: 'Stk', co2PerUnit: 450 }
];

const PROJECTS = [
	{
		name: 'Wohnüberbauung Steinegg',
		address: 'Badenerstrasse 26, 8952 Schlieren',
		startDate: '2026-01-15',
		endDate: '2027-08-30',
		status: 'laufend',
		notes: 'Etappe 1: Tiefgarage + Erdgeschoss. 4 Mehrfamilienhäuser, 86 Wohnungen.'
	},
	{
		name: 'Gewerbehalle Müller AG',
		address: 'Industriestrasse 12, 8404 Winterthur',
		startDate: '2026-03-01',
		endDate: '2026-12-15',
		status: 'laufend',
		notes: 'Stahlhalle 60×40m, Bürotrakt 2-geschossig in Massivbau.'
	},
	{
		name: 'Schulhaus Sägebach Erweiterung',
		address: 'Sägebachstrasse 8, 8810 Horgen',
		startDate: '2026-04-15',
		endDate: '2027-04-30',
		status: 'laufend',
		notes: 'Holz-Beton-Hybrid-Bau, 6 Klassenzimmer, Aula. KBOB-konform.'
	},
	{
		name: 'EFH Familie Brunner',
		address: 'Bergstrasse 14, 8645 Jona',
		startDate: '2026-02-01',
		endDate: '2026-11-30',
		status: 'laufend',
		notes: 'Einfamilienhaus Massivbau, Untergeschoss + 2 Vollgeschosse + Attikageschoss.'
	},
	{
		name: 'Sanierung MFH Hardturmstrasse',
		address: 'Hardturmstrasse 88, 8005 Zürich',
		startDate: '2026-05-20',
		endDate: '2026-10-30',
		status: 'offen',
		notes: 'Energetische Sanierung 12 WHG, Fassade + Dach + Fenster. Bewilligung noch ausstehend.'
	},
	{
		name: 'Lagerhalle Coop Wallisellen',
		address: 'Industriering 3, 8304 Wallisellen',
		startDate: '2025-09-01',
		endDate: '2026-04-28',
		status: 'abgeschlossen',
		notes: 'Logistikhalle 120×80m mit Bürotrakt. Schlussabnahme 28.04.2026 erfolgt.'
	},
	{
		name: 'Tiefbau Kreuzung Dorfstrasse',
		address: 'Dorfstrasse / Hauptstrasse, 8623 Wetzikon',
		startDate: '2026-06-10',
		endDate: '2026-09-30',
		status: 'offen',
		notes: 'Kreiselneubau inkl. Werkleitungen. Verkehrsfreigabe Anfang Oktober.'
	},
	{
		name: 'Hotelumbau Bellevue',
		address: 'Seestrasse 102, 8810 Horgen',
		startDate: '2025-11-01',
		endDate: '2026-03-31',
		status: 'pausiert',
		notes: 'Bewilligungs-Einsprache durch Nachbar. Baustopp seit 12.02.2026.'
	}
];

// Lieferungen werden pro Projekt zufällig/realistisch generiert.
function generateDeliveriesForProject(project, projectId, materials) {
	const deliveries = [];
	if (project.status === 'abgeschlossen') {
		// Abgeschlossene Projekte: alles verrechnet, in Vergangenheit
		const numDeliveries = 6;
		for (let i = 0; i < numDeliveries; i++) {
			const mat = materials[Math.floor(Math.random() * materials.length)];
			const daysAgo = 30 + i * 15;
			const date = isoDate(addDays(new Date('2026-04-15'), -daysAgo));
			deliveries.push({
				material: mat.name,
				materialKey: mat.key,
				quantity: realisticQuantity(mat),
				unit: mat.unit,
				supplier: pickSupplier(mat),
				scheduledDate: date,
				status: 'verrechnet'
			});
		}
	} else if (project.status === 'laufend') {
		// Laufende: Mix aus vergangen (angekommen/verrechnet) und zukünftig (bestellt/bestätigt)
		const past = [3, 10, 18];
		for (const daysAgo of past) {
			const mat = materials[Math.floor(Math.random() * materials.length)];
			deliveries.push({
				material: mat.name,
				materialKey: mat.key,
				quantity: realisticQuantity(mat),
				unit: mat.unit,
				supplier: pickSupplier(mat),
				scheduledDate: isoDate(addDays(new Date(), -daysAgo)),
				status: Math.random() < 0.6 ? 'verrechnet' : 'angekommen'
			});
		}
		// Zukünftige in der nächsten Woche (für Kalender-Demo)
		const future = [1, 2, 4, 6, 8];
		for (const daysAhead of future) {
			const mat = materials[Math.floor(Math.random() * materials.length)];
			deliveries.push({
				material: mat.name,
				materialKey: mat.key,
				quantity: realisticQuantity(mat),
				unit: mat.unit,
				supplier: pickSupplier(mat),
				scheduledDate: isoDate(addDays(new Date(), daysAhead)),
				status: daysAhead <= 2 ? 'unterwegs' : Math.random() < 0.5 ? 'bestaetigt' : 'bestellt'
			});
		}
		// Ein überfälliger zur Demo (5 Tage in Vergangenheit, aber noch nicht angekommen)
		if (Math.random() < 0.5) {
			const mat = materials[Math.floor(Math.random() * materials.length)];
			deliveries.push({
				material: mat.name,
				materialKey: mat.key,
				quantity: realisticQuantity(mat),
				unit: mat.unit,
				supplier: pickSupplier(mat),
				scheduledDate: isoDate(addDays(new Date(), -5)),
				status: 'bestaetigt'
			});
		}
	} else if (project.status === 'offen') {
		// Offene: nur ein paar bestellt
		const numDeliveries = 2;
		for (let i = 0; i < numDeliveries; i++) {
			const mat = materials[Math.floor(Math.random() * materials.length)];
			deliveries.push({
				material: mat.name,
				materialKey: mat.key,
				quantity: realisticQuantity(mat),
				unit: mat.unit,
				supplier: pickSupplier(mat),
				scheduledDate: isoDate(addDays(new Date(), 14 + i * 7)),
				status: 'bestellt'
			});
		}
	}
	// Status pausiert: keine aktiven Lieferungen

	// CO2 pro Lieferung berechnen
	for (const d of deliveries) {
		const mat = materials.find((m) => m.key === d.materialKey);
		d.co2Kg = Math.round((mat?.co2PerUnit ?? 0) * d.quantity);
		d.projectId = projectId;
		d.notes = '';
		d.createdAt = new Date();
		d.updatedAt = new Date();
	}
	return deliveries;
}

function realisticQuantity(mat) {
	if (mat.unit === 'm³') return Math.round(10 + Math.random() * 90); // 10-100 m³
	if (mat.unit === 't') return Math.round((0.5 + Math.random() * 12) * 10) / 10; // 0.5-12.5 t
	if (mat.unit === 'Stk') return Math.round(5 + Math.random() * 40); // 5-45 Stk
	return 1;
}

function pickSupplier(mat) {
	const suppliers = {
		beton: ['Holcim AG', 'Vigier Beton', 'KIBAG Beton'],
		stahl: ['Debrunner Acifer', 'Stahl Gerlafingen', 'Ferrum AG'],
		mauerwerk: ['Keller Ziegeleien', 'AGZ Ziegeleien'],
		kies: ['KIBAG Kies', 'Toggwiler Kies'],
		holz: ['Schilliger Holz', 'Hess Holzleimbau'],
		daemmung: ['Flumroc AG', 'Sager AG'],
		default: ['Marti AG', 'Implenia']
	};
	let bucket = 'default';
	if (mat.key.startsWith('beton') || mat.key.startsWith('fertigteile')) bucket = 'beton';
	else if (mat.key.includes('stahl')) bucket = 'stahl';
	else if (mat.key.includes('mauerwerk')) bucket = 'mauerwerk';
	else if (mat.key === 'kies' || mat.key === 'sand') bucket = 'kies';
	else if (mat.key === 'bsh') bucket = 'holz';
	else if (mat.key.includes('daemmung')) bucket = 'daemmung';
	const list = suppliers[bucket];
	return list[Math.floor(Math.random() * list.length)];
}

function isoDate(d) {
	return d.toISOString().slice(0, 10);
}
function addDays(d, n) {
	const r = new Date(d);
	r.setDate(r.getDate() + n);
	return r;
}

function generateNotesForProject(project, projectId) {
	const notes = [];
	if (project.status === 'pausiert') {
		notes.push({
			projectId,
			text: 'Baustopp wegen Einsprache. Rechtliche Klärung beauftragt an Kanzlei Müller & Partner.',
			author: 'Max Muster',
			createdAt: addDays(new Date(), -12)
		});
		notes.push({
			projectId,
			text: 'Erstes Schlichtungsgespräch mit Nachbar erfolgt — Lösungssuche läuft.',
			author: 'Max Muster',
			createdAt: addDays(new Date(), -5)
		});
	} else if (project.status === 'laufend') {
		notes.push({
			projectId,
			text: 'Wöchentliche Bauleitungssitzung Mi 09:00 vor Ort. Protokoll im SharePoint.',
			author: 'Max Muster',
			createdAt: addDays(new Date(), -21)
		});
		notes.push({
			projectId,
			text: 'Statiker (Müller AG) hat freigegeben für nächste Etappe. Bewehrungspläne final.',
			author: 'Max Muster',
			createdAt: addDays(new Date(), -7)
		});
		notes.push({
			projectId,
			text: 'Wetter-Warnung Donnerstag — Betonage vorziehen falls möglich.',
			author: 'Max Muster',
			createdAt: addDays(new Date(), -2)
		});
	} else if (project.status === 'abgeschlossen') {
		notes.push({
			projectId,
			text: 'Schlussabnahme erfolgt ohne Mängel. Schlussrechnung freigegeben.',
			author: 'Max Muster',
			createdAt: addDays(new Date(), -25)
		});
	} else if (project.status === 'offen') {
		notes.push({
			projectId,
			text: 'Baubewilligung eingereicht — Antwort innert 8 Wochen erwartet.',
			author: 'Max Muster',
			createdAt: addDays(new Date(), -3)
		});
	}
	return notes;
}

async function main() {
	const client = new MongoClient(MONGODB_URI);
	await client.connect();
	const db = client.db('buildex');

	if (RESET) {
		console.log('Reset: lösche alle Collections...');
		await db.collection('projects').deleteMany({});
		await db.collection('deliveries').deleteMany({});
		await db.collection('notes').deleteMany({});
		await db.collection('materials').deleteMany({});
		await db.collection('users').deleteMany({});
	}

	// Demo-Users: damit Reviewer/Dozenten direkt einloggen können ohne Konto anzulegen
	const userCol = db.collection('users');
	const demoUsers = [
		{
			email: 'demo@buildex.ch',
			username: 'demo',
			password: 'demo123',
			company: 'Bauunternehmung XY AG',
			role: 'Bauführer'
		},
		{
			email: 'marko@buildex.ch',
			username: 'mvukcevic',
			password: 'marko2026',
			company: 'BUILDEX',
			role: 'Bauleiter'
		}
	];
	for (const u of demoUsers) {
		const salt = randomBytes(16).toString('hex');
		const passwordHash = createHash('sha256').update(salt + ':' + u.password).digest('hex');
		await userCol.updateOne(
			{ email: u.email },
			{
				$set: {
					email: u.email,
					username: u.username,
					passwordHash,
					salt,
					company: u.company,
					role: u.role,
					createdAt: new Date()
				}
			},
			{ upsert: true }
		);
	}
	console.log(`✓ ${demoUsers.length} Demo-User upserted (demo@buildex.ch / demo123, marko@buildex.ch / marko2026).`);

	// Materials: upsert
	const matCol = db.collection('materials');
	for (const m of MATERIALS) {
		await matCol.updateOne({ key: m.key }, { $set: m }, { upsert: true });
	}
	console.log(`✓ ${MATERIALS.length} Materialien upserted.`);

	// Projects: insert
	const projCol = db.collection('projects');
	const projectIds = {};
	for (const p of PROJECTS) {
		const res = await projCol.insertOne({
			...p,
			createdAt: new Date(),
			updatedAt: new Date()
		});
		projectIds[p.name] = res.insertedId.toString();
	}
	console.log(`✓ ${PROJECTS.length} Projekte angelegt.`);

	// Deliveries: pro Projekt generieren
	const delCol = db.collection('deliveries');
	let totalDeliveries = 0;
	for (const p of PROJECTS) {
		const pid = projectIds[p.name];
		const deliveries = generateDeliveriesForProject(p, pid, MATERIALS);
		if (deliveries.length > 0) {
			await delCol.insertMany(deliveries);
			totalDeliveries += deliveries.length;
		}
	}
	console.log(`✓ ${totalDeliveries} Lieferungen angelegt.`);

	// Notes: pro Projekt generieren
	const noteCol = db.collection('notes');
	let totalNotes = 0;
	for (const p of PROJECTS) {
		const pid = projectIds[p.name];
		const notes = generateNotesForProject(p, pid);
		if (notes.length > 0) {
			await noteCol.insertMany(notes);
			totalNotes += notes.length;
		}
	}
	console.log(`✓ ${totalNotes} Notizen angelegt.`);

	await client.close();
	console.log('\nSeed abgeschlossen.');
}

main().catch((e) => {
	console.error('Seed-Fehler:', e);
	process.exit(1);
});
