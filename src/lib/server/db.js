// Server-only Datenbankverbindung zu MongoDB Atlas.
// Wichtig: Diese Datei liegt unter src/lib/server/ — SvelteKit liefert sie NIE an den Client aus.
// Das Passwort bleibt also auf dem Server.

import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

if (!MONGODB_URI) {
	throw new Error('MONGODB_URI ist nicht gesetzt. Prüfe .env (lokal) bzw. die Environment-Variables in Netlify.');
}

// Ein einziger Client für die gesamte App. MongoDB pooled Connections intern.
const client = new MongoClient(MONGODB_URI);

// connect() returnt ein Promise. Wir cachen das Promise, damit alle Routen denselben Verbindungs-State teilen.
const clientPromise = client.connect();

/**
 * Liefert die `buildex`-Datenbank.
 * Beispiel: const db = await getDb(); const items = await db.collection('projects').find().toArray();
 */
export async function getDb() {
	const c = await clientPromise;
	return c.db('buildex');
}

/**
 * Shortcut für die projects-Collection.
 */
export async function getProjectsCollection() {
	const db = await getDb();
	return db.collection('projects');
}
