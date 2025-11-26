/**
 * Character Orchestra - Main Entry Point
 * Simplified version showing only character rows
 */

import * as Tone from 'tone';
import { CharacterOrchestra } from './ui/character-orchestra/CharacterOrchestra';
import { TransportControls } from './ui/shared/TransportControls';

// DOM Elements
const characterGrid = document.getElementById('characterGrid') as HTMLElement;
const transportControlsContainer = document.getElementById('transportControlsContainer') as HTMLElement;

// Initialize Character Orchestra (no AudioEngine dependency)
const orchestra = new CharacterOrchestra(characterGrid);

// Initialize UI
orchestra.init();

// Create transport controls
const transportControls = new TransportControls({
  initialBPM: 120,
  onPlay: async () => {
    await Tone.start(); // Unlock audio context directly
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
