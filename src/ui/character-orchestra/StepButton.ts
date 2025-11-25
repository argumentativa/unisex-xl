/**
 * Step Button Component for Character Orchestra
 * Circular button with character emoji, note label, and pitch-based color
 */

import type { Character } from './Character';
import type { StepState } from './CharacterOrchestra';

const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export class StepButton {
  private element: HTMLButtonElement;
  private stepIndex: number;
  private stepState: StepState;
  private character: Character;

  constructor(
    stepIndex: number,
    stepState: StepState,
    character: Character,
    onClick: (stepIndex: number) => void
  ) {
    this.stepIndex = stepIndex;
    this.stepState = { ...stepState };
    this.character = character;

    // Create button element
    this.element = document.createElement('button');
    this.element.className = 'character-step-button';
    this.element.setAttribute('data-step', stepIndex.toString());
    
    // Add click handler
    this.element.addEventListener('click', () => {
      onClick(stepIndex);
    });

    // Update initial state
    this.updateAppearance();
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
    this.updateAppearance();
  }

  /**
   * Set current step highlight
   */
  setCurrentStep(isCurrent: boolean): void {
    this.element.classList.toggle('current-step', isCurrent);
  }

  /**
   * Update button visual appearance
   */
  private updateAppearance(): void {
    // Remove all state classes
    this.element.classList.remove('active', 'inactive');

    if (this.stepState.isActive) {
      this.element.classList.add('active');
    } else {
      this.element.classList.add('inactive');
    }

    // Calculate color based on pitch
    const color = this.calculateColor();
    
    // Set background color
    this.element.style.backgroundColor = color.backgroundColor;
    this.element.style.borderColor = color.borderColor;
    this.element.style.color = color.textColor;

    // Update content
    this.updateContent();
  }

  /**
   * Calculate color based on pitch (lightness increases with note height)
   */
  private calculateColor(): { backgroundColor: string; borderColor: string; textColor: string } {
    const baseColor = this.character.baseColor;
    
    // Convert hex to RGB
    const r = parseInt(baseColor.slice(1, 3), 16);
    const g = parseInt(baseColor.slice(3, 5), 16);
    const b = parseInt(baseColor.slice(5, 7), 16);

    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      // OFF state: dark gray
      return {
        backgroundColor: 'rgba(42, 42, 46, 0.3)',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        textColor: 'rgba(255, 255, 255, 0.3)'
      };
    }

    if (this.character.canPitch) {
      // Melody/Bass: lightness increases with pitch
      // C (noteIndex 0) = 25% lightness, B (noteIndex 11) = 75% lightness
      const lightness = 25 + (this.stepState.noteIndex / 11) * 50;
      
      // Calculate HSL color
      const hsl = this.rgbToHsl(r, g, b);
      const backgroundColor = `hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`;
      
      return {
        backgroundColor,
        borderColor: '#ffffff',
        textColor: '#ffffff'
      };
    } else {
      // Drums: fixed medium lightness (50%)
      const hsl = this.rgbToHsl(r, g, b);
      const backgroundColor = `hsl(${hsl.h}, ${hsl.s}%, 50%)`;
      
      return {
        backgroundColor,
        borderColor: '#ffffff',
        textColor: '#ffffff'
      };
    }
  }

  /**
   * Convert RGB to HSL
   */
  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

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

  /**
   * Update button content (emoji and note label)
   */
  private updateContent(): void {
    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      // OFF state: empty
      this.element.innerHTML = '';
      this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${this.character.name} (off)`);
      return;
    }

    // Character emoji
    const emoji = document.createElement('div');
    emoji.className = 'step-emoji';
    emoji.textContent = this.character.emoji;

    // Note label
    const noteLabel = document.createElement('div');
    noteLabel.className = 'step-note-label';
    
    if (this.character.canPitch && this.stepState.noteIndex >= 0) {
      noteLabel.textContent = CHROMATIC_NOTES[this.stepState.noteIndex];
    } else {
      noteLabel.textContent = '♪';
    }

    this.element.innerHTML = '';
    this.element.appendChild(emoji);
    this.element.appendChild(noteLabel);

    // Update aria-label
    const noteText = this.character.canPitch 
      ? CHROMATIC_NOTES[this.stepState.noteIndex] 
      : '♪';
    this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${this.character.name} - ${noteText}`);
  }
}

