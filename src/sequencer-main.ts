/**
 * Step Sequencer - Main Entry Point
 * Standalone step sequencer using AudioEngine instruments
 */

import { AudioEngine } from './core/audio';
import { Sequencer } from './ui/sequencer/Sequencer';

// DOM Elements
const playBtn = document.getElementById('playBtn') as HTMLElement;
const pauseBtn = document.getElementById('pauseBtn') as HTMLElement;
const stopBtn = document.getElementById('stopBtn') as HTMLElement;
const bpmSlider = document.getElementById('bpm') as HTMLInputElement;
const bpmValue = document.getElementById('bpmValue') as HTMLSpanElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const playbackStatus = document.getElementById('playbackStatus') as HTMLSpanElement;
const sequencerGrid = document.getElementById('sequencerGrid') as HTMLElement;

// Initialize AudioEngine and Sequencer
const audioEngine = new AudioEngine();
const sequencer = new Sequencer(audioEngine, sequencerGrid);

/**
 * Update playback status display
 */
function updatePlaybackStatus(status: string): void {
  playbackStatus.textContent = status;
  playBtn.classList.toggle('active', status === 'Playing');
  pauseBtn.classList.toggle('active', status === 'Paused');
}

/**
 * Handle button activation (click or keyboard)
 */
function handleButtonActivate(element: HTMLElement, handler: () => void): void {
  element.addEventListener('click', handler);
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  });
}

/**
 * Play button handler
 */
handleButtonActivate(playBtn, async () => {
  try {
    await audioEngine.start();
    sequencer.play();
    updatePlaybackStatus('Playing');
    statusText.textContent = 'Playing';
  } catch (error) {
    statusText.textContent = `Error: ${error}`;
    console.error(error);
  }
});

/**
 * Pause button handler
 */
handleButtonActivate(pauseBtn, () => {
  sequencer.pause();
  updatePlaybackStatus('Paused');
  statusText.textContent = 'Paused';
});

/**
 * Stop button handler
 */
handleButtonActivate(stopBtn, () => {
  sequencer.stop();
  updatePlaybackStatus('Stopped');
  statusText.textContent = 'Stopped - Click steps to create patterns';
});

/**
 * BPM slider handler
 */
bpmSlider.addEventListener('input', (e) => {
  const bpm = parseInt((e.target as HTMLInputElement).value);
  audioEngine.setBPM(bpm);
  sequencer.setBPM(bpm);
  bpmValue.textContent = bpm.toString();
  statusText.textContent = `BPM: ${bpm}`;
});

// Initialize sequencer UI
sequencer.init();

// Set initial interaction level
document.body.setAttribute('data-interaction-level', '0');

// Log initialization
console.log('Step Sequencer initialized');
statusText.textContent = 'Ready - Click steps to create patterns';

