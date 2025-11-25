/**
 * Step Sequencer - Main Logic
 * Manages patterns, sequences, and color feedback
 */

import * as Tone from 'tone';
import type { AudioEngine } from '../../core/audio';
import type { InstrumentType } from '../../types';
import { InstrumentRow } from './InstrumentRow';
import type { StepState } from '../shared/StepButton';
export type { StepState } from '../shared/StepButton';

export interface StepPattern {
  instrumentId: InstrumentType;
  steps: StepState[]; // 16 step states
}

/**
 * Available Tone.js instruments for the sequencer
 */
export const AVAILABLE_INSTRUMENTS: InstrumentType[] = [
  'synth',
  'polySynth',
  'monoSynth',
  'fmSynth',
  'amSynth',
  'membraneSynth',
  'noiseSynth',
  'snare',
  'pluckSynth',
  'metalSynth',
  'duoSynth',
  'monophonic'
];

/**
 * Create a Tone.js instrument instance based on instrument type
 */
export function createInstrumentInstance(type: InstrumentType): Tone.ToneAudioNode {
  switch (type) {
    case 'synth':
      return new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
      });
    
    case 'polySynth':
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
      });
    
    case 'monoSynth':
      return new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.8 },
        filterEnvelope: {
          attack: 0.01,
          decay: 0.1,
          sustain: 0.5,
          release: 0.5,
          baseFrequency: 200,
          octaves: 2.5
        }
      });
    
    case 'fmSynth':
      return new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.5 }
      });
    
    case 'amSynth':
      return new Tone.AMSynth({
        harmonicity: 3,
        oscillator: { type: 'sine' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.5 }
      });
    
    case 'membraneSynth':
      return new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.001,
          decay: 0.4,
          sustain: 0.01,
          release: 1.4,
          attackCurve: 'exponential'
        }
      });
    
    case 'noiseSynth':
      return new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: 0.1,
          sustain: 0,
          release: 0.1
        }
      });
    
    case 'snare':
      return new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: 0.2,
          sustain: 0,
          release: 0.2
        }
      });
    
    case 'pluckSynth':
      return new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.7
      });
    
    case 'metalSynth':
      return new Tone.MetalSynth({
        envelope: {
          attack: 0.001,
          decay: 0.1,
          release: 0.01
        },
        harmonicity: 5.1,
        modulationIndex: 32,
        resonance: 4000,
        octaves: 1.5
      });
    
    case 'duoSynth':
      return new Tone.DuoSynth({
        vibratoAmount: 0.5,
        vibratoRate: 5,
        harmonicity: 1.5,
        voice0: {
          oscillator: { type: 'sawtooth' },
          filterEnvelope: { attack: 0.01, decay: 0, sustain: 1, release: 0.5 }
        },
        voice1: {
          oscillator: { type: 'sawtooth' },
          filterEnvelope: { attack: 0.01, decay: 0, sustain: 1, release: 0.5 }
        }
      });
    
    case 'monophonic':
      // Monophonic is actually a base class, use Synth instead
      return new Tone.Synth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.5 }
      });
    
    default:
      return new Tone.Synth();
  }
}

export class Sequencer {
  private audioEngine: AudioEngine;
  private container: HTMLElement;
  private patterns: StepPattern[];
  private sequences: Map<InstrumentType, Tone.Sequence>;
  private instrumentRows: Map<InstrumentType, InstrumentRow>;
  private currentStep: number = 0;
  private isPlaying: boolean = false;
  private stepIndicatorEventId: number | null = null;

  // Instruments configuration - all available Tone.js instruments
  private readonly instruments: InstrumentType[] = AVAILABLE_INSTRUMENTS;
  private readonly instrumentInstances: Map<InstrumentType, Tone.ToneAudioNode> = new Map();
  private readonly instrumentColors: Map<InstrumentType, number> = new Map([
    ['synth', 180],        // Cyan
    ['polySynth', 200],    // Blue-Cyan
    ['monoSynth', 30],     // Orange
    ['fmSynth', 60],       // Yellow
    ['amSynth', 90],       // Yellow-Green
    ['membraneSynth', 270], // Purple
    ['noiseSynth', 300],   // Magenta
    ['snare', 320],        // Pink
    ['pluckSynth', 150],   // Cyan-Green
    ['metalSynth', 240],   // Blue
    ['duoSynth', 0],       // Red
    ['monophonic', 330]    // Pink-Red
  ]);

  constructor(audioEngine: AudioEngine, container: HTMLElement) {
    this.audioEngine = audioEngine;
    this.container = container;
    this.patterns = [];
    this.sequences = new Map();
    this.instrumentRows = new Map();

    // Initialize patterns for each instrument with StepState objects
    this.instruments.forEach((instrumentId) => {
      this.patterns.push({
        instrumentId,
        steps: new Array(16).fill(null).map(() => ({
          noteIndex: 0, // Start at C
          pressCount: 0,
          isActive: false
        }))
      });
    });
  }

  /**
   * Get or create instrument instance
   */
  private getInstrumentInstance(instrumentId: InstrumentType): Tone.ToneAudioNode {
    if (!this.instrumentInstances.has(instrumentId)) {
      const instance = createInstrumentInstance(instrumentId);
      // Connect to destination (sequencer instruments connect directly)
      instance.toDestination();
      this.instrumentInstances.set(instrumentId, instance);
    }
    return this.instrumentInstances.get(instrumentId)!;
  }

  /**
   * Initialize sequencer UI
   */
  init(): void {
    // Clear container
    this.container.innerHTML = '';

    // Create instrument rows
    this.instruments.forEach((instrumentId) => {
      const pattern = this.patterns.find(p => p.instrumentId === instrumentId)!;
      const hue = this.instrumentColors.get(instrumentId)!;
      
      const row = new InstrumentRow(
        instrumentId,
        pattern,
        hue,
        (stepIndex: number) => this.toggleStep(instrumentId, stepIndex),
        (currentStep: number) => this.currentStep === currentStep
      );

      this.instrumentRows.set(instrumentId, row);
      this.container.appendChild(row.getElement());
    });

    // Update colors based on initial state
    this.updateColors();
  }

  /**
   * Toggle a step - cycles through chromatic scale
   * After 12 presses (full cycle), step turns off
   * Next click resets to C and starts over
   */
  toggleStep(instrumentId: InstrumentType, stepIndex: number): void {
    const pattern = this.patterns.find(p => p.instrumentId === instrumentId);
    if (!pattern) return;

    const stepState = pattern.steps[stepIndex];
    
    // If step is inactive, reset and activate
    if (!stepState.isActive) {
      stepState.noteIndex = 0; // Start at C
      stepState.pressCount = 0;
      stepState.isActive = true;
    } else {
      // Cycle through chromatic scale (0-11)
      stepState.noteIndex = (stepState.noteIndex + 1) % 12;
      stepState.pressCount++;
      
      // After completing full cycle (12 presses), turn step off
      if (stepState.pressCount >= 12) {
        stepState.isActive = false;
        stepState.noteIndex = 0; // Reset to C for next time
        stepState.pressCount = 0;
      }
    }

    // Update UI
    const row = this.instrumentRows.get(instrumentId);
    if (row) {
      row.updateStep(stepIndex, stepState);
    }

    // Always update sequence (will be started when play is pressed)
    this.updateSequence(instrumentId);

    // Update colors
    this.updateColors();
  }

  /**
   * Create or update Tone.Sequence for an instrument
   */
  private updateSequence(instrumentId: InstrumentType): void {
    const pattern = this.patterns.find(p => p.instrumentId === instrumentId);
    if (!pattern) return;

    // Get or create instrument instance
    const instrumentInstance = this.getInstrumentInstance(instrumentId);
    if (!instrumentInstance) return;

    // Stop existing sequence
    const existingSequence = this.sequences.get(instrumentId);
    if (existingSequence) {
      existingSequence.stop();
      existingSequence.dispose();
    }

    // Chromatic note names
    const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Determine base octave for instrument type
    let baseOctave = 4; // Default
    if (instrumentId === 'membraneSynth' || instrumentId === 'drums') {
      baseOctave = 1; // Low for kicks
    } else if (instrumentId === 'noiseSynth' || instrumentId === 'snare') {
      baseOctave = 4; // Mid for snares/cymbals
    } else if (instrumentId === 'monoSynth' || instrumentId === 'bass') {
      baseOctave = 2; // Low for bass
    } else {
      baseOctave = 4; // Standard for melodic instruments
    }

    // Create notes array (null for inactive steps)
    const notes: (string | null)[] = pattern.steps.map((stepState) => {
      if (!stepState.isActive) return null;
      
      // Calculate actual note from noteIndex
      const noteName = CHROMATIC_NOTES[stepState.noteIndex];
      return `${noteName}${baseOctave}`;
    });

    // Check if there are any active steps
    const hasActiveSteps = notes.some(note => note !== null);
    
    // Debug logging
    if (hasActiveSteps) {
      console.log(`Creating sequence for ${instrumentId} with notes:`, notes.filter(n => n !== null));
    }

    // Only create sequence if there are active steps
    if (!hasActiveSteps) {
      // Stop and remove existing sequence if no active steps
      const existingSequence = this.sequences.get(instrumentId);
      if (existingSequence) {
        existingSequence.stop();
        existingSequence.dispose();
        this.sequences.delete(instrumentId);
      }
      return;
    }

    // Create new sequence
    const sequence = new Tone.Sequence(
      (time, note) => {
        if (note !== null && instrumentInstance) {
          try {
            // Handle different instrument types
            if (instrumentId === 'noiseSynth' || instrumentId === 'snare') {
              // Only NoiseSynth doesn't use note pitches - just duration
              (instrumentInstance as any).triggerAttackRelease('16n', time);
            } else {
              // All other instruments (including MetalSynth and PluckSynth) use note pitches
              (instrumentInstance as any).triggerAttackRelease(note, '16n', time);
            }
          } catch (error) {
            console.error(`Error triggering ${instrumentId} with note ${note}:`, error);
          }
        }
      },
      notes,
      '16n'
    );

    this.sequences.set(instrumentId, sequence);

    // Start sequence if playing
    if (this.isPlaying) {
      sequence.start(0);
    }
  }

  /**
   * Start playback
   */
  play(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;

    // Start transport first
    this.audioEngine.play();

    // Create sequences for all instruments (will start automatically)
    this.instruments.forEach((instrumentId) => {
      this.updateSequence(instrumentId);
    });

    // Ensure all sequences start
    this.sequences.forEach((sequence, instrumentId) => {
      if (sequence.state === 'stopped') {
        sequence.start(0);
        console.log(`Started sequence for ${instrumentId}`);
      } else {
        console.log(`Sequence for ${instrumentId} already started (state: ${sequence.state})`);
      }
    });

    console.log(`Sequencer playing: ${this.sequences.size} sequences active`);

    // Start step indicator animation
    this.startStepIndicator();
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.isPlaying) return;

    this.audioEngine.pause();
    // Step indicator pauses automatically with Transport, no need to clear it
  }

  /**
   * Stop playback
   */
  stop(): void {
    this.isPlaying = false;

    // Stop all sequences
    this.sequences.forEach((sequence) => {
      sequence.stop();
      sequence.dispose();
    });
    this.sequences.clear();

    // Stop transport
    this.audioEngine.stop();

    // Reset step indicator
    this.currentStep = 0;
    this.stopStepIndicator();
    this.updateStepIndicator();
  }

  /**
   * Set BPM
   */
  setBPM(bpm: number): void {
    this.audioEngine.setBPM(bpm);
  }

  /**
   * Start step indicator animation
   */
  private startStepIndicator(): void {
    // Cancel existing indicator if any
    if (this.stepIndicatorEventId !== null) {
      Tone.Transport.clear(this.stepIndicatorEventId);
      this.stepIndicatorEventId = null;
    }
    
    // Reset current step
    this.currentStep = 0;
    
    // Use Tone.Transport to sync step indicator with audio
    // Store the event ID so we can cancel it specifically
    this.stepIndicatorEventId = Tone.Transport.scheduleRepeat(() => {
      this.currentStep = (this.currentStep + 1) % 16;
      this.updateStepIndicator();
    }, '16n', 0);

    // Initial update
    this.updateStepIndicator();
  }

  /**
   * Stop step indicator animation
   */
  private stopStepIndicator(): void {
    if (this.stepIndicatorEventId !== null) {
      Tone.Transport.clear(this.stepIndicatorEventId);
      this.stepIndicatorEventId = null;
    }
  }

  /**
   * Update step indicator visual feedback
   */
  private updateStepIndicator(): void {
    this.instrumentRows.forEach((row) => {
      row.updateCurrentStep(this.currentStep);
    });
  }

  /**
   * Calculate interaction level (0-4) based on total active steps
   */
  private calculateInteractionLevel(): number {
    const totalActiveSteps = this.patterns.reduce((sum, pattern) => {
      return sum + pattern.steps.filter(stepState => stepState.isActive).length;
    }, 0);

    if (totalActiveSteps === 0) return 0;
    if (totalActiveSteps <= 4) return 1;
    if (totalActiveSteps <= 8) return 2;
    if (totalActiveSteps <= 12) return 3;
    return 4;
  }

  /**
   * Calculate per-row activity level (0-1) for individual row color intensity
   */
  private calculateRowActivityLevel(pattern: StepPattern): number {
    const activeSteps = pattern.steps.filter(stepState => stepState.isActive).length;
    return Math.min(activeSteps / 16, 1); // Normalize to 0-1
  }

  /**
   * Update colors based on interaction level
   * Enhanced with per-row intensity
   */
  private updateColors(): void {
    const interactionLevel = this.calculateInteractionLevel();
    
    // Update body data attribute for CSS selectors
    document.body.setAttribute('data-interaction-level', interactionLevel.toString());
    
    // Update each row with global interaction level and per-row activity
    this.instrumentRows.forEach((row, instrumentId) => {
      const pattern = this.patterns.find(p => p.instrumentId === instrumentId);
      const rowActivity = pattern ? this.calculateRowActivityLevel(pattern) : 0;
      row.updateInteractionLevel(interactionLevel, rowActivity);
    });
  }
}

