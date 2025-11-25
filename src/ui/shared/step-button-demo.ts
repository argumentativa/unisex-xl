/**
 * Demo Controller for Unified Step Button
 * Shows a single button cycling through chromatic notes with hue changes
 */

import * as Tone from 'tone';
import { StepButton, StepState } from './StepButton';

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

class StepButtonDemo {
  private button: StepButton | null = null;
  private currentNoteIndex: number = -1; // -1 = OFF state
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
    if (!this.synth || noteIndex < 0) return;

    const noteName = CHROMATIC_NOTES[noteIndex];
    const octave = 4; // Middle octave
    const noteWithOctave = `${noteName}${octave}`;

    this.synth.triggerAttackRelease(noteWithOctave, '8n');
  }

  /**
   * Create single step button
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
      { mode: 'hue', hue: 0 }, // Will update on click
      () => this.handleClick()
    );

    container.appendChild(this.button.getElement());
    this.updateStateDisplay();
  }

  /**
   * Handle button click - cycle through 12 notes then back to OFF
   * OFF → C (0°) → C# (30°) → D (60°) → ... → B (330°) → OFF
   */
  private async handleClick(): Promise<void> {
    if (!this.button) return;

    // Start audio on first click (required by browser autoplay policy)
    await this.startAudio();

    // Advance to next note (or OFF if at B)
    this.currentNoteIndex = (this.currentNoteIndex + 1) % 13; // 0-11 are notes, 12 wraps to -1 (OFF)

    // If we hit 12, reset to -1 (OFF)
    if (this.currentNoteIndex === 12) {
      this.currentNoteIndex = -1;
    }

    const isActive = this.currentNoteIndex >= 0;
    const hue = isActive ? this.currentNoteIndex * 30 : 0; // 360° / 12 = 30° per note

    // Play the note if active
    if (isActive) {
      this.playNote(this.currentNoteIndex);
    }

    const state = this.button.getStepState();
    state.isActive = isActive;
    state.noteIndex = this.currentNoteIndex >= 0 ? this.currentNoteIndex : 0;
    state.pressCount++;

    // Update button state with new hue
    this.button = new StepButton(
      0,
      state,
      { mode: 'hue', hue },
      () => this.handleClick()
    );

    // Replace button in DOM
    const container = document.getElementById('button-container');
    if (container) {
      container.innerHTML = '';
      container.appendChild(this.button.getElement());
    }

    this.updateStateDisplay();
  }

  /**
   * Update the state display text
   */
  private updateStateDisplay(): void {
    const stateValue = document.getElementById('state-value');
    if (!stateValue) return;

    if (this.currentNoteIndex === -1) {
      stateValue.textContent = 'OFF';
      stateValue.style.color = '#999';
    } else {
      const noteName = CHROMATIC_NOTES[this.currentNoteIndex];
      const hue = this.currentNoteIndex * 30;
      stateValue.textContent = noteName;
      stateValue.style.color = `hsl(${hue}, 100%, 50%)`; // Brighter, more saturated text
    }
  }
}

// Initialize demo when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new StepButtonDemo());
} else {
  new StepButtonDemo();
}

