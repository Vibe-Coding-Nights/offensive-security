import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		host: true,
		port: 5173,
		strictPort: false,
		watch: {
			usePolling: false
		}
	},
	optimizeDeps: {
		include: ['yjs', 'y-websocket', 'y-protocols']
	},
	build: {
		target: 'esnext',
		sourcemap: true
	}
});
