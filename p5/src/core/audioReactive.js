/**
 * Audio reactive utilities for Tone.js integration
 * Shared across all audio-reactive ASCII implementations
 */

import { FREQ_RANGES, AUDIO_CONFIG } from './config.js';

/**
 * AudioReactiveState - Manages audio analysis state
 */
export class AudioReactiveState {
  constructor() {
    this.fft = null;
    this.meter = null;
    this.waveform = null;
    this.started = false;

    // Current audio values
    this.bass = 0;
    this.mid = 0;
    this.treble = 0;
    this.volume = 0;

    // Smoothed values
    this.bassSmooth = 0;
    this.midSmooth = 0;
    this.trebleSmooth = 0;
    this.volumeSmooth = 0;

    // Smoothing factors
    this.bassSmoothFactor = 0.3;
    this.midSmoothFactor = 0.3;
    this.trebleSmoothFactor = 0.3;
    this.volumeSmoothFactor = 0.2;
  }

  /**
   * Initialize Tone.js analyzers
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.started) return;

    await Tone.start();

    this.fft = new Tone.FFT(AUDIO_CONFIG.FFT_SIZE);
    this.fft.smoothing = AUDIO_CONFIG.SMOOTHING;

    this.meter = new Tone.Meter();
    this.waveform = new Tone.Waveform(AUDIO_CONFIG.FFT_SIZE);

    Tone.Destination.connect(this.fft);
    Tone.Destination.connect(this.meter);
    Tone.Destination.connect(this.waveform);

    this.started = true;
  }

  /**
   * Get frequency energy for a specific range
   * @param {Float32Array} spectrum - FFT spectrum data
   * @param {number[]} freqRange - [min, max] frequency range
   * @param {number} multiplier - Energy multiplier
   * @returns {number} Energy value (0-255)
   */
  getFrequencyEnergy(spectrum, freqRange, multiplier = AUDIO_CONFIG.BASS_MULTIPLIER) {
    const nyquist = Tone.context.sampleRate / 2;
    const binCount = spectrum.length;
    const lowBin = Math.floor((freqRange[0] / nyquist) * binCount);
    const highBin = Math.floor((freqRange[1] / nyquist) * binCount);

    let sum = 0;
    let count = 0;

    for (let i = lowBin; i <= highBin && i < binCount; i++) {
      // Convert from dB to linear
      const linear = Math.pow(10, spectrum[i] / 20);
      sum += linear;
      count++;
    }

    const average = count > 0 ? sum / count : 0;
    return constrain(average * multiplier, 0, 255);
  }

  /**
   * Update audio analysis values
   */
  update() {
    if (!this.started || !this.fft || !this.meter) return;

    const spectrum = this.fft.getValue();

    // Get frequency band energies
    this.bass = this.getFrequencyEnergy(spectrum, FREQ_RANGES.BASS, AUDIO_CONFIG.BASS_MULTIPLIER);
    this.mid = this.getFrequencyEnergy(spectrum, FREQ_RANGES.MID, AUDIO_CONFIG.MID_MULTIPLIER);
    this.treble = this.getFrequencyEnergy(spectrum, FREQ_RANGES.TREBLE, AUDIO_CONFIG.TREBLE_MULTIPLIER);

    // Get overall volume
    const meterValue = this.meter.getValue();
    this.volume = map(constrain(meterValue, -60, 0), -60, 0, 0, 1);

    // Apply smoothing
    this.bassSmooth = lerp(this.bassSmooth, this.bass, this.bassSmoothFactor);
    this.midSmooth = lerp(this.midSmooth, this.mid, this.midSmoothFactor);
    this.trebleSmooth = lerp(this.trebleSmooth, this.treble, this.trebleSmoothFactor);
    this.volumeSmooth = lerp(this.volumeSmooth, this.volume, this.volumeSmoothFactor);
  }

  /**
   * Get all current values
   * @returns {Object} Audio values
   */
  getValues() {
    return {
      bass: this.bass,
      mid: this.mid,
      treble: this.treble,
      volume: this.volume,
      bassSmooth: this.bassSmooth,
      midSmooth: this.midSmooth,
      trebleSmooth: this.trebleSmooth,
      volumeSmooth: this.volumeSmooth
    };
  }
}

/**
 * Create audio reactive color modifier
 * @param {AudioReactiveState} audioState - Audio state instance
 * @returns {Function} Color modifier function
 */
export function createAudioColorModifier(audioState) {
  return ({ r, g, b, brightness }) => {
    const values = audioState.getValues();

    // Boost colors based on frequency bands
    r = r + map(values.bassSmooth, 0, 255, 0, 40);
    g = g + map(values.midSmooth, 0, 255, 0, 30);
    b = b + map(values.trebleSmooth, 0, 255, 0, 35);

    return {
      r: constrain(r, 0, 255),
      g: constrain(g, 0, 255),
      b: constrain(b, 0, 255)
    };
  };
}

/**
 * Create audio reactive brightness modifier
 * @param {AudioReactiveState} audioState - Audio state instance
 * @returns {Function} Brightness modifier function
 */
export function createAudioBrightnessModifier(audioState) {
  return (brightness) => {
    const values = audioState.getValues();

    // Boost brightness based on volume
    const volumeBoost = map(values.volumeSmooth, 0, AUDIO_CONFIG.VOLUME_MULTIPLIER, 0, 50);
    brightness = brightness + volumeBoost;

    // Adjust range based on treble
    const trebleBoost = map(values.treble, 0, 255, 0, 30);
    brightness = map(brightness, 0, 255, trebleBoost, 255 - trebleBoost);

    return constrain(brightness, 0, 255);
  };
}

/**
 * Create audio reactive size modifier
 * @param {AudioReactiveState} audioState - Audio state instance
 * @param {number} baseSize - Base character size
 * @returns {Function} Size modifier function
 */
export function createAudioSizeModifier(audioState, baseSize) {
  return (i, j, frameCount) => {
    const values = audioState.getValues();

    let size = baseSize * 1.1;

    // Bass pulse
    const bassPulse = map(values.bassSmooth, 0, 255, 1.0, 1.3);
    size = size * bassPulse;

    // Mid-frequency wave effect
    const wave = Math.sin((i + j) * 0.1 + frameCount * 0.05) * 0.5 + 0.5;
    const midEffect = map(values.midSmooth, 0, 255, 1.0, 1.15);
    size = size * (1 + (wave * (midEffect - 1)));

    return size;
  };
}

/**
 * Constrain value between min and max
 * @param {number} value - Value to constrain
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Constrained value
 */
function constrain(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map value from one range to another
 * @param {number} value - Value to map
 * @param {number} start1 - Source range start
 * @param {number} stop1 - Source range end
 * @param {number} start2 - Target range start
 * @param {number} stop2 - Target range end
 * @returns {number} Mapped value
 */
function map(value, start1, stop1, start2, stop2) {
  return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
}

/**
 * Linear interpolation
 * @param {number} start - Start value
 * @param {number} stop - End value
 * @param {number} amount - Interpolation amount (0-1)
 * @returns {number} Interpolated value
 */
function lerp(start, stop, amount) {
  return start + (stop - start) * amount;
}
