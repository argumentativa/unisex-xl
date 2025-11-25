/**
 * Type definitions for UNISEX XL Live Coding Music Application
 */

import * as Tone from 'tone';

/**
 * Instrument types available in the application
 * All Tone.js instrument types for the sequencer
 */
export type InstrumentType = 
  | 'synth' 
  | 'bass' 
  | 'drums'
  | 'snare'
  | 'polySynth'
  | 'monoSynth'
  | 'fmSynth'
  | 'amSynth'
  | 'membraneSynth'
  | 'noiseSynth'
  | 'pluckSynth'
  | 'metalSynth'
  | 'duoSynth'
  | 'monophonic';

/**
 * Effect types available in the application
 */
export type EffectType = 'reverb' | 'delay' | 'distortion' | 'bitcrusher';

/**
 * Playback state of the transport
 */
export type PlaybackState = 'playing' | 'paused' | 'stopped';


/**
 * Configuration for an instrument
 */
export interface InstrumentConfig {
  type: InstrumentType;
  enabled: boolean;
  volume: number;
  instance: Tone.ToneAudioNode | null;
}

/**
 * Configuration for an effect
 */
export interface EffectConfig {
  type: EffectType;
  value: number;
  instance: Tone.Reverb | Tone.FeedbackDelay | Tone.Distortion | Tone.BitCrusher | null;
}

/**
 * Pattern definition for sequencing
 */
export interface Pattern {
  name: string;
  notes: string[];
  durations: string[];
  times: string[];
}

/**
 * Console message types
 */
export type ConsoleMessageType = 'info' | 'error' | 'success' | 'warning';

/**
 * Console message
 */
export interface ConsoleMessage {
  type: ConsoleMessageType;
  message: string;
  timestamp: Date;
}

