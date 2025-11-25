# App Development Guide for Claude

**STOP! READ THIS FIRST**

## Project Overview

**UNISEX XL** is a browser-based live coding music application for creating electronic music through code.

### Tech Stack
- **Build:** Vite + TypeScript (ES2020+)
- **Audio:** Tone.js (synthesis, effects, transport) + Strudel (pattern-based live coding)
- **Editor:** Monaco Editor (VS Code's editor component)
- **Visualization:** Canvas API + p5.js (for demos)
- **Runtime:** Node.js v16+, ES Modules

### Core Architecture
```
User Code (Monaco Editor)
    ↓
Code Executor (sandboxed execution)
    ↓
Audio Engine (Tone.js/Strudel)
    ├→ Transport (play/pause/stop)
    ├→ Instruments (synth, bass, drums)
    └→ Analyzer
        ↓
Visualizer (Canvas2D)
    └→ Waveform/Frequency display
```

### Key Features
- Live code execution with instant audio feedback
- Real-time audio visualization (waveform, frequency bars)
- Support for both Tone.js and Strudel patterns
- Split-panel UI: editor + visualizer
- p5.js demos for advanced visualizations (ASCII art, webcam)

### Project Structure
- `src/` - TypeScript source code (core, ui, types)
- `p5js/` - p5.js demos and visualizations
- `patterns/` - Example patterns (Strudel, Tone.js)
- `demos/` - Standalone demo pages

---

## Quick Reference

### Development Commands
- `npm run dev` - Start dev server (http://localhost:5173)
- `npm run build` - Build for production (outputs to `dist/`)
- `npm run preview` - Preview production build locally
- `npm run type-check` - TypeScript type checking without building

### Git Commands
- `git checkout -b feature/[name]` - Create feature branch
- `git add . && git commit -m "[Type] Description"` - Stage and commit changes
- `git push -u origin feature/[name]` - Push branch to remote (first time)
- `git push` - Push subsequent commits (after `-u` is set)

### Common Commit Types
- `[Feat]` - New feature
- `[Fix]` - Bug fix
- `[Docs]` - Documentation changes
- `[Style]` - Code style/formatting
- `[Refactor]` - Code refactoring
- `[Test]` - Tests
- `[Chore]` - Build/config changes

---

## MANDATORY Git Workflow - DO NOT SKIP

Before writing ANY code, you MUST:

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/[name]
   ```
   Or use your preferred naming convention (e.g., `username/[name]`)

2. **Commit changes FREQUENTLY** (every file/component)
   - After completing each major step
   - When switching between different files/features
   - Before running build tests
   - Use meaningful commit messages with `[Type]` prefix:
   ```bash
   git commit -m "[Type] Brief description"
   ```

3. **NEVER work directly on main branch**
   - All changes must go through feature branches
   - Create pull requests for review

**If you complete a task without proper Git commits = TASK INCOMPLETE**

---

## Development Style Guide

### Communication Approach
- Explain JavaScript/TypeScript concepts clearly with examples
- Connect code patterns to design system thinking
- Provide both "what" and "why" behind decisions
- Break down complex logic step-by-step

### Code Preferences
- **HTML:** Modern semantic HTML5 elements
- **CSS:** Grid/Flexbox, custom properties for design tokens, mobile-first, BEM naming
- **TypeScript/JavaScript:** ES6+ syntax, functional patterns, clear variable names, component-based thinking
- **Structure:** Reusable components that mirror design system principles

### Learning Support
- Suggest incremental steps for complex topics
- Point out common mistakes
- Show multiple solution approaches (simple → advanced)

**Note:** This project uses TypeScript, so apply these principles within TypeScript's type system.

---

## Build Configuration & Static Assets

### Understanding Vite Build System

**CRITICAL:** Vite has TWO ways to include files in the production build:

#### 1. **Processed HTML Files** (Main App Pages)
Files that Vite should process, bundle, and optimize:
- `index.html` (main app)
- `gallery.html` (project gallery)

**Add these to `vite.config.ts` → `build.rollupOptions.input`:**
```typescript
build: {
  rollupOptions: {
    input: {
      main: resolve(__dirname, 'index.html'),
      gallery: resolve(__dirname, 'gallery.html'),
      newPage: resolve(__dirname, 'new-page.html')  // Add new processed pages here
    }
  }
}
```

#### 2. **Static Assets** (Demos & Standalone Pages)
Files that should be COPIED AS-IS without processing:
- `p5/**/*` - All p5.js demos and visualizations
- `strudel/**/*` - Strudel live coding demos
- `tonejs/**/*` - Tone.js demos
- Any standalone HTML/JS/CSS that uses external libraries

**These are copied via `vite-plugin-static-copy` in the plugins section:**
```typescript
import { viteStaticCopy } from 'vite-plugin-static-copy';

plugins: [
  viteStaticCopy({
    targets: [
      { src: 'p5/**/*', dest: 'p5' },
      { src: 'strudel/**/*', dest: 'strudel' },
      { src: 'tonejs/**/*', dest: 'tonejs' }
    ]
  })
]
```

### When to Use Each Approach

**Use processed HTML** (rollupOptions.input) when:
- File imports TypeScript/bundled assets
- File needs Vite's build optimization
- File is part of the main app

**Use static copy** (vite-plugin-static-copy) when:
- File uses external CDN libraries (p5.js, Strudel, etc.)
- File has non-module scripts (`<script src="...">` without `type="module"`)
- Entire directory should be copied as-is
- File contains special characters that break Vite's HTML parser (e.g., `<` in code blocks)

### Testing Your Build

**After adding new files, ALWAYS test the build:**

```bash
# Build and check output
npm run build

# Verify HTML files
find dist -name "*.html" | wc -l  # Should show all expected HTML files

# Check specific directories
ls -la dist/p5/          # Should show all p5 demos
ls -la dist/strudel/     # Should show strudel demos

# Verify .nojekyll file exists
ls -la dist/.nojekyll    # MUST exist for GitHub Pages
```

### Common Build Issues

**Problem:** New HTML page returns 404 on GitHub Pages
**Solution:** Add to static copy targets in `vite.config.ts`

**Problem:** Page loads but scripts/assets return 404
**Solution:** Ensure the entire directory is in static copy targets

**Problem:** Build fails with "can't be bundled without type='module'"
**Solution:** Use static copy instead of rollupOptions.input

**Problem:** GitHub Pages ignores files starting with `_`
**Solution:** `.nojekyll` file is automatically created by custom plugin in `vite.config.ts`

### Deployment Checklist

Before deploying to GitHub Pages:

- [ ] All new HTML files added to `vite.config.ts` (either input or static copy)
- [ ] Run `npm run build` successfully
- [ ] Verify all files in `dist/` directory
- [ ] Check `.nojekyll` file exists in `dist/`
- [ ] Test paths are relative (not absolute `/path`)
- [ ] Run `npm run deploy`

---

## Deployment

### GitHub Pages

**Setup:**
1. Install: `npm install --save-dev gh-pages`
2. Add to `package.json` scripts: `"deploy": "npm run build && gh-pages -d dist"`
3. Configure `vite.config.ts` base path if deploying to subdirectory:
   ```typescript
   base: '/unisex-xl/',  // Only if repo is not at root
   ```
4. Enable GitHub Pages in repo Settings → Pages → Deploy from `gh-pages` branch

**Deploy:**
```bash
npm run deploy
```

**Site URL:**
- Root repo: `https://argumentativa.github.io/`
- Subdirectory: `https://argumentativa.github.io/unisex-xl/`

**Note:** After first deploy, just run `npm run deploy` to update the live site.

---

This guide captures best practices and learnings from developing the Live Coding Music Application
