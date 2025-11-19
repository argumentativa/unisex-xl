// ============================================
// VARIABLES
// ============================================

let img;  // Will hold our image
let size; // Size of each ASCII character (in pixels)

// ASCII characters ordered from dense/dark to light/sparse
// Used to represent different brightness levels

// Character set options (uncomment one to try different styles):

// Option 1: Standard ASCII (current - good balance)
let asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";

// Option 2: Lighter variation (more spaces, airier look)
// let asciiChar = "@%#*+=-:. ";

// Option 3: Ultra light (minimal characters, very sparse)
// let asciiChar = "█▓▒░ ";

// Option 4: Bold blocks (heavier, more dense)
// let asciiChar = "█▓▒░$@B%8&WM#*oahkbdpqwm";

// Option 5: Simple gradient (easy to read)
// let asciiChar = "# .:;+=xX$&";

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
  
  // Create canvas: each character will be 10x10 pixels
  // So if image is 64x48, canvas will be 640x480
  createCanvas(img.width * 10, img.height * 10);
  
  // Calculate how many pixels each ASCII character takes up
  // Example: 640 width / 64 characters = 10 pixels per character
  size = width / img.width;
  
  // Static image doesn't need to redraw every frame
  // This improves performance by only drawing once
  noLoop();
}

// ============================================
// DRAW - Renders the ASCII art
// ============================================

function draw() {
  // Background color options (uncomment to try different looks):
  
  background(220);  // Light gray (current)
  // background(255);  // White (high key, airy)
  // background(200);  // Medium gray
  // background(0);    // Black (dramatic, high contrast)
  
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
      
      // Brightness adjustment options (uncomment one to modify contrast):
      
      // Option 1: Standard (no adjustment - natural look)
      // bright = brightness(pixelVal);
      
      // Option 2: Increase contrast (darker darks, lighter lights)
      // bright = map(bright, 0, 255, 30, 255);
      // bright = constrain(bright, 0, 255);
      
      // Option 3: Lighter overall (brighten the image)
      // bright = map(bright, 0, 255, 50, 255);
      // bright = constrain(bright, 0, 255);
      
      // Option 4: High key (very light, washed out look)
      // bright = map(bright, 0, 255, 100, 255);
      // bright = constrain(bright, 0, 255);
      
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
      
      // Set text color to black
      fill(0);
      
      // Draw the ASCII character at position (x, y)
      text(t, x, y);
    }
  }
}