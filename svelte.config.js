import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

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
    alias: {
      '@/*': './path/to/lib/*',
    },
  },
}
