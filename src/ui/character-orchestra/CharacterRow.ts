/**
 * Character Row Component
 * Row containing character avatar and 16 step buttons
 */

import type { Character } from './Character';
import type { CharacterPattern, StepState } from './CharacterOrchestra';
import { StepButton } from './StepButton';

export class CharacterRow {
  private element: HTMLElement;
  private character: Character;
  private pattern: CharacterPattern;
  private stepButtons: StepButton[];
  private currentStep: number = -1;
  private emotionalState: 'sleepy' | 'awake' | 'performing' = 'sleepy';
  private scrollContainer: HTMLElement | null = null;

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

    // Create scrolling container for infinite scroll
    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'steps-scroll-wrapper';
    
    const scrollContainer = document.createElement('div');
    scrollContainer.className = `steps-scroll-container scroll-${this.getScrollDirection()}`;
    
    // Create 8 step buttons (4 visible + 4 duplicate for seamless loop)
    for (let i = 0; i < 8; i++) {
      const stepIndex = i % 4; // Cycle through 0-3
      const stepButton = new StepButton(
        stepIndex,
        pattern.steps[stepIndex],
        character,
        onStepClick
      );
      this.stepButtons.push(stepButton);
      scrollContainer.appendChild(stepButton.getElement());
    }

    scrollWrapper.appendChild(scrollContainer);
    this.element.appendChild(scrollWrapper);
    this.scrollContainer = scrollContainer;
  }

  /**
   * Get row element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Get scroll direction based on character index
   */
  private getScrollDirection(): string {
    // Even rows (0, 2, 4, 6): right-to-left
    // Odd rows (1, 3, 5, 7): left-to-right
    const characterIndex = this.pattern.characterIndex;
    return characterIndex % 2 === 0 ? 'right-to-left' : 'left-to-right';
  }

  /**
   * Update a step's state (updates both instances in the 8-button loop)
   */
  updateStep(stepIndex: number, stepState: StepState): void {
    if (stepIndex >= 0 && stepIndex < 4) {
      // Update both instances (stepIndex and stepIndex + 4)
      if (stepIndex < this.stepButtons.length) {
        this.stepButtons[stepIndex].setStepState(stepState);
      }
      if (stepIndex + 4 < this.stepButtons.length) {
        this.stepButtons[stepIndex + 4].setStepState(stepState);
      }
    }
  }

  /**
   * Update current step indicator (updates both instances in the loop)
   */
  updateCurrentStep(stepIndex: number): void {
    // Remove current step from previous buttons (both instances)
    if (this.currentStep >= 0 && this.currentStep < 4) {
      if (this.currentStep < this.stepButtons.length) {
        this.stepButtons[this.currentStep].setCurrentStep(false);
      }
      if (this.currentStep + 4 < this.stepButtons.length) {
        this.stepButtons[this.currentStep + 4].setCurrentStep(false);
      }
    }

    // Set new current step (both instances)
    this.currentStep = stepIndex;
    if (this.currentStep >= 0 && this.currentStep < 4) {
      if (this.currentStep < this.stepButtons.length) {
        this.stepButtons[this.currentStep].setCurrentStep(true);
      }
      if (this.currentStep + 4 < this.stepButtons.length) {
        this.stepButtons[this.currentStep + 4].setCurrentStep(true);
      }
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

