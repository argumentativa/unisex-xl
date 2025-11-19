/**
 * UNISEX XL - Strudel + Webcam ASCII
 * Audio-reactive webcam ASCII art with live coding
 */

import { webaudioRepl, registerSynthSounds, registerZZFXSounds } from '@strudel/webaudio';
import { getAnalyserById, getAnalyzerData } from 'superdough';
import * as strudel from '@strudel/core';
import { evalScope } from '@strudel/core';
import * as mini from '@strudel/mini';
import * as soundfonts from '@strudel/soundfonts';
import * as tonal from '@strudel/tonal';
import { transpiler } from '@strudel/transpiler';
import { EditorComponent } from './components/editor';
import p5 from 'p5';

console.log('[Strudel + Webcam] Starting...');

// Initialize Strudel
await Promise.all([
  evalScope(strudel, mini, soundfonts, tonal),
  registerSynthSounds(),
  registerZZFXSounds(),
  soundfonts.registerSoundfonts(),
]);

console.log('[Strudel + Webcam] Strudel initialized');

// Initialize Strudel REPL
const { evaluate, scheduler } = webaudioRepl({
  transpiler,
  onToggle: (playing: boolean) => {
    updateStatus(playing ? 'Pattern playing...' : 'Pattern stopped');
  },
  onError: (error: Error) => {
    updateStatus(`Error: ${error.message}`);
    console.error('[Strudel] Error:', error);
  }
});

// Get audio analyser from superdough
// @ts-ignore - analyzer is used for side effects (internal connection setup)
const analyzer = getAnalyserById(1, 2048, 0.8);

// Status update helper
const statusText = document.getElementById('statusText') as HTMLSpanElement;
function updateStatus(msg: string) {
  statusText.textContent = msg;
  console.log(`[Status] ${msg}`);
}

// Initialize Monaco Editor
const editorComponent = new EditorComponent();
const editorContainer = document.getElementById('editor') as HTMLElement;

const defaultCode = `// Strudel + Webcam ASCII
note("c3 e3 g3 c4").fast(2)`;

editorComponent.init(editorContainer, defaultCode);

// Webcam ASCII Sketch
let video: any; // p5 video element with pixel access
let asciiDensity = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";
let resolution = 128;
let reactivityMode = 'size';
let intensity = 1.0;

const sketch = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(640, 480);
    canvas.parent('webcam-canvas');

    console.log('[Webcam] Creating video capture...');
    video = p.createCapture(p.VIDEO, () => {
      console.log('[Webcam] Video stream started!');
      updateStatus('Webcam active - ready to play!');
    });
    video.size(resolution, resolution * 0.75);
    video.hide();

    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.background(0);

    updateStatus('Requesting webcam access...');
  };

  p.draw = () => {
    p.background(0);

    // Check if video is ready
    if (!video || video.width === 0 || video.height === 0) {
      p.fill(255);
      p.textSize(16);
      p.text('Waiting for webcam...', p.width / 2, p.height / 2);
      return;
    }

    // Get audio data
    const audioData = getAnalyzerData('time', 1);
    const energy = calculateEnergy(audioData);

    video.loadPixels();

    const cellW = p.width / resolution;
    const cellH = p.height / (resolution * 0.75);

    for (let i = 0; i < resolution; i++) {
      for (let j = 0; j < resolution * 0.75; j++) {
        const pixelIndex = (j * resolution + i) * 4;
        const r = video.pixels[pixelIndex];
        const g = video.pixels[pixelIndex + 1];
        const b = video.pixels[pixelIndex + 2];

        // Calculate brightness
        const bright = (r + g + b) / 3;

        // Map to ASCII character
        let charIndex = p.floor(p.map(bright, 0, 255, asciiDensity.length - 1, 0));
        charIndex = p.constrain(charIndex, 0, asciiDensity.length - 1);

        // Apply audio reactivity
        const { char, size, xOffset, yOffset, color } = applyAudioReactivity(
          charIndex, bright, energy, audioData, i, j, p
        );

        const x = i * cellW + cellW / 2 + xOffset;
        const y = j * cellH + cellH / 2 + yOffset;

        p.fill(color);
        p.textSize(size);
        p.text(char, x, y);
      }
    }
  };
};

// Calculate audio energy
function calculateEnergy(audioData: Float32Array): number {
  let sum = 0;
  for (let i = 0; i < audioData.length; i++) {
    sum += Math.abs(audioData[i]);
  }
  return sum / audioData.length;
}

// Apply audio reactivity to ASCII
function applyAudioReactivity(
  charIndex: number,
  brightness: number,
  energy: number,
  audioData: Float32Array,
  i: number,
  _j: number,
  p: p5
) {
  const baseSize = p.width / resolution;
  let char = asciiDensity.charAt(charIndex);
  let size = baseSize * 0.8;
  let xOffset = 0;
  let yOffset = 0;
  let color = p.color(brightness);

  const intensityMult = intensity;

  switch (reactivityMode) {
    case 'size':
      // Characters pulse with audio energy
      size = baseSize * (0.6 + energy * 3 * intensityMult);
      break;

    case 'density':
      // Character density changes with audio
      const densityShift = Math.floor(energy * asciiDensity.length * 0.5 * intensityMult);
      const newIndex = Math.max(0, Math.min(asciiDensity.length - 1, charIndex + densityShift));
      char = asciiDensity.charAt(newIndex);
      break;

    case 'distortion':
      // Position distortion based on audio
      const audioIndex = Math.floor((i / resolution) * audioData.length);
      const amplitude = audioData[audioIndex] || 0;
      xOffset = amplitude * 30 * intensityMult;
      yOffset = Math.sin(i * 0.1 + energy * 10) * 15 * intensityMult;
      break;

    case 'color':
      // Color changes with audio
      p.colorMode(p.HSB);
      const hue = (energy * 360 + i * 2) % 360;
      color = p.color(hue, 80, brightness / 2.55);
      break;

    case 'glitch':
      // Glitch effect on high energy
      if (energy > 0.3 * intensityMult) {
        const glitchChance = energy * intensityMult;
        if (Math.random() < glitchChance) {
          char = asciiDensity.charAt(Math.floor(Math.random() * asciiDensity.length));
          xOffset = (Math.random() - 0.5) * 40 * intensityMult;
          yOffset = (Math.random() - 0.5) * 40 * intensityMult;

          p.colorMode(p.RGB);
          color = p.color(
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
          );
        }
      }
      break;
  }

  return { char, size, xOffset, yOffset, color };
}

// Initialize p5 sketch
new p5(sketch);

// UI Controls
const runBtn = document.getElementById('runCode') as HTMLButtonElement;
const stopBtn = document.getElementById('stopCode') as HTMLButtonElement;
const clearBtn = document.getElementById('clearCode') as HTMLButtonElement;
const exampleBtn = document.getElementById('loadExample') as HTMLButtonElement;
const reactivitySelect = document.getElementById('reactivityMode') as HTMLSelectElement;
const intensitySelect = document.getElementById('intensityLevel') as HTMLSelectElement;

// Run code
runBtn?.addEventListener('click', async () => {
  const code = editorComponent.getValue();
  updateStatus('Evaluating pattern...');

  try {
    await evaluate(code);
    updateStatus('Pattern playing!');
  } catch (error: any) {
    updateStatus(`Error: ${error.message || error}`);
    console.error('[Strudel] Evaluation error:', error);
  }
});

// Stop
stopBtn?.addEventListener('click', () => {
  try {
    scheduler.stop();
    updateStatus('Stopped');
  } catch (error: any) {
    updateStatus(`Error stopping: ${error.message}`);
  }
});

// Clear
clearBtn?.addEventListener('click', () => {
  editorComponent.setValue('');
  updateStatus('Cleared');
});

// Examples
const examples = [
  `// Bass pulse
note("c2 c2 g2 f2").gain(0.5)`,
  `// Melodic glitch
note("c3 e3 g3 c4 e4 g4").fast(4)`,
  `// Chord progression
stack(
  note("c3 f3 g3 c3"),
  note("e3 a3 b3 e3")
)`,
  `// Fast arpeggio
note("c3 e3 g3 c4 e4 g4 c5").fast(8)`
];

exampleBtn?.addEventListener('click', () => {
  const example = examples[Math.floor(Math.random() * examples.length)];
  editorComponent.setValue(example);
  updateStatus('Example loaded');
});

// Reactivity mode
reactivitySelect?.addEventListener('change', (e) => {
  reactivityMode = (e.target as HTMLSelectElement).value;
  updateStatus(`Reactivity mode: ${reactivityMode}`);
});

// Intensity
intensitySelect?.addEventListener('change', (e) => {
  const level = (e.target as HTMLSelectElement).value;
  intensity = {
    'low': 0.5,
    'medium': 1.0,
    'high': 2.0,
    'extreme': 4.0
  }[level] || 1.0;
  updateStatus(`Intensity: ${level}`);
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    runBtn?.click();
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    stopBtn?.click();
  }
});

updateStatus('Ready - Press Run or Cmd/Ctrl+Enter');
