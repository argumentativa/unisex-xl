/**
 * Step Sequencer - Main Entry Point
 * Standalone step sequencer using AudioEngine instruments
 */

import { AudioEngine } from './core/audio';
import { Sequencer } from './ui/sequencer/Sequencer';

// DOM Elements
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const pauseBtn = document.getElementById('pauseBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
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
 * Play button handler
 */
playBtn.addEventListener('click', async () => {
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
pauseBtn.addEventListener('click', () => {
  sequencer.pause();
  updatePlaybackStatus('Paused');
  statusText.textContent = 'Paused';
});

/**
 * Stop button handler
 */
stopBtn.addEventListener('click', () => {
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

