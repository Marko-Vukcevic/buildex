// User-Verwaltung: Register, Login, Lookup.
// Demo-Auth: Passwort wird per SHA-256 + Salt gehasht (kein bcrypt, weil keine native Dep).
// Für ein echtes Produkt müsste man bcrypt oder argon2 verwenden — für den Prototyp reicht das.

import { createHash, randomBytes } from 'node:crypto';
import { ObjectId } from 'mongodb';
import { getDb } from './db.js';

const COLLECTION = 'users';

async function getUsersCollection() {
	const db = await getDb();
	return db.collection(COLLECTION);
}

function hashPassword(password, salt) {
	return createHash('sha256').update(salt + ':' + password).digest('hex');
}

function generateSalt() {
	return randomBytes(16).toString('hex');
}

export async function registerUser({ email, username, password, company }) {
	const errors = {};
	if (!email || !email.trim()) errors.email = 'E-Mail ist Pflicht.';
	else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Ungültige E-Mail-Adresse.';
	if (!username || !username.trim()) errors.username = 'Benutzername ist Pflicht.';
	else if (username.length < 3) errors.username = 'Mindestens 3 Zeichen.';
	else if (username.length > 30) errors.username = 'Maximal 30 Zeichen.';
	if (!password) errors.password = 'Passwort ist Pflicht.';
	else if (password.length < 6) errors.password = 'Mindestens 6 Zeichen.';
	if (company && company.length > 100) errors.company = 'Firmenname max 100 Zeichen.';
	if (Object.keys(errors).length > 0) return { ok: false, errors };

	const col = await getUsersCollection();

	// Eindeutigkeit prüfen
	const existing = await col.findOne({
		$or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }]
	});
	if (existing) {
		if (existing.email === email.toLowerCase().trim()) {
			return { ok: false, errors: { email: 'E-Mail ist bereits registriert.' } };
		}
		return { ok: false, errors: { username: 'Benutzername ist bereits vergeben.' } };
	}

	const salt = generateSalt();
	const passwordHash = hashPassword(password, salt);

	const result = await col.insertOne({
		email: email.toLowerCase().trim(),
		username: username.trim(),
		passwordHash,
		salt,
		company: company?.trim() || 'Bauunternehmung XY AG',
		role: 'Bauführer',
		createdAt: new Date()
	});

	return { ok: true, userId: result.insertedId.toString() };
}

export async function loginUser({ email, password }) {
	const errors = {};
	if (!email) errors.email = 'E-Mail ist Pflicht.';
	if (!password) errors.password = 'Passwort ist Pflicht.';
	if (Object.keys(errors).length > 0) return { ok: false, errors };

	const col = await getUsersCollection();
	const user = await col.findOne({ email: email.toLowerCase().trim() });
	if (!user) {
		// Generische Fehlermeldung — verrate nicht ob E-Mail oder Passwort falsch ist
		return { ok: false, errors: { _: 'E-Mail oder Passwort falsch.' } };
	}
	const hash = hashPassword(password, user.salt);
	if (hash !== user.passwordHash) {
		return { ok: false, errors: { _: 'E-Mail oder Passwort falsch.' } };
	}
	return { ok: true, user: toPublicUser(user) };
}

export async function getUserById(id) {
	if (!ObjectId.isValid(id)) return null;
	const col = await getUsersCollection();
	const doc = await col.findOne({ _id: new ObjectId(id) });
	return doc ? toPublicUser(doc) : null;
}

function toPublicUser(doc) {
	return {
		id: doc._id.toString(),
		email: doc.email,
		username: doc.username,
		company: doc.company ?? '',
		role: doc.role ?? 'Bauführer',
		createdAt: doc.createdAt?.toISOString?.() ?? null
	};
}
