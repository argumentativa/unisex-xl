/**
 * Character Orchestra - Main Entry Point
 * Simplified version showing only character rows
 */

import { AudioEngine } from './core/audio';
import { CharacterOrchestra } from './ui/character-orchestra/CharacterOrchestra';
import { playbackStore } from './core/store';
import { handleButtonActivate } from './ui/shared/utils';

// DOM Elements
const characterGrid = document.getElementById('characterGrid') as HTMLElement;
const playBtn = document.getElementById('playBtn') as HTMLElement;
const stopBtn = document.getElementById('stopBtn') as HTMLElement;
const bpmSlider = document.getElementById('bpm') as HTMLInputElement;
const bpmValue = document.getElementById('bpmValue') as HTMLElement;

// Initialize AudioEngine and Character Orchestra
const audioEngine = new AudioEngine();
const orchestra = new CharacterOrchestra(characterGrid, audioEngine);

// Initialize UI
orchestra.init();

/**
 * Subscribe to playback state changes
 */
playbackStore.subscribe((state) => {
  playBtn.classList.toggle('disabled', state === 'playing');
  stopBtn.classList.toggle('disabled', state !== 'playing');
});

// Play button handler
handleButtonActivate(playBtn, async () => {
  await audioEngine.start();
  orchestra.play();
});

// Stop button handler
handleButtonActivate(stopBtn, () => {
  orchestra.stop();
});

// BPM slider handler
bpmSlider.addEventListener('input', (e) => {
  const bpm = parseInt((e.target as HTMLInputElement).value);
  bpmValue.textContent = bpm.toString();
  orchestra.setBPM(bpm);
});

// Log initialization
console.log('Character Orchestra initialized');
