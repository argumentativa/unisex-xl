# UNISEX XL - Live Coding Music Application

A browser-based live coding music application that allows you to create electronic music by writing code in real-time.

## Core Purpose

UNISEX XL is a web application for creating music through code, featuring two powerful audio frameworks:

1. **Tone.js** - Full-featured Web Audio synthesis framework
2. **Strudel** - Pattern-based music notation system (used in algorave/live coding scenes)

## Key Features

### Live Coding Environment

- **Monaco Editor** - VS Code's editor component with syntax highlighting and IntelliSense
- **Write & Execute** - JavaScript/TypeScript code that generates music patterns
- **Instant Feedback** - Execute code with `Cmd/Ctrl + Enter` and hear results instantly
- **Real-time Modification** - Change code while music is playing for live performances

### Audio Engine

**Instruments:**
- Polyphonic synthesizer (synth)
- Monophonic bass synthesizer (bass)
- Membrane synthesizer for percussion (drums)

**Effects Chain:**
```
Instruments → Distortion → Bit Crusher → Delay → Reverb → Master Volume → Output
```

**Audio Features:**
- Transport controls (play/pause/stop)
- BPM control (60-200 BPM)
- Individual instrument volume control
- Real-time effect parameter adjustment
- Pre-loaded audio samples (kick, snare, hat, bass, tom, pad)

### Visual Interface

- **Split-panel Layout** - Code editor on left, controls on right
- **Real-time Visualizer** - Waveform display showing audio output
- **Console** - Logs, errors, and execution feedback
- **Theme Toggle** - Dark/light mode support
- **Responsive Design** - Works on desktop and tablets

### Keyboard Shortcuts

- `Cmd/Ctrl + Enter` - Execute code
- `Space` - Play/Pause transport
- `Escape` - Stop transport

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd /Users/miguelarias/Code/unisex-xl
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Type Checking

```bash
npm run type-check
```

## How to Use

### Basic Workflow

1. **Write Code** - Use the Monaco editor to write Tone.js or Strudel code
2. **Execute** - Click "Run" button or press `Cmd/Ctrl + Enter`
3. **Control Playback** - Use play/pause/stop buttons
4. **Adjust Parameters** - Modify BPM, effects, and instrument volumes in real-time
5. **Monitor** - Watch the visualizer and console for feedback

### Example Patterns

Click "Load Example" to load random example code.

#### Basic Melody (Tone.js)
```javascript
// Create a simple melodic sequence
const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '8n', time);
}, ['C4', 'E4', 'G4', 'B4', 'A4', 'F4', 'D4', 'C4'], '4n');

melody.start(0);
```

#### Drum Pattern (Tone.js)
```javascript
// Create a basic drum beat
const kick = new Tone.Loop((time) => {
  drums.triggerAttackRelease('C1', '8n', time);
}, '4n');

kick.start(0);
```

#### Bass Line (Tone.js)
```javascript
// Create a bassline pattern
const bassPattern = new Tone.Pattern((time, note) => {
  bass.triggerAttackRelease(note, '8n', time);
}, ['C2', 'C2', 'G2', 'F2'], 'upDown');

bassPattern.start(0);
```

#### Strudel Pattern
```javascript
// Strudel's concise notation
s("bd ~ bd ~")
  .bank("RolandTR909")
  .gain(0.7)
  .lpf(120)
```

### Available Objects (Tone.js Mode)

- `Tone` - Full Tone.js library
- `Transport` - Tone.js Transport for timing
- `synth` - Polyphonic synthesizer instance
- `bass` - Bass synthesizer instance
- `drums` - Drum synthesizer instance
- `console` - Console for logging (log, error, warn)

## Project Structure

```
unisex-xl/
├── src/
│   ├── components/
│   │   ├── editor.ts         # Monaco Editor setup
│   │   └── visualizer.ts     # Audio visualization
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── audioEngine.ts    # Tone.js audio management
│   │   ├── strudelEngine.ts  # Strudel integration
│   │   ├── codeExecutor.ts   # Code execution sandbox
│   │   └── examples.ts       # Example code snippets
│   ├── styles/
│   │   └── main.css          # Application styles
│   ├── main.ts               # Tone.js entry point
│   └── strudel-main.ts       # Strudel entry point
├── samples/                   # Audio samples (.wav)
│   ├── bass/
│   ├── hat/
│   ├── kick/
│   ├── pad/
│   ├── snare/
│   └── tom/
├── tracks/                    # Example patterns
│   ├── berlin-techno.dart
│   ├── chord-layer-progression
│   └── ...
├── index.html                 # Tone.js interface
├── strudel.html              # Strudel interface
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

## Use Cases

- **Live Coding Performances** - Write and modify music code in real-time during performances
- **Music Experimentation** - Test synthesis ideas and patterns quickly
- **Learning** - Understand Web Audio API and music programming concepts
- **Prototyping** - Sketch musical ideas programmatically before production

## Tech Stack

- **TypeScript** - Type-safe JavaScript for reliability
- **Tone.js** - Web Audio framework for music synthesis
- **Strudel** - Pattern-based music notation system
- **Monaco Editor** - VS Code's powerful code editor
- **Vite** - Fast build tool and development server
- **Vanilla JavaScript** - No framework overhead for optimal performance

## Advanced Usage

### Combining Multiple Instruments

```javascript
// Layer instruments for rich textures
const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '16n', time);
}, ['C4', 'E4', 'G4', 'E4'], '8n');

const bassline = new Tone.Loop((time) => {
  bass.triggerAttackRelease('C2', '4n', time);
}, '2n');

melody.start(0);
bassline.start(0);
```

### Precise Timing with Transport

```javascript
// Use Tone.js scheduling for precise timing
Transport.scheduleRepeat((time) => {
  synth.triggerAttackRelease('C4', '8n', time);
}, '4n');
```

## Troubleshooting

### Audio Not Playing
- Click anywhere on the page first (browser requirement for audio context)
- Check that instruments are enabled in the UI
- Verify transport is playing (press Play button)
- Check browser console for errors

### Code Errors
- Check the in-app console for error messages
- Ensure proper Tone.js syntax
- Verify instrument names: `synth`, `bass`, `drums`
- Make sure to start sequences/loops with `.start(0)`

### Performance Issues
- Reduce number of simultaneous sequences
- Simplify complex patterns
- Lower effect values (reverb, delay can be CPU-intensive)
- Check CPU usage in browser task manager

## Production Guides

### Internal Documentation
- **[Attack Magazine Guide](docs/ATTACK-MAGAZINE-GUIDE.md)** - Comprehensive sound design and mixing techniques
- **[Quick Reference Card](docs/QUICK-REFERENCE.md)** - Essential parameters and settings for live coding
- **[Project Analysis](PROJECT-ANALYSIS.md)** - Complete project breakdown and architecture

### External Resources
- [Tone.js Documentation](https://tonejs.github.io/)
- [Tone.js Examples](https://tonejs.github.io/examples/)
- [Strudel Documentation](https://strudel.cc/learn/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Attack Magazine](https://www.attackmagazine.com/technique/)

## License

MIT

## Author

Built as a live coding music application for browser-based music creation and experimentation.
