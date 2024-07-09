import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        sourcemap: true
    },
    plugins: [
        svgr({}),
        react(),
    ],
    optimizeDeps: {},
    test: {
        include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
        globals: true,
        environment: 'jsdom',
        setupFiles: 'vitest-setup.js',
        deps: {
            web: {
                transformCss: false,
                transformAssets: false,
            },
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/'],
            exclude: ['node_modules/', 'dist/', 'coverage/'],
        },
    },
});
