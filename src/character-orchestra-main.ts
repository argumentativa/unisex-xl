/**
 * Character Orchestra - Main Entry Point
 * Simplified version showing only character rows
 */

import { AudioEngine } from './core/audio';
import { CharacterOrchestra } from './ui/character-orchestra/CharacterOrchestra';
import { TransportControls } from './ui/shared/TransportControls';

// DOM Elements
const characterGrid = document.getElementById('characterGrid') as HTMLElement;
const transportControlsContainer = document.getElementById('transportControlsContainer') as HTMLElement;

// Initialize AudioEngine and Character Orchestra
const audioEngine = new AudioEngine();
const orchestra = new CharacterOrchestra(characterGrid, audioEngine);

// Initialize UI
orchestra.init();

// Create transport controls
const transportControls = new TransportControls({
  initialBPM: 120,
  onPlay: async () => {
    await audioEngine.start();
    orchestra.play();
  },
  onStop: () => {
    orchestra.stop();
  },
  onBPMChange: (bpm) => {
    orchestra.setBPM(bpm);
  }
});

transportControlsContainer.appendChild(transportControls.getElement());

// Log initialization
console.log('Character Orchestra initialized');
