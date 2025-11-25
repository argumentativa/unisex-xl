/**
 * Demo Controller for Unified Step Button
 * Shows a single button cycling through chromatic notes with custom color palette
 */

import * as Tone from 'tone';
import { StepButton, StepState } from './StepButton';

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

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

/**
 * Convert hex color to HSL
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

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
   * Handle button click - cycle through 12 notes with custom colors then back to OFF
   * OFF → C (Peach) → C# (Terracotta) → D (Apricot) → ... → B (Warm Cream) → OFF
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
    
    // Get hue from custom color palette
    const hue = isActive ? hexToHSL(COLOR_PALETTE[this.currentNoteIndex]).h : 0;

    // Play the note if active
    if (isActive) {
      this.playNote(this.currentNoteIndex);
    }

    const state = this.button.getStepState();
    state.isActive = isActive;
    state.noteIndex = this.currentNoteIndex >= 0 ? this.currentNoteIndex : 0;
    state.pressCount++;

    // Update button state with new hue from palette
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
      
      // Apply palette color directly to button
      if (isActive) {
        const buttonElement = this.button.getElement();
        buttonElement.style.backgroundColor = COLOR_PALETTE[this.currentNoteIndex];
        // Update glow to match palette color
        buttonElement.style.boxShadow = `0 0 30px ${COLOR_PALETTE[this.currentNoteIndex]}`;
      }
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
      const color = COLOR_PALETTE[this.currentNoteIndex];
      stateValue.textContent = noteName;
      stateValue.style.color = color; // Use custom palette color
    }
  }
}

// Initialize demo when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new StepButtonDemo());
} else {
  new StepButtonDemo();
}

