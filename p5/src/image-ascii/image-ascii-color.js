// ============================================
// IMAGE ASCII - COLOR VERSION (Refactored)
// Using shared ASCII utilities for efficiency
// Load ascii-utils.js first!
// ============================================

// State
let img;
let size;
let w = ASCII_CONFIG.RESOLUTIONS.LOW.w;  // 64
let h = ASCII_CONFIG.RESOLUTIONS.LOW.h;  // 48



// ============================================
// PRELOAD
// ============================================

function preload() {
  img = loadImage("../assets/dandy.jpg");
}

// ============================================
// SETUP
// ============================================

function setup() {
  // Resize image
  img.resize(w, 0);
  h = img.height;

  // Create canvas using shared utility
  const dims = createAsciiCanvas(w, h);
  size = dims.size;
}

// ============================================
// DRAW
// ============================================

function draw() {
  background(255);

  // Render using shared utility - replaces entire nested loop!
  renderAsciiGrid(img, img.width, img.height, size, ASCII_CONFIG.CHARS.HIGH, {
    useColor: true,
    useBold: false
  });
}

// ============================================
// WINDOW RESIZE
// ============================================

function windowResized() {
  const dims = resizeAsciiCanvas(w, h);
  size = dims.size;
  redraw();
}
