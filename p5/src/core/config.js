/**
 * Shared configuration and constants for ASCII visualizations
 */

// ASCII character sets (ordered from darkest to lightest)
export const ASCII_CHARS = {
  // Short set for low detail
  LOW: "@#*+=-:. ",

  // Medium set (most common)
  MEDIUM: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ",

  // Extended set with bold characters for high contrast
  BOLD: "█▓▒░$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ",

  // High detail monochrome
  HIGH: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. "
};

// Audio frequency ranges (Hz)
export const FREQ_RANGES = {
  BASS: [20, 250],
  MID: [250, 4000],
  TREBLE: [4000, 20000]
};

// Default resolutions
export const RESOLUTIONS = {
  LOW: { w: 64, h: 48 },
  MEDIUM: { w: 100, h: 75 },
  HIGH: { w: 128, h: 96 }
};

// Audio reactivity settings
export const AUDIO_CONFIG = {
  FFT_SIZE: 512,
  SMOOTHING: 0.8,
  BASS_MULTIPLIER: 800,
  MID_MULTIPLIER: 800,
  TREBLE_MULTIPLIER: 800,
  VOLUME_MULTIPLIER: 0.5
};
