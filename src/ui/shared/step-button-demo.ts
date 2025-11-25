/**
 * Demo Controller for Unified Step Button
 * Shows a single button cycling through chromatic notes with custom color palette
 * Uses the same callback pattern as Sequencer and CharacterOrchestra
 */

import * as Tone from 'tone';
import { StepButton, StepState, CHROMATIC_NOTES } from './StepButton';

// Custom color palette for the 12 chromatic steps
const COLOR_PALETTE = [
  '#FFCBA4', // C - Peach
  '#E2725B', // C# - Terracotta
  '#FBCEB1', // D - Apricot
  '#F4D03F', // D# - Golden Hour
  '#7FCDCD', // E - Aqua Dream
  '#93E9BE', // F - Seafoam
  '#4A9B9B', // F# - Teal
  '#63B3B3', // G - Lagoon
  '#DCAE96', // G# - Dusty Rose
  '#B2C9AB', // A - Sage
  '#C5B4E3', // A# - Lavender Haze
  '#F8EDD3'  // B - Warm Cream
];

class StepButtonDemo {
  private button: StepButton | null = null;
  private synth: Tone.Synth | null = null;
  private audioStarted: boolean = false;

  constructor() {
    this.init();
  }

  private init(): void {
    this.initAudio();
    this.createButton();
  }

  /**
   * Initialize Tone.js synth for playing notes
   */
  private initAudio(): void {
    this.synth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5
      }
    }).toDestination();
  }

  /**
   * Start audio context (required by browsers on first user interaction)
   */
  private async startAudio(): Promise<void> {
    if (!this.audioStarted) {
      await Tone.start();
      this.audioStarted = true;
    }
  }

  /**
   * Play a note using Tone.js
   */
  private playNote(noteIndex: number): void {
    // Start audio on first interaction
    this.startAudio();

    if (!this.synth || noteIndex < 0) return;

    const noteName = CHROMATIC_NOTES[noteIndex];
    const octave = 4; // Middle octave
    const noteWithOctave = `${noteName}${octave}`;

    this.synth.triggerAttackRelease(noteWithOctave, '8n');
  }

  /**
   * Create single step button using the unified callback pattern
   */
  private createButton(): void {
    const container = document.getElementById('button-container');
    if (!container) return;

    // Initial state: OFF
    const stepState: StepState = {
      isActive: false,
      noteIndex: -1,
      pressCount: 0
    };

    this.button = new StepButton(
      0,
      stepState,
      { mode: 'hue', hue: 0 },
      {
        // Called when step state changes (after cycling to next note)
        onStateChange: (_stepIndex, newState) => {
          this.handleStateChange(newState);
        },
        // Called to play preview sound
        onPlayPreview: (noteIndex) => {
          this.playNote(noteIndex);
        }
      }
    );

    container.appendChild(this.button.getElement());
    this.updateStateDisplay(-1);
  }

  /**
   * Handle state change from StepButton
   * Update display and apply custom palette color
   */
  private handleStateChange(newState: StepState): void {
    if (!this.button) return;

    const noteIndex = newState.isActive ? newState.noteIndex : -1;

    // Apply palette color directly to button
    if (newState.isActive && noteIndex >= 0) {
      const buttonElement = this.button.getElement();
      buttonElement.style.backgroundColor = COLOR_PALETTE[noteIndex];
    }

    this.updateStateDisplay(noteIndex);
  }

  /**
   * Update the state display text
   */
  private updateStateDisplay(noteIndex: number): void {
    const stateValue = document.getElementById('state-value');
    if (!stateValue) return;

    if (noteIndex === -1) {
      stateValue.textContent = 'OFF';
      stateValue.style.color = '#999';
    } else {
      const noteName = CHROMATIC_NOTES[noteIndex];
      const color = COLOR_PALETTE[noteIndex];
      stateValue.textContent = noteName;
      stateValue.style.color = color;
    }
  }
}

// Initialize demo when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new StepButtonDemo());
} else {
  new StepButtonDemo();
}
