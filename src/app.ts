/**
 * Main Application - Orchestrates editor, audio engine, and visualizer
 */

import { AudioEngine } from './core/audio';
import { CodeExecutor } from './core/executor';
import { Editor } from './ui/editor';
import { Visualizer } from './ui/visualizer';
import { getExample, type ExampleName } from './core/examples';
import { playbackStore } from './core/store';
import { handleButtonActivate } from './ui/shared/utils';
import { TransportControls } from './ui/shared/TransportControls';

// Initialize components
const audioEngine = new AudioEngine();
const codeExecutor = new CodeExecutor(audioEngine);
const editor = new Editor();
let visualizer: Visualizer;

// DOM Elements
const editorContainer = document.getElementById('editor') as HTMLElement;
const visualizerCanvas = document.getElementById('visualizer') as HTMLCanvasElement;
const runCodeBtn = document.getElementById('runCode') as HTMLElement;
const transportControlsContainer = document.getElementById('transportControlsContainer') as HTMLElement;
const vizModeSelect = document.getElementById('vizMode') as HTMLSelectElement;
const exampleSelect = document.getElementById('exampleSelect') as HTMLSelectElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const playbackStatus = document.getElementById('playbackStatus') as HTMLSpanElement;

// Initialize editor with default example
const defaultCode = getExample('basic');
editor.init(editorContainer, defaultCode);

// Initialize visualizer
visualizer = new Visualizer(visualizerCanvas);
visualizer.setAnalyzer(audioEngine.getAnalyzer());

// Resize visualizer canvas
function resizeVisualizer(): void {
  const container = visualizerCanvas.parentElement;
  if (container) {
    visualizerCanvas.width = container.clientWidth;
    visualizerCanvas.height = container.clientHeight;
    visualizer.resize(visualizerCanvas.width, visualizerCanvas.height);
  }
}

resizeVisualizer();
window.addEventListener('resize', resizeVisualizer);

/**
 * Subscribe to playback state changes for status display
 */
playbackStore.subscribe((state) => {
  playbackStatus.textContent = state.charAt(0).toUpperCase() + state.slice(1);
});

/**
 * Create transport controls
 */
const transportControls = new TransportControls({
  initialBPM: 120,
  onPlay: async () => {
    await audioEngine.start();
    // Update visualizer with analyzer after audio initialization
    visualizer.setAnalyzer(audioEngine.getAnalyzer());
    audioEngine.play();
    statusText.textContent = 'Playing';
  },
  onStop: () => {
    audioEngine.stop();
    statusText.textContent = 'Stopped';
  },
  onBPMChange: (bpm) => {
    audioEngine.setBPM(bpm);
  }
});

transportControlsContainer.appendChild(transportControls.getElement());

// Get button references for keyboard shortcuts
const playBtn = transportControls.getElement().querySelector('.play-btn') as HTMLElement;
const stopBtn = transportControls.getElement().querySelector('.stop-btn') as HTMLElement;

/**
 * Run code button handler
 */
handleButtonActivate(runCodeBtn, async () => {
  try {
    await audioEngine.start();
    // Update visualizer with analyzer after audio initialization
    visualizer.setAnalyzer(audioEngine.getAnalyzer());
    const code = editor.getValue();
    await codeExecutor.execute(code);
    statusText.textContent = 'Code executed';
  } catch (error) {
    statusText.textContent = `Error: ${error}`;
    console.error(error);
  }
});

// Transport controls are handled by TransportControls component above

/**
 * Visualizer mode change handler
 */
vizModeSelect.addEventListener('change', (e) => {
  const mode = (e.target as HTMLSelectElement).value as 'waveform' | 'frequency';
  visualizer.setMode(mode);
  statusText.textContent = `Visualizer mode: ${mode}`;
});

/**
 * Example selector handler
 */
exampleSelect.addEventListener('change', (e) => {
  const exampleName = (e.target as HTMLSelectElement).value as ExampleName;
  editor.setValue(getExample(exampleName));
  statusText.textContent = `Loaded: ${exampleName}`;
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

  // Space to play/stop
  if (e.code === 'Space' && e.target === document.body) {
    e.preventDefault();
    const state = playbackStore.getState();
    if (state === 'playing' && stopBtn) {
      stopBtn.click();
    } else if (playBtn) {
      playBtn.click();
    }
  }

  // Escape to stop
  if (e.key === 'Escape' && stopBtn) {
    e.preventDefault();
    stopBtn.click();
  }
});

// Log initialization
console.log('UNISEX XL Live Coding Music Application initialized');
statusText.textContent = 'Ready - Press "Run" or Cmd/Ctrl+Enter to execute code';



