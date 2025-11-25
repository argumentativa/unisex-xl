/**
 * Character Row Component
 * Row containing 16 step buttons for one character
 */

import type { Character } from './Character';
import type { CharacterPattern, StepState } from './CharacterOrchestra';
import { StepButton } from '../shared/StepButton';

export class CharacterRow {
  private element: HTMLElement;
  private character: Character;
  private pattern: CharacterPattern;
  private stepButtons: StepButton[];
  private currentStep: number = -1;
  private emotionalState: 'sleepy' | 'awake' | 'performing' = 'sleepy';
  private onStepStateChange: (stepIndex: number, newState: StepState) => void;
  private onPlayPreview?: (noteIndex: number) => void;

  constructor(
    character: Character,
    pattern: CharacterPattern,
    onStepStateChange: (stepIndex: number, newState: StepState) => void,
    onPlayPreview?: (noteIndex: number) => void
  ) {
    this.character = character;
    this.pattern = pattern;
    this.onStepStateChange = onStepStateChange;
    this.onPlayPreview = onPlayPreview;
    this.stepButtons = [];

    // Create row element
    this.element = document.createElement('div');
    this.element.className = 'character-row';
    this.element.setAttribute('data-character', character.name);

    // Create 16 step buttons with callbacks
    for (let i = 0; i < 16; i++) {
      const stepButton = new StepButton(
        i,
        pattern.steps[i],
        { mode: 'character', character },
        {
          onStateChange: (stepIndex, newState) => {
            // Update local pattern
            this.pattern.steps[stepIndex] = newState;
            // Notify parent
            this.onStepStateChange(stepIndex, newState);
          },
          onPlayPreview: this.onPlayPreview
        }
      );
      this.stepButtons.push(stepButton);
      this.element.appendChild(stepButton.getElement());
    }
  }

  /**
   * Get row element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Update a step's state
   */
  updateStep(stepIndex: number, stepState: StepState): void {
    if (stepIndex >= 0 && stepIndex < 16 && stepIndex < this.stepButtons.length) {
      this.stepButtons[stepIndex].setStepState(stepState);
    }
  }

  /**
   * Update current step indicator
   */
  updateCurrentStep(stepIndex: number): void {
    // Remove current step from previous button
    if (this.currentStep >= 0 && this.currentStep < 16 && this.currentStep < this.stepButtons.length) {
      this.stepButtons[this.currentStep].setCurrentStep(false);
    }

    // Set new current step
    this.currentStep = stepIndex;
    if (this.currentStep >= 0 && this.currentStep < 16 && this.currentStep < this.stepButtons.length) {
      this.stepButtons[this.currentStep].setCurrentStep(true);
    }
  }

  /**
   * Update character emotional state
   * (State is tracked internally but not displayed)
   */
  updateCharacterState(state: 'sleepy' | 'awake' | 'performing'): void {
    this.emotionalState = state;
    // State is tracked internally for audio/state management but not displayed
  }

  /**
   * Get status emoji based on emotional state
   */
  private getStatusEmoji(): string {
    switch (this.emotionalState) {
      case 'sleepy':
        return '💤';
      case 'awake':
        return '😊';
      case 'performing':
        return '🎭';
      default:
        return '💤';
    }
  }
}

