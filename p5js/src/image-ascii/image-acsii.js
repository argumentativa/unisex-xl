// ============================================
// VARIABLES
// ============================================

let img;  // Will hold our image
let size; // Size of each ASCII character (in pixels)

// ASCII characters ordered from dense/dark to light/sparse
// Used to represent different brightness levels
let asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";

let w = 64;  // Target width for image (in pixels/characters)
let h = 48;  // Height (will be recalculated to maintain aspect ratio)

// ============================================
// PRELOAD - Runs before setup()
// ============================================

function preload() {
  // Load the image file before anything else runs
  // This ensures the image is ready when we need it
  img = loadImage("../../assets/dandy.jpg");
}

// ============================================
// SETUP - Runs once at the start
// ============================================

function setup() {
  // Resize image to 64 pixels wide, height auto-calculated (0 = maintain aspect ratio)
  img.resize(w, 0);
  
  // Update h to match the actual resized height of the image
  h = img.height;
  
  // Create canvas that fills the window while maintaining aspect ratio
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;  // Maintain image aspect ratio
  
  createCanvas(canvasWidth, canvasHeight);
  
  // Calculate how many pixels each ASCII character takes up
  // This adapts to the browser window size
  size = width / img.width;
}

// ============================================
// DRAW - Renders the ASCII art
// ============================================

function draw() {
  // Fill background with light gray
  // For color mode, try white (255) or black (0) background
  background(220);
  
  // Prepare image pixels for reading
  // This is more efficient than calling get() repeatedly
  img.loadPixels();

  // Loop through every pixel in the image
  // i = horizontal position (x), j = vertical position (y)
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      
      // Get the color of the pixel at position (i, j)
      let pixelVal = img.get(i, j);
      
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
      
      // Option 2: Full color (uses actual pixel colors)
      // fill(pixelVal);
      
      // Option 3: Tinted color (softer, less saturated)
      // let c = color(pixelVal);
      // c.setAlpha(200);  // Add transparency
      // fill(c);
      
      // Option 4: Grayscale with color tint
      // fill(bright, 100, 255);  // HSB mode: bright as hue, low saturation
      
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
  size = width / img.width;
  
  // Redraw the image with new size
  redraw();
}