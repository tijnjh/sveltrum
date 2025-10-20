import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import adapter from 'svelte-adapter-bun'

/** @type {import('@sveltejs/kit').Config} */
export default {
	compilerOptions: {
		experimental: {
			async: true,
		},
	},
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		experimental: {
			remoteFunctions: true,
		},
	},
}
