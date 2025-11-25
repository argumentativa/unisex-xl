// ============================================
// VIDEO ASCII - BOLD VERSION (Refactored)
// ============================================
// This sketch captures video from the webcam and renders it as ASCII art
// using bold characters for high contrast. It uses shared utility functions
// from ascii-utils.js for consistent rendering across all ASCII visualizations.

// --- GLOBAL VARIABLES ---

// `vid` - p5.js video capture object
// Stores the webcam video feed for ASCII conversion
let vid;

// `size` - Character size in pixels
// Calculated by createAsciiCanvas() based on canvas and grid dimensions
// Determines how large each ASCII character will be rendered
let size;

// `w` - Grid width in characters (64)
// Number of ASCII characters horizontally across the canvas
// Lower resolution for better performance
let w = 64;

// `h` - Grid height in characters (48)
// Number of ASCII characters vertically down the canvas
// Lower resolution for better performance
let h = 48;

// --- SETUP FUNCTION ---
// Runs once when the sketch starts

function setup() {
  // `createAsciiCanvas(w, h)` - Creates canvas optimized for ASCII rendering
  // Returns object with { canvasWidth, canvasHeight, size }
  // Ensures canvas fits window while maintaining grid aspect ratio
  const dims = createAsciiCanvas(w, h);
  
  // `size` - Extract character size from returned dimensions
  // Pixel size each ASCII character will occupy
  size = dims.size;

  // `createCapture(VIDEO)` - Starts webcam capture
  // Creates a video object that captures from the user's webcam
  vid = createCapture(VIDEO);
  
  // `vid.size(w, h)` - Sets video capture resolution
  // Resizes video to match ASCII grid dimensions (64x48)
  vid.size(w, h);
  
  // `vid.hide()` - Hides the default video element
  // Video feed still captured but not displayed as separate element
  vid.hide();
}

// --- DRAW FUNCTION ---
// Runs continuously (typically 60 times per second)

function draw() {
  // `background(0)` - Sets canvas background to black
  // Black background provides maximum contrast for white ASCII characters
  background(20);

  // `brightnessMod` - Custom function to enhance contrast
  // Modifies pixel brightness before converting to ASCII
  // `map(bright, 0, 255, 0, 255)` - Maps brightness range
  // `constrain(bright, 0, 255)` - Ensures value stays within valid range
  const brightnessMod = (bright) => {
    bright = map(bright, 0, 255, 0, 255);
    return constrain(bright, 0, 255);
  };

  // `renderAsciiGrid()` - Main rendering function from ascii-utils.js
  // Converts video pixels into ASCII characters and draws them on canvas
  // Parameters:
  //   - `vid`: Source video object (webcam feed)
  //   - `w`: Grid width (64 characters)
  //   - `h`: Grid height (48 characters)
  //   - `size * 1.2`: Character size multiplier (20% larger for smoother appearance)
  //   - `ASCII_CONFIG.CHARS.BOLD`: Character set ordered from darkest to lightest
  //   - Options: `useColor: true` (color), `useBold: false`, `brightMod` function
  renderAsciiGrid(vid, w, h, size * 1.2, ASCII_CONFIG.CHARS.BOLD, {
    useColor: true,
    useBold: false,
    brightMod: brightnessMod
  });
}

// --- WINDOW RESIZE FUNCTION ---
// Automatically called by p5.js when the browser window is resized

function windowResized() {
  // `resizeAsciiCanvas(w, h)` - Resizes canvas to fit new window size
  // Recalculates canvas dimensions and maintains aspect ratio
  const dims = resizeAsciiCanvas(w, h);
  
  // `size` - Update character size for new canvas dimensions
  // Ensures ASCII characters scale proportionally when window is resized
  size = dims.size;
}
