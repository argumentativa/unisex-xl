// ============================================
// VIDEO ASCII - BOLD VERSION (Refactored)
// Using shared ASCII utilities with custom contrast
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
  background(0);  // Dark background for contrast

  // Custom brightness modifier for increased contrast
  const brightnessMod = (bright) => {
    bright = map(bright, 0, 255, 30, 255);  // Compress dark end
    return constrain(bright, 0, 255);
  };

  // Render with shared utility
  renderAsciiGrid(video, w, h, size * 1.2, ASCII_CONFIG.CHARS.BOLD, {
    useColor: false,
    useBold: true,
    brightMod: brightnessMod
  });
}

function windowResized() {
  const dims = resizeAsciiCanvas(w, h);
  size = dims.size;
}