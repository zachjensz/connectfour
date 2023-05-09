/** @type {import('@sveltejs/kit').Config} */
import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
	},
};

export default config;
