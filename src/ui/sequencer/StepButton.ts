/**
 * Step Button Component
 * Individual step button with chromatic note cycling and saturation feedback
 */

import type { StepState } from './Sequencer';

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export class StepButton {
  private element: HTMLButtonElement;
  private stepIndex: number;
  private stepState: StepState;
  private hue: number;
  private interactionLevel: number = 0;
  private rowActivity: number = 0; // Per-row activity level (0-1)

  constructor(
    stepIndex: number,
    stepState: StepState,
    hue: number,
    onClick: (stepIndex: number) => void
  ) {
    this.stepIndex = stepIndex;
    this.stepState = { ...stepState }; // Copy state
    this.hue = hue;

    // Create button element
    this.element = document.createElement('button');
    this.element.className = 'step-button';
    this.element.setAttribute('data-step', stepIndex.toString());
    this.element.setAttribute('aria-label', `Step ${stepIndex + 1}`);
    
    // Add click handler - notify parent, parent will update state
    this.element.addEventListener('click', () => {
      onClick(stepIndex);
    });

    // Update initial state
    this.updateState();
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
   * Update interaction level for color calculation
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

    // Calculate color based on interaction level and press count
    const saturation = this.calculateSaturation();
    const lightness = this.calculateLightness();

    // Set CSS custom properties for color
    this.element.style.setProperty('--step-hue', this.hue.toString());
    this.element.style.setProperty('--step-saturation', `${saturation}%`);
    this.element.style.setProperty('--step-lightness', `${lightness}%`);
    this.element.style.setProperty('--row-activity', this.rowActivity.toString());
    
    // Add glow effect for active steps
    if (this.stepState.isActive) {
      this.element.classList.add('glow-active');
    } else {
      this.element.classList.remove('glow-active');
    }

    // Update aria-label with note information
    const noteName = this.getNoteName();
    this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${noteName} (${this.stepState.pressCount} presses)`);
  }

  /**
   * Calculate saturation based on interaction level, row activity, and press count
   * Steps glow at 100% saturation when active (no dimming)
   */
  private calculateSaturation(): number {
    if (!this.stepState.isActive) return 0; // No color when inactive
    
    // Always return 100% saturation when active (no dimming)
    return 100;
  }

  /**
   * Calculate lightness based on interaction level
   * Enhanced with row activity for more dynamic range
   */
  private calculateLightness(): number {
    if (!this.stepState.isActive) return 20; // Dark when inactive

    // Base lightness from interaction level (40-80% range)
    let baseLightness = 40;
    switch (this.interactionLevel) {
      case 0:
        return 30;
      case 1:
        baseLightness = 40;
        break;
      case 2:
        baseLightness = 55;
        break;
      case 3:
        baseLightness = 65;
        break;
      case 4:
        baseLightness = 75;
        break;
      case 5:
        baseLightness = 85; // Very bright at maximum
        break;
      default:
        baseLightness = 40;
    }

    // Boost lightness based on row activity (up to +15%)
    const rowBoost = this.rowActivity * 15;
    return Math.min(baseLightness + rowBoost, 90);
  }
}

