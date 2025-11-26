# Product Requirements Document: UNISEX XL

**Version:** 1.0
**Date:** November 2024
**Status:** Active Development
**Type:** Browser-Based Live Coding Music Application

---

## Executive Summary

UNISEX XL is a browser-based live coding music application that enables musicians, performers, and experimenters to create electronic music by writing code in real-time. The platform combines professional-grade audio synthesis (Tone.js, Strudel) with aggressive ASCII visualization, requiring zero external dependencies or complex audio routing setup.

### Core Value Proposition

- **Zero Setup** - Works immediately in any modern browser, no DAW or audio routing required
- **Live Performance Ready** - Built for algorave, live coding performances, and electronic music creation
- **Multiple Paradigms** - Choose between imperative (Tone.js) or declarative (Strudel/Tidal Cycles) approaches
- **Immediate Visual Feedback** - Aggressive real-time visualization ensures visual reactions are always obvious

---

## Product Vision

### Primary Goal
Provide the fastest path from musical idea to sound, optimized for live performance and experimental music creation.

### Target Users

1. **Live Coders** - Algorave performers, live coding artists
2. **Electronic Musicians** - Producers experimenting with generative music
3. **Educators** - Teaching Web Audio API, music programming, synthesis
4. **Experimenters** - Artists exploring intersection of code, music, and visuals

### Market Position
- **Vs. Sonic Pi**: Browser-based, no installation, visual feedback
- **Vs. TidalCycles**: Lower barrier to entry, integrated visualization
- **Vs. DAWs**: Code-first approach, live coding optimized, zero latency

---

## Product Architecture

### Application Variants

#### 1. Tone.js Interface (`index.html`, `main.ts`)
**Purpose:** Full-featured synthesis with granular control

**Features:**
- Monaco Editor (VS Code component) with IntelliSense
- Direct Tone.js API access
- Three synthesizer instances (synth, bass, drums)
- Effects chain: Distortion → BitCrusher → Delay → Reverb
- Transport controls (play/pause/stop)
- BPM control (60-200 BPM)
- Audio sample library (kick, snare, hat, bass, tom, pad)
- Waveform visualizer
- Console logging

**Use Case:** Complex synthesis, learning Web Audio API, prototyping

#### 2. Strudel Interface (`strudel.html`, `strudel-main.ts`)
**Purpose:** Pattern-based music notation

**Features:**
- Tidal Cycles syntax in browser
- Compact notation system
- Pattern-oriented composition
- Sample triggering
- Effects processing

**Use Case:** Quick pattern creation, algorave performances, Tidal Cycles users

#### 3. Live Coding + Visualizer (`live-coding.html`)
**Purpose:** Unified environment for performance

**Key Innovation:** Direct Tone.js → Visualizer audio routing (no BlackHole required)

**Features:**
- Split-screen layout (code editor + ASCII visualizer)
- Pattern library management (6+ pre-loaded patterns)
- Keyboard-driven workflow (7 shortcuts)
- Three workflow modes:
  - **Live Coding Mode** - 50/50 split, balanced workflow
  - **Performance Mode** - Large visualizer, minimal editor
  - **Studio Mode** - Large editor, full console
- Visual presets:
  - Aggressive (1.0-3.0x size changes)
  - Extreme (0.2-6.0x size changes)
  - Subtle (0.8-1.5x size changes)
- Multi-layered visual effects:
  - Bass pulse (overall size)
  - Wave effect (mid frequencies)
  - Ripple from center
  - Position-based variation
  - Volume jitter
- Real-time audio level indicators
- Console logging
- Pattern save/load

**Use Case:** Live performances, studio work, all-in-one environment

#### 4. Strudel + Visualizer (`strudel-viz.html`)
**Purpose:** Clean, production-ready live coding

**Key Innovation:** Uses official `@strudel/web` package for reliability

**Features:**
- Simplified codebase (~200 lines vs ~600 in live-coding.html)
- Official Strudel integration (automatic dependency handling)
- Aggressive ASCII visualization (reused component)
- Pattern library dropdown
- Visual presets (Aggressive, Extreme, Subtle)
- Keyboard shortcuts (Ctrl+Enter, Ctrl+.)
- Direct audio routing

**Use Case:** Live performances (production-ready), reliability priority

---

## Technical Specifications

### Core Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Audio Engine** | Tone.js | ^15.0.4 | Web Audio synthesis framework |
| **Pattern Language** | Strudel | ^1.2.x | Tidal Cycles for browser |
| **Code Editor** | Monaco Editor | ^0.45.0 | VS Code editor component |
| **Visualization** | p5.js | ^2.1.1 | Creative coding framework |
| **Build Tool** | Vite | ^5.0.0 | Fast bundler and dev server |
| **Language** | TypeScript | ^5.3.0 | Type-safe JavaScript |

### Audio Architecture

```
User Code
    ↓
[Execution Sandbox]
    ↓
Tone.js Transport
    ↓
Instruments (Synth, Bass, Drums)
    ↓
Effects Chain (Distortion → BitCrusher → Delay → Reverb)
    ↓
Master Volume
    ↓
Tone.Destination (Master Output)
    ├→ Tone.FFT (Frequency Analysis, 256 bins)
    └→ Tone.Meter (Volume Analysis)
    ↓
Visualizer (p5.js ASCII Rendering)
```

### Performance Characteristics

- **Audio Latency:** ~10-30ms (browser Web Audio API)
- **Visual Framerate:** 60 FPS target
- **Code Execution:** Immediate (< 100ms)
- **Pattern Library Load:** < 500ms
- **Memory Footprint:** ~50-100MB (browser context)

---

## Feature Requirements

### Must-Have (P0)

- [x] Monaco Editor with syntax highlighting
- [x] Tone.js synthesis engine
- [x] Strudel pattern evaluation
- [x] Transport controls (play/pause/stop)
- [x] BPM control
- [x] Code execution with Cmd/Ctrl+Enter
- [x] Console logging
- [x] Audio visualizer
- [x] Sample library
- [x] Effects chain
- [x] Direct audio routing (visualizer)
- [x] Pattern library management
- [x] Keyboard shortcuts
- [x] Mode switching
- [x] Visual presets

### Should-Have (P1)

- [ ] MIDI controller support
- [ ] Pattern sharing via URL
- [ ] Recording/export functionality
- [ ] More visual modes (particles, mesh, WebGL)
- [ ] Syntax error highlighting in editor
- [ ] BPM detection and display
- [ ] Master effects controls (EQ, compression)
- [ ] Undo/redo for code editor
- [ ] Multiple pattern tabs

### Nice-to-Have (P2)

- [ ] Pop-out visualizer window (multi-display support)
- [ ] Collaborative editing (WebRTC)
- [ ] Cloud pattern storage
- [ ] Mobile/tablet optimization
- [ ] Plugin architecture for custom instruments
- [ ] Step sequencer view
- [ ] Piano roll visualization
- [ ] Spectral analyzer
- [ ] OSC (Open Sound Control) support

---

## User Stories

### Live Performer
**As a** live coding artist performing at an algorave,
**I want** aggressive visual reactions that are obvious to the audience,
**So that** people can see the connection between my code and the music.

**Acceptance Criteria:**
- Visual size changes of 2-6x on heavy bass
- Screen flashes on kicks
- Real-time color shifting based on frequency spectrum
- No audio routing setup required at venue

### Music Educator
**As a** university professor teaching Web Audio,
**I want** students to see immediate results from their code,
**So that** they understand synthesis concepts faster.

**Acceptance Criteria:**
- Code executes with one keyboard shortcut
- Console shows clear error messages
- Example patterns load in one click
- Documentation is comprehensive

### Electronic Musician
**As an** electronic music producer,
**I want** to quickly prototype generative patterns,
**So that** I can capture musical ideas before they fade.

**Acceptance Criteria:**
- Code to sound in under 2 seconds
- Pattern save/load functionality
- BPM sync with external DAW (future)
- Export patterns to WAV/MIDI (future)

### Experimenter
**As a** creative technologist,
**I want** to combine different synthesis approaches,
**So that** I can discover new sonic territories.

**Acceptance Criteria:**
- Switch between Tone.js and Strudel modes
- Mix imperative and declarative code
- Access raw Web Audio API
- Modify audio routing architecture

---

## Technical Constraints

### Browser Requirements
- **Minimum:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Optimal:** Latest Chrome/Edge (best Web Audio API support)
- **Required APIs:** Web Audio API, ES6 Modules, Canvas API

### Performance Targets
- **Code Execution:** < 100ms from keypress to sound
- **Visual Render:** 60 FPS sustained
- **Pattern Load:** < 500ms for 1KB pattern file
- **Memory:** < 150MB total footprint

### Security Considerations
- **Code Sandbox:** Execute user code in isolated context
- **No Server Access:** All computation client-side
- **Sample Origin:** Validate audio file sources
- **XSS Prevention:** Sanitize pattern library content

---

## Design Principles

### 1. Zero Setup Friction
- No installation, no audio routing, no configuration
- Works immediately after opening URL
- No account required, no cloud dependency

### 2. Live Performance First
- Every feature optimized for on-stage use
- Keyboard-driven workflow (mouse optional)
- Visual feedback for all state changes
- No hidden states or ambiguous UI

### 3. Progressive Complexity
- Simple examples work in 3 lines
- Advanced features discoverable through exploration
- Documentation provides multiple entry points
- Fail gracefully with clear error messages

### 4. Modular Architecture
- Components can be reused across apps
- Clean separation of concerns (audio, visual, UI)
- Easy to extend with new instruments/effects
- No framework lock-in

---

## Success Metrics

### Engagement
- **DAU/MAU Ratio:** > 0.3 (high retention)
- **Session Duration:** > 15 minutes average
- **Pattern Creation Rate:** > 2 patterns saved per session

### Performance
- **Page Load Time:** < 2 seconds
- **Time to First Sound:** < 3 seconds from page load
- **Error Rate:** < 5% of code executions
- **FPS Stability:** > 55 FPS for 95% of sessions

### Adoption
- **GitHub Stars:** Track community interest
- **Live Performance Usage:** Testimonials from algorave performers
- **Educational Adoption:** Usage in courses/workshops
- **Pattern Library Growth:** User-contributed patterns

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Browser audio latency | High | Medium | Document optimal browsers, use AudioWorklet |
| Monaco Editor bundle size | Medium | Low | Lazy load, CDN caching |
| Mobile performance | Medium | High | Scope as desktop-first, optimize later |
| Sample loading failures | High | Low | Graceful degradation, cache samples |

### User Experience Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Steep learning curve | High | Medium | Better onboarding, interactive tutorials |
| Visual fatigue (ASCII) | Low | Medium | Offer alternative visualizers |
| Pattern library overwhelm | Medium | Low | Categorization, search functionality |

---

## Release Roadmap

### Phase 1: Foundation (COMPLETE)
- [x] Tone.js interface with Monaco Editor
- [x] Basic transport controls
- [x] Sample library
- [x] Effects chain
- [x] Waveform visualizer

### Phase 2: Strudel Integration (COMPLETE)
- [x] Strudel pattern evaluation
- [x] Pattern library system
- [x] Example patterns
- [x] Strudel-specific interface

### Phase 3: Live Performance (COMPLETE)
- [x] Live Coding + Visualizer app
- [x] Aggressive ASCII visualization
- [x] Direct audio routing
- [x] Keyboard shortcuts
- [x] Mode switching
- [x] Visual presets

### Phase 4: Production Polish (COMPLETE)
- [x] Strudel + Viz app (clean, reliable)
- [x] Official @strudel/web integration
- [x] Comprehensive documentation
- [x] Multiple entry points

### Phase 5: Enhancement (NEXT)
- [ ] MIDI controller support
- [ ] Recording/export
- [ ] Pattern sharing URLs
- [ ] Improved error handling
- [ ] Syntax highlighting improvements

### Phase 6: Advanced Features (FUTURE)
- [ ] Collaborative editing
- [ ] Cloud pattern storage
- [ ] Plugin architecture
- [ ] Mobile optimization
- [ ] WebGL visualizations

---

## Documentation Requirements

### User-Facing Docs
- [x] Main README.md
- [x] Live Coding Quickstart
- [x] Live Coding Comprehensive Guide
- [x] Strudel + Viz README
- [x] Implementation Summary
- [x] Pattern Library README
- [ ] Video tutorials (YouTube)
- [ ] Interactive onboarding

### Developer Docs
- [x] Project structure overview
- [x] TypeScript type definitions
- [ ] API reference (auto-generated)
- [ ] Architecture decision records
- [ ] Contribution guidelines
- [ ] Plugin development guide

---

## Competitive Analysis

### vs. Sonic Pi
**Advantages:**
- Browser-based (no installation)
- Visual feedback built-in
- Immediate accessibility

**Disadvantages:**
- Less mature ecosystem
- No SuperCollider backend
- Limited offline support

### vs. TidalCycles
**Advantages:**
- Lower barrier to entry
- Integrated visualization
- No Haskell/GHCi setup

**Disadvantages:**
- Strudel is newer, less patterns available
- Smaller community
- Some TidalCycles features missing

### vs. Max/MSP, Pure Data
**Advantages:**
- Free and open source
- Code-first (vs. patching)
- Web-based collaboration potential

**Disadvantages:**
- Less visual programming
- Smaller object library
- No native audio plugins

### vs. Web-based DAWs (Soundtrap, BandLab)
**Advantages:**
- Code-based workflow
- Lower latency
- Live coding optimized

**Disadvantages:**
- Steeper learning curve
- No traditional DAW features
- No multitrack recording (yet)

---

## Open Questions

1. **MIDI Integration:** Should we prioritize MIDI input (controller) or output (sync with DAW)?
2. **Recording:** Local WAV export or cloud-based rendering?
3. **Collaboration:** Real-time (WebRTC) or asynchronous (pattern sharing)?
4. **Mobile Support:** Native mobile apps or responsive web optimization?
5. **Monetization:** Remain free/open-source or offer premium features?
6. **Community:** Self-hosted pattern library or integrate with existing platforms?

---

## Dependencies

### Runtime Dependencies
```json
{
  "@strudel/core": "^1.2.5",
  "@strudel/mini": "^1.2.5",
  "@strudel/repl": "^1.2.7",
  "@strudel/soundfonts": "^1.2.6",
  "@strudel/tonal": "^1.2.5",
  "@strudel/transpiler": "^1.2.5",
  "@strudel/webaudio": "^1.2.6",
  "monaco-editor": "^0.45.0",
  "p5": "^2.1.1",
  "tone": "^15.0.4"
}
```

### Development Dependencies
```json
{
  "typescript": "^5.3.0",
  "vite": "^5.0.0",
  "vite-plugin-monaco-editor": "^1.1.0"
}
```

---

## Appendices

### Appendix A: Keyboard Shortcuts Reference

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd/Ctrl + Enter` | Execute code | All modes |
| `Space` | Play/Pause | Transport controls |
| `Escape` | Stop | Transport controls |
| `Ctrl + .` | Stop | Strudel apps |
| `Ctrl + S` | Save pattern | Live Coding app |
| `Ctrl + E` | Toggle editor fullscreen | Live Coding app |
| `Ctrl + O` | Load pattern | Live Coding app |
| `Ctrl + D` | Duplicate pattern | Live Coding app |
| `?` | Toggle help | Live Coding app |

### Appendix B: Sample Library Inventory

```
samples/
├── bass/ (8 files)
├── hat/ (8 files)
├── kick/ (8 files)
├── pad/ (6 files)
├── snare/ (8 files)
└── tom/ (8 files)
```

**Total:** 46 WAV files, ~15MB

### Appendix C: Pattern Library

```
patterns/
├── strudel/
│   ├── berlin-techno.strudel
│   ├── der-der-v1.strudel
│   ├── der-der-v2.strudel
│   ├── industrial-157.strudel
│   ├── industrial-157-advanced.strudel
│   └── techno-roland.strudel
└── tonejs/
    ├── basic-melody.js
    ├── drum-pattern.js
    └── bassline.js
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Nov 2024 | Initial PRD based on existing codebase |

---

## Approval

**Product Owner:** TBD
**Technical Lead:** TBD
**Stakeholders:** Live coding community, electronic musicians, educators

---

**Document Status:** Draft
**Next Review:** TBD
**Maintainer:** Project Team
