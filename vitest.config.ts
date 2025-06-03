import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
	plugins: [react(), tsConfigPaths()],
	test: {
    alias: {
      "~/*": "/src",
      "@/content/*": "/src/content",
      "#/tests/*": "/tests",
    },
		include: ['app/**/*.test.tsx'],
		globals: true,
		environment: 'jsdom',
		setupFiles: [
			'./tests/setup/cleanup.ts',
		],
	},
});
