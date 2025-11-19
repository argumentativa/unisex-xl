/**
 * UNISEX XL - Strudel Live Coding Editor
 * Using Strudel core packages for pattern-based live coding
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
import { P5Visualizer } from './components/p5-visualizer';

console.log('[Strudel] Starting...');

// Initialize Strudel: load modules, register synths, and load samples
await Promise.all([
  evalScope(strudel, mini, soundfonts, tonal),
  registerSynthSounds(), // Register built-in synthesis sounds (sine, square, sawtooth, etc.)
  registerZZFXSounds(),  // Register chiptune-style sounds
  soundfonts.registerSoundfonts(), // Register MIDI soundfonts
]);

console.log('[Strudel] Synths and samples loaded');

// Simple console logging
const logs: string[] = [];
function log(msg: string, type = 'info') {
  const time = new Date().toLocaleTimeString();
  logs.push(`[${time}] ${msg}`);
  const consoleEl = document.getElementById('console');
  if (consoleEl) {
    const colorClass = `console-${type}`;
    consoleEl.innerHTML = logs.map(l => `<div class="${colorClass}">${l}</div>`).join('');
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
  console.log(`[Strudel] ${msg}`);
}

// Initialize Strudel with webaudio REPL (includes audio output)
const { evaluate, scheduler } = webaudioRepl({
  transpiler, // Add transpiler for code transformation
  onToggle: (playing: boolean) => {
    log(playing ? 'Pattern started' : 'Pattern stopped', 'info');
  },
  onError: (error: Error) => {
    log(`Error: ${error.message}`, 'error');
    console.error('[Strudel] Error:', error);
  }
});

log('Strudel webaudio initialized', 'success');

// Initialize Monaco Editor
const editorComponent = new EditorComponent();
const editorContainer = document.getElementById('editor') as HTMLElement;

// Default Strudel code (simple sine synth - no samples needed)
const defaultCode = `// Strudel Basic Pattern
note("c3 e3 g3 c4")`;

editorComponent.init(editorContainer, defaultCode);

// Initialize P5 visualizer with superdough's built-in analyser
const p5VisualizerContainer = document.getElementById('p5-visualizer') as HTMLDivElement;
const vizModeSelect = document.getElementById('vizMode') as HTMLSelectElement;
let p5Visualizer: P5Visualizer | null = null;

// Use superdough's built-in analyser (patched to connect to audio output)
// @ts-ignore - analyzer is used for side effects (internal connection setup)
const analyzer = getAnalyserById(1, 2048, 0.8);

// Create a wrapper that matches Tone.js Analyser interface
const toneAnalyzerWrapper = {
  getValue: () => {
    // Use superdough's getAnalyzerData function
    return getAnalyzerData('time', 1);
  }
};

if (p5VisualizerContainer) {
  p5Visualizer = new P5Visualizer(p5VisualizerContainer, {
    width: p5VisualizerContainer.clientWidth,
    height: 300,
    mode: 'waveform'
  });
  p5Visualizer.setAnalyzer(toneAnalyzerWrapper as any);
  log('P5 Visualizer initialized', 'success');
}

// Get buttons
const runBtn = document.getElementById('runCode') as HTMLButtonElement;
const stopBtn = document.getElementById('stopCode') as HTMLButtonElement;
const clearBtn = document.getElementById('clearCode') as HTMLButtonElement;
const exampleBtn = document.getElementById('loadExample') as HTMLButtonElement;
const themeBtn = document.getElementById('themeToggle') as HTMLButtonElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;

// Run code
runBtn?.addEventListener('click', async () => {
  const code = editorComponent.getValue();
  log('Evaluating pattern...');
  statusText.textContent = 'Running...';

  try {
    // Evaluate the Strudel code using the REPL context
    await evaluate(code);

    log('Pattern playing!', 'success');
    statusText.textContent = 'Playing';
  } catch (error: any) {
    log(`Error: ${error.message || error}`, 'error');
    statusText.textContent = 'Error - check console';
    console.error('[Strudel] Evaluation error:', error);
  }
});

// Stop
stopBtn?.addEventListener('click', () => {
  try {
    scheduler.stop();
    log('Stopped', 'success');
    statusText.textContent = 'Stopped';
  } catch (error: any) {
    log(`Error stopping: ${error.message}`, 'error');
    console.error('[Strudel] Stop error:', error);
  }
});

// Clear
clearBtn?.addEventListener('click', () => {
  editorComponent.setValue('');
  statusText.textContent = 'Cleared';
});

// Load example (simple patterns without samples)
const examples = [
  `// Basic melody
note("c3 a3 f3 e3")`,
  `// Bass pattern
note("c2 c2 g2 f2").gain(0.3)`,
  `// Chord progression
stack(
  note("c3 f3 g3 c3"),
  note("e3 a3 b3 e3"),
  note("g3 c4 d4 g3")
)`,
  `// Fast arpeggio
note("c3 e3 g3 c4 e4 g4 c5 g4 e4 c4 g3 e3").fast(2)`
];

exampleBtn?.addEventListener('click', () => {
  const example = examples[Math.floor(Math.random() * examples.length)];
  editorComponent.setValue(example);
  log('Example loaded');
  statusText.textContent = 'Example loaded';
});

// Theme toggle
themeBtn?.addEventListener('click', () => {
  editorComponent.toggleTheme();
  document.body.classList.toggle('light-theme');
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

// Visualizer mode change handler
vizModeSelect?.addEventListener('change', (e) => {
  const mode = (e.target as HTMLSelectElement).value as 'waveform' | 'frequency' | 'circular' | 'particles' | 'mesh';
  p5Visualizer?.setMode(mode);
  log(`Visualizer mode: ${mode}`, 'info');
});

log('Strudel editor ready!', 'success');
statusText.textContent = 'Ready - Press Run or Cmd/Ctrl+Enter';
