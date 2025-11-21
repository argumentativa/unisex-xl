# UNISEX-XL Documentation

Welcome to the UNISEX-XL documentation library. This guide helps you master live coding for industrial and Berlin techno using Tone.js and Strudel.

---

## 📁 Folder Structure

```
docs/
├── README.md (this file)          # Start here
├── cheatsheets/                    # 1-page quick reference (PRINT THESE!)
├── reference/                      # Quick lookups & guides
├── books/                          # Book-based learning
├── guides/                         # Topic deep dives
└── examples/                       # Code examples
```

---

## 🚀 Quick Start Paths

### 🎓 Complete Beginner? START HERE!
```
1. Read: cheatsheets/beginner.md (LEARNING BY DOING)
2. Copy-paste code blocks → hear sound → modify → learn
3. Reference while coding: Keep cheatsheet open!
4. Print it: cheatsheets/ folder has printable quick refs
```

### New to UNISEX XL?
```
1. Read: reference/README.md
2. Try: reference/templates.md (copy-paste examples)
3. Learn: reference/tonejs-quickstart.md OR reference/strudel-quickstart.md
```

### Ready to Code?
```
1. Copy template from reference/templates.md
2. Modify in UNISEX XL (http://localhost:5173)
3. Reference guides as needed
4. Save to /patterns/
```

### Learning from a Book?
```
1. Navigate to books/{book-name}/
2. Read book content
3. Try implementations (tonejs.md or strudel.md)
4. Use quick-ref.md for parameter lookups
```

---

## 📋 Cheatsheets (`cheatsheets/`)

**1-page quick references optimized for scanning & glancing**

- **[📖 Cheatsheets Overview](./cheatsheets/README.md)** - Start here
- **[🎓 Beginner Cheatsheet](./cheatsheets/beginner.md)** - Copy-paste learning (800+ lines)
- **[🎚️ Mixing Cheatsheet](./cheatsheets/mixing.md)** - Frequencies, levels, effects

**Purpose:** Print these. Keep them visible while coding. Scan in under 30 seconds.

**Use when:**
- Learning syntax (beginner.md)
- Mix sounds muddy (mixing.md)
- Need quick parameter lookup
- Want to paste working code immediately

---

## 📚 Reference Library (`reference/`)

**Quick lookups and getting-started guides**

### Framework Guides
- **[Tone.js Quickstart](./reference/tonejs-quickstart.md)** - Synths, notes, basic patterns
- **[Tone.js Effects](./reference/tonejs-effects.md)** - Reverb, delay, filters, chains
- **[Strudel Quickstart](./reference/strudel-quickstart.md)** - Mini-notation, patterns, samples
- **[Strudel Advanced](./reference/strudel-advanced.md)** - Euclidean rhythms, transformations

### Universal Guides
- **[Templates](./reference/templates.md)** - Complete copy-paste examples
- **[Timing](./reference/timing.md)** - BPM, note durations, Transport
- **[Troubleshooting](./reference/troubleshooting.md)** - Common issues & fixes

**Purpose:** Fast answers while coding. Keep these open in tabs during live sessions.

---

## 📖 Books (`books/`)

**Structured learning from production books**

### Attack Magazine Techno Secrets
- **[Overview](./books/attack-magazine/README.md)**
- [Production Guide](./books/attack-magazine/guide-draft.md) - Techniques & approaches
- [Personal Notes](./books/attack-magazine/notes.md) - YOUR learning journal
- [Quick Reference](./books/attack-magazine/quick-ref.md) - Parameter tables

### Dance Music Manual (Rick Snoman)
- **[Overview](./books/dance-music-manual/README.md)**
- [Tone.js Implementation](./books/dance-music-manual/tonejs.md) - 741 lines
- [Strudel Implementation](./books/dance-music-manual/strudel.md) - 706 lines
- [Quick Reference](./books/dance-music-manual/quick-ref.md)

### Mixing & Mastering In the Box (Steve Savage)
- **[Overview](./books/mixing-mastering/README.md)**
- [Tone.js Mixing Guide](./books/mixing-mastering/tonejs.md) - 945 lines
- [Strudel Mixing Guide](./books/mixing-mastering/strudel.md) - 853 lines
- [Quick Reference](./books/mixing-mastering/quick-ref.md)

**Purpose:** Apply professional production techniques in live coding context.

---

## 🎯 Guides (`guides/`)

**Deep dives into specific topics**

*Coming soon:*
- Kick drum design & synthesis
- Bassline programming
- Effects chains & signal flow
- Mixing for techno
- Sound design fundamentals

**Purpose:** Comprehensive exploration of single topics, combining multiple sources.

---

## 💻 Examples (`examples/`)

**Working code and patterns**

- **[Sample Documentation](./examples/SAMPLES.md)** - Using Kit01 samples
- *Coming soon:* Tone.js pattern collection
- *Coming soon:* Strudel pattern collection

**Purpose:** Copy, modify, learn from working code.

---

## 📍 Navigation Guide

### By Learning Style:

**Visual Learner → "Show me examples"**
- Start: `reference/templates.md`
- Then: `examples/`

**Conceptual Learner → "Explain the theory"**
- Start: `books/` (choose a book)
- Then: `guides/`

**Hands-on Learner → "Let me try it"**
- Start: `cheatsheets/beginner.md` (copy-paste & modify!)
- Then: `reference/templates.md` (complete patterns)
- Keep: `cheatsheets/mixing.md` (glance while mixing)

### By Use Case:

**"I want to make a kick drum"**
```
1. books/dance-music-manual/tonejs.md (theory)
2. reference/templates.md (copy-paste)
3. examples/ (working patterns)
```

**"My pattern sounds muddy"**
```
1. cheatsheets/mixing.md (GLANCE: EQ frequencies, line 8-17)
2. reference/tonejs-effects.md (how to apply filters)
3. books/mixing-mastering/quick-ref.md (deeper mixing guide)
```

**"How do I use .slow() in Strudel?"**
```
1. reference/strudel-quickstart.md (basics)
2. reference/strudel-advanced.md (transformations)
3. books/dance-music-manual/strudel.md (examples)
```

---

## 🎵 Integration with UNISEX XL

### Using Documentation While Coding:

**Recommended Workflow:**
```
Terminal 1: npm run dev (UNISEX XL running)
Browser Tab 1: http://localhost:5173 (Tone.js mode)
Browser Tab 2: http://localhost:5173/strudel.html (Strudel mode)
Browser Tab 3: docs/reference/README.md (this guide)
Browser Tab 4: Relevant book/guide
```

**Live Coding Session Setup:**
1. Open UNISEX XL interface
2. Print and keep visible: `cheatsheets/` (beginner.md, mixing.md)
3. Load `reference/templates.md` for quick starts
4. Keep `reference/troubleshooting.md` nearby
5. Reference book guides for techniques

### Saving Your Work:
```
docs/        → Keep documentation here
patterns/    → Save your working patterns
examples/    → Reference working examples
```

---

## 🔄 Adding New Content

### Quick Decision Tree:

**Is it a 1-page scannable reference?**
- Yes → Add to `cheatsheets/`
- Must be printable, scannable in 30 seconds
- Examples: mixing.md, beginner.md, scales.md

**Is it from a book?**
- Yes → Add to `books/{book-name}/`
- Create: README.md, tonejs.md, strudel.md, quick-ref.md

**Is it a framework guide or tutorial?**
- Yes → Add to `reference/`
- Update: Existing files or create new quickstart

**Is it a deep topic guide?**
- Yes → Add to `guides/{topic}.md`
- Example: `guides/kick-drums.md`

**Is it working code?**
- Yes → Add to `examples/`
- Format: tonejs-examples.md or strudel-examples.md

### Naming Conventions:
- Folders: `lowercase-with-hyphens/`
- Files: `descriptive-name.md`
- Book folders: Match book title (shortened)

---

## ⚖️ Copyright & Attribution

### This Documentation Contains:
✅ General electronic music production knowledge
✅ Common industry practices
✅ Strudel/Tone.js implementations
✅ Personal learning notes and experiments

### This Documentation Does NOT Contain:
❌ Direct book citations (without permission)
❌ Copyrighted content
❌ Verified book excerpts

**All book-based content represents interpretations and applications of production principles in live coding contexts.**

---

## 🆘 Getting Help

**Can't find what you need?**

1. Check `reference/troubleshooting.md`
2. Search documentation: `grep -r "your topic" docs/`
3. Try `reference/templates.md` for working examples

**Documentation unclear?**
- Create an issue
- Add clarifications to relevant README.md
- Update quick references with verified values

---

## 📊 Documentation Stats

- **Total Lines:** ~9,200+
- **Files:** 24 markdown files
- **Coverage:** Tone.js, Strudel, mixing, sound design, techno production
- **Status:** Living documentation - constantly updated with discoveries
- **NEW:** Cheatsheets folder (beginner.md + mixing.md, printable!)

---

## 🎯 Recommended Learning Paths

### Path 1: Complete Beginner (Learning by Doing)
```
Day 1: cheatsheets/beginner.md (COPY-PASTE & MODIFY!)
Day 2: Keep cheatsheet open, experiment with all code blocks
Day 3: reference/templates.md (complete patterns)
Week 2: books/dance-music-manual/tonejs.md (understand theory)
Week 3+: cheatsheets/mixing.md + books/mixing-mastering/ (improve mixes)
```

### Path 2: Experienced Producer (New to Live Coding)
```
Day 1: reference/templates.md (learn syntax fast)
Day 2: books/dance-music-manual/tonejs.md (apply your knowledge)
Day 3: books/mixing-mastering/tonejs.md (translate mixing skills)
Week 2+: Experiment, save patterns, build library
```

### Path 3: Berlin Techno Focus
```
Day 1: reference/templates.md (techno examples)
Day 2: books/attack-magazine/guide-draft.md
Day 3: books/mixing-mastering/tonejs.md (industrial mixing)
Week 2+: /strudel/techno/ (study working patterns)
```

---

**Happy live coding! 🎵**

**Last Updated:** November 18, 2024
