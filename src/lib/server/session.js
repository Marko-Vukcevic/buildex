// Einfache Session-Verwaltung über httpOnly-Cookie.
// Für ein echtes Produkt würde man Sessions in einer DB speichern und nur die Session-ID im Cookie.
// Für den Prototyp reicht: User-ID direkt im Cookie (signed wäre besser, hier aus Einfachheit ungesigniert).

const COOKIE_NAME = 'buildex_session';
const COOKIE_OPTIONS = {
	path: '/',
	httpOnly: true,
	sameSite: 'lax',
	secure: true, // Netlify ist immer HTTPS
	maxAge: 60 * 60 * 24 * 30 // 30 Tage
};

export function setSession(cookies, userId) {
	cookies.set(COOKIE_NAME, userId, COOKIE_OPTIONS);
}

export function clearSession(cookies) {
	cookies.delete(COOKIE_NAME, { path: '/' });
}

export function getSessionUserId(cookies) {
	return cookies.get(COOKIE_NAME) || null;
}
