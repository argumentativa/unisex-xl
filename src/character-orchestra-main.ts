/**
 * Character Orchestra - Main Entry Point
 * Simplified version showing only character rows
 */

import * as Tone from 'tone';
import { CharacterOrchestra } from './ui/character-orchestra/CharacterOrchestra';

// DOM Elements
const characterGrid = document.getElementById('characterGrid') as HTMLElement;
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const bpmSlider = document.getElementById('bpm') as HTMLInputElement;
const bpmValue = document.getElementById('bpmValue') as HTMLElement;

// Initialize Character Orchestra
const orchestra = new CharacterOrchestra(characterGrid);

// Initialize UI
orchestra.init();

// Play button handler
playBtn.addEventListener('click', async () => {
  if (Tone.context.state !== 'running') {
    await Tone.start();
  }
  orchestra.play();
  playBtn.disabled = true;
  stopBtn.disabled = false;
});

// Stop button handler
stopBtn.addEventListener('click', () => {
  orchestra.stop();
  playBtn.disabled = false;
  stopBtn.disabled = true;
});

// Initialize button states
stopBtn.disabled = true;

// BPM slider handler
bpmSlider.addEventListener('input', (e) => {
  const bpm = parseInt((e.target as HTMLInputElement).value);
  bpmValue.textContent = bpm.toString();
  orchestra.setBPM(bpm);
});

// Log initialization
console.log('Character Orchestra initialized');
