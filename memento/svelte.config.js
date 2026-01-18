import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			out: 'build',
			precompress: false,
			envPrefix: ''
		}),
		alias: {
			$lib: './src/lib',
			$components: './src/lib/components',
			$server: './src/lib/server',
			$stores: './src/lib/stores',
			$types: './src/lib/types',
			$utils: './src/lib/utils'
		},
		csrf: {
			checkOrigin: true
		}
	}
};

export default config;
