/**
 * Instrument Row Component
 * Row containing 16 step buttons for one instrument
 */

import type { InstrumentType } from '../../types';
import type { StepPattern, StepState } from './Sequencer';
import { StepButton } from './StepButton';

export class InstrumentRow {
  private element: HTMLElement;
  private instrumentId: InstrumentType;
  private pattern: StepPattern;
  private hue: number;
  private stepButtons: StepButton[];
  private currentStep: number = -1;
  private interactionLevel: number = 0;
  private rowActivity: number = 0;
  private onStepClick: (stepIndex: number) => void;

  constructor(
    instrumentId: InstrumentType,
    pattern: StepPattern,
    hue: number,
    onStepClick: (stepIndex: number) => void,
    isCurrentStep: (stepIndex: number) => boolean
  ) {
    this.instrumentId = instrumentId;
    this.pattern = pattern;
    this.hue = hue;
    this.onStepClick = onStepClick;
    this.stepButtons = [];

    // Create row element
    this.element = document.createElement('div');
    this.element.className = 'instrument-row';
    this.element.setAttribute('data-instrument', instrumentId);

    // Create instrument label
    const label = document.createElement('div');
    label.className = 'instrument-label';
    label.textContent = this.getInstrumentLabel(instrumentId);
    this.element.appendChild(label);

    // Create steps container
    const stepsContainer = document.createElement('div');
    stepsContainer.className = 'steps-container';

    // Create 16 step buttons with StepState
    for (let i = 0; i < 16; i++) {
      const stepButton = new StepButton(
        i,
        pattern.steps[i],
        hue,
        onStepClick
      );
      this.stepButtons.push(stepButton);
      stepsContainer.appendChild(stepButton.getElement());
    }

    this.element.appendChild(stepsContainer);
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
    if (stepIndex >= 0 && stepIndex < this.stepButtons.length) {
      this.stepButtons[stepIndex].setStepState(stepState);
    }
  }

  /**
   * Update current step indicator
   */
  updateCurrentStep(stepIndex: number): void {
    // Remove current step from previous button
    if (this.currentStep >= 0 && this.currentStep < this.stepButtons.length) {
      this.stepButtons[this.currentStep].setCurrentStep(false);
    }

    // Set new current step
    this.currentStep = stepIndex;
    if (this.currentStep >= 0 && this.currentStep < this.stepButtons.length) {
      this.stepButtons[this.currentStep].setCurrentStep(true);
    }
  }

  /**
   * Update interaction level for color calculation
   * Enhanced with per-row activity level
   */
  updateInteractionLevel(level: number, rowActivity: number = 0): void {
    this.interactionLevel = level;
    this.rowActivity = rowActivity;
    this.stepButtons.forEach((button) => {
      button.setInteractionLevel(level, rowActivity);
    });
    
    // Update row element with activity level for CSS
    this.element.style.setProperty('--row-activity', rowActivity.toString());
    this.element.classList.toggle('row-active', rowActivity > 0);
  }

  /**
   * Get instrument display label
   */
  private getInstrumentLabel(instrumentId: InstrumentType): string {
    const labels: Record<InstrumentType, string> = {
      'synth': 'Synth',
      'polySynth': 'PolySynth',
      'monoSynth': 'MonoSynth',
      'fmSynth': 'FMSynth',
      'amSynth': 'AMSynth',
      'membraneSynth': 'Membrane',
      'noiseSynth': 'Noise',
      'snare': 'Snare',
      'pluckSynth': 'Pluck',
      'metalSynth': 'Metal',
      'duoSynth': 'DuoSynth',
      'monophonic': 'Monophonic',
      'bass': 'Bass',
      'drums': 'Drums'
    };
    return labels[instrumentId] || instrumentId;
  }
}

