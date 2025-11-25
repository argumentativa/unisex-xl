/**
 * Character Row Component
 * Row containing character avatar and 16 step buttons
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

  constructor(
    character: Character,
    pattern: CharacterPattern,
    onStepClick: (stepIndex: number) => void,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isCurrentStep: (stepIndex: number) => boolean
  ) {
    this.character = character;
    this.pattern = pattern;
    this.stepButtons = [];

    // Create row element
    this.element = document.createElement('div');
    this.element.className = 'character-row';
    this.element.setAttribute('data-character', character.name);

    // Create 4 step buttons directly in the row
    for (let i = 0; i < 4; i++) {
      const stepButton = new StepButton(
        i,
        pattern.steps[i],
        { mode: 'character', character },
        onStepClick
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
    if (stepIndex >= 0 && stepIndex < 4 && stepIndex < this.stepButtons.length) {
      this.stepButtons[stepIndex].setStepState(stepState);
    }
  }

  /**
   * Update current step indicator
   */
  updateCurrentStep(stepIndex: number): void {
    // Remove current step from previous button
    if (this.currentStep >= 0 && this.currentStep < 4 && this.currentStep < this.stepButtons.length) {
      this.stepButtons[this.currentStep].setCurrentStep(false);
    }

    // Set new current step
    this.currentStep = stepIndex;
    if (this.currentStep >= 0 && this.currentStep < 4 && this.currentStep < this.stepButtons.length) {
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

