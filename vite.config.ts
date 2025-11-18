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
    include: ['monaco-editor', 'tone', '@strudel/core', '@strudel/webaudio', '@strudel/repl']
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        strudel: resolve(__dirname, 'strudel.html')
      }
    }
  }
});
