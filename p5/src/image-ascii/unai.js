// ============================================
// HIGH DETAIL VERSION (Refactored)
// Higher resolution with detailed ASCII character set for better visual quality
// ============================================

let img, size;

// PERFORMANCE SETTINGS
const OPTIMIZED_RES = { w: 80, h: 60 };  // Lower resolution for less density
const TARGET_FPS = 60;
const SHOW_DEBUG = true;

let w = OPTIMIZED_RES.w;
let h = OPTIMIZED_RES.h;

// Audio setup (p5.sound)
let mic, fft, amp, audioStarted = false;
let bass = 0, mid = 0, treble = 0, volume = 0;
let bassSmooth = 0, volumeSmooth = 0;

// Performance cache

function preload() {
  img = loadImage("/p5/assets/unai-outside.jpg");
}

function setup() {
  img.resize(w, 0);
  h = img.height;

  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;
  createCanvas(canvasWidth, canvasHeight);

  // PERFORMANCE OPTS
  noSmooth();
  frameRate(TARGET_FPS);

  size = width / img.width;

  console.log('🎨 p5.js setup complete');
  console.log(`Resolution: ${w}x${h} | FPS: ${TARGET_FPS}`);
}

function draw() {
  background(0);

  // Audio analysis (once per frame)
  if (audioStarted && fft && amp) {
    bass = fft.getEnergy("bass") * 4.0;
    mid = fft.getEnergy("mid") * 4.0;
    treble = fft.getEnergy("treble") * 4.0;
    volume = amp.getLevel();

    bassSmooth = lerp(bassSmooth, bass, 0.7);
    volumeSmooth = lerp(volumeSmooth, volume, 0.6);

    if (SHOW_DEBUG && frameCount % 30 === 0) {
      console.log(`🎵 Bass=${Math.floor(bassSmooth)} Mid=${Math.floor(mid)} Treble=${Math.floor(treble)}`);
    }
  }

  // Pre-calculate effects (OPTIMIZATION: once per frame, not per pixel!)
  const effects = {
    volumeBoost: audioStarted ? map(volumeSmooth, 0, 0.3, 0, 150) : 0,
    trebleBoost: audioStarted ? map(treble, 0, 255, 0, 100) : 0,
    bassPulse: audioStarted ? map(bassSmooth, 0, 255, 0.5, 4.0) : 1.0,
    midEffect: audioStarted ? map(mid, 0, 255, 1.0, 2.0) : 1.0,
    bassBoost: audioStarted ? map(bassSmooth, 0, 255, 0, 200) : 0,
    midBoost: audioStarted ? map(mid, 0, 255, 0, 180) : 0,
    trebleColorBoost: audioStarted ? map(treble, 0, 255, 0, 190) : 0,
    colorShift: audioStarted ? sin(frameCount * 0.05 + bassSmooth * 0.01) * 50 : 0,
    brightnessFlash: (audioStarted && bassSmooth > 150) ? 1.3 : 1.0
  };

  // Custom brightness modifier
  const brightMod = (bright) => {
    if (!audioStarted) return bright;
    bright = bright + effects.volumeBoost;
    bright = map(bright, 0, 255, effects.trebleBoost, 255 - effects.trebleBoost);
    bright = bright * effects.brightnessFlash;
    return constrain(bright, 0, 255);
  };

  // Color modifier - preserve original colors with audio enhancement
  const colorMod = ({ r, g, b }) => {
    if (!audioStarted) return { r, g, b };

    r = r * 1.5 + effects.bassBoost;
    g = g * 1.5 + effects.midBoost;
    b = b * 1.5 + effects.trebleColorBoost;

    if (mid > 100) {
      r *= 0.7;
      b *= 0.7;
    }

    if (treble > 150) {
      r += (treble - 150);
      g += (treble - 150);
      b += (treble - 150);
    }

    r = r + effects.colorShift;
    g = g - effects.colorShift * 0.5;
    b = b + effects.colorShift * 0.8;

    return {
      r: constrain(r, 0, 255),
      g: constrain(g, 0, 255),
      b: constrain(b, 0, 255)
    };
  };

  // Size modifier - match reference style
  const sizeMod = (i, j) => {
    let charSize = size * 1.1 * effects.bassPulse;

    if (audioStarted) {
      // Wave effect
      let wave = sin((i + j) * 0.1 + frameCount * 0.1) * 0.5 + 0.5;
      charSize *= (1 + (wave * (effects.midEffect - 1)));

      // Ripple from center
      let distFromCenter = dist(i, j, img.width / 2, img.height / 2);
      let ripple = sin(distFromCenter * 0.3 - frameCount * 0.15 - bassSmooth * 0.05) * 0.5 + 0.5;
      charSize *= (1 + ripple * 0.5);

      // Position variation
      let variation = sin(i * 0.5 + frameCount * 0.08) * cos(j * 0.5 + frameCount * 0.06);
      variation *= map(treble, 0, 255, 0, 0.6);
      charSize *= (1 + variation);

      // Volume jitter
      if (volume > 0.2) {
        let jitter = sin(i * j * 0.1 + frameCount * 0.2) * map(volume, 0.2, 1.0, 0, 0.4);
        charSize *= (1 + jitter);
      }
    }

    return charSize;
  };

  // Render using shared utility with custom modifiers
  // Use BOLD character set like the reference
  const charSet = window.ASCII_CONFIG ? window.ASCII_CONFIG.CHARS.BOLD : "█▓▒░$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";
  renderAsciiGrid(img, img.width, img.height, size, charSet, {
    useColor: true,
    useBold: true,  // Enable bold like the reference
    brightMod: brightMod,
    colorMod: colorMod,
    sizeMod: sizeMod
  });
}

function windowResized() {
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;
  resizeCanvas(canvasWidth, canvasHeight);
  size = width / img.width;
}
