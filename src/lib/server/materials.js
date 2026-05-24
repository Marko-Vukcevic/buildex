// Materialien-Katalog mit CO2-Emissionsfaktoren.
// Quelle: KBOB Ökobilanzdaten im Baubereich (vereinfacht für Prototyp-Demo).
// Werte sind Grössenordnungs-Schätzungen, nicht für echte Bilanzierung tauglich.

import { getMaterialsCollection } from './db.js';

export async function listMaterials() {
	const col = await getMaterialsCollection();
	const docs = await col.find({}).sort({ name: 1 }).toArray();
	return docs.map((d) => ({
		key: d.key,
		name: d.name,
		unit: d.unit,
		co2PerUnit: d.co2PerUnit
	}));
}

export async function getMaterial(key) {
	const col = await getMaterialsCollection();
	const doc = await col.findOne({ key });
	if (!doc) return null;
	return {
		key: doc.key,
		name: doc.name,
		unit: doc.unit,
		co2PerUnit: doc.co2PerUnit
	};
}

/**
 * Berechnet CO2 (in kg) für eine Lieferung anhand Material-Key, Menge.
 * Returnt 0 wenn Material nicht gefunden.
 */
export async function calculateCo2(materialKey, quantity) {
	if (!quantity || quantity <= 0) return 0;
	const mat = await getMaterial(materialKey);
	if (!mat) return 0;
	return Math.round(mat.co2PerUnit * quantity);
}

// Statischer Fallback wenn Collection leer (für Dev/Local).
export const DEFAULT_MATERIALS = [
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
