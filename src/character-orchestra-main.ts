/**
 * Character Orchestra - Main Entry Point
 * Simplified version showing only character rows
 */

import * as Tone from 'tone';
import { CharacterOrchestra } from './ui/character-orchestra/CharacterOrchestra';

// DOM Elements
const characterGrid = document.getElementById('characterGrid') as HTMLElement;
const playBtn = document.getElementById('playBtn') as HTMLElement;
const stopBtn = document.getElementById('stopBtn') as HTMLElement;
const bpmSlider = document.getElementById('bpm') as HTMLInputElement;
const bpmValue = document.getElementById('bpmValue') as HTMLElement;

// Initialize Character Orchestra
const orchestra = new CharacterOrchestra(characterGrid);

// Initialize UI
orchestra.init();

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

// Play button handler
handleButtonActivate(playBtn, async () => {
  if (Tone.context.state !== 'running') {
    await Tone.start();
  }
  orchestra.play();
  playBtn.classList.add('disabled');
  stopBtn.classList.remove('disabled');
});

// Stop button handler
handleButtonActivate(stopBtn, () => {
  orchestra.stop();
  playBtn.classList.remove('disabled');
  stopBtn.classList.add('disabled');
});

// Initialize button states
stopBtn.classList.add('disabled');

// BPM slider handler
bpmSlider.addEventListener('input', (e) => {
  const bpm = parseInt((e.target as HTMLInputElement).value);
  bpmValue.textContent = bpm.toString();
  orchestra.setBPM(bpm);
});

// Log initialization
console.log('Character Orchestra initialized');
