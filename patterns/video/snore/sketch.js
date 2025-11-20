// ============================================
// VIDEO CIRCLES VISUALIZER
// ============================================
// This sketch loads a local video file and renders it as colored circles
// where each circle's size is based on the brightness of the corresponding pixel.

// --- GLOBAL VARIABLES ---

// `vid` - p5.js video object
// Stores the local video file for processing
let vid;

// `w` - Video width in pixels (64)
// Lower resolution for better performance
let w = 64;

// `h` - Video height in pixels (48)
// Lower resolution for better performance
let h = 48;

// `scl` - Scale multiplier (20)
// How much to scale up each pixel when drawing (64x48 becomes 640x480 canvas)
let scl = 10;

// --- SETUP FUNCTION ---
// Runs once when the sketch starts

function setup() {
  // `createCanvas(w * scl, h * scl)` - Creates the drawing canvas
  // Canvas size = 64 * 20 = 1280 pixels wide, 48 * 20 = 960 pixels tall
  createCanvas(w * scl, h * scl);
  
  // `createVideo('assets/snore.mov')` - Loads local video file
  // Creates a video object from the specified file path
  // Supported formats: mp4, webm, ogg, mov
  vid = createVideo('assets/1.mov');
  
  // `vid.size(w, h)` - Sets video display resolution
  // Resizes the video to 64x48 pixels for efficient processing
  vid.size(w, h);
  
  // `vid.hide()` - Hides the default video element
  // Video still plays but not displayed as separate element
  vid.hide();
  
  // `vid.loop()` - Starts video playback in continuous loop
  // Use `vid.play()` for single playthrough, or `vid.loop()` for continuous loop
  vid.loop();
}

// --- DRAW FUNCTION ---
// Runs continuously (typically 60 times per second)

function draw() {
  // Check if video is loaded and ready
  if (!vid || vid.width === 0) {
    background(220);
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Loading video...", width/2, height/2);
    return;
  }

  // `background(220)` - Sets canvas background color
  // Light gray background (220 out of 255) to provide contrast
  background(220);
  
  // `vid.loadPixels()` - Loads pixel data into vid.pixels array
  // Must be called before accessing individual pixel colors
  // Each pixel is stored as 4 values: [R, G, B, A] (Red, Green, Blue, Alpha)
  vid.loadPixels();
  
  // Outer loop: iterate through each column (x-axis)
  // `i` goes from 0 to vid.width (0 to 63)
  for (let i = 0; i < vid.width; i++) {
    // Inner loop: iterate through each row (y-axis)
    // `j` goes from 0 to vid.height (0 to 47)
    for (let j = 0; j < vid.height; j++) {
      // `index` - Calculates the position in the pixels array
      // Formula: ((row * width) + column) * 4
      // Multiplied by 4 because each pixel has 4 values (RGBA)
      // Example: pixel at (10, 5) = ((5 * 64) + 10) * 4 = 1320
      let index = ((j * vid.width) + i) * 4;
      
      // Extract color components from the pixels array
      // `r` - Red channel value (0-255)
      // `vid.pixels[index + 0]` - Red is at the base index
      let r = vid.pixels[index + 0];
      
      // `g` - Green channel value (0-255)
      // `vid.pixels[index + 1]` - Green is offset by 1
      let g = vid.pixels[index + 1];
      
      // `b` - Blue channel value (0-255)
      // `vid.pixels[index + 2]` - Blue is offset by 2
      let b = vid.pixels[index + 2];
      
      // `a` - Alpha channel value (0-255, transparency)
      // `vid.pixels[index + 3]` - Alpha is offset by 3
      // Note: Currently not used in this sketch
      let a = vid.pixels[index + 3];
      
      // `average` - Calculates brightness from RGB values
      // Average of red, green, and blue gives perceived brightness
      // Range: 0 (black) to 255 (white)
      let average = (r + g + b) / 3;
      
      // `c` - Mapped color value (currently unused, same as average)
      // `map(value, start1, stop1, start2, stop2)` - Maps a value from one range to another
      // Maps average (0-255) to same range (0-255), so effectively does nothing
      let c = map(average, 0, 255, 0, 255);
      
      // `s` - Circle size based on brightness
      // Maps brightness (0-100) to circle diameter (0-20 pixels)
      // Note: Uses `c` which is 0-255, but maps as if it's 0-100
      // Brighter pixels = larger circles, darker pixels = smaller circles
      let s = map(c, 0, 100, 0, 20);
      
      // `fill(r, g, b)` - Sets the fill color for shapes
      // Uses the actual RGB values from the video pixel
      // This makes each circle match the color of its corresponding pixel
      fill(r, g, b);
      
      // `ellipse(x, y, width, height)` - Draws a circle
      // `i * scl` - X position: column index scaled up (0-63 becomes 0-1280)
      // `j * scl` - Y position: row index scaled up (0-47 becomes 0-960)
      // `s, s` - Circle diameter (same for width and height = perfect circle)
      // Circle size varies based on pixel brightness
      ellipse(i * scl, j * scl, s, s);
    }
  }
}

