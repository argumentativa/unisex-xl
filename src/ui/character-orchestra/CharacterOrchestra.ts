/**
 * Character Orchestra - Main Logic
 * Manages characters, patterns, sequences, and playback
 */

import * as Tone from 'tone';
import { CHARACTERS, createCharacterSynth, type Character } from './Character';
import { CharacterRow } from './CharacterRow';
import type { StepState } from '../shared/StepButton';
export type { StepState } from '../shared/StepButton';

export interface CharacterPattern {
  characterIndex: number;
  steps: StepState[]; // 8 step states
}

export class CharacterOrchestra {
  private container: HTMLElement;
  private characters: Character[];
  private patterns: CharacterPattern[];
  private sequences: Map<number, Tone.Sequence>;
  private characterRows: Map<number, CharacterRow>;
  private currentStep: number = 0;
  private isPlaying: boolean = false;
  private bpm: number = 120;
  private stepIndicatorEventId: number | null = null;
  private onStateChangeCallbacks: (() => void)[] = [];

  constructor(container: HTMLElement) {
    this.container = container;
    this.patterns = [];
    this.sequences = new Map();
    this.characterRows = new Map();

    // Initialize characters with full state
    this.characters = CHARACTERS.map((charData, _index) => {
      const synth = createCharacterSynth(charData);
      synth.toDestination();
      
      return {
        ...charData,
        synth,
        emotionalState: 'sleepy' as const,
        hasActiveSteps: false
      };
    });

    // Initialize patterns for each character (8 steps)
    this.characters.forEach((_, index) => {
      this.patterns.push({
        characterIndex: index,
        steps: new Array(8).fill(null).map(() => ({
          noteIndex: -1,
          pressCount: 0,
          isActive: false
        }))
      });
    });
  }

  /**
   * Initialize UI
   */
  init(): void {
    this.container.innerHTML = '';

    this.characters.forEach((character, index) => {
      const pattern = this.patterns[index];
      const row = new CharacterRow(
        character,
        pattern,
        // onStepStateChange - called when StepButton cycles through notes
        (stepIndex: number, newState: StepState) => {
          this.handleStepStateChange(index, stepIndex, newState);
        },
        // onPlayPreview - called to play preview sound
        (noteIndex: number) => {
          this.playPreviewNote(index, noteIndex);
        }
      );

      this.characterRows.set(index, row);
      this.container.appendChild(row.getElement());
    });

    this.updateCharacterStates();
  }

  /**
   * Handle step state change from StepButton
   * Called when user clicks a step and it cycles to next note
   */
  private handleStepStateChange(characterIndex: number, stepIndex: number, newState: StepState): void {
    const pattern = this.patterns[characterIndex];
    if (!pattern) return;

    // Update pattern state
    pattern.steps[stepIndex] = newState;

    // Update sequence for playback
    this.updateSequence(characterIndex);
    this.updateCharacterStates();

    // Notify state change
    this.notifyStateChange();

    // If already playing, update the sequence
    if (this.isPlaying) {
      const sequence = this.sequences.get(characterIndex);
      if (sequence && sequence.state === 'stopped') {
        sequence.start(0);
      }
    }
  }

  /**
   * Play a preview note immediately (for click feedback)
   */
  private playPreviewNote(characterIndex: number, noteIndex: number): void {
    const character = this.characters[characterIndex];
    if (!character.synth) return;

    const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    try {
      if (character.canPitch && noteIndex >= 0) {
        const noteName = CHROMATIC_NOTES[noteIndex];
        const note = `${noteName}${character.octave}`;
        (character.synth as any).triggerAttackRelease(note, '8n');
      } else if (!character.canPitch) {
        // Drums: just trigger without note
        if (character.type === 'membrane') {
              (character.synth as any).triggerAttackRelease('C1', '8n');
            } else {
              (character.synth as any).triggerAttackRelease('8n');
        }
      }
    } catch (error) {
      console.error('Preview sound error:', error);
    }
  }

  /**
   * Create or update Tone.Sequence for a character
   */
  private updateSequence(characterIndex: number): void {
    const character = this.characters[characterIndex];
    const pattern = this.patterns[characterIndex];
    if (!character.synth) return;

    // Stop existing sequence
    const existingSequence = this.sequences.get(characterIndex);
    if (existingSequence) {
      existingSequence.stop();
      existingSequence.dispose();
    }

    const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Create notes array
    const notes: (string | null)[] = pattern.steps.map((stepState) => {
      if (!stepState.isActive) return null;

      if (character.canPitch && stepState.noteIndex >= 0) {
        // Melody/Bass: use chromatic note
        const noteName = CHROMATIC_NOTES[stepState.noteIndex];
        return `${noteName}${character.octave}`;
      } else if (!character.canPitch) {
        // Drums: return special marker
        return 'DRUM';
      }
      return null;
    });

    // Check if there are any active steps
    const hasActiveSteps = notes.some(note => note !== null);

    if (!hasActiveSteps) {
      this.sequences.delete(characterIndex);
      return;
    }

    // Create new sequence
    const sequence = new Tone.Sequence(
      (time, note) => {
        if (note !== null && character.synth) {
          try {
            if (note === 'DRUM') {
              // Drums: trigger without note pitch
              if (character.type === 'membrane') {
                (character.synth as any).triggerAttackRelease('C1', '4n', time);
              } else {
                (character.synth as any).triggerAttackRelease('4n', time);
              }
            } else {
              // Melody/Bass: use note pitch
              (character.synth as any).triggerAttackRelease(note, '4n', time);
            }
          } catch (error) {
            console.error(`Error triggering ${character.name}:`, error);
          }
        }
      },
      notes,
      '8n' // 8th note resolution for 8 steps
    );

    this.sequences.set(characterIndex, sequence);

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

    // Start transport
    Tone.Transport.start();
    Tone.Transport.bpm.value = this.bpm;

    // Create sequences for all characters
    this.characters.forEach((_, index) => {
      this.updateSequence(index);
    });

    // Ensure all sequences start
    this.sequences.forEach((sequence, _index) => {
      if (sequence.state === 'stopped') {
        sequence.start(0);
      }
    });

    // Start step indicator animation
    this.startStepIndicator();
    this.updateCharacterStates();
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (!this.isPlaying) return;

    Tone.Transport.pause();
    this.isPlaying = false;
    this.updateCharacterStates();
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
    Tone.Transport.stop();

    // Reset step indicator
    this.currentStep = 0;
    this.stopStepIndicator();
    this.updateStepIndicator();
    this.updateCharacterStates();
  }

  /**
   * Set BPM
   */
  setBPM(bpm: number): void {
    this.bpm = bpm;
    Tone.Transport.bpm.value = bpm;
  }

  /**
   * Check if currently playing
   */
  isPlayingState(): boolean {
    return this.isPlaying;
  }

  /**
   * Get count of active characters
   */
  getActiveCharacterCount(): number {
    return this.characters.filter(c => c.hasActiveSteps).length;
  }

  /**
   * Register callback for state changes
   */
  onCharacterStateChange(callback: () => void): void {
    this.onStateChangeCallbacks.push(callback);
  }

  /**
   * Notify state change listeners
   */
  private notifyStateChange(): void {
    this.onStateChangeCallbacks.forEach(callback => callback());
  }

  /**
   * Update character emotional states based on step activity
   */
  private updateCharacterStates(): void {
    this.characters.forEach((character, index) => {
      const pattern = this.patterns[index];
      const hasActiveSteps = pattern.steps.some(step => step.isActive);
      character.hasActiveSteps = hasActiveSteps;

      // Update emotional state
      if (!hasActiveSteps) {
        character.emotionalState = 'sleepy';
      } else if (this.isPlaying) {
        character.emotionalState = 'performing';
      } else {
        character.emotionalState = 'awake';
      }

      // Update row display
      const row = this.characterRows.get(index);
      if (row) {
        row.updateCharacterState(character.emotionalState);
      }
    });
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

    // Use Tone.Transport to sync step indicator with audio (8 steps)
    // Update visual FIRST at current step, then increment for next iteration
    this.stepIndicatorEventId = Tone.Transport.scheduleRepeat(() => {
      this.updateStepIndicator();
      this.updateCharacterStates();
      // Increment AFTER updating visual so indicator matches playing audio
      this.currentStep = (this.currentStep + 1) % 8;
    }, '8n', 0); // 8th note resolution for 8 steps

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
    this.characterRows.forEach((row) => {
      row.updateCurrentStep(this.currentStep);
    });
  }
}

