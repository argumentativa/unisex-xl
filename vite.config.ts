import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { resolve } from 'path';

export default defineConfig({
  base: '/unisex-xl/', // GitHub Pages base path
  plugins: [
    (monacoEditorPlugin as any).default({
      languageWorkers: ['editorWorkerService', 'typescript', 'json']
    })
  ],
  optimizeDeps: {
    include: ['monaco-editor', 'tone']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    port: 5173,
    // Allow serving files from project root (needed for p5js demos)
    fs: {
      allow: ['..']
    }
  },
  build: {
    target: 'es2022', // Support top-level await
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});
