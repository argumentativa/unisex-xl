/**
 * Character Orchestra - Main Entry Point
 * Standalone children's music app with character-driven interface
 */

import * as Tone from 'tone';
import { CharacterOrchestra } from './ui/character-orchestra/CharacterOrchestra';

// DOM Elements
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;
const bpmSlider = document.getElementById('bpm') as HTMLInputElement;
const bpmValue = document.getElementById('bpmValue') as HTMLSpanElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;
const characterGrid = document.getElementById('characterGrid') as HTMLElement;
const celebrationModal = document.getElementById('celebrationModal') as HTMLElement;

// Initialize Character Orchestra
const orchestra = new CharacterOrchestra(characterGrid);

let celebrationShown = false;

/**
 * Update status message
 */
function updateStatus(): void {
  const activeCount = orchestra.getActiveCharacterCount();
  
  if (activeCount === 0) {
    statusText.textContent = 'Click circles to wake up the characters! 🎵';
  } else if (activeCount === 1) {
    statusText.textContent = '1 character is awake! Wake up more friends! 🌟';
  } else if (activeCount < 8) {
    statusText.textContent = `${activeCount} characters are awake! Keep going! 🎪`;
  } else {
    statusText.textContent = '🎉 THE WHOLE BAND IS READY! Press PLAY! 🎉';
    
    // Show celebration modal (once per session)
    if (!celebrationShown) {
      showCelebration();
      celebrationShown = true;
    }
  }
}

/**
 * Show celebration modal
 */
function showCelebration(): void {
  celebrationModal.style.display = 'flex';
  
  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    celebrationModal.style.display = 'none';
  }, 3000);
}

/**
 * Play button handler
 */
playBtn.addEventListener('click', async () => {
  try {
    // Start audio context if not already started
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    const isPlaying = orchestra.isPlayingState();
    
    if (isPlaying) {
      // Pause
      orchestra.pause();
      playBtn.textContent = '▶ PLAY';
    } else {
      // Play
      orchestra.play();
      playBtn.textContent = '⏸ PAUSE';
    }
  } catch (error) {
    statusText.textContent = `🔇 Oops! Can't start the music. Try clicking PLAY again!`;
    console.error('Audio error:', error);
  }
});

/**
 * Stop button handler
 */
stopBtn.addEventListener('click', () => {
  orchestra.stop();
  playBtn.textContent = '▶ PLAY';
  updateStatus();
});

/**
 * BPM slider handler
 */
bpmSlider.addEventListener('input', (e) => {
  const bpm = parseInt((e.target as HTMLInputElement).value);
  orchestra.setBPM(bpm);
  bpmValue.textContent = bpm.toString();
});

// Listen for character state changes
orchestra.onCharacterStateChange(() => {
  updateStatus();
});

// Initialize UI
orchestra.init();
updateStatus();

// Log initialization
console.log('Character Orchestra initialized');

