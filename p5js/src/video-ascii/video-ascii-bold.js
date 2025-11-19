// ============================================
// VARIABLES - BOLD VERSION
// ============================================

let video; // Will hold our webcam video
let size;  // Size of each ASCII character (in pixels)

// BOLD ASCII characters - full range but emphasizes heavy/dense characters
// Uses block characters and bold symbols for more visual weight
let asciiChar = "█▓▒░$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ";

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
  // Create canvas at full screen width
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
  size = width / w;
  
  // Set bold text style
  textStyle(BOLD);
}

// ============================================
// DRAW - Renders the BOLD ASCII art continuously
// ============================================

function draw() {
  // Dark background for more contrast
  background(0);
  
  // Prepare video pixels for reading
  video.loadPixels();

  // Loop through every pixel in the video
  // i = horizontal position (x), j = vertical position (y)
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      
      // Get the color of the pixel at position (i, j)
      let pixelVal = video.get(i, j);
      
      // Calculate brightness of this pixel (0 = black, 255 = white)
      let bright = brightness(pixelVal);
      
      // Increase contrast for bolder appearance
      // Option 1: Heavy compression (more dramatic, fewer character variations)
      // bright = map(bright, 0, 255, 20, 200);  // Reduced range for more contrast
      // bright = constrain(bright, 0, 255);
      
      // Option 2: Light compression (current - more detail, still bold)
      bright = map(bright, 0, 255, 30, 255);  // Slightly compress dark end
      bright = constrain(bright, 0, 255);
      
      // Option 3: No compression (uncomment for maximum detail)
      // bright = brightness(pixelVal);  // Use original brightness as-is
      
      // Map brightness to an index in our asciiChar string
      // Reversed: dark pixels (0) → end of string (dense chars like █▓▒)
      //           bright pixels (255) → start of string (still dense like ###)
      let tIndex = floor(map(bright, 0, 255, asciiChar.length - 1, 0));
      
      // Calculate where to draw this character on the canvas
      let x = i * size + size / 2;
      let y = j * size + size / 2;
      
      // Get the ASCII character at the calculated index
      let t = asciiChar.charAt(tIndex);
      
      // Set the size of the text to match our character grid
      textSize(size * 1.2);  // Slightly larger for more weight
      
      // Center the character both horizontally and vertically
      textAlign(CENTER, CENTER);
      
      // Color options for BOLD version (uncomment one):
      
      // Option 1: White text (high contrast - current)
      fill(255);
      stroke(255);
      strokeWeight(0.5);
      
      // Option 2: Full color with stroke (colorful bold)
      // fill(pixelVal);
      // stroke(pixelVal);
      // strokeWeight(0.5);
      
      // Option 3: Colored with white stroke (outline effect)
      // fill(pixelVal);
      // stroke(255);
      // strokeWeight(1);
      
      // Draw the ASCII character at position (x, y)
      text(t, x, y);
      
      // Reset stroke for next character
      noStroke();
    }
  }
}

// ============================================
// WINDOW RESIZED - Handle window resizing
// ============================================

function windowResized() {
  // Recalculate canvas size when window is resized
  // Canvas fills full browser width, maintains aspect ratio
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;
  
  resizeCanvas(canvasWidth, canvasHeight);
  
  // Recalculate character size
  size = width / w;
}

