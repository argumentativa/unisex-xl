// ============================================
// VIDEO ASCII - WEBCAM MONOCHROME (Refactored)
// Using shared ASCII utilities
// ============================================

let video;
let size;
let w = ASCII_CONFIG.RESOLUTIONS.HIGH.w;  // 128
let h = ASCII_CONFIG.RESOLUTIONS.HIGH.h;  // 96

function setup() {
  const dims = createAsciiCanvas(w, h);
  size = dims.size;

  // Initialize webcam
  video = createCapture(VIDEO);
  video.size(w, h);
  video.hide();
}

function draw() {
  background(220);

  // Render using shared utility
  renderAsciiGrid(video, w, h, size, ASCII_CONFIG.CHARS.MEDIUM, {
    useColor: false,
    useBold: false
  });
}

function windowResized() {
  const dims = resizeAsciiCanvas(w, h);
  size = dims.size;
}
