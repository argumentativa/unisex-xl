/**
 * Character Orchestra - Main Entry Point
 * Simplified version showing only character rows
 */

import * as Tone from 'tone';
import { CharacterOrchestra } from './ui/character-orchestra/CharacterOrchestra';

// DOM Elements
const characterGrid = document.getElementById('characterGrid') as HTMLElement;

// Initialize Character Orchestra
const orchestra = new CharacterOrchestra(characterGrid);

// Initialize UI
orchestra.init();

// Auto-play on first user interaction (required by browser autoplay policy)
document.addEventListener('click', async () => {
  if (Tone.context.state !== 'running') {
    await Tone.start();
    orchestra.play();
  }
}, { once: true });

// Log initialization
console.log('Character Orchestra initialized');
