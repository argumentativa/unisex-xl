/**
 * Demo Controller for Unified Step Button
 * Shows both Sequencer and Character Orchestra modes
 */

import { StepButton, StepState } from './StepButton';
import type { Character } from '../character-orchestra/Character';

// Demo character definitions
const demoCharacters: Character[] = [
  {
    id: 'kick',
    name: 'Kick',
    emoji: '🥁',
    baseColor: '#FF0066',
    canPitch: false,
    soundUrl: '',
    defaultNote: 'C1'
  },
  {
    id: 'snare',
    name: 'Snare',
    emoji: '🎯',
    baseColor: '#00FF66',
    canPitch: false,
    soundUrl: '',
    defaultNote: 'D1'
  },
  {
    id: 'bass',
    name: 'Bass',
    emoji: '🎸',
    baseColor: '#6600FF',
    canPitch: true,
    soundUrl: '',
    defaultNote: 'E1'
  },
  {
    id: 'melody',
    name: 'Melody',
    emoji: '🎹',
    baseColor: '#FFD700',
    canPitch: true,
    soundUrl: '',
    defaultNote: 'C4'
  }
];

class StepButtonDemo {
  private sequencerButtons: StepButton[] = [];
  private characterButtons: StepButton[] = [];
  private currentStep: number = 0;
  private isPlaying: boolean = false;
  private animationInterval: number | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.createSequencerRow();
    this.createCharacterRows();
    this.setupControls();
  }

  /**
   * Create Sequencer mode row
   */
  private createSequencerRow(): void {
    const container = document.getElementById('sequencer-demo');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'step-row';

    for (let i = 0; i < 16; i++) {
      const stepState: StepState = {
        isActive: i % 4 === 0, // Every 4th step active
        noteIndex: i % 12,
        pressCount: 0
      };

      const button = new StepButton(
        i,
        stepState,
        { mode: 'hue', hue: 220 }, // Blue hue for demo
        (index) => this.handleSequencerClick(index)
      );

      this.sequencerButtons.push(button);
      row.appendChild(button.getElement());
    }

    container.appendChild(row);
  }

  /**
   * Create Character Orchestra mode rows
   */
  private createCharacterRows(): void {
    const container = document.getElementById('character-demo');
    if (!container) return;

    demoCharacters.forEach((character) => {
      const rowContainer = document.createElement('div');
      rowContainer.className = 'character-row-container';

      const label = document.createElement('div');
      label.className = 'character-label';
      label.textContent = `${character.emoji} ${character.name}`;
      rowContainer.appendChild(label);

      const row = document.createElement('div');
      row.className = 'step-row character-row';

      const buttons: StepButton[] = [];

      for (let i = 0; i < 8; i++) {
        const stepState: StepState = {
          isActive: i === 0 || i === 4, // First and middle step active
          noteIndex: character.canPitch ? i : 0,
          pressCount: 0
        };

        const button = new StepButton(
          i,
          stepState,
          { mode: 'character', character },
          (index) => this.handleCharacterClick(character.id, index, buttons)
        );

        buttons.push(button);
        row.appendChild(button.getElement());
      }

      this.characterButtons.push(...buttons);
      rowContainer.appendChild(row);
      container.appendChild(rowContainer);
    });
  }

  /**
   * Handle sequencer button click
   */
  private handleSequencerClick(index: number): void {
    const button = this.sequencerButtons[index];
    const state = button.getStepState();
    
    state.isActive = !state.isActive;
    state.pressCount++;

    if (state.isActive) {
      state.noteIndex = (state.noteIndex + 1) % 12;
    }

    button.setStepState(state);
    
    // Update interaction level based on press count
    const interactionLevel = Math.min(state.pressCount, 5);
    button.setInteractionLevel(interactionLevel);
  }

  /**
   * Handle character button click
   */
  private handleCharacterClick(characterId: string, index: number, rowButtons: StepButton[]): void {
    const button = rowButtons[index];
    const state = button.getStepState();
    
    state.isActive = !state.isActive;
    state.pressCount++;

    // For melody/bass, cycle through notes
    const character = demoCharacters.find(c => c.id === characterId);
    if (character?.canPitch && state.isActive) {
      state.noteIndex = (state.noteIndex + 1) % 12;
    }

    button.setStepState(state);
  }

  /**
   * Setup playback controls
   */
  private setupControls(): void {
    const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
    const stopBtn = document.getElementById('stop-btn') as HTMLButtonElement;
    const randomizeBtn = document.getElementById('randomize-btn') as HTMLButtonElement;

    playBtn?.addEventListener('click', () => this.startPlayback());
    stopBtn?.addEventListener('click', () => this.stopPlayback());
    randomizeBtn?.addEventListener('click', () => this.randomize());
  }

  /**
   * Start playback animation
   */
  private startPlayback(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.animationInterval = window.setInterval(() => {
      // Clear previous step highlight
      this.sequencerButtons.forEach(btn => btn.setCurrentStep(false));
      this.characterButtons.forEach(btn => btn.setCurrentStep(false));

      // Highlight current step
      this.sequencerButtons[this.currentStep]?.setCurrentStep(true);
      
      // Highlight corresponding steps in character rows (8 steps vs 16)
      const charStep = Math.floor(this.currentStep / 2);
      this.characterButtons.forEach((btn, idx) => {
        if (idx % 8 === charStep) {
          btn.setCurrentStep(true);
        }
      });

      // Move to next step
      this.currentStep = (this.currentStep + 1) % 16;
    }, 200); // 120 BPM sixteenth notes
  }

  /**
   * Stop playback animation
   */
  private stopPlayback(): void {
    if (!this.isPlaying) return;
    this.isPlaying = false;

    if (this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    // Clear all highlights
    this.sequencerButtons.forEach(btn => btn.setCurrentStep(false));
    this.characterButtons.forEach(btn => btn.setCurrentStep(false));
    this.currentStep = 0;
  }

  /**
   * Randomize patterns
   */
  private randomize(): void {
    // Randomize sequencer
    this.sequencerButtons.forEach((button, i) => {
      const state = button.getStepState();
      state.isActive = Math.random() > 0.5;
      state.noteIndex = Math.floor(Math.random() * 12);
      button.setStepState(state);
      button.setInteractionLevel(Math.floor(Math.random() * 6));
    });

    // Randomize character buttons
    this.characterButtons.forEach((button, i) => {
      const state = button.getStepState();
      state.isActive = Math.random() > 0.6;
      state.noteIndex = Math.floor(Math.random() * 12);
      button.setStepState(state);
    });
  }
}

// Initialize demo when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new StepButtonDemo());
} else {
  new StepButtonDemo();
}

