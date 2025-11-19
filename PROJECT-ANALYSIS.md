# UNISEX XL - Project Analysis

**Analysis Date:** November 18, 2024  
**Project Type:** Live Coding Music Web Application  
**Primary Focus:** Industrial/Berlin Techno Production

---

## 🎵 Overview

UNISEX XL is a **dual-purpose live coding music web application** that combines two powerful audio frameworks in a single browser-based environment. The project serves as a comprehensive music production laboratory, particularly focused on creating industrial and Berlin-style techno music.

### Core Capabilities

1. **Tone.js Interface** - Traditional synthesis and sample-based composition
2. **Strudel Interface** - Tidal Cycles-inspired pattern language
3. **Custom Sample Loading** - Integration of personal drum kits
4. **Advanced Visualizations** - Real-time visual feedback for patterns
5. **Live Performance** - Real-time parameter manipulation with sliders

---

## 📊 Project Structure

```
unisex-xl/
├── 🎹 Audio Interfaces
│   ├── index.html          → Tone.js live coding interface
│   └── strudel.html        → Strudel live coding interface (primary)
│
├── 🎨 Source Code (TypeScript)
│   └── src/
│       ├── main.ts                → Tone.js entry point
│       ├── strudel-main.ts        → Strudel entry point
│       ├── components/
│       │   ├── editor.ts          → Monaco Editor setup
│       │   └── visualizer.ts      → Audio visualization engine
│       ├── utils/
│       │   ├── audioEngine.ts     → Tone.js audio management
│       │   ├── strudelEngine.ts   → Strudel pattern engine
│       │   ├── codeExecutor.ts    → Safe code execution sandbox
│       │   └── examples.ts        → Example code library
│       ├── types/
│       │   └── index.ts           → TypeScript definitions
│       └── styles/
│           └── main.css           → Application styling
│
├── 🎼 Music Patterns
│   └── patterns/
│       ├── strudel/               → Strudel-specific patterns
│       ├── tonejs/                → Tone.js patterns
│       ├── berlin-techno-0.1      → Industrial techno (157 BPM)
│       ├── berlin-techno.dart     → Berlin style variation
│       ├── visualizers-experimentations → Visual showcase
│       ├── industrial-pattern.md  → Pattern documentation
│       ├── chord-layer-progression → Harmonic experiments
│       ├── samples.md             → Sample loading guide
│       └── [various experimental tracks]
│
├── 🥁 Custom Sample Library
│   └── samples/
│       ├── kick/     → Kit01_Kick.wav
│       ├── snare/    → Kit01_Snare.wav
│       ├── hat/      → Kit01_Hat.wav
│       ├── bass/     → Kit01_Bass.wav
│       ├── pad/      → Kit01_SynthPad.wav
│       └── tom/      → Kit01_tom.wav
│
└── ⚙️ Configuration
    ├── package.json              → Dependencies & scripts
    ├── tsconfig.json             → TypeScript config
    ├── vite.config.ts            → Vite build config
    └── .gitignore               → Git exclusions
```

---

## 🎯 Musical Direction

### Genre Focus: Industrial/Berlin Techno

The project is heavily oriented toward creating dark, aggressive techno music in the Berlin/industrial style.

#### Musical Characteristics:
- **Tempo:** 157 BPM (0.654 CPS in Strudel)
- **Key Centers:** A minor, B minor
- **Sound Design:** Heavy filtering, bit crushing, aggressive distortion
- **Influences:** Berlin clubs (Berghain aesthetic), Attack Magazine techniques

#### Key Tracks in Development:

**1. `berlin-techno-0.1` - Industrial Pattern**
```javascript
// 157 BPM industrial techno
// Features:
- Filtered bass with heavy bit crushing
- Aggressive kick with filtering
- Distorted snare
- Noise hi-hats
- Atmospheric pad with slow sweep
```

**2. `visualizers-experimentations` - Visual Showcase**
```javascript
// Pushing visualization limits
// Features:
- Spiral kick animations (logarithmic)
- Vertical matrix-style bass (Matrix code effect)
- Color-coded piano rolls
- Euclidean rhythm visualizations
- Real-time oscilloscope & spectrum analyzer
```

**3. `chord-layer-progression` - Harmonic Experiments**
```javascript
// Chord progression studies
// Features:
- Bm → D progressions
- Piano voicings with .voicing()
- Interactive sliders for live tweaking
- Stereo width with .jux(rev)
```

---

## 🛠️ Technology Stack

### Frontend Framework
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Ultra-fast dev server & build tool
- **Monaco Editor** - VS Code editor component in browser
- **Vanilla JS** - No heavy framework overhead

### Audio Engines

#### Tone.js Stack
- **Tone.js v15.0.4** - Synthesis & scheduling framework
- **Web Audio API** - Low-level audio processing
- **Built-in Instruments:**
  - Polyphonic synthesizer
  - Monophonic bass synth
  - Membrane drum synth
- **Effects Chain:**
  - Reverb → Delay → Distortion → Bit Crusher

#### Strudel Stack
- **@strudel/core v1.2.5** - Pattern language core
- **@strudel/mini v1.2.5** - Mini-notation parser
- **@strudel/webaudio v1.2.6** - Web Audio integration
- **Tidal Cycles Patterns** - Euclidean rhythms, transformations

### Visualization
- Custom punchcard/pianoroll renderers
- Real-time oscilloscope (time domain)
- Spectrum analyzer (frequency domain)
- Pitch wheel (circular note display)
- Spiral visualizations

---

## 🎨 Custom Sample Integration

### Kit01 Drum Kit

The project includes a professionally organized drum kit:

| Sample Type | File | Characteristics |
|-------------|------|----------------|
| **Kick** | Kit01_Kick.wav | 84.8 KB, punchy attack |
| **Snare** | Kit01_Snare.wav | 84.8 KB, aggressive snap |
| **Hat** | Kit01_Hat.wav | 22.2 KB, crisp high-end |
| **Bass** | Kit01_Bass.wav | 1.35 MB, long sustain |
| **Pad** | Kit01_SynthPad.wav | 1.35 MB, atmospheric |
| **Tom** | Kit01_tom.wav | 43.0 KB, percussive |

### Strudel Integration

Samples are organized in the Strudel-required folder structure:
```
samples/
├── kick/Kit01_Kick.wav      → s("kick")
├── snare/Kit01_Snare.wav    → s("snare")
├── hat/Kit01_Hat.wav        → s("hat")
└── [etc...]
```

Each subfolder name becomes the sample name in Strudel code.

---

## 🎼 Production Techniques

### Influenced by "The Secrets of Techno Production" (Attack Magazine)

The project follows professional techno production principles:

#### 1. **Gain Staging**
- Kick: Loudest (1.0+)
- Bass: Just below kick (0.75-0.9)
- Snare: Secondary (0.7)
- Hats: Background (0.3-0.4)
- Effects: Controlled levels

#### 2. **Frequency Separation**
- Kick: Tight LPF (120-200 Hz for punch)
- Bass: HPF at 35 Hz + LPF at 400-800 Hz
- Hats: Aggressive HPF (3000-8000 Hz)
- Each element occupies distinct frequency space

#### 3. **Layering Techniques**
- TR-909 (punch) + TR-808 (sub-bass weight)
- Multiple bass layers with different filtering
- Stacked synths for rich textures

#### 4. **Effects Philosophy**
- Minimal reverb on drums (0.1-0.2)
- Heavy saturation on bass (0.4-0.7)
- Bit crushing for digital grit
- Controlled delay for space

#### 5. **Berlin Techno Characteristics**
- High resonance + low LPF for squelchy bass
- Tight, rolling 16th note patterns
- Minimal, hypnotic structures
- Dry sound (minimal reverb)
- Heavy compression via saturation

---

## 🎹 Code Examples

### Strudel Pattern (Primary Language)

```javascript
// Industrial techno pattern
setcps(0.654) // 157 BPM

stack(
  // Bass - aggressive filtered
  note("a1 [a1 a2] a1 [a2 a1] a1 [e2 a1] [g1 a1] [a1 a2]")
    .s("sawtooth")
    .slow(2)
    .lpf(slider(400, 150, 800))
    .resonance(slider(15, 10, 20))
    .shape(slider(0.5, 0.3, 0.7))
    .crush(slider(8, 6, 12)),
  
  // Kick - layered for depth
  s("kick ~ kick ~")
    .gain(1.8)
    .lpf(3000)
    .shape(0.3),
  
  // Visualize with punchcard
  s("kick ~ kick ~")
    ._punchcard({
      labels: 1,
      cycles: 2,
      active: "#FF0000",
      fillActive: 1
    })
)
```

### Tone.js Pattern (Alternative)

```javascript
// Melodic sequence
const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '8n', time);
}, ['C4', 'E4', 'G4', 'B4'], '4n');

melody.start(0);
Transport.start();
```

---

## 📈 Current Development State

### ✅ Completed Features

- [x] Dual framework integration (Tone.js + Strudel)
- [x] Custom sample loading system
- [x] Sample folder reorganization for Strudel
- [x] Advanced visualization suite
- [x] Multiple working techno patterns
- [x] Professional mixing techniques applied
- [x] Git repository initialized
- [x] Development server configured
- [x] TypeScript compilation setup

### 🚧 In Progress

- [ ] File extension standardization (.dart → .strudel, .js)
- [ ] Pattern library organization
- [ ] Additional sample packs
- [ ] More complex arrangements

### 💡 Future Possibilities

- [ ] MIDI controller integration
- [ ] Pattern recording/export
- [ ] Collaboration features
- [ ] Sample editor/slicer
- [ ] More drum machine banks (808, 606, 707)
- [ ] Effect preset system
- [ ] Pattern sharing/export

---

## 🚀 How to Run

### Development Server

```bash
cd /Users/miguelarias/Code/unisex-xl
npm install
npm run dev
```

**Access at:** http://localhost:5173

### Available URLs
- **Tone.js Interface:** http://localhost:5173/
- **Strudel Interface:** http://localhost:5173/strudel.html

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎛️ Workflow

### Typical Session

1. **Open Strudel Interface** (http://localhost:5173/strudel.html)
2. **Import Custom Samples** (samples folder via UI)
3. **Write Pattern** using mini-notation
4. **Add Effects** with sliders for live tweaking
5. **Visualize** with punchcard/pianoroll
6. **Save Pattern** to patterns/ folder
7. **Iterate** and refine

### Live Coding Process

```javascript
// Start simple
s("kick ~ kick ~")

// Add complexity
s("kick ~ kick ~, ~ snare ~ snare")

// Layer bass
s("kick ~ kick ~, ~ snare ~ snare").stack(
  note("a1 e2 a1 d2").s("bass")
)

// Add effects & visualize
s("kick ~ kick ~")
  .lpf(slider(800, 200, 2000))
  .shape(slider(0.5, 0, 1))
  ._punchcard({labels: 1, cycles: 2})
```

---

## 🎓 Learning Resources Applied

### Books & Guides
- **"The Secrets of Techno Production"** by Attack Magazine
  - Mixing techniques
  - Frequency separation
  - Layering strategies
  - Berlin techno aesthetics

### Documentation
- [Strudel Documentation](https://strudel.cc/learn/)
- [Tone.js API](https://tonejs.github.io/)
- [Tidal Cycles Patterns](https://tidalcycles.org/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 🎯 Project Purpose

UNISEX XL serves as:

1. **Creative Laboratory** - Experimentation with live coding patterns
2. **Learning Platform** - Applying professional production techniques
3. **Performance Tool** - Live techno performance in browser
4. **Production Environment** - Creating complete techno tracks
5. **Visual Instrument** - Combining audio with real-time visualizations

---

## 🏆 Notable Achievements

### Technical
- ✅ Integrated two major audio frameworks seamlessly
- ✅ Created custom sample loading system
- ✅ Implemented advanced visualizations
- ✅ Built type-safe TypeScript architecture

### Musical
- ✅ Developed signature industrial techno sound
- ✅ Applied professional mixing techniques
- ✅ Created reusable pattern library
- ✅ Mastered Strudel mini-notation

### Workflow
- ✅ Established efficient live coding process
- ✅ Organized sample library properly
- ✅ Version controlled with Git
- ✅ Documented patterns and techniques

---

## 📝 Notes

### File Extensions Used
- `.dart` - Currently used (incorrect, Dart language)
- `.js` - Standard for JavaScript/Tone.js
- `.strudel` - Recommended for Strudel patterns
- `.md` - Markdown documentation

**Recommendation:** Rename `.dart` files to appropriate extensions.

### Sample Organization
Original flat structure caused loading issues. Reorganized to:
```
✓ samples/kick/Kit01_Kick.wav
✗ samples/Kit01_Kick.wav
```

This follows Strudel's required folder structure where subfolder names become sample identifiers.

---

## 🎨 Aesthetic & Vision

**UNISEX XL** represents a fusion of:
- 🏭 Industrial/Berlin techno aesthetics
- 💻 Live coding culture
- 🎨 Visual feedback and interaction
- 🔊 Professional audio production
- ⚡ Real-time performance capabilities

The project embodies the **dark, hypnotic, and minimal** characteristics of Berlin underground techno while maintaining the **experimental and improvisational** spirit of live coding.

---

## 📊 Statistics

- **Total Patterns:** 16+
- **Custom Samples:** 6 (Kit01 drum kit)
- **Code Files:** 20+ TypeScript/JavaScript files
- **Dependencies:** 30+ npm packages
- **Supported Formats:** Strudel mini-notation, Tone.js, plain JavaScript
- **Visualization Types:** 5 (punchcard, pianoroll, scope, spectrum, spiral)

---

## 🔗 Links & Resources

- **Strudel:** https://strudel.cc
- **Tone.js:** https://tonejs.github.io
- **Tidal Cycles:** https://tidalcycles.org
- **Attack Magazine:** https://www.attackmagazine.com

---

**Last Updated:** November 18, 2024  
**Status:** Active Development  
**License:** MIT

