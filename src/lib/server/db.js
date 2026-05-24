// Server-only Datenbankverbindung zu MongoDB Atlas.
// Wichtig: Diese Datei liegt unter src/lib/server/ — SvelteKit liefert sie NIE an den Client aus.
//
// Lazy initialization: Wir verbinden erst beim ersten getDb()-Aufruf,
// nicht beim Modul-Import. Das verhindert Crashes beim Build, wo MongoDB nicht erreichbar ist.

import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';

let clientPromise = null;

function getClientPromise() {
	if (!clientPromise) {
		if (!MONGODB_URI) {
			throw new Error(
				'MONGODB_URI ist nicht gesetzt. Prüfe .env (lokal) bzw. die Environment-Variables in Netlify.'
			);
		}
		const client = new MongoClient(MONGODB_URI);
		clientPromise = client.connect();
	}
	return clientPromise;
}

export async function getDb() {
	const c = await getClientPromise();
	return c.db('buildex');
}

export async function getProjectsCollection() {
	const db = await getDb();
	return db.collection('projects');
}

export async function getDeliveriesCollection() {
	const db = await getDb();
	return db.collection('deliveries');
}

export async function getNotesCollection() {
	const db = await getDb();
	return db.collection('notes');
}

export async function getMaterialsCollection() {
	const db = await getDb();
	return db.collection('materials');
}
