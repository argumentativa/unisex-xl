let size;
let asciiChar = "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";

let video;
let w = 64;
let h = 48;

function setup() {
  // Create canvas that fills browser window (responsive)
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;  // Maintain aspect ratio
  
  createCanvas(canvasWidth, canvasHeight);
  
  console.log("Setup running..."); // Debug log
  
  video = createCapture(VIDEO);
  video.size(w, h);
  video.hide(); // Hide the video element (we'll draw ASCII instead)
  
  size = width / w; // Calculate character size (adapts to window)
  
  console.log("Canvas created:", width, "x", height); // Debug log
  console.log("Video capture initialized"); // Debug log
}

function draw() {
  background(220);
  
  // Check if video is ready by verifying it has valid dimensions
  // p5.Capture objects don't have a loadedmetadata property
  // Instead, check if width > 0 which indicates the stream is initialized
  if (!video || video.width === 0) {
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Waiting for webcam...", width/2, height/2);
    return;
  }
  
  video.loadPixels(); // Load video pixels

  for (let i = 0; i < w; i++) {           // Changed from img.width to w
    for (let j = 0; j < h; j++) {         // Changed from img.height to h
      let pixelVal = video.get(i, j);     // Changed from img.get to video.get
      
      let bright = brightness(pixelVal);
      let tIndex = floor(map(bright, 0, 255, asciiChar.length - 1, 0));
      
      let x = i * size + size / 2;        // Center the character
      let y = j * size + size / 2;
      let t = asciiChar.charAt(tIndex);
      
      textSize(size);
      textAlign(CENTER, CENTER);
      
      // Color options (uncomment one):
      fill(0);              // Black text (monochrome)
      // fill(pixelVal);    // Full color from webcam
      
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