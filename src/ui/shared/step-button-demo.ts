/**
 * Demo Controller for Unified Step Button
 * Shows a single button cycling through chromatic notes with custom color palette
 * Uses the same callback pattern as Sequencer and CharacterOrchestra
 */

import * as Tone from 'tone';
import { StepButton, StepState, CHROMATIC_NOTES, COLOR_PALETTE } from './StepButton';

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
   * Update the state display text and background color
   */
  private updateStateDisplay(noteIndex: number): void {
    const stateValue = document.getElementById('state-value');
    if (!stateValue) return;

    if (noteIndex === -1) {
      // OFF state: white background, gray text
      stateValue.textContent = 'OFF';
      stateValue.style.color = '#999';
      document.body.style.backgroundColor = 'white';
    } else {
      // Active state: complementary background color
      const noteName = CHROMATIC_NOTES[noteIndex];
      const color = COLOR_PALETTE[noteIndex];
      stateValue.textContent = noteName;
      stateValue.style.color = color;

      // Calculate complementary hue for background
      const hsl = hexToHSL(color);
      const complementaryHue = (hsl.h + 180) % 360;
      
      // Apply to body with high saturation for bright contrast
      document.body.style.backgroundColor = 
        `hsl(${complementaryHue}, 85%, 75%)`;
    }
  }
}

// Initialize demo when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new StepButtonDemo());
} else {
  new StepButtonDemo();
}
