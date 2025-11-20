// ============================================
// IMAGE ASCII - BASIC (Refactored)
// Note: This file is in video-ascii folder but renders images
// Using shared ASCII utilities
// ============================================

let img;
let size;
let w = ASCII_CONFIG.RESOLUTIONS.LOW.w;
let h = ASCII_CONFIG.RESOLUTIONS.LOW.h;

function preload() {
  img = loadImage("/p5js/assets/dandy.jpg");
}

function setup() {
  img.resize(w, 0);
  h = img.height;

  // Different canvas sizing than other image files
  createCanvas(img.width * 10, img.height * 10);
  size = width / img.width;

  noLoop();  // Static image - render once
}

function draw() {
  background(220);

  renderAsciiGrid(img, img.width, img.height, size, ASCII_CONFIG.CHARS.MEDIUM, {
    useColor: false,
    useBold: false
  });
}
