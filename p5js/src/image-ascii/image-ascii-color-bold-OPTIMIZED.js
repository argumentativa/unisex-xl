// ============================================
// OPTIMIZED PERFORMANCE VERSION
// ============================================
// Lower resolution, faster rendering, same visual impact

let img;
let size;

// Simplified ASCII set for faster rendering (fewer unique characters)
let asciiChar = "█▓▒░@%#*+=:. ";

// REDUCED RESOLUTION for performance (64 vs 100)
let w = 64;  // Lower = MUCH faster
let h = 48;

// ============================================
// AUDIO VARIABLES
// ============================================

let mic;
let fft;
let amp;
let startButton;
let audioStarted = false;

let bass = 0;
let mid = 0;
let treble = 0;
let volume = 0;
let bassSmooth = 0;
let volumeSmooth = 0;

// Cache frequently used values
let halfSize;
let baseCharSize;
let imgPixels;

// Performance settings
const SHOW_DEBUG = true; // Set to true to show audio levels
const TARGET_FPS = 60; // Can reduce to 30 for better performance

// ============================================
// PRELOAD
// ============================================

function preload() {
  img = loadImage("../../assets/dandy.jpg");
}

// ============================================
// SETUP
// ============================================

function setup() {
  img.resize(w, 0);
  h = img.height;

  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;

  createCanvas(canvasWidth, canvasHeight);
  
  // PERFORMANCE: Disable smoothing for faster rendering
  noSmooth();
  
  // Set target framerate
  frameRate(TARGET_FPS);

  size = width / img.width;
  halfSize = size / 2;
  baseCharSize = size * 1.1;

  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  console.log('🚀 OPTIMIZED version loaded');
  console.log(`Resolution: ${w}x${h} pixels`);
  console.log(`Target FPS: ${TARGET_FPS}`);

  // Create start button
  startButton = createButton('🎤 START AUDIO');
  startButton.position(20, 20);
  startButton.mousePressed(startAudio);
  startButton.style('padding', '15px 30px');
  startButton.style('font-size', '18px');
  startButton.style('background', '#00ff00');
  startButton.style('border', 'none');
  startButton.style('border-radius', '10px');
  startButton.style('cursor', 'pointer');
  startButton.style('font-weight', 'bold');
  startButton.style('box-shadow', '0 4px 15px rgba(0,255,0,0.4)');
  startButton.mouseOver(() => {
    startButton.style('background', '#00cc00');
  });
  startButton.mouseOut(() => {
    startButton.style('background', '#00ff00');
  });
}

// ============================================
// START AUDIO
// ============================================

function startAudio() {
  if (!audioStarted) {
    console.log('🎤 Starting audio... Select BlackHole 2ch!');

    mic = new p5.AudioIn();
    mic.start();

    // Reduced FFT bins for better performance (256 vs 512)
    fft = new p5.FFT(0.8, 256);
    fft.setInput(mic);

    amp = new p5.Amplitude();
    amp.setInput(mic);

    audioStarted = true;

    startButton.html('🔊 LISTENING');
    startButton.style('background', '#ff00ff');

    console.log('✅ Audio active!');
  }
}

// ============================================
// DRAW - OPTIMIZED
// ============================================

function draw() {
  background(0);

  // ============================================
  // AUDIO ANALYSIS (calculated once per frame)
  // ============================================

  if (audioStarted && fft && amp) {
    // Get audio data (EXTRA BOOST for optimized version)
    bass = fft.getEnergy("bass") * 4.0; // Even higher than original
    mid = fft.getEnergy("mid") * 4.0;
    treble = fft.getEnergy("treble") * 4.0;
    volume = amp.getLevel();

    // Smooth
    bassSmooth = lerp(bassSmooth, bass, 0.7);
    volumeSmooth = lerp(volumeSmooth, volume, 0.6);
    
    // Debug log
    if (frameCount % 30 === 0) {
      console.log(`🎵 Bass=${Math.floor(bassSmooth)} Mid=${Math.floor(mid)} Treble=${Math.floor(treble)} Vol=${volume.toFixed(3)}`);
    }
  }

  // Pre-calculate audio effects (once per frame, not per pixel!)
  let volumeBoost = audioStarted ? map(volumeSmooth, 0, 0.3, 0, 150) : 0;
  let trebleBoost = audioStarted ? map(treble, 0, 255, 0, 100) : 0;
  let bassPulse = audioStarted ? map(bassSmooth, 0, 255, 1.0, 3.0) : 1.0; // EVEN MORE pulse!
  let midEffect = audioStarted ? map(mid, 0, 255, 1.0, 2.0) : 1.0; // More mid effect
  let bassBoost = audioStarted ? map(bassSmooth, 0, 255, 0, 200) : 0;
  let midBoost = audioStarted ? map(mid, 0, 255, 0, 180) : 0;
  let trebleColorBoost = audioStarted ? map(treble, 0, 255, 0, 190) : 0;
  let colorShift = audioStarted ? sin(frameCount * 0.05 + bassSmooth * 0.01) * 50 : 0;
  let brightnessFlash = (audioStarted && bassSmooth > 150) ? 1.3 : 1.0;
  
  // Stroke settings
  let strokeMode = 0; // 0=normal, 1=bass, 2=mid, 3=treble
  if (audioStarted) {
    if (bassSmooth > 80) strokeMode = 1;
    else if (mid > 80) strokeMode = 2;
    else if (treble > 50) strokeMode = 3;
  }
  
  // Load pixels once
  img.loadPixels();
  let imgW = img.width;
  let imgH = img.height;

  // ============================================
  // RENDER LOOP - OPTIMIZED
  // ============================================

  for (let i = 0; i < imgW; i++) {
    let x = i * size + halfSize;
    
    for (let j = 0; j < imgH; j++) {
      // Get pixel color (using get is slow, but necessary for small images)
      let pixelVal = img.get(i, j);
      let r = red(pixelVal);
      let g = green(pixelVal);
      let b = blue(pixelVal);
      
      // Brightness
      let bright = (r * 0.299 + g * 0.587 + b * 0.114); // Faster than brightness()
      
      if (audioStarted) {
        // Apply brightness effects
        bright = bright + volumeBoost;
        bright = map(bright, 0, 255, trebleBoost, 255 - trebleBoost);
        bright = bright * brightnessFlash;
        bright = constrain(bright, 0, 255);
      }

      // Map to ASCII character
      let tIndex = floor(map(bright, 0, 255, asciiChar.length - 1, 0));
      let t = asciiChar.charAt(tIndex);

      // Calculate position
      let y = j * size + halfSize;

      // EXTREME size reactivity with multiple effects
      let charSize = baseCharSize * bassPulse;
      
      if (audioStarted) {
        // Wave effect from mids (flowing across image)
        let wave = sin((i + j) * 0.1 + frameCount * 0.1) * 0.5 + 0.5;
        charSize = charSize * (1 + (wave * (midEffect - 1)));
        
        // Ripple effect from center (bass driven)
        let centerX = imgW / 2;
        let centerY = imgH / 2;
        let distFromCenter = dist(i, j, centerX, centerY);
        let ripple = sin(distFromCenter * 0.3 - frameCount * 0.15 - bassSmooth * 0.05) * 0.5 + 0.5;
        charSize = charSize * (1 + ripple * 0.5);
        
        // Individual character variation based on position + treble
        let variation = sin(i * 0.5 + frameCount * 0.08) * cos(j * 0.5 + frameCount * 0.06);
        variation = variation * map(treble, 0, 255, 0, 0.6);
        charSize = charSize * (1 + variation);
        
        // Random-ish jitter on high energy
        if (volume > 0.2) {
          let jitter = sin(i * j * 0.1 + frameCount * 0.2) * map(volume, 0.2, 1.0, 0, 0.4);
          charSize = charSize * (1 + jitter);
        }
      }
      
      textSize(charSize);

      // Color manipulation (optimized)
      if (audioStarted) {
        r = r * 1.5 + bassBoost;
        g = g * 1.5 + midBoost;
        b = b * 1.5 + trebleColorBoost;
        
        // Channel suppression for mids
        if (mid > 100) {
          r *= 0.7;
          b *= 0.7;
        }
        
        // White flash on treble
        if (treble > 150) {
          let flash = treble - 150;
          r += flash;
          g += flash;
          b += flash;
        }
        
        // Color shift
        r += colorShift;
        g -= colorShift * 0.5;
        b += colorShift * 0.8;
        
        r = constrain(r, 0, 255);
        g = constrain(g, 0, 255);
        b = constrain(b, 0, 255);
      }

      fill(r, g, b);

      // Stroke (optimized with pre-calculated mode)
      if (strokeMode === 1) {
        stroke(255, 50, 50);
        strokeWeight(3.0);
      } else if (strokeMode === 2) {
        stroke(50, 255, 50);
        strokeWeight(2.5);
      } else if (strokeMode === 3) {
        stroke(100, 255, 255);
        strokeWeight(2.5);
      } else {
        stroke(r * 1.2, g * 1.2, b * 1.2);
        strokeWeight(0.8);
      }

      // Draw character
      text(t, x, y);
    }
  }

  noStroke();

  // Optional debug display
  if (SHOW_DEBUG && audioStarted) {
    drawAudioDebug();
  }
  
  // FPS counter
  if (frameCount % 60 === 0) {
    console.log(`FPS: ${Math.round(frameRate())}`);
  }
}

// ============================================
// AUDIO DEBUG (Optional)
// ============================================

function drawAudioDebug() {
  push();
  fill(0, 0, 0, 200);
  noStroke();
  rect(10, height - 120, 250, 110, 10);

  fill(255);
  textSize(12);
  textAlign(LEFT, TOP);
  textStyle(NORMAL);

  fill(255, 50, 50);
  rect(20, height - 105, map(bassSmooth, 0, 255, 0, 200), 20, 3);
  fill(255);
  text(`BASS: ${Math.floor(bassSmooth)}`, 25, height - 100);

  fill(50, 255, 50);
  rect(20, height - 75, map(mid, 0, 255, 0, 200), 20, 3);
  fill(255);
  text(`MID: ${Math.floor(mid)}`, 25, height - 70);

  fill(50, 50, 255);
  rect(20, height - 45, map(treble, 0, 255, 0, 200), 20, 3);
  fill(255);
  text(`TREBLE: ${Math.floor(treble)}`, 25, height - 40);

  pop();
}

// ============================================
// WINDOW RESIZED
// ============================================

function windowResized() {
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;
  resizeCanvas(canvasWidth, canvasHeight);
  
  size = width / img.width;
  halfSize = size / 2;
  baseCharSize = size * 1.1;
}

// ============================================
// 🚀 PERFORMANCE OPTIMIZATIONS
// ============================================
//
// WHAT'S DIFFERENT FROM THE ORIGINAL:
//
// 1. LOWER RESOLUTION: 64x48 instead of 100x75 (60% fewer pixels!)
// 2. SIMPLER ASCII SET: 13 characters instead of 70 (faster rendering)
// 3. noSmooth(): Disabled anti-aliasing for faster drawing
// 4. REDUCED FFT BINS: 256 instead of 512 (less CPU for analysis)
// 5. PRE-CALCULATED VALUES: Audio effects calculated once per frame
// 6. OPTIMIZED BRIGHTNESS: Custom formula instead of brightness()
// 7. SIMPLIFIED STROKE: Pre-determined stroke mode per frame
// 8. REMOVED DEBUG BY DEFAULT: Set SHOW_DEBUG = true to enable
// 9. FPS MONITORING: Console logs FPS every second
//
// PERFORMANCE GAINS:
// - ~60-70% reduction in pixels processed
// - ~80% fewer unique characters to render
// - Pre-calculation saves repeated math operations
// - Should run 2-3x faster than original
//
// TO ADJUST PERFORMANCE:
// - Lower w/h further (try w=48) for even more speed
// - Reduce TARGET_FPS to 30 for slower machines
// - Disable stroke completely for maximum speed
// - Use even simpler ASCII set: "█▒░ " (just 4 chars!)
//
// ============================================

