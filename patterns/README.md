# UNISEX XL Patterns

This folder contains visual patterns, musical patterns, and compositions for P5.js, Tone.js and Strudel live coding modes.

## 📁 Folder Structure

```
patterns/
├── p5/                   # P5.js visual patterns & demos ⭐ NEW
│   ├── image-ascii/      # Image-based ASCII art demos (10 variations)
│   ├── video-ascii/      # Webcam ASCII art demos (3 variations)
│   ├── strudel-demos/    # Strudel integration demos
│   ├── audio-reactive/   # Audio-reactive patterns
│   ├── circles/          # Circles pattern
│   ├── faces/            # Face detection pattern
│   ├── snore/            # Video pattern example
│   ├── misc/             # Experimental demos
│   └── demos-legacy/     # Legacy demo files
├── strudel/              # Strudel mini-notation patterns
│   ├── techno/           # Techno and industrial patterns
│   ├── experimental/     # Experimental compositions
│   ├── der-der/          # Der-der track versions
│   ├── track-1/          # Track 1 strudel patterns
│   └── demos/            # Strudel demo files
└── tonejs/               # Tone.js JavaScript patterns
    ├── techno/           # Techno Tone.js translations
    ├── dnb/              # Drum & Bass patterns
    └── track-1-archive/  # Legacy track variations
```

## 🎨 P5.js Visual Patterns ⭐ NEW

All P5.js demos and patterns are now consolidated in `patterns/p5/`. Browse all demos at [patterns/p5/index.html](p5/index.html).

### Image ASCII Art (`p5/image-ascii/`)
10 variations of image-based ASCII art with audio reactivity:
- **image-ascii.html** - Basic monochrome ASCII
- **image-ascii-color.html** - Color ASCII
- **image-ascii-color-bold.html** - Bold + audio reactive ⭐
- **image-ascii-color-bold-mic.html** - Microphone input 🎤
- **image-ascii-color-bold-OPTIMIZED.html** - Performance optimized ⭐
- **image-ascii-color-bold-OPTIMIZED-autostart.html** - Auto-start for live performances 🎭
- **image-ascii-color-bold-strudel.html** - Strudel integration 🎵
- **man.html** - Portrait visualization
- **unai.html** - Portrait visualization
- **test-audio-devices.html** - Audio device testing

### Video ASCII Art (`p5/video-ascii/`)
Webcam-based ASCII art patterns:
- **index.html** - Video ASCII pattern (original)
- **video-ascii.html** - Basic webcam ASCII
- **video-ascii-bold.html** - Bold enhanced contrast

### Strudel Integration (`p5/strudel-demos/`)
Live coding + visualization demos:
- **demo-with-strudel.html** - Full split-screen: Strudel editor + ASCII visualizer (Industrial Techno 157 BPM) ⭐
- **test-tonejs.html** - Tone.js integration test

### Pattern Examples
- **audio-reactive/** - Audio-reactive circles pattern
- **circles/** - Simple circles pattern
- **faces/** - Face detection pattern
- **snore/** - Video playback pattern
- **misc/** - Experimental demos
- **demos-legacy/** - Legacy demo files

## 🎵 Strudel Patterns

### Techno (`strudel/techno/`)
- **berlin-techno.strudel** - Berlin-style techno with layered kicks (TR-909 + TR-808)
- **industrial-157bpm.strudel** - Industrial techno at 157 BPM (0.654 CPS)
- **industrial-157bpm-advanced.strudel** - Advanced mix with Attack Magazine + Steve Savage principles
- **techno-roland.strudel** - Roland-inspired techno groove
- **industrial-pattern.md** - Documentation for industrial patterns

### Experimental (`strudel/experimental/`)
- **chord-layer-progression.strudel** - Chord progressions and layering
- **visualizers.strudel** - Visual programming experiments

### Der-der (`strudel/der-der/`)
- **v1.strudel** - First version using Strudel syntax
- **v2.strudel** - Enhanced version with custom samples
- **v1.js** - JavaScript hybrid version

### Track 1 (`strudel/track-1/`)
- **em-202bpm-dnb.js** - Drum & Bass pattern at 202 BPM

## 🎹 Tone.js Patterns

### Techno (`tonejs/techno/`) ⭐ NEW
Professional Tone.js translations of Strudel patterns:

- **berlin-techno-tonejs.js** - Berlin techno with layered kicks (909+808)
  - 7 instruments with full effect chains
  - 30+ interactive controls (filters, delays, panning)
  - Attack Magazine mixing techniques
  - Real-time parameter adjustment

- **industrial-157bpm-tonejs.js** - Industrial techno at 157 BPM
  - 9 layered instruments (kick, bass, snare, hats, lead, pad, stabs)
  - Attack Magazine + Steve Savage mixing principles
  - Strategic frequency management
  - Interactive sliders for live control

### Drum & Bass (`tonejs/dnb/`)
- **em-202bpm-dnb.js** - High-energy DnB at 202 BPM

### Legacy (`tonejs/track-1-archive/`)
Earlier experimental versions and learning exercises:
- **basic.js** - Basic Tone.js pattern with sequences
- **basic-mixed-principles.js** - Early mixing experiments
- **advanced-mixed-principles-webapp.js** - Web app version
- **with-sliders.js** - Interactive pattern controlled by UI sliders
- **hybrid.js** - Combination of Tone.js and Strudel concepts
- **hybrid-documented.js** - Well-documented hybrid approach
- **IMPROVEMENTS.md** - Development notes
- **TRACKS_ANALYSIS.md** - Analysis of track variations

## 📝 File Naming Conventions

### Strudel Files
- **Extension**: `.strudel` for Strudel mini-notation code
- **Format**: `descriptive-name.strudel`
- **Example**: `berlin-techno.strudel`

### Tone.js Files
- **Extension**: `.js` for JavaScript code
- **Format**: `descriptive-name-tonejs.js` (for translations)
- **Example**: `berlin-techno-tonejs.js`

### Documentation Files
- **Extension**: `.md` for Markdown documentation
- **Format**: `descriptive-name.md`
- **Example**: `industrial-pattern.md`

### Version Suffixes
When creating multiple versions of the same pattern:
- Use `-v1`, `-v2`, `-v3` etc.
- Or use semantic names: `-basic`, `-advanced`, `-final`

## 🏷️ Pattern Metadata Format

Each pattern should include header comments with metadata:

### Strudel Pattern Template
```javascript
// ========================================
// Title: Industrial Techno
// BPM: 157
// CPS: 0.654
// Key: B minor
// Genre: Industrial Techno
// Description: Heavy industrial techno with distorted bass
// ========================================

setcps(0.654)

stack(
  // Your pattern here
)
```

### Tone.js Pattern Template
```javascript
// ========================================
// Title: Berlin Techno
// BPM: 157
// Genre: Techno
// Description: Berlin-style techno with layered kicks
// Techniques: Attack Magazine layering (909+808)
// ========================================

import * as Tone from 'tone';

Tone.Transport.bpm.value = 157;

// Your pattern here
```

## 🔧 How to Use Patterns

### Loading in Tone.js Mode
1. Open `index.html` in your browser
2. Import pattern from `tonejs/` folder
3. Call exported functions like `start()`, `stop()`
4. Use setter functions for real-time control

### Loading in Strudel Mode
1. Open `strudel.html` in your browser
2. Copy pattern code from `strudel/` folder
3. Paste into the editor
4. Press **Run** or `Cmd/Ctrl+Enter`

## 🎼 Pattern Categories

### Techno
Fast-paced electronic music with 4/4 kick drums, typically 120-157 BPM. Features:
- Layered kicks (909 for punch, 808 for sub)
- Aggressive filtering and distortion
- Minimal reverb on drums
- Strategic frequency separation

### Industrial
Aggressive, distorted sounds with heavy processing, typically 150-170 BPM. Features:
- Heavy saturation and bit crushing
- High resonance filters
- Dark, aggressive timbres
- Berlin techno influence

### Experimental
Patterns exploring unusual techniques, generative algorithms, or sound design.

### Drum & Bass (DnB)
High-energy breakbeats at 160-180 BPM with heavy sub-bass.

## 🎛️ Tone.js Interactive Controls

The new Tone.js techno patterns include extensive real-time controls:

```javascript
// Example: Berlin Techno
import { 
  start, 
  setKick909LPF,
  setBassLPF,
  setStabsDelay,
  setMasterGain 
} from './tonejs/techno/berlin-techno-tonejs.js';

await start();
setKick909LPF(150);   // Tighten kick (80-200 Hz)
setBassLPF(600);      // Open bass filter (250-800 Hz)
setStabsDelay(0.3);   // Add delay (0-0.4)
setMasterGain(0.85);  // Master volume (0.6-0.9)
```

## 📚 Learning Resources

### Mixing Principles Applied
Both new Tone.js patterns follow professional mixing techniques:

#### Attack Magazine Principles
- Kick loudest (1.0+ gain)
- Bass below kick (0.7-0.9 gain)
- HPF on all non-bass elements
- Snare emphasis at 2-5 kHz
- Quiet hi-hats (0.3-0.4 gain)
- Minimal reverb on drums
- Master gain at 0.8-0.85 (headroom)

#### Steve Savage Principles
- "Cut, don't boost" - HPF before adding effects
- "Bass presence" - 1 kHz for audibility
- "Stereo interest" - Panning for width
- "Less is more" - Strategic filtering

### External Resources
- [Strudel Documentation](https://strudel.tidalcycles.org/)
- [Tone.js Documentation](https://tonejs.github.io/)
- [Attack Magazine - Mixing Techno](https://www.attackmagazine.com/)
- [TidalCycles Patterns](https://tidalcycles.org/docs/patternlib/tutorials/pattern)

## 🤝 Contributing Patterns

When adding new patterns:

1. **Choose the right folder** - `strudel/` or `tonejs/`
2. **Use proper file extensions** - `.strudel` or `.js`
3. **Include metadata** - Title, BPM, key, genre, techniques
4. **Add comments** - Explain complex sections
5. **Test thoroughly** - Ensure pattern plays without errors
6. **Document parameters** - Note any custom controls or effects
7. **Follow naming conventions** - Use descriptive names with hyphens

## 📊 Pattern Statistics

- **Total Patterns**: 20+
  - Strudel: 10+ files
  - Tone.js: 10+ files
- **Genres**: Techno, Industrial, Experimental, Drum & Bass
- **BPM Range**: 120-202 (techno to DnB)
- **New Tone.js Translations**: 2 professional patterns with 30+ controls each

## 🔗 Related Files

- `/samples/` - Audio samples used in patterns (TR-909, TR-808, etc.)
- `/src/utils/examples.ts` - Built-in example patterns
- `/docs/` - Comprehensive documentation on Strudel and Tone.js

## ✨ Recent Updates

### November 2024
- ✅ Reorganized folder structure for clarity
- ✅ Added `tonejs/techno/` folder for professional translations
- ✅ Created `berlin-techno-tonejs.js` (7 instruments, 30+ controls)
- ✅ Created `industrial-157bpm-tonejs.js` (9 instruments, full mix principles)
- ✅ Moved legacy files to `track-1-archive/`
- ✅ Fixed file extensions (moved Strudel files from .js to .strudel)
- ✅ Updated README with new structure and usage examples
