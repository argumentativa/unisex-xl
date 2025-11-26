/**
 * Audio Engine - Simplified Tone.js audio engine
 * Manages instruments, effects, transport, and analyzer
 */

import * as Tone from 'tone';
import type { InstrumentType, EffectType, InstrumentConfig, EffectConfig } from '../types';

export class AudioEngine {
  private instruments: Map<InstrumentType, InstrumentConfig>;
  private effects: Map<EffectType, EffectConfig>;
  private effectChain: Tone.ToneAudioNode[];
  private masterVolume: Tone.Volume | null = null;
  private analyzer: Tone.Analyser | null = null;
  private initialized = false;

  constructor() {
    this.instruments = new Map();
    this.effects = new Map();
    this.effectChain = [];
    // Don't initialize audio here - wait for user gesture
    // Transport state sync is handled by playbackStore
  }

  /**
   * Initialize all audio components (called after user gesture)
   */
  private initializeAudio(): void {
    if (this.initialized) return;

    this.masterVolume = new Tone.Volume(-10);
    this.analyzer = new Tone.Analyser('waveform', 256);

    this.initializeInstruments();
    this.initializeEffects();
    Tone.Transport.bpm.value = 120;
    this.initialized = true;
  }

  /**
   * Initialize all instruments
   */
  private initializeInstruments(): void {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 1
      }
    });

    const bass = new Tone.MonoSynth({
      oscillator: { type: 'sawtooth' },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.5,
        release: 0.8
      },
      filterEnvelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.5,
        baseFrequency: 200,
        octaves: 2.5
      }
    });

    const drums = new Tone.MembraneSynth({
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

    this.instruments.set('synth', {
      type: 'synth',
      enabled: true,
      volume: -10,
      instance: synth as any
    });

    this.instruments.set('bass', {
      type: 'bass',
      enabled: true,
      volume: -10,
      instance: bass as any
    });

    this.instruments.set('drums', {
      type: 'drums',
      enabled: true,
      volume: -10,
      instance: drums as any
    });
  }

  /**
   * Initialize all effects
   */
  private initializeEffects(): void {
    const reverb = new Tone.Reverb({
      decay: 2,
      wet: 0.3
    });

    const delay = new Tone.FeedbackDelay({
      delayTime: '8n',
      feedback: 0.2,
      wet: 0.2
    });

    const distortion = new Tone.Distortion({
      distortion: 0,
      wet: 0
    });

    // BitCrusher at low bit depth (4 bits = max crush), control intensity via wet
    const bitcrusher = new Tone.BitCrusher(4);
    bitcrusher.wet.value = 0;

    this.effects.set('reverb', {
      type: 'reverb',
      value: 0.3,
      instance: reverb
    });

    this.effects.set('delay', {
      type: 'delay',
      value: 0.2,
      instance: delay
    });

    this.effects.set('distortion', {
      type: 'distortion',
      value: 0,
      instance: distortion
    });

    this.effects.set('bitcrusher', {
      type: 'bitcrusher',
      value: 0,
      instance: bitcrusher
    });

    // Connect effects chain: instruments -> effects -> master -> destination
    this.effectChain = [
      distortion,
      bitcrusher,
      delay,
      reverb,
      this.masterVolume!,
      this.analyzer!
    ];

    // Connect effects in series
    for (let i = 0; i < this.effectChain.length - 1; i++) {
      this.effectChain[i].connect(this.effectChain[i + 1]);
    }

    // Connect analyzer to destination
    this.analyzer!.toDestination();

    // Connect all instruments to the first effect in chain
    this.instruments.forEach((config) => {
      if (config.instance) {
        config.instance.connect(this.effectChain[0]);
      }
    });
  }

  /**
   * Start audio context (required by browsers)
   * Also initializes audio components on first call
   */
  async start(): Promise<void> {
    await Tone.start();
    this.initializeAudio();
  }

  /**
   * Get an instrument by type
   */
  getInstrument(type: InstrumentType): InstrumentConfig | undefined {
    return this.instruments.get(type);
  }

  /**
   * Get an effect by type
   */
  getEffect(type: EffectType): EffectConfig | undefined {
    return this.effects.get(type);
  }

  /**
   * Set instrument volume
   */
  setInstrumentVolume(type: InstrumentType, volume: number): void {
    const instrument = this.instruments.get(type);
    if (instrument && instrument.instance) {
      (instrument.instance as any).volume.value = volume;
      instrument.volume = volume;
    }
  }

  /**
   * Toggle instrument enabled state
   */
  toggleInstrument(type: InstrumentType, enabled: boolean): void {
    const instrument = this.instruments.get(type);
    if (instrument && instrument.instance) {
      instrument.enabled = enabled;
      (instrument.instance as any).volume.value = enabled ? instrument.volume : -Infinity;
    }
  }

  /**
   * Set effect parameter
   */
  setEffect(type: EffectType, value: number): void {
    const effect = this.effects.get(type);
    if (!effect || !effect.instance) return;

    effect.value = value;

    switch (type) {
      case 'reverb':
        (effect.instance as Tone.Reverb).wet.value = value;
        break;
      case 'delay':
        (effect.instance as Tone.FeedbackDelay).wet.value = value;
        break;
      case 'distortion':
        (effect.instance as Tone.Distortion).wet.value = value;
        break;
      case 'bitcrusher':
        // BitCrusher: use wet parameter for intensity (0 = clean, 1 = full 4-bit crush)
        (effect.instance as Tone.BitCrusher).wet.value = value;
        break;
    }
  }

  /**
   * Set BPM
   */
  setBPM(bpm: number): void {
    Tone.Transport.bpm.value = bpm;
  }

  /**
   * Get current BPM
   */
  getBPM(): number {
    return Tone.Transport.bpm.value;
  }

  /**
   * Start transport
   * Note: playbackStore is updated via Transport event listeners in constructor
   */
  play(): void {
    Tone.Transport.start();
  }

  /**
   * Pause transport
   * Note: playbackStore is updated via Transport event listeners in constructor
   */
  pause(): void {
    Tone.Transport.pause();
  }

  /**
   * Stop transport
   * Note: playbackStore is updated via Transport event listeners in constructor
   */
  stop(): void {
    Tone.Transport.stop();
    Tone.Transport.cancel();
  }

  /**
   * Get analyzer for visualization
   */
  getAnalyzer(): Tone.Analyser | null {
    return this.analyzer;
  }

  /**
   * Get the effect chain input node
   * External synths can connect to this to route through the effect chain
   */
  getEffectChainInput(): Tone.ToneAudioNode | null {
    if (!this.initialized || this.effectChain.length === 0) {
      return null;
    }
    return this.effectChain[0];
  }

  /**
   * Connect an external audio node to the effect chain
   * Useful for routing synths from other modules through the shared effects
   * If AudioEngine is not initialized yet, connects directly to destination as fallback
   */
  connectToEffectChain(node: Tone.ToneAudioNode): void {
    if (!this.initialized || this.effectChain.length === 0) {
      // Fallback: connect directly to destination if effect chain not ready
      node.toDestination();
      return;
    }
    node.connect(this.effectChain[0]);
  }

  /**
   * Get Transport for direct access
   */
  getTransport(): typeof Tone.Transport {
    return Tone.Transport;
  }

  /**
   * Dispose all audio resources
   */
  dispose(): void {
    this.stop();
    this.instruments.forEach((config) => {
      config.instance?.dispose();
    });
    this.effects.forEach((config) => {
      config.instance?.dispose();
    });
    this.masterVolume?.dispose();
    this.analyzer?.dispose();
  }
}



