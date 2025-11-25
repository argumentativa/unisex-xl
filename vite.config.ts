import { defineConfig } from 'vite';
import monacoEditorPlugin from 'vite-plugin-monaco-editor';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

export default defineConfig({
  base: '/unisex-xl/', // GitHub Pages base path
  plugins: [
    (monacoEditorPlugin as any).default({
      languageWorkers: ['editorWorkerService', 'typescript', 'json']
    }),
    viteStaticCopy({
      targets: [
        {
          src: 'p5',
          dest: ''
        },
        {
          src: 'strudel',
          dest: ''
        },
        {
          src: 'tonejs',
          dest: ''
        },
        {
          src: 'tonejs-template',
          dest: ''
        },
        {
          src: 'projects.html',
          dest: ''
        }
      ]
    }),
    {
      name: 'create-nojekyll',
      closeBundle() {
        const nojekyllPath = resolve(__dirname, 'dist/.nojekyll');
        writeFileSync(nojekyllPath, '');
        console.log('✓ Created .nojekyll file for GitHub Pages');
      }
    }
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
        main: resolve(__dirname, 'index.html'),
        gallery: resolve(__dirname, 'gallery.html')
      }
    }
  }
});
