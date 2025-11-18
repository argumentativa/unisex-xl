# UNISEX XL - Live Coding Music Web Application

A browser-based live coding music application built with Tone.js. Write pattern-based music code that plays in real-time with seamless live updates.

## Features

### Live Coding Environment
- **Monaco Editor**: Full-featured code editor with syntax highlighting and IntelliSense
- **Real-time Execution**: Write Tone.js code and hear results instantly
- **Pattern-based Composition**: Create musical patterns using sequences, loops, and patterns
- **Example Library**: Load pre-built examples to learn and experiment

### Audio Engine
- **Multiple Instruments**:
  - Synth (Polyphonic synthesizer)
  - Bass (Monophonic bass synthesizer)
  - Drums (Membrane synthesizer for percussion)
- **Audio Effects**:
  - Reverb - Add spatial depth
  - Delay - Echo effects
  - Distortion - Drive and overdrive
  - Bit Crusher - Lo-fi digital distortion
- **Transport Controls**: Play, pause, stop with visual feedback
- **BPM Control**: Adjust tempo from 60-200 BPM in real-time

### User Interface
- **Split-panel Layout**: Code editor on left, controls on right
- **Audio Visualizer**: Real-time waveform display
- **Console Output**: View logs, errors, and execution feedback
- **Dark/Light Theme**: Toggle between color schemes
- **Responsive Design**: Works on desktop and tablets

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

1. **Write Code**: Use the Monaco editor to write Tone.js code
2. **Execute**: Click "Run" button or press `Cmd/Ctrl + Enter`
3. **Control Playback**: Use play/pause/stop buttons
4. **Adjust Parameters**: Modify BPM, effects, and instrument volumes
5. **Monitor**: Watch the visualizer and console for feedback

### Example Patterns

Click "Load Example" to load random example code. Examples include:

#### Basic Melody
```javascript
// Create a simple melodic sequence
const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '8n', time);
}, ['C4', 'E4', 'G4', 'B4', 'A4', 'F4', 'D4', 'C4'], '4n');

melody.start(0);
```

#### Drum Pattern
```javascript
// Create a basic drum beat
const kick = new Tone.Loop((time) => {
  drums.triggerAttackRelease('C1', '8n', time);
}, '4n');

kick.start(0);
```

#### Bass Line
```javascript
// Create a bassline pattern
const bassPattern = new Tone.Pattern((time, note) => {
  bass.triggerAttackRelease(note, '8n', time);
}, ['C2', 'C2', 'G2', 'F2'], 'upDown');

bassPattern.start(0);
```

### Available Objects

When writing code, you have access to:

- `Tone` - Full Tone.js library
- `Transport` - Tone.js Transport for timing
- `synth` - Polyphonic synthesizer instance
- `bass` - Bass synthesizer instance
- `drums` - Drum synthesizer instance
- `console` - Console for logging (log, error, warn)

### Pattern Types

Tone.js supports several pattern types:

- **Sequence**: Play notes in order at regular intervals
- **Loop**: Repeat a function at regular intervals
- **Pattern**: Play notes with different iteration patterns (up, down, upDown, random, etc.)
- **Part**: Schedule events at specific times

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
│   │   ├── codeExecutor.ts   # Code execution sandbox
│   │   └── examples.ts       # Example code snippets
│   ├── styles/
│   │   └── main.css          # Application styles
│   └── main.ts               # Application entry point
├── index.html                # HTML structure
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration
└── README.md                 # This file
```

## Technical Details

### Technology Stack
- **TypeScript** - Type-safe JavaScript
- **Tone.js** - Web Audio framework for music synthesis
- **Monaco Editor** - VS Code's code editor component
- **Vite** - Fast build tool and dev server
- **Vanilla JavaScript** - No framework overhead

### Audio Architecture

The audio signal flow:
```
Instruments → Distortion → Bit Crusher → Delay → Reverb → Master Volume → Analyzer → Output
```

Each instrument can be:
- Enabled/disabled individually
- Volume controlled independently
- Routed through the effects chain

### Code Execution

User code is executed in a sandboxed environment using JavaScript's `Function` constructor. The execution context provides:
- Access to Tone.js and instrument instances
- Safe console logging
- Isolated scope to prevent global pollution

## Advanced Usage

### Creating Custom Patterns

```javascript
// Use Tone.js scheduling for precise timing
Transport.scheduleRepeat((time) => {
  synth.triggerAttackRelease('C4', '8n', time);
}, '4n');
```

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

### Using Effects Dynamically

Effects can be controlled in real-time through the UI sliders or programmatically in your code.

## Troubleshooting

### Audio Not Playing
- Click anywhere on the page first (browser requirement)
- Check that instruments are enabled
- Verify transport is playing (press Play button)

### Code Errors
- Check console for error messages
- Ensure proper Tone.js syntax
- Verify instrument names: `synth`, `bass`, `drums`

### Performance Issues
- Reduce number of simultaneous sequences
- Simplify complex patterns
- Lower effect values (reverb, delay)

## Resources

- [Tone.js Documentation](https://tonejs.github.io/)
- [Tone.js Examples](https://tonejs.github.io/examples/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## License

MIT

## Author

Built as a live coding music application for browser-based music creation and experimentation.
