/**
 * Unified Step Button Component
 * Works for both Sequencer (hue-based) and Character Orchestra (character-based) modes
 */

import type { Character } from '../character-orchestra/Character';

export interface StepState {
  isActive: boolean;
  noteIndex: number;
  pressCount: number;
}

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

type ColorConfig = 
  | { mode: 'hue'; hue: number }
  | { mode: 'character'; character: Character };

export class StepButton {
  private element: HTMLButtonElement;
  private stepIndex: number;
  private stepState: StepState;
  private colorConfig: ColorConfig;
  private interactionLevel: number = 0;
  private rowActivity: number = 0;
  private hue: number; // Computed hue for both modes

  constructor(
    stepIndex: number,
    stepState: StepState,
    colorConfig: ColorConfig,
    onClick: (stepIndex: number) => void
  ) {
    this.stepIndex = stepIndex;
    this.stepState = { ...stepState };
    this.colorConfig = colorConfig;

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
    
    // Add click handler
    this.element.addEventListener('click', () => {
      onClick(stepIndex);
    });

    // Update initial state
    this.updateState();
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
   * Apply color for hue mode (Sequencer)
   */
  private applyHueColor(): void {
    const saturation = this.calculateSaturation();
    const lightness = this.calculateLightness();

    this.element.style.setProperty('--step-hue', this.hue.toString());
    this.element.style.setProperty('--step-saturation', `${saturation}%`);
    this.element.style.setProperty('--step-lightness', `${lightness}%`);
    this.element.style.setProperty('--row-activity', this.rowActivity.toString());

    // Clear inline styles used by character mode
    this.element.style.backgroundColor = '';
    this.element.style.borderColor = '';
    this.element.style.color = '';
  }

  /**
   * Apply color for character mode (Character Orchestra)
   */
  private applyCharacterColor(): void {
    if (this.colorConfig.mode !== 'character') return;

    const character = this.colorConfig.character;
    
    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      // OFF state: dark gray
      this.element.style.backgroundColor = 'rgba(42, 42, 46, 0.3)';
      this.element.style.borderColor = 'rgba(255, 255, 255, 0.3)';
      this.element.style.color = 'rgba(255, 255, 255, 0.3)';
      return;
    }

    if (character.canPitch) {
      // Melody/Bass: lightness increases with pitch
      const lightness = 25 + (this.stepState.noteIndex / 11) * 50;
      this.element.style.backgroundColor = `hsl(${this.hue}, 70%, ${lightness}%)`;
      this.element.style.borderColor = '#ffffff';
      this.element.style.color = '#ffffff';
    } else {
      // Drums: fixed medium lightness
      this.element.style.backgroundColor = `hsl(${this.hue}, 70%, 50%)`;
      this.element.style.borderColor = '#ffffff';
      this.element.style.color = '#ffffff';
    }
  }

  /**
   * Calculate saturation (for hue mode)
   */
  private calculateSaturation(): number {
    if (!this.stepState.isActive) return 0;
    return 100; // Always 100% when active
  }

  /**
   * Calculate lightness (for hue mode)
   */
  private calculateLightness(): number {
    if (!this.stepState.isActive) return 20;

    let baseLightness = 40;
    switch (this.interactionLevel) {
      case 0: return 30;
      case 1: baseLightness = 40; break;
      case 2: baseLightness = 55; break;
      case 3: baseLightness = 65; break;
      case 4: baseLightness = 75; break;
      case 5: baseLightness = 85; break;
      default: baseLightness = 40;
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
   * Render character mode content (emoji + note)
   */
  private renderCharacterContent(): void {
    if (this.colorConfig.mode !== 'character') return;

    const character = this.colorConfig.character;

    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      this.element.innerHTML = '';
      this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${character.name} (off)`);
      return;
    }

    // Character emoji
    const emoji = document.createElement('div');
    emoji.className = 'step-emoji';
    emoji.textContent = character.emoji;

    // Note label
    const noteLabel = document.createElement('div');
    noteLabel.className = 'step-note-label';
    
    if (character.canPitch && this.stepState.noteIndex >= 0) {
      noteLabel.textContent = CHROMATIC_NOTES[this.stepState.noteIndex];
    } else {
      noteLabel.textContent = '♪';
    }

    this.element.innerHTML = '';
    this.element.appendChild(emoji);
    this.element.appendChild(noteLabel);

    const noteText = character.canPitch 
      ? CHROMATIC_NOTES[this.stepState.noteIndex] 
      : '♪';
    this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${character.name} - ${noteText}`);
  }
}

