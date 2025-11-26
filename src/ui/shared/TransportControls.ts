/**
 * Transport Controls Component
 * Reusable transport controls (Play, Stop, BPM) for consistent UI across the app
 */

import { Slider } from './Slider';
import { playbackStore } from '../../core/store';
import { handleButtonActivate } from './utils';
import type { PlaybackState } from '../../types';

export interface TransportControlsOptions {
  initialBPM?: number;
  minBPM?: number;
  maxBPM?: number;
  onPlay?: () => void | Promise<void>;
  onStop?: () => void;
  onBPMChange?: (bpm: number) => void;
  className?: string;
}

export class TransportControls {
  private element!: HTMLElement;
  private playBtn!: HTMLElement;
  private stopBtn!: HTMLElement;
  private bpmSlider!: Slider;
  private unsubscribe?: () => void;
  private options: TransportControlsOptions;

  constructor(options: TransportControlsOptions) {
    this.options = {
      initialBPM: 120,
      minBPM: 60,
      maxBPM: 200,
      ...options
    };

    this.createElement();
    this.setupEventHandlers();
    this.subscribeToPlaybackState();
  }

  private createElement(): void {
    // Main container
    this.element = document.createElement('div');
    this.element.className = 'transport-controls';
    if (this.options.className) {
      this.element.classList.add(this.options.className);
    }

    // Button group
    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'transport-controls-buttons';

    // Play button
    this.playBtn = document.createElement('span');
    this.playBtn.className = 'transport-controls-btn play-btn';
    this.playBtn.setAttribute('role', 'button');
    this.playBtn.setAttribute('tabindex', '0');
    this.playBtn.textContent = '▶ Play';

    // Stop button
    this.stopBtn = document.createElement('span');
    this.stopBtn.className = 'transport-controls-btn stop-btn';
    this.stopBtn.setAttribute('role', 'button');
    this.stopBtn.setAttribute('tabindex', '0');
    this.stopBtn.textContent = '⏹ Stop';

    buttonGroup.appendChild(this.playBtn);
    buttonGroup.appendChild(this.stopBtn);

    // BPM slider container
    const bpmContainer = document.createElement('div');
    bpmContainer.className = 'transport-controls-bpm';

    // Create BPM slider using Slider component
    this.bpmSlider = new Slider({
      label: 'BPM',
      min: this.options.minBPM!,
      max: this.options.maxBPM!,
      step: 1,
      value: this.options.initialBPM!,
      displayFormat: 'raw',
      onChange: (bpm) => {
        if (this.options.onBPMChange) {
          this.options.onBPMChange(Math.round(bpm));
        }
      }
    });

    bpmContainer.appendChild(this.bpmSlider.getElement());

    // Assemble
    this.element.appendChild(buttonGroup);
    this.element.appendChild(bpmContainer);
  }

  private setupEventHandlers(): void {
    // Play button
    handleButtonActivate(this.playBtn, async () => {
      if (this.options.onPlay) {
        await this.options.onPlay();
      }
    });

    // Stop button
    handleButtonActivate(this.stopBtn, () => {
      if (this.options.onStop) {
        this.options.onStop();
      }
    });
  }

  private subscribeToPlaybackState(): void {
    this.unsubscribe = playbackStore.subscribe((state: PlaybackState) => {
      this.updateButtonStates(state);
    });
  }

  private updateButtonStates(state: PlaybackState): void {
    // Update play button
    this.playBtn.classList.toggle('active', state === 'playing');
    this.playBtn.classList.toggle('disabled', state === 'playing');

    // Update stop button
    this.stopBtn.classList.toggle('disabled', state === 'stopped');
  }

  /**
   * Get the transport controls container element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Set BPM programmatically
   */
  setBPM(bpm: number): void {
    this.bpmSlider.setValue(bpm);
  }

  /**
   * Get current BPM
   */
  getBPM(): number {
    return Math.round(this.bpmSlider.getValue());
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

