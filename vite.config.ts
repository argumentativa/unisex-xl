import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { resolve } from 'path';

export default defineConfig({
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
  build: {
    target: 'es2022',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});
