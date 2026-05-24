// Wir machen alle Routen dynamisch — sie brauchen einen MongoDB-Zugriff bei jedem Request.
// Ohne diese Einstellung versucht SvelteKit (via adapter-netlify) Routen zu pre-rendern,
// was beim Build ohne DB-Zugriff crasht.
export const prerender = false;
export const ssr = true;
