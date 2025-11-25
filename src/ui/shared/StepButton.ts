/**
 * Unified Step Button Component
 * Works for both Sequencer (hue-based) and Character Orchestra (character-based) modes
 * Handles note cycling (OFF → C → C# → ... → B → OFF) and preview sound on click
 */

import type { Character } from '../character-orchestra/Character';

export interface StepState {
  isActive: boolean;
  noteIndex: number;
  pressCount: number;
}

export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Unified color palette for the 12 chromatic steps
export const COLOR_PALETTE = [
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

type ColorConfig =
  | { mode: 'hue'; hue: number }
  | { mode: 'character'; character: Character };

export interface StepButtonCallbacks {
  /** Called when step state changes (for parent to track pattern state) */
  onStateChange: (stepIndex: number, newState: StepState) => void;
  /** Called to play preview sound (parent provides the instrument) */
  onPlayPreview?: (noteIndex: number) => void;
}

export class StepButton {
  private element: HTMLButtonElement;
  private stepIndex: number;
  private stepState: StepState;
  private colorConfig: ColorConfig;
  private callbacks: StepButtonCallbacks;
  private interactionLevel: number = 0;
  private rowActivity: number = 0;
  private hue: number; // Computed hue for both modes

  constructor(
    stepIndex: number,
    stepState: StepState,
    colorConfig: ColorConfig,
    callbacks: StepButtonCallbacks
  ) {
    this.stepIndex = stepIndex;
    this.stepState = { ...stepState };
    this.colorConfig = colorConfig;
    this.callbacks = callbacks;

    // Compute hue based on mode
    if (colorConfig.mode === 'hue') {
      this.hue = colorConfig.hue;
    } else {
      // Extract hue from character's baseColor
      this.hue = this.extractHueFromHex(colorConfig.character.baseColor);
    }

    // Create button element
    this.element = document.createElement('button');
    this.element.className = this.getButtonClassName();
    this.element.setAttribute('data-step', stepIndex.toString());
    this.element.setAttribute('aria-label', `Step ${stepIndex + 1}`);

    // Add click handler - handles note cycling internally
    this.element.addEventListener('click', () => {
      this.handleClick();
    });

    // Update initial state
    this.updateState();
  }

  /**
   * Handle click - cycle through notes and play preview
   * OFF → C (0) → C# (1) → D (2) → ... → B (11) → OFF
   */
  private handleClick(): void {
    // Cycle to next note
    let newNoteIndex = this.stepState.noteIndex + 1;

    // If we exceed 11 (B), wrap back to -1 (OFF)
    if (newNoteIndex > 11) {
      newNoteIndex = -1;
    }

    const isActive = newNoteIndex >= 0;

    // Update state
    this.stepState = {
      isActive,
      noteIndex: newNoteIndex,
      pressCount: this.stepState.pressCount + 1
    };

    // Update hue based on note (for hue mode)
    if (this.colorConfig.mode === 'hue' && isActive) {
      this.hue = newNoteIndex * 30; // 360° / 12 = 30° per note
    }

    // Update visuals
    this.updateState();

    // Notify parent of state change
    this.callbacks.onStateChange(this.stepIndex, { ...this.stepState });

    // Play preview sound if active and callback provided
    if (isActive && this.callbacks.onPlayPreview) {
      this.callbacks.onPlayPreview(newNoteIndex);
    }
  }

  /**
   * Get appropriate button class name based on mode
   */
  private getButtonClassName(): string {
    if (this.colorConfig.mode === 'character') {
      return 'step-button character-mode';
    }
    return 'step-button';
  }

  /**
   * Extract hue from hex color
   */
  private extractHueFromHex(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return Math.round(h * 360);
  }

  /**
   * Get button element
   */
  getElement(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Update step state
   */
  setStepState(stepState: StepState): void {
    this.stepState = { ...stepState };
    this.updateState();
  }

  /**
   * Get current step state
   */
  getStepState(): StepState {
    return { ...this.stepState };
  }

  /**
   * Get note name from noteIndex
   */
  getNoteName(): string {
    return CHROMATIC_NOTES[this.stepState.noteIndex] || 'C';
  }

  /**
   * Set current step highlight
   */
  setCurrentStep(isCurrent: boolean): void {
    this.element.classList.toggle('current-step', isCurrent);
  }

  /**
   * Update interaction level (for sequencer mode)
   */
  setInteractionLevel(level: number, rowActivity: number = 0): void {
    this.interactionLevel = level;
    this.rowActivity = rowActivity;
    this.updateState();
  }

  /**
   * Update button visual state
   */
  private updateState(): void {
    // Remove all state classes
    this.element.classList.remove('active', 'inactive');

    // Add appropriate class
    if (this.stepState.isActive) {
      this.element.classList.add('active');
    } else {
      this.element.classList.add('inactive');
    }

    // Apply color based on mode
    if (this.colorConfig.mode === 'character') {
      this.applyCharacterColor();
    } else {
      this.applyHueColor();
    }

    // Update content based on mode
    this.updateContent();

    // Add glow effect for active steps
    if (this.stepState.isActive) {
      this.element.classList.add('glow-active');
    } else {
      this.element.classList.remove('glow-active');
    }
  }

  /**
   * Apply color for hue mode (Sequencer/Demo)
   * Uses unified COLOR_PALETTE for consistent colors
   */
  private applyHueColor(): void {
    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      // OFF state: let CSS handle it (white background)
      this.element.style.backgroundColor = '';
      this.element.style.color = '';
      return;
    }

    // Active state: use unified color palette
    const color = COLOR_PALETTE[this.stepState.noteIndex];
    this.element.style.backgroundColor = color;
    this.element.style.color = '#333333';
  }

  /**
   * Apply color for character mode (Character Orchestra)
   * Uses unified COLOR_PALETTE for consistent colors across all modes
   */
  private applyCharacterColor(): void {
    if (this.colorConfig.mode !== 'character') return;

    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      // OFF state: let CSS handle it (white background)
      this.element.style.backgroundColor = '';
      this.element.style.color = '';
      return;
    }

    // Active state: use unified color palette
    const color = COLOR_PALETTE[this.stepState.noteIndex];
    this.element.style.backgroundColor = color;
    this.element.style.color = '#333333';
  }

  /**
   * Calculate saturation (for hue mode)
   */
  private calculateSaturation(): number {
    if (!this.stepState.isActive) return 0;
    return 100; // Always 100% when active - maximum saturation for vibrant colors
  }

  /**
   * Calculate lightness (for hue mode)
   */
  private calculateLightness(): number {
    if (!this.stepState.isActive) return 20;

    // Brighter base lightness values for more vibrant colors
    let baseLightness = 55;
    switch (this.interactionLevel) {
      case 0: return 55; // Much brighter default
      case 1: baseLightness = 58; break;
      case 2: baseLightness = 62; break;
      case 3: baseLightness = 66; break;
      case 4: baseLightness = 70; break;
      case 5: baseLightness = 75; break;
      default: baseLightness = 55;
    }

    const rowBoost = this.rowActivity * 15;
    return Math.min(baseLightness + rowBoost, 90);
  }

  /**
   * Update button content
   */
  private updateContent(): void {
    if (this.colorConfig.mode === 'character') {
      this.renderCharacterContent();
    } else {
      // Sequencer mode: empty button (just color)
      this.element.innerHTML = '';
      const noteName = this.getNoteName();
      this.element.setAttribute('aria-label', 
        `Step ${this.stepIndex + 1} - ${noteName} (${this.stepState.pressCount} presses)`
      );
    }
  }

  /**
   * Render character mode content (note only, no emoji)
   */
  private renderCharacterContent(): void {
    if (this.colorConfig.mode !== 'character') return;

    const character = this.colorConfig.character;

    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      this.element.innerHTML = '';
      this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${character.name} (off)`);
      return;
    }

    // Note label only (no emoji)
    const noteLabel = document.createElement('div');
    noteLabel.className = 'step-note-label';
    
    if (character.canPitch && this.stepState.noteIndex >= 0) {
      noteLabel.textContent = CHROMATIC_NOTES[this.stepState.noteIndex];
    } else {
      noteLabel.textContent = '♪';
    }

    this.element.innerHTML = '';
    this.element.appendChild(noteLabel);

    const noteText = character.canPitch 
      ? CHROMATIC_NOTES[this.stepState.noteIndex] 
      : '♪';
    this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${character.name} - ${noteText}`);
  }
}

