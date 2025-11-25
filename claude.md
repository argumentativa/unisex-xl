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
