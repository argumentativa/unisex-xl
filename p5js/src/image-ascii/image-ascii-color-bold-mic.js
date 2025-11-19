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
// AUDIO VARIABLES - P5.SOUND (MICROPHONE)
// ============================================

let mic;           // Microphone input
let fft;           // FFT analyzer for frequency analysis
let amplitude;     // Amplitude analyzer for volume
let startButton;   // Button to start audio context
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
  // AUDIO SETUP - P5.SOUND MICROPHONE
  // ============================================

  // Check if p5.sound is loaded
  if (typeof p5.AudioIn === 'undefined') {
    console.error('❌ p5.sound NOT FOUND! The library may not have loaded.');
    console.error('Check that the p5.sound.min.js script tag is in the HTML.');
  } else {
    console.log('✅ p5.sound detected!');
  }

  // Create start button
  startButton = createButton('🎤 START MICROPHONE');
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

  console.log('🎛️ Button created. Click to start microphone input!');
}

// ============================================
// START AUDIO - Initialize microphone input
// ============================================

function startAudio() {
  if (!audioStarted) {
    try {
      // Check if p5.sound is loaded
      if (typeof p5.AudioIn === 'undefined') {
        console.error('❌ p5.sound is not loaded! Check the script tag in HTML.');
        alert('ERROR: p5.sound library not loaded. Check console for details.');
        return;
      }

      console.log('🎤 Starting microphone input...');

      // Create microphone input
      mic = new p5.AudioIn();
      mic.start();
      console.log('✅ Microphone started');

      // Create FFT analyzer (analyzes frequencies)
      // 512 bins for detailed frequency analysis, 0.8 smoothing
      fft = new p5.FFT(0.8, 512);
      fft.setInput(mic);
      console.log('✅ FFT analyzer created');

      // Create Amplitude analyzer (measures volume)
      amplitude = new p5.Amplitude();
      amplitude.setInput(mic);
      console.log('✅ Amplitude analyzer created');

      audioStarted = true;

      // Update button
      startButton.html('🔊 LISTENING TO MICROPHONE');
      startButton.style('background', '#ff00ff');
      startButton.style('box-shadow', '0 4px 15px rgba(255,0,255,0.6)');

      console.log('✅ Setup complete! Microphone is listening.');
      console.log('🎵 Play Strudel in another tab - it will pick up your system audio!');
      console.log('💡 TIP: On Mac, you may need to use software like BlackHole to route audio to mic');

    } catch (error) {
      console.error('❌ Error starting microphone:', error);
      alert('Error starting microphone: ' + error.message);
    }
  }
}

// ============================================
// DRAW - Renders BOLD COLOR ASCII art
// ============================================

function draw() {
  // Black background makes colors pop
  background(0);

  // ============================================
  // AUDIO ANALYSIS - P5.SOUND MICROPHONE
  // ============================================

  if (audioStarted && fft && amplitude) {
    // Get frequency spectrum from p5.sound FFT
    // Returns an array of amplitude values for each frequency
    let spectrum = fft.analyze();

    // Analyze different frequency ranges
    // Bass: low frequencies (bins 0-15 approx for 20-250 Hz at 44.1kHz)
    // Mid: mid frequencies (bins 15-200 approx for 250-4000 Hz)
    // Treble: high frequencies (bins 200-256 approx for 4000-20000 Hz)

    bass = fft.getEnergy("bass");       // Gets energy in bass range
    mid = fft.getEnergy("mid");         // Gets energy in mid range
    treble = fft.getEnergy("treble");   // Gets energy in treble range

    // Get overall volume from amplitude analyzer (0 to 1)
    volume = amplitude.getLevel();

    // Smooth the values for less jitter
    bassSmooth = lerp(bassSmooth, bass, 0.5);
    volumeSmooth = lerp(volumeSmooth, volume, 0.4);

    // DEBUG: Log values every 30 frames (~0.5 seconds at 60fps)
    if (frameCount % 30 === 0) {
      console.log(`🎵 Audio Values: Bass=${Math.floor(bassSmooth)} Mid=${Math.floor(mid)} Treble=${Math.floor(treble)} Vol=${volume.toFixed(3)}`);
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
        // AGGRESSIVE brightness modulation with volume
        let volumeBoost = map(volumeSmooth, 0, 0.5, 0, 100);
        bright = bright + volumeBoost;

        // Add treble-based contrast (MORE EXTREME)
        let trebleBoost = map(treble, 0, 255, 0, 60);
        bright = map(bright, 0, 255, trebleBoost, 255 - trebleBoost);

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
        // Bass makes everything pulse (AGGRESSIVE)
        let bassPulse = map(bassSmooth, 0, 255, 1.0, 1.8);
        charSize = charSize * bassPulse;

        // Mid frequencies create wave effect based on position (MORE INTENSE)
        let wave = sin((i + j) * 0.1 + frameCount * 0.08) * 0.5 + 0.5;
        let midEffect = map(mid, 0, 255, 1.0, 1.4);
        charSize = charSize * (1 + (wave * (midEffect - 1)));
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
        // Bass boosts red channel (AGGRESSIVE warm effect)
        r = r + map(bassSmooth, 0, 255, 0, 80);

        // Mid boosts green (POWERFUL energy)
        g = g + map(mid, 0, 255, 0, 70);

        // Treble boosts blue (INTENSE shimmer)
        b = b + map(treble, 0, 255, 0, 75);

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
        // Volume affects stroke weight (MORE EXTREME)
        strokeW = map(volumeSmooth, 0, 0.5, 0.5, 2.5);

        // High treble adds white outline for sparkle (EASIER TO TRIGGER)
        if (treble > 100) {
          stroke(255, 255, 255, map(treble, 100, 255, 50, 255));
          strokeWeight(strokeW * 2.0);
        } else {
          stroke(r, g, b);
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
    fill(255, 100, 100);
    text('⚠️ NO AUDIO DETECTED', 20, height - 190);
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
// 🎤 MICROPHONE AUDIO REACTIVE FEATURES 🎤
// ============================================
//
// WHAT IT DOES:
// - Captures microphone/system audio input
// - Splits audio into Bass, Mid, and Treble frequencies
// - Animates the ASCII art based on audio input
//
// AUDIO EFFECTS:
// 1. BASS (low freq) → Makes everything pulse larger
// 2. MID (mid freq) → Creates wave patterns across the image
// 3. TREBLE (high freq) → Adds white sparkle outlines on high notes
// 4. VOLUME → Modulates overall brightness
//
// COLOR EFFECTS:
// - Bass → Boosts RED (warm, powerful)
// - Mid → Boosts GREEN (energetic)
// - Treble → Boosts BLUE (shimmer, sparkle)
//
// HOW TO USE:
// 1. Click "START MICROPHONE" button
// 2. Grant microphone permission when prompted
// 3. Play Strudel or any audio in another tab
// 4. The visualizer will react to audio it picks up!
//
// SYSTEM AUDIO ROUTING (Mac):
// - Install BlackHole (free virtual audio driver)
// - Route your system audio through BlackHole
// - Set BlackHole as your microphone input
// - Now the visualizer will capture all system audio!
//
// WORKS WITH:
// ✅ Microphone input (music, voice, instruments)
// ✅ System audio (with audio routing software)
// ✅ Any sound your microphone can hear
// ✅ Strudel playing in another tab (with audio routing)
//
// TECHNICAL:
// - Uses p5.sound library
// - p5.AudioIn for microphone capture
// - p5.FFT for frequency analysis
// - p5.Amplitude for volume measurement
// - 512 FFT bins with 0.8 smoothing
//
// ============================================
