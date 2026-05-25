// Routen sind dynamisch (MongoDB-backed) — kein Prerender.
// User (oder null) wird aus event.locals (siehe hooks.server.js) an alle Layouts/Pages weitergegeben.
export const prerender = false;
export const ssr = true;

export async function load({ locals, url }) {
	return {
		user: locals.user,
		pathname: url.pathname
	};
}
