/**
 * ASCII Utilities - Shared functions for all ASCII visualizations
 * Load this file with a <script> tag before your main sketch
 *
 * Usage: <script src="../../src/core/ascii-utils.js"></script>
 */

// ============================================
// CONFIGURATION & CONSTANTS
// ============================================

const ASCII_CONFIG = {
  // Character sets (ordered from darkest to lightest)
  CHARS: {
    LOW: "@#*+=-:. ",
    MEDIUM: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ",
    BOLD: "█▓▒░$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ",
    HIGH: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. "
  },

  // Common resolutions
  RESOLUTIONS: {
    LOW: { w: 64, h: 48 },
    MEDIUM: { w: 100, h: 75 },
    HIGH: { w: 128, h: 96 }
  },

  // Audio frequency ranges (Hz)
  FREQ_RANGES: {
    BASS: [20, 250],
    MID: [250, 4000],
    TREBLE: [4000, 20000]
  },

  // Audio settings
  AUDIO: {
    FFT_SIZE: 512,
    SMOOTHING: 0.8,
    BASS_MULT: 800,
    MID_MULT: 800,
    TREBLE_MULT: 800
  }
};

// ============================================
// ASCII RENDERING UTILITIES
// ============================================

/**
 * Get ASCII character for given brightness
 */
function getAsciiChar(brightness, charSet) {
  const index = floor(map(brightness, 0, 255, charSet.length - 1, 0));
  return charSet.charAt(index) || ' ';
}

/**
 * Calculate character position in grid
 */
function getCharPosition(i, j, size) {
  return {
    x: i * size + size / 2,
    y: j * size + size / 2
  };
}

/**
 * Setup text rendering properties
 */
function setupTextRender(size, bold = false) {
  textSize(size);
  textAlign(CENTER, CENTER);
  if (bold) {
    textStyle(BOLD);
  }
}

/**
 * Render ASCII grid from image/video source
 * This replaces the common nested loop pattern
 */
function renderAsciiGrid(source, gridWidth, gridHeight, charSize, charSet, options = {}) {
  const { useColor = false, useBold = false, colorMod = null, brightMod = null, sizeMod = null } = options;

  // Load pixels if source supports it
  if (source.loadPixels) {
    source.loadPixels();
  }

  setupTextRender(charSize, useBold);

  for (let i = 0; i < gridWidth; i++) {
    for (let j = 0; j < gridHeight; j++) {
      // Get pixel
      const pixelVal = source.get(i, j);
      let bright = brightness(pixelVal);

      // Apply brightness modifier if provided
      if (brightMod) {
        bright = brightMod(bright, i, j);
      }

      // Get character
      const char = getAsciiChar(bright, charSet);

      // Calculate position
      const pos = getCharPosition(i, j, charSize);

      // Calculate size if modifier provided
      let finalSize = charSize;
      if (sizeMod) {
        finalSize = sizeMod(i, j, charSize);
        textSize(finalSize);
      }

      // Set color
      if (useColor) {
        let r = red(pixelVal);
        let g = green(pixelVal);
        let b = blue(pixelVal);

        // Apply color modifier if provided
        if (colorMod) {
          const modified = colorMod({ r, g, b, brightness: bright });
          r = modified.r;
          g = modified.g;
          b = modified.b;
        }

        fill(r, g, b);
      } else {
        fill(255);
      }

      // Draw character
      text(char, pos.x, pos.y);
    }
  }
}

/**
 * Create ASCII canvas with proper dimensions
 */
function createAsciiCanvas(gridW, gridH) {
  const canvasWidth = windowWidth;
  const canvasHeight = (canvasWidth * gridH) / gridW;
  createCanvas(canvasWidth, canvasHeight);
  const size = width / gridW;
  return { canvasWidth, canvasHeight, size };
}

/**
 * Handle canvas resize
 */
function resizeAsciiCanvas(gridW, gridH) {
  const canvasWidth = windowWidth;
  const canvasHeight = (canvasWidth * gridH) / gridW;
  resizeCanvas(canvasWidth, canvasHeight);
  const size = width / gridW;
  return { canvasWidth, canvasHeight, size };
}

// ============================================
// AUDIO REACTIVE UTILITIES (Tone.js)
// ============================================

/**
 * Audio Reactive Manager - Handles Tone.js integration
 */
class AudioReactiveManager {
  constructor() {
    this.fft = null;
    this.meter = null;
    this.waveform = null;
    this.started = false;

    // Current values
    this.bass = 0;
    this.mid = 0;
    this.treble = 0;
    this.volume = 0;

    // Smoothed values
    this.bassSmooth = 0;
    this.midSmooth = 0;
    this.trebleSmooth = 0;
    this.volumeSmooth = 0;
  }

  async init() {
    if (this.started) return;

    await Tone.start();

    this.fft = new Tone.FFT(ASCII_CONFIG.AUDIO.FFT_SIZE);
    this.fft.smoothing = ASCII_CONFIG.AUDIO.SMOOTHING;

    this.meter = new Tone.Meter();
    this.waveform = new Tone.Waveform(ASCII_CONFIG.AUDIO.FFT_SIZE);

    Tone.Destination.connect(this.fft);
    Tone.Destination.connect(this.meter);
    Tone.Destination.connect(this.waveform);

    this.started = true;
  }

  getFrequencyEnergy(spectrum, freqRange, multiplier) {
    const nyquist = Tone.context.sampleRate / 2;
    const binCount = spectrum.length;
    const lowBin = floor((freqRange[0] / nyquist) * binCount);
    const highBin = floor((freqRange[1] / nyquist) * binCount);

    let sum = 0;
    let count = 0;

    for (let i = lowBin; i <= highBin && i < binCount; i++) {
      const linear = pow(10, spectrum[i] / 20);
      sum += linear;
      count++;
    }

    const average = count > 0 ? sum / count : 0;
    return constrain(average * multiplier, 0, 255);
  }

  update() {
    if (!this.started || !this.fft || !this.meter) return;

    const spectrum = this.fft.getValue();

    this.bass = this.getFrequencyEnergy(spectrum, ASCII_CONFIG.FREQ_RANGES.BASS, ASCII_CONFIG.AUDIO.BASS_MULT);
    this.mid = this.getFrequencyEnergy(spectrum, ASCII_CONFIG.FREQ_RANGES.MID, ASCII_CONFIG.AUDIO.MID_MULT);
    this.treble = this.getFrequencyEnergy(spectrum, ASCII_CONFIG.FREQ_RANGES.TREBLE, ASCII_CONFIG.AUDIO.TREBLE_MULT);

    const meterValue = this.meter.getValue();
    this.volume = map(constrain(meterValue, -60, 0), -60, 0, 0, 1);

    // Smooth values
    this.bassSmooth = lerp(this.bassSmooth, this.bass, 0.3);
    this.midSmooth = lerp(this.midSmooth, this.mid, 0.3);
    this.trebleSmooth = lerp(this.trebleSmooth, this.treble, 0.3);
    this.volumeSmooth = lerp(this.volumeSmooth, this.volume, 0.2);
  }

  // Create color modifier function
  getColorModifier() {
    return ({ r, g, b, brightness }) => {
      r = r + map(this.bassSmooth, 0, 255, 0, 40);
      g = g + map(this.midSmooth, 0, 255, 0, 30);
      b = b + map(this.trebleSmooth, 0, 255, 0, 35);
      return {
        r: constrain(r, 0, 255),
        g: constrain(g, 0, 255),
        b: constrain(b, 0, 255)
      };
    };
  }

  // Create brightness modifier
  getBrightnessModifier() {
    return (brightness) => {
      const volumeBoost = map(this.volumeSmooth, 0, 0.5, 0, 50);
      brightness = brightness + volumeBoost;

      const trebleBoost = map(this.treble, 0, 255, 0, 30);
      brightness = map(brightness, 0, 255, trebleBoost, 255 - trebleBoost);

      return constrain(brightness, 0, 255);
    };
  }

  // Create size modifier (for character pulsing)
  getSizeModifier(baseSize) {
    return (i, j, size) => {
      let finalSize = baseSize * 1.1;

      // Bass pulse
      const bassPulse = map(this.bassSmooth, 0, 255, 1.0, 1.3);
      finalSize = finalSize * bassPulse;

      // Mid wave
      const wave = sin((i + j) * 0.1 + frameCount * 0.05) * 0.5 + 0.5;
      const midEffect = map(this.midSmooth, 0, 255, 1.0, 1.15);
      finalSize = finalSize * (1 + (wave * (midEffect - 1)));

      return finalSize;
    };
  }
}

// ============================================
// EXPORT/MAKE AVAILABLE
// ============================================

// Make config available globally
window.ASCII_CONFIG = ASCII_CONFIG;

// Make utilities available globally
window.getAsciiChar = getAsciiChar;
window.getCharPosition = getCharPosition;
window.setupTextRender = setupTextRender;
window.renderAsciiGrid = renderAsciiGrid;
window.createAsciiCanvas = createAsciiCanvas;
window.resizeAsciiCanvas = resizeAsciiCanvas;

// Make audio manager class available
window.AudioReactiveManager = AudioReactiveManager;

console.log("✅ ASCII Utils loaded successfully");
