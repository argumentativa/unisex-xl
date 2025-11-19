// ============================================
// IMAGE ASCII - BASIC MONOCHROME (Refactored)
// Using shared ASCII utilities
// ============================================

let img;
let size;
let w = ASCII_CONFIG.RESOLUTIONS.LOW.w;
let h = ASCII_CONFIG.RESOLUTIONS.LOW.h;

function preload() {
  img = loadImage("../../assets/dandy.jpg");
}

function setup() {
  img.resize(w, 0);
  h = img.height;
  const dims = createAsciiCanvas(w, h);
  size = dims.size;
}

function draw() {
  background(220);  // Gray background

  renderAsciiGrid(img, img.width, img.height, size, ASCII_CONFIG.CHARS.MEDIUM, {
    useColor: false,  // Monochrome mode
    useBold: false
  });
}

function windowResized() {
  const dims = resizeAsciiCanvas(w, h);
  size = dims.size;
  redraw();
}
