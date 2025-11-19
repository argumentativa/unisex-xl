// ============================================
// VARIABLES - BOLD COLOR VERSION WITH SOUND
// ============================================

let img;  // Will hold our image
let size; // Size of each ASCII character (in pixels)

// ASCII characters with block characters for extra boldness
// Dense characters create more visual weight
let asciiChar = "█▓▒░$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. ";

let w = 100;  // Higher resolution for MORE DETAIL (was 64)
let h = 75;   // Proportional height

// ============================================
// AUDIO VARIABLES - BLACKHOLE INPUT
// ============================================

let mic;           // Audio input (BlackHole device)
let fft;           // FFT analyzer for frequency analysis
let amp;           // Amplitude analyzer for volume
let startButton;   // Button to start audio
let audioStarted = false;

// Audio reactive values
let bass = 0;      // Bass frequency energy
let mid = 0;       // Mid frequency energy
let treble = 0;    // Treble frequency energy
let volume = 0;    // Overall volume
let bassSmooth = 0;    // Smoothed bass for less jitter
let volumeSmooth = 0;  // Smoothed volume

// ============================================
// PRELOAD - Runs before setup()
// ============================================

function preload() {
  // Load the image file before anything else runs
  img = loadImage("../../assets/dandy.jpg");
}

// ============================================
// SETUP - Runs once at the start
// ============================================

function setup() {
  // Resize image to higher resolution for more detail
  img.resize(w, 0);

  // Update h to match the actual resized height
  h = img.height;

  // Create canvas that fills the window
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;

  createCanvas(canvasWidth, canvasHeight);

  // Calculate character size
  size = width / img.width;

  // Enable bold text style for extra weight
  textStyle(BOLD);

  console.log('🎨 p5.js setup complete');
  
  // ============================================
  // AUDIO SETUP - BLACKHOLE INPUT
  // ============================================
  
  // Create start button
  startButton = createButton('🎤 START AUDIO (Select BlackHole)');
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
  startButton.style('transition', 'all 0.3s');
  startButton.mouseOver(() => {
    startButton.style('background', '#00cc00');
    startButton.style('transform', 'scale(1.05)');
  });
  startButton.mouseOut(() => {
    startButton.style('background', '#00ff00');
    startButton.style('transform', 'scale(1)');
  });

  console.log('🎛️ Button created. Click to start audio analysis!');
}

// ============================================
// START AUDIO - Initialize BlackHole input & analyzers
// ============================================

function startAudio() {
  if (!audioStarted) {
    console.log('🎤 Starting audio input...');
    console.log('📢 SELECT BLACKHOLE 2CH when browser asks for microphone permission!');
    
    // Create microphone input (will prompt for BlackHole selection)
    mic = new p5.AudioIn();
    mic.start();
    
    // Create FFT for frequency analysis
    // 512 bins for detailed frequency data
    fft = new p5.FFT(0.8, 512);
    fft.setInput(mic);
    
    // Create amplitude analyzer
    amp = new p5.Amplitude();
    amp.setInput(mic);
    
    audioStarted = true;
    
    // Update button
    startButton.html('🔊 LISTENING TO SYSTEM AUDIO');
    startButton.style('background', '#ff00ff');
    startButton.style('box-shadow', '0 4px 15px rgba(255,0,255,0.6)');
    
    console.log('✅ Audio input started!');
    console.log('🎵 Play any audio on your Mac - it will be captured via BlackHole!');
  }
}


// ============================================
// DRAW - Renders BOLD COLOR ASCII art
// ============================================

function draw() {
  // Black background makes colors pop
  background(0);
  
  // Alternative backgrounds (uncomment to try):
  // background(255);  // White - clean
  // background(220);  // Light gray - softer
  
  // ============================================
  // AUDIO ANALYSIS - BLACKHOLE INPUT
  // ============================================
  
  if (audioStarted && fft && amp) {
    // Get frequency spectrum
    let spectrum = fft.analyze();
    
    // Analyze different frequency ranges (ULTRA AGGRESSIVE scaling)
    // Bass: 20-250 Hz (bins 0-30 approx)
    bass = fft.getEnergy("bass") * 3.0; // HUGE boost bass detection
    
    // Mid: 250-4000 Hz
    mid = fft.getEnergy("mid") * 3.0; // HUGE boost mid detection
    
    // Treble: 4000-20000 Hz
    treble = fft.getEnergy("treble") * 3.0; // HUGE boost treble detection
    
    // Get overall volume (0-1)
    volume = amp.getLevel();
    
    // Smooth the values for less jitter (but VERY responsive)
    bassSmooth = lerp(bassSmooth, bass, 0.7); // More responsive
    volumeSmooth = lerp(volumeSmooth, volume, 0.6); // More responsive
    
    // DEBUG: Log values every 30 frames (~0.5 seconds at 60fps)
    if (frameCount % 30 === 0) {
      console.log(`🎵 Audio Values: Bass=${Math.floor(bassSmooth)} Mid=${Math.floor(mid)} Treble=${Math.floor(treble)} Vol=${volume.toFixed(3)}`);
      if (bassSmooth < 5 && mid < 5 && treble < 5) {
        console.warn('⚠️ NO AUDIO DETECTED! Check BlackHole selection!');
      }
    }
    
    // Flash background on heavy bass to show it's working
    if (bassSmooth > 200) {
      background(20, 0, 0); // Dark red flash
    }
  }
  
  // Prepare image pixels for reading
  img.loadPixels();

  // Loop through every pixel with higher resolution
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      
      // Get the color of the pixel at position (i, j)
      let pixelVal = img.get(i, j);
      
      // Calculate brightness
      let bright = brightness(pixelVal);
      
      // ============================================
      // AUDIO REACTIVE BRIGHTNESS
      // ============================================
      
      if (audioStarted) {
        // ULTRA AGGRESSIVE brightness modulation with volume
        let volumeBoost = map(volumeSmooth, 0, 0.3, 0, 150);
        bright = bright + volumeBoost;
        
        // Add treble-based contrast (EXTREME)
        let trebleBoost = map(treble, 0, 255, 0, 100);
        bright = map(bright, 0, 255, trebleBoost, 255 - trebleBoost);
        
        // Flash brighter on bass hits
        if (bassSmooth > 150) {
          bright = bright * 1.3;
        }
        
        // Constrain to valid range
        bright = constrain(bright, 0, 255);
      }
      
      // Map brightness to character index
      let tIndex = floor(map(bright, 0, 255, asciiChar.length - 1, 0));
      
      // Calculate character position
      let x = i * size + size / 2;
      let y = j * size + size / 2;
      
      // Get the ASCII character
      let t = asciiChar.charAt(tIndex);
      
      // ============================================
      // AUDIO REACTIVE SIZE
      // ============================================
      
      // Base size
      let charSize = size * 1.1;
      
      if (audioStarted) {
        // Bass makes everything pulse (ULTRA AGGRESSIVE)
        let bassPulse = map(bassSmooth, 0, 255, 0.5, 4.0); // EXTREME range!
        charSize = charSize * bassPulse;
        
        // Mid frequencies create wave effect based on position (EXTREME)
        let wave = sin((i + j) * 0.1 + frameCount * 0.1) * 0.5 + 0.5;
        let midEffect = map(mid, 0, 255, 1.0, 2.0);
        charSize = charSize * (1 + (wave * (midEffect - 1)));
        
        // Ripple effect from center (bass driven)
        let centerX = img.width / 2;
        let centerY = img.height / 2;
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
      
      // Center the character
      textAlign(CENTER, CENTER);
      
      // ============================================
      // AUDIO REACTIVE COLOR
      // ============================================
      
      // Extract RGB components
      let r = red(pixelVal);
      let g = green(pixelVal);
      let b = blue(pixelVal);
      
      if (audioStarted) {
        // EXTREME COLOR MANIPULATION for obvious changes
        
        // Bass: MASSIVE red boost + saturation
        let bassBoost = map(bassSmooth, 0, 255, 0, 200);
        r = r * 1.5 + bassBoost; // Multiply original + huge boost
        
        // Mid: MASSIVE green boost + reduce other channels for contrast
        let midBoost = map(mid, 0, 255, 0, 180);
        g = g * 1.5 + midBoost;
        if (mid > 100) {
          r = r * 0.7; // Reduce red when mids are high
          b = b * 0.7; // Reduce blue when mids are high
        }
        
        // Treble: MASSIVE blue boost + white flash effect
        let trebleBoost = map(treble, 0, 255, 0, 190);
        b = b * 1.5 + trebleBoost;
        if (treble > 150) {
          // Flash to white on high treble
          r = r + (treble - 150);
          g = g + (treble - 150);
          b = b + (treble - 150);
        }
        
        // Add color cycling effect based on time + audio
        let colorShift = sin(frameCount * 0.05 + bassSmooth * 0.01) * 50;
        r = r + colorShift;
        g = g - colorShift * 0.5;
        b = b + colorShift * 0.8;
        
        // Constrain RGB values
        r = constrain(r, 0, 255);
        g = constrain(g, 0, 255);
        b = constrain(b, 0, 255);
      }
      
      // Apply color
      fill(r, g, b);
      
      // ============================================
      // AUDIO REACTIVE STROKE
      // ============================================
      
      let strokeW = 0.8;
      
      if (audioStarted) {
        // Volume affects stroke weight (ULTRA EXTREME)
        strokeW = map(volumeSmooth, 0, 0.3, 0.5, 3.5);
        
        // COLORFUL STROKE based on frequency content
        if (bassSmooth > 80) {
          // RED stroke on bass
          stroke(255, 50, 50, 255);
          strokeWeight(strokeW * 3.0);
        } else if (mid > 80) {
          // GREEN stroke on mids
          stroke(50, 255, 50, 255);
          strokeWeight(strokeW * 2.5);
        } else if (treble > 50) {
          // CYAN/WHITE stroke on treble
          stroke(100, 255, 255, 255);
          strokeWeight(strokeW * 2.5);
        } else {
          // Saturated color stroke
          stroke(r * 1.2, g * 1.2, b * 1.2);
          strokeWeight(strokeW);
        }
      } else {
        stroke(r, g, b);
        strokeWeight(strokeW);
      }
      
      // Draw the ASCII character
      text(t, x, y);
    }
  }
  
  // Reset stroke
  noStroke();
  
  // ============================================
  // AUDIO DEBUG DISPLAY (Optional)
  // ============================================
  
  if (audioStarted) {
    drawAudioDebug();
  }
}

// ============================================
// DRAW AUDIO DEBUG - Visual feedback
// ============================================

function drawAudioDebug() {
  push();
  
  // BIGGER background
  fill(0, 0, 0, 200);
  noStroke();
  rect(10, height - 200, 350, 190, 10);
  
  // Title with activity indicator
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  
  // Flash if any audio detected
  if (bassSmooth > 10 || mid > 10 || treble > 10) {
    fill(0, 255, 0);
    text('🔊 AUDIO ACTIVE', 20, height - 190);
  } else {
    fill(255, 0, 0);
    text('⚠️ NO AUDIO - RESELECT BLACKHOLE!', 20, height - 190);
  }
  
  textStyle(NORMAL);
  textSize(14);
  
  // Bass bar - BIGGER
  fill(255, 50, 50);
  let bassWidth = map(bassSmooth, 0, 255, 0, 300);
  rect(20, height - 155, bassWidth, 30, 3);
  fill(255);
  text(`BASS: ${Math.floor(bassSmooth)} / 255`, 25, height - 148);
  
  // Mid bar - BIGGER
  fill(50, 255, 50);
  let midWidth = map(mid, 0, 255, 0, 300);
  rect(20, height - 115, midWidth, 30, 3);
  fill(255);
  text(`MID: ${Math.floor(mid)} / 255`, 25, height - 108);
  
  // Treble bar - BIGGER
  fill(50, 50, 255);
  let trebleWidth = map(treble, 0, 255, 0, 300);
  rect(20, height - 75, trebleWidth, 30, 3);
  fill(255);
  text(`TREBLE: ${Math.floor(treble)} / 255`, 25, height - 68);
  
  // Volume indicator
  fill(255, 255, 0);
  let volWidth = map(volumeSmooth, 0, 1, 0, 300);
  rect(20, height - 35, volWidth, 25, 3);
  fill(255);
  text(`VOLUME: ${(volumeSmooth * 100).toFixed(1)}%`, 25, height - 30);
  
  pop();
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

// ============================================
// 🎵 TONE.JS AUDIO REACTIVE FEATURES 🎵
// ============================================
//
// WHAT IT DOES:
// - Analyzes Tone.js audio output in real-time
// - Splits audio into Bass, Mid, and Treble frequencies
// - Animates the ASCII art based on your Strudel/Tone.js patterns
//
// AUDIO EFFECTS:
// 1. BASS (20-250 Hz) → Makes everything pulse larger
// 2. MID (250-4000 Hz) → Creates wave patterns across the image
// 3. TREBLE (4000-20000 Hz) → Adds white sparkle outlines on high notes
// 4. VOLUME → Modulates overall brightness
//
// COLOR EFFECTS:
// - Bass → Boosts RED (warm, powerful)
// - Mid → Boosts GREEN (energetic)
// - Treble → Boosts BLUE (shimmer, sparkle)
//
// HOW TO USE FOR LIVE PERFORMANCE:
// 1. Open this page in one browser tab
// 2. Open your Strudel or Tone.js code in another tab
// 3. Click "START TONE.JS AUDIO" button on this page
// 4. Start playing audio in your music tab
// 5. The visualizer will react to your audio output!
//
// WORKS WITH:
// ✅ Strudel live coding patterns
// ✅ Tone.js synthesizers and samplers
// ✅ Any audio playing through Tone.Destination
// ✅ Your 157 BPM industrial tracks!
//
// CUSTOMIZATION TIPS:
// - Adjust bass pulse intensity: Line 243 (currently 1.0 to 1.3)
// - Adjust color boost: Lines 268, 271, 274
// - Adjust brightness modulation: Line 213
// - Wave speed: Line 247 (frameCount * 0.05)
// - Frequency ranges: Lines 34-36
// - Sensitivity: Line 169 (currently * 800)
//
// TECHNICAL:
// - Uses Tone.FFT for frequency analysis
// - Uses Tone.Meter for volume measurement
// - Connected to Tone.Destination (master output)
// - 512 FFT bins with 0.8 smoothing
//
// ============================================

