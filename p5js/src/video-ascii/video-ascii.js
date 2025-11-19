// ============================================
// VARIABLES
// ============================================

let video; // Will hold our webcam video
let size;  // Size of each ASCII character (in pixels)

// ASCII characters ordered from dense/dark to light/sparse
// Used to represent different brightness levels
let asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";

// Resolution options (higher = more detail, but slower performance):
// Low:    64 x 48   (default, fast)
// Medium: 100 x 75  (good balance)
// High:   128 x 96  (detailed)
// Ultra:  160 x 120 (very detailed, may be slow)

let w = 128;  // Video capture width (in pixels/characters) - INCREASED for more detail
let h = 96;   // Video capture height (in pixels/characters) - INCREASED for more detail

// ============================================
// SETUP - Runs once at the start
// ============================================

function setup() {
  // Create canvas that fills the browser window width
  // Height is calculated to maintain aspect ratio (w:h = 128:96 = 4:3)
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;  // Maintain aspect ratio
  
  createCanvas(canvasWidth, canvasHeight);
  
  // Initialize webcam capture
  video = createCapture(VIDEO);
  
  // Set video resolution to match our desired ASCII grid
  video.size(w, h);
  
  // Hide the default video element (we'll draw ASCII instead)
  video.hide();
  
  // Calculate how many pixels each ASCII character takes up
  // This adapts to the browser window size
  size = width / w;
}

// ============================================
// DRAW - Renders the ASCII art continuously
// ============================================

function draw() {
  // Fill background with light gray
  background(220);
  
  // Prepare video pixels for reading
  // This is more efficient than calling get() repeatedly
  video.loadPixels();

  // Loop through every pixel in the video
  // i = horizontal position (x), j = vertical position (y)
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      
      // Get the color of the pixel at position (i, j)
      let pixelVal = video.get(i, j);
      
      // Calculate brightness of this pixel (0 = black, 255 = white)
      let bright = brightness(pixelVal);
      
      // Map brightness to an index in our asciiChar string
      // Reversed: dark pixels (0) → end of string (dense chars like $@B)
      //           bright pixels (255) → start of string (sparse chars like spaces)
      let tIndex = floor(map(bright, 0, 255, asciiChar.length - 1, 0));
      
      // Calculate where to draw this character on the canvas
      // Multiply by size to space them out, add size/2 to center
      let x = i * size + size / 2;
      let y = j * size + size / 2;
      
      // Get the ASCII character at the calculated index
      let t = asciiChar.charAt(tIndex);
      
      // Set the size of the text to match our character grid
      textSize(size);
      
      // Center the character both horizontally and vertically
      textAlign(CENTER, CENTER);
      
      // Color options (uncomment one):
      
      // Option 1: Black text (monochrome - current)
      fill(0);
      
      // Option 2: Full color (uses actual pixel colors from webcam)
      // fill(pixelVal);
      
      // Option 3: Tinted color (softer, less saturated)
      // let c = color(pixelVal);
      // c.setAlpha(200);  // Add transparency
      // fill(c);
      
      // Draw the ASCII character at position (x, y)
      text(t, x, y);
    }
  }
}

// ============================================
// WINDOW RESIZED - Handle window resizing
// ============================================

function windowResized() {
  // Recalculate canvas size when window is resized
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;
  
  resizeCanvas(canvasWidth, canvasHeight);
  
  // Recalculate character size
  size = width / w;
}

