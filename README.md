# UNISEX XL - Live Coding Music Application

A simplified, browser-based live coding music application for creating electronic music through code.

## Core Components

- **Code Editor** - Monaco Editor (VS Code's editor) for writing JavaScript/TypeScript
- **Audio Engine** - Tone.js for synthesis, effects, and transport control
- **Visualizer** - Real-time audio waveform and frequency visualization

## Features

### Live Coding Environment

- **Monaco Editor** - Full-featured code editor with syntax highlighting
- **Write & Execute** - JavaScript/TypeScript code that generates music patterns
- **Instant Feedback** - Execute code with `Cmd/Ctrl + Enter` and hear results instantly
- **Real-time Modification** - Change code while music is playing

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
- Real-time audio analysis for visualization

### Visual Interface

- **Split-panel Layout** - Code editor on left, visualizer on right
- **Real-time Visualizer** - Waveform and frequency bar displays
- **Simple Controls** - Transport and BPM controls

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
cd /Users/miguelarias/Code/unisex-xl-experimental
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

## Usage

1. Write Tone.js code in the editor
2. Press `Cmd/Ctrl + Enter` or click "Run" to execute
3. Use transport controls to play/pause/stop
4. Adjust BPM with the slider
5. Switch visualizer modes between waveform and frequency bars

## Example Code

```javascript
// Basic melody pattern
const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '8n', time);
}, ['C4', 'E4', 'G4', 'B4'], '4n');

melody.start(0);
```

## Architecture

```
User Code (Editor)
    ↓
Code Executor (exposes audio engine globally)
    ↓
Audio Engine (Tone.js)
    ├→ Transport (play/pause/stop)
    ├→ Instruments (synth, bass, drums)
    └→ Analyzer
        ↓
Visualizer (Canvas2D)
    └→ Waveform/Frequency display
```

## Dependencies

- **tone** - Web Audio synthesis framework
- **monaco-editor** - Code editor component
- **vite** - Build tool and dev server
- **typescript** - Type safety

## License

MIT
