/**
 * Character Definitions
 * Character data structures and Tone.js synth creation for Character Orchestra
 */

import * as Tone from 'tone';

export interface Character {
  name: string;
  emoji: string;
  baseColor: string;
  type: 'membrane' | 'noise' | 'metal' | 'synth' | 'pluck' | 'fm' | 'mono' | 'poly';
  octave: number;
  canPitch: boolean;
  synth: Tone.ToneAudioNode | null;
  emotionalState: 'sleepy' | 'awake' | 'performing';
  hasActiveSteps: boolean;
}

/**
 * Create Tone.js synth instance for a character
 */
export function createCharacterSynth(character: Character): Tone.ToneAudioNode {
  switch (character.type) {
    case 'membrane':
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

    case 'noise':
      return new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
          attack: 0.001,
          decay: 0.2,
          sustain: 0,
          release: 0.2
        }
      });

    case 'metal':
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

    case 'synth':
      return new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      });

    case 'pluck':
      return new Tone.PluckSynth({
        attackNoise: 1,
        dampening: 4000,
        resonance: 0.7
      });

    case 'fm':
      return new Tone.FMSynth({
        harmonicity: 3,
        modulationIndex: 10,
        detune: 0,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.01,
          sustain: 1,
          release: 0.5
        },
        modulation: { type: 'square' },
        modulationEnvelope: {
          attack: 0.5,
          decay: 0,
          sustain: 1,
          release: 0.5
        }
      });

    case 'mono':
      return new Tone.MonoSynth({
        oscillator: { type: 'square' },
        envelope: {
          attack: 0.1,
          decay: 0.3,
          sustain: 0.4,
          release: 0.8
        },
        filterEnvelope: {
          attack: 0.001,
          decay: 0.01,
          sustain: 0.5,
          baseFrequency: 200,
          octaves: 2.6
        }
      });

    case 'poly':
      return new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.02,
          decay: 0.1,
          sustain: 0.3,
          release: 1
        }
      });

    default:
      return new Tone.Synth();
  }
}

/**
 * All 8 characters for Character Orchestra
 */
export const CHARACTERS: Omit<Character, 'synth' | 'emotionalState' | 'hasActiveSteps'>[] = [
  {
    name: 'Boom the Elephant',
    emoji: '🐘',
    baseColor: '#ff6b6b',
    type: 'membrane',
    octave: 1,
    canPitch: false
  },
  {
    name: 'Snap the Squirrel',
    emoji: '🐿️',
    baseColor: '#4ecdc4',
    type: 'noise',
    octave: 4,
    canPitch: false
  },
  {
    name: 'Shimmer the Bird',
    emoji: '🐦',
    baseColor: '#ffe66d',
    type: 'metal',
    octave: 4,
    canPitch: false
  },
  {
    name: 'Melody the Fox',
    emoji: '🦊',
    baseColor: '#f38181',
    type: 'synth',
    octave: 4,
    canPitch: true
  },
  {
    name: 'Pluck the Rabbit',
    emoji: '🐰',
    baseColor: '#95e1d3',
    type: 'pluck',
    octave: 4,
    canPitch: true
  },
  {
    name: 'Glow the Firefly',
    emoji: '✨',
    baseColor: '#aa96da',
    type: 'fm',
    octave: 5,
    canPitch: true
  },
  {
    name: 'Rumble the Bear',
    emoji: '🐻',
    baseColor: '#a8e6cf',
    type: 'mono',
    octave: 2,
    canPitch: true
  },
  {
    name: 'Chorus the Birds',
    emoji: '🐦‍⬛',
    baseColor: '#fcbad3',
    type: 'poly',
    octave: 4,
    canPitch: true
  }
];

