import adapter from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		// Netlify adapter — handles SSR endpoints (form actions, MongoDB queries) as Netlify Functions.
		adapter: adapter()
	}
};

export default config;
