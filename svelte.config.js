import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const dev = process.argv.includes('dev');
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		paths: {
			// base: dev ? '' : '/phase-space',
			base: '/phase-space',
		}
	}
};
export default config;
