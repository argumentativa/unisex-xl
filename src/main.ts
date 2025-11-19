/**
 * UNISEX XL - Live Coding Music Web Application
 * Main entry point
 */

import { AudioEngine } from './utils/audioEngine';
import { CodeExecutor } from './utils/codeExecutor';
import { EditorComponent } from './components/editor';
import { Visualizer } from './components/visualizer';
import { P5Visualizer } from './components/p5-visualizer';
import { getExample } from './utils/examples';
import type { PlaybackState, ConsoleMessage, InstrumentType, EffectType } from './types';

// Application state
let playbackState: PlaybackState = 'stopped';

// Initialize components
const audioEngine = new AudioEngine();
const codeExecutor = new CodeExecutor(audioEngine);
const editorComponent = new EditorComponent();
let visualizer: Visualizer;
let p5Visualizer: P5Visualizer;

// DOM Elements
const editorContainer = document.getElementById('editor') as HTMLElement;
const runCodeBtn = document.getElementById('runCode') as HTMLButtonElement;
const clearCodeBtn = document.getElementById('clearCode') as HTMLButtonElement;
const loadExampleBtn = document.getElementById('loadExample') as HTMLButtonElement;
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const bpmSlider = document.getElementById('bpm') as HTMLInputElement;
const bpmValue = document.getElementById('bpmValue') as HTMLSpanElement;
const themeToggle = document.getElementById('themeToggle') as HTMLButtonElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const playbackStatus = document.getElementById('playbackStatus') as HTMLSpanElement;
const consoleElement = document.getElementById('console') as HTMLDivElement;
const visualizerCanvas = document.getElementById('visualizer') as HTMLCanvasElement;
const p5VisualizerContainer = document.getElementById('p5-visualizer') as HTMLDivElement;
const vizModeSelect = document.getElementById('vizMode') as HTMLSelectElement;

// Initialize editor with default example
const defaultCode = getExample('basic');
editorComponent.init(editorContainer, defaultCode);

// Initialize visualizers
visualizer = new Visualizer(visualizerCanvas);
visualizer.setAnalyzer(audioEngine.getAnalyzer());

// Initialize P5 visualizer
p5Visualizer = new P5Visualizer(p5VisualizerContainer, {
  width: p5VisualizerContainer.clientWidth,
  height: 300,
  mode: 'waveform'
});
p5Visualizer.setAnalyzer(audioEngine.getAnalyzer());

// Set console callback
codeExecutor.setConsoleCallback((messages: ConsoleMessage[]) => {
  updateConsole(messages);
});

/**
 * Update console display
 */
function updateConsole(messages: ConsoleMessage[]): void {
  consoleElement.innerHTML = messages
    .map((msg) => {
      const time = msg.timestamp.toLocaleTimeString();
      const colorClass = `console-${msg.type}`;
      return `<div class="${colorClass}">[${time}] ${msg.message}</div>`;
    })
    .join('');
  consoleElement.scrollTop = consoleElement.scrollHeight;
}

/**
 * Update playback state
 */
function updatePlaybackState(state: PlaybackState): void {
  playbackState = state;
  playbackStatus.textContent = state.charAt(0).toUpperCase() + state.slice(1);

  playBtn.classList.toggle('active', state === 'playing');
  pauseBtn.classList.toggle('active', state === 'paused');
}

/**
 * Run code button handler
 */
runCodeBtn.addEventListener('click', async () => {
  await audioEngine.start();
  const code = editorComponent.getValue();
  await codeExecutor.execute(code);
  statusText.textContent = 'Code executed';
});

/**
 * Clear code button handler
 */
clearCodeBtn.addEventListener('click', () => {
  editorComponent.setValue('');
  statusText.textContent = 'Code cleared';
});

/**
 * Load example button handler
 */
loadExampleBtn.addEventListener('click', () => {
  const examples = ['basic', 'drums', 'bassline', 'complex', 'generative', 'arpeggio'];
  const randomExample = examples[Math.floor(Math.random() * examples.length)];
  const exampleCode = getExample(randomExample as any);
  editorComponent.setValue(exampleCode);
  statusText.textContent = `Loaded ${randomExample} example`;
});

/**
 * Play button handler
 */
playBtn.addEventListener('click', async () => {
  await audioEngine.start();
  audioEngine.play();
  updatePlaybackState('playing');
  statusText.textContent = 'Playing';
});

/**
 * Pause button handler
 */
pauseBtn.addEventListener('click', () => {
  audioEngine.pause();
  updatePlaybackState('paused');
  statusText.textContent = 'Paused';
});

/**
 * Stop button handler
 */
stopBtn.addEventListener('click', () => {
  audioEngine.stop();
  updatePlaybackState('stopped');
  statusText.textContent = 'Stopped';
});

/**
 * BPM slider handler
 */
bpmSlider.addEventListener('input', (e) => {
  const bpm = parseInt((e.target as HTMLInputElement).value);
  audioEngine.setBPM(bpm);
  bpmValue.textContent = bpm.toString();
});

/**
 * Theme toggle handler
 */
themeToggle.addEventListener('click', () => {
  editorComponent.toggleTheme();
  document.body.classList.toggle('light-theme');
  statusText.textContent = `Theme: ${editorComponent.getTheme()}`;
});

/**
 * Instrument toggle handlers
 */
document.querySelectorAll('.instrument-toggle').forEach((toggle) => {
  toggle.addEventListener('change', (e) => {
    const checkbox = e.target as HTMLInputElement;
    const instrument = checkbox.dataset.instrument as InstrumentType;
    audioEngine.toggleInstrument(instrument, checkbox.checked);
    statusText.textContent = `${instrument} ${checkbox.checked ? 'enabled' : 'disabled'}`;
  });
});

/**
 * Instrument volume slider handlers
 */
document.querySelectorAll('.volume-slider').forEach((slider) => {
  slider.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    const instrument = input.dataset.instrument as InstrumentType;
    const volume = parseInt(input.value);
    audioEngine.setInstrumentVolume(instrument, volume);
  });
});

/**
 * Effect slider handlers
 */
const effectSliders = ['reverb', 'delay', 'distortion', 'bitcrusher'];
effectSliders.forEach((effectType) => {
  const slider = document.getElementById(effectType) as HTMLInputElement;
  const valueDisplay = slider.parentElement?.querySelector('.value-display');

  slider.addEventListener('input', (e) => {
    const value = parseFloat((e.target as HTMLInputElement).value);
    audioEngine.setEffect(effectType as EffectType, value);
    if (valueDisplay) {
      if (effectType === 'bitcrusher') {
        valueDisplay.textContent = value.toFixed(0);
      } else {
        valueDisplay.textContent = value.toFixed(2);
      }
    }
  });
});

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
  // Cmd/Ctrl + Enter to run code
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    runCodeBtn.click();
  }

  // Space to play/pause
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    if (playbackState === 'playing') {
      pauseBtn.click();
    } else {
      playBtn.click();
    }
  }

  // Escape to stop
  if (e.key === 'Escape') {
    e.preventDefault();
    stopBtn.click();
  }
});

/**
 * Visualizer mode change handler
 */
vizModeSelect.addEventListener('change', (e) => {
  const mode = (e.target as HTMLSelectElement).value as 'waveform' | 'frequency' | 'circular' | 'particles' | 'mesh';
  p5Visualizer.setMode(mode);
  statusText.textContent = `Visualizer mode: ${mode}`;
});

// Log initialization
console.log('UNISEX XL Live Coding Music Application initialized');
statusText.textContent = 'Ready - Press "Run" or Cmd/Ctrl+Enter to execute code';
