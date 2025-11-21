// ============================================
// AUDIO-REACTIVE VIDEO CIRCLES VISUALIZER
// ============================================
// This sketch captures video from the webcam and renders it as colored circles
// where circle size, color intensity, and position are influenced by audio input.
// Audio frequencies (bass, mid, treble) control different visual aspects.

// --- GLOBAL VARIABLES ---

// `vid` - p5.js video capture object
// Stores the webcam video feed for processing
let vid;

// `w` - Video width in pixels (64)
// Lower resolution for better performance
let w = 32;

// `h` - Video height in pixels (48)
// Lower resolution for better performance
let h = 24;

// `scl` - Scale multiplier (20)
// How much to scale up each pixel when drawing (64x48 becomes 640x480 canvas)
let scl = 40;

// Audio setup (p5.sound)
// `mic` - Microphone input for audio analysis
let mic, fft, amp;
let audioStarted = false;
let startButton;

// Audio analysis variables
// `bass`, `mid`, `treble` - Frequency band energies (0-255)
// `volume` - Overall audio volume (0-1)
let bass = 0, mid = 0, treble = 0, volume = 0;
let bassSmooth = 0, midSmooth = 0, trebleSmooth = 0, volumeSmooth = 0;

// --- SETUP FUNCTION ---
// Runs once when the sketch starts

function setup() {
  // `createCanvas(w * scl, h * scl)` - Creates the drawing canvas
  // Canvas size = 64 * 20 = 1280 pixels wide, 48 * 20 = 960 pixels tall
  createCanvas(w * scl, h * scl);
  
  // `createCapture(VIDEO)` - Starts webcam capture
  // Creates a video object that captures from the user's webcam
  vid = createCapture(VIDEO);
  
  // `vid.size(w, h)` - Sets video capture resolution
  // Resizes the video to 64x48 pixels for efficient processing
  vid.size(w, h);
  
  // `vid.hide()` - Hides the default video element
  // Video feed still captured but not displayed as separate element
  vid.hide();
  
  // Create audio start button
  // User must click to start audio (browser autoplay policy)
  startButton = createButton('🎤 START AUDIO');
  startButton.position(20, 20);
  startButton.mousePressed(startAudio);
  startButton.style('padding', '10px 20px');
  startButton.style('font-size', '16px');
  startButton.style('background', '#00ff00');
  startButton.style('border', 'none');
  startButton.style('border-radius', '5px');
  startButton.style('cursor', 'pointer');
  startButton.style('font-weight', 'bold');
}

// `startAudio()` - Initializes audio input and analysis
// Called when user clicks the START AUDIO button
function startAudio() {
  if (!audioStarted) {
    // `new p5.AudioIn()` - Creates microphone input
    // Captures audio from the user's microphone
    mic = new p5.AudioIn();
    mic.start();
    
    // `new p5.FFT()` - Fast Fourier Transform analyzer
    // Analyzes audio frequencies to extract bass, mid, treble bands
    // Parameters: smoothing (0.8), bins (256 for detailed analysis)
    fft = new p5.FFT(0.8, 256);
    fft.setInput(mic);
    
    // `new p5.Amplitude()` - Volume analyzer
    // Measures overall audio volume level
    amp = new p5.Amplitude();
    amp.setInput(mic);
    
    audioStarted = true;
    startButton.html('🔊 LISTENING');
    startButton.style('background', '#00cc00');
    console.log('🎵 Audio started! Make some noise!');
  }
}

// --- DRAW FUNCTION ---
// Runs continuously (typically 60 times per second)

function draw() {
  // ============================================
  // BACKGROUND COLOR EXAGGERATION SYSTEM
  // ============================================
  // Controls how much background color shifts with audio
  
  // **EXAGGERATION CONTROL: Background Color Shift**
  // `220 + bassSmooth * 0.4` - Background red tint from bass
  // - `220` - Base gray color (neutral starting point)
  // - `* 0.4` - Color shift multiplier: Higher (1.0, 1.5) = BIGGER color changes = MORE dramatic
  // - Current: 0.4x multiplier = balanced, subtle shifts
  // - To exaggerate MORE: Increase to `bassSmooth * 1.5` for dramatic red flashes
  // - To exaggerate LESS: Decrease to `bassSmooth * 0.1` for very subtle shifts
  if (audioStarted) {
    let bgR = 220 + bassSmooth * 0.4;  // Red tint from bass
    let bgG = 220 + midSmooth * 0.3;   // Green tint from mid
    let bgB = 220 + trebleSmooth * 0.35; // Blue tint from treble
    background(constrain(bgR, 0, 255), constrain(bgG, 0, 255), constrain(bgB, 0, 255));
  } else {
    // `background(220)` - Sets canvas background color
    // Light gray background (220 out of 255) when no audio
    background(220);
  }
  
  // ============================================
  // AUDIO ANALYSIS & EXAGGERATION SYSTEM
  // ============================================
  // This section amplifies raw audio values to make visual effects more dramatic
  
  // Audio analysis (once per frame for performance)
  if (audioStarted && fft && amp) {
    // `fft.getEnergy("bass")` - Gets bass frequency energy (20-250 Hz)
    // `fft.getEnergy("mid")` - Gets mid frequency energy (250-4000 Hz)
    // `fft.getEnergy("treble")` - Gets treble frequency energy (4000-20000 Hz)
    // 
    // **EXAGGERATION CONTROL: Initial Audio Amplification**
    // `* 10.0` - First level of exaggeration: multiplies raw audio values
    // - Higher values (15.0, 20.0) = MORE exaggerated, circles react to quieter sounds
    // - Lower values (5.0, 3.0) = LESS exaggerated, need louder sounds to react
    // - Current: 10.0 = balanced amplification
    // - To make MORE dramatic: increase to 15.0 or 20.0
    // - To make LESS dramatic: decrease to 5.0 or 3.0
    bass = fft.getEnergy("bass") * 10.0;
    mid = fft.getEnergy("mid") * 10.0;
    treble = fft.getEnergy("treble") * 10.0;
    
    // `amp.getLevel()` - Gets overall volume level (0-1)
    volume = amp.getLevel();
    
    // Smooth audio values using linear interpolation
    // `lerp(start, end, amount)` - Interpolates between values
    // Creates smoother, less jittery visual effects
    // VERY FAST smoothing (0.9) for QUICK inflation response
    // Higher values = faster response, circles inflate quickly with music
    bassSmooth = lerp(bassSmooth, bass, 0.9);
    midSmooth = lerp(midSmooth, mid, 0.9);
    trebleSmooth = lerp(trebleSmooth, treble, 0.9);
    volumeSmooth = lerp(volumeSmooth, volume, 0.85);
    
    // Debug: Log audio values every 60 frames to see what we're getting
    if (frameCount % 60 === 0) {
      console.log(`🎵 Audio - Bass: ${bassSmooth.toFixed(1)}, Mid: ${midSmooth.toFixed(1)}, Treble: ${trebleSmooth.toFixed(1)}, Volume: ${volumeSmooth.toFixed(3)}`);
    }
  }
  
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
      let g = vid.pixels[index + 10];
      
      // `b` - Blue channel value (0-255)
      // `vid.pixels[index + 2]` - Blue is offset by 2
      let b = vid.pixels[index + 30];
      
      // `a` - Alpha channel value (0-255, transparency)
      // `vid.pixels[index + 3]` - Alpha is offset by 3
      // Note: Currently not used in this sketch
      let a = vid.pixels[index + 0];
      
      // `average` - Calculates brightness from RGB values
      // Average of red, green, and blue gives perceived brightness
      // Range: 0 (black) to 255 (white)
      let average = (r + g + b) / 3;
      
      // `c` - Mapped color value (currently unused, same as average)
      // `map(value, start1, stop1, start2, stop2)` - Maps a value from one range to another
      // Maps average (0-255) to same range (0-255), so effectively does nothing
      let c = map(average, 0, 255, 0, 255);
      
      // ============================================
      // CIRCLE SIZE EXAGGERATION SYSTEM
      // ============================================
      // Controls how much circles grow with audio input
      
      // `baseSize` - Base circle size from pixel brightness
      // **EXAGGERATION CONTROL: Base Size Range**
      // `map(c, 0, 100, 5, 20)` - Maps brightness to circle size
      // - Higher max (30, 40) = Larger circles overall = MORE dramatic
      // - Lower max (15, 10) = Smaller circles overall = LESS dramatic
      // - Current: 5-20px = balanced
      let baseSize = map(c, 0, 100, 5, 100);
      
      // **EXAGGERATION CONTROL: Second Level Boost**
      // `boostedBass = (bassSmooth * 3.0) + 5.0`
      // - `* 3.0` - Multiplier: Higher (5.0, 10.0) = MORE exaggerated size changes
      // - `+ 5.0` - Minimum boost: Higher (10, 20) = Circles always larger, MORE dramatic baseline
      // - Current: 3.0x multiplier + 5.0 minimum = balanced
      // - To exaggerate MORE: Increase multiplier to 5.0-10.0, increase minimum to 10-20
      // - To exaggerate LESS: Decrease multiplier to 1.5-2.0, decrease minimum to 0-2
      let boostedBass = (bassSmooth * 3.0) + 5.0;
      let boostedMid = (midSmooth * 3.0) + 3.0;
      let boostedTreble = (trebleSmooth * 3.0) + 2.0;
      
      // **EXAGGERATION CONTROL: Size Multiplier Mapping**
      // `map(boostedBass, 0, 100, 1.2, 8.0)` - Maps boosted audio to size multiplier
      // - `1.2` (start) - Minimum multiplier: Higher (2.0, 3.0) = Circles always bigger = MORE dramatic
      // - `8.0` (end) - Maximum multiplier: Higher (15.0, 25.0) = Circles can get MUCH bigger = MORE dramatic
      // - `0, 100` (input range) - Lower threshold (0, 50) = Reacts to quieter sounds = MORE sensitive
      // - Current: 1.2x-8x = balanced
      // - To exaggerate MORE: Change to `map(boostedBass, 0, 50, 3.0, 25.0)` for extreme effect
      // - To exaggerate LESS: Change to `map(boostedBass, 0, 200, 1.0, 4.0)` for subtle effect
      let bassMultiplier = audioStarted ? constrain(map(boostedBass, 0, 100, 1.2, 8.0), 1.2, 8.0) : 1.0;
      let volumeMultiplier = audioStarted ? constrain(map(volumeSmooth, 0, 0.1, 1.1, 5.0), 1.1, 5.0) : 1.0;
      let midMultiplier = audioStarted ? constrain(map(boostedMid, 0, 100, 1.1, 4.0), 1.1, 4.0) : 1.0;
      let trebleMultiplier = audioStarted ? constrain(map(boostedTreble, 0, 100, 1.1, 3.0), 1.1, 3.0) : 1.0;
      
      // **EXAGGERATION CONTROL: Combined Multiplier**
      // Multipliers combine multiplicatively: 8.0 * 5.0 * 4.0 * 3.0 = 480x potential!
      // This creates exponential growth - small increases in audio = HUGE size changes
      let totalMultiplier = bassMultiplier * volumeMultiplier * midMultiplier * trebleMultiplier;
      
      // **EXAGGERATION CONTROL: Maximum Size Cap**
      // `min(totalMultiplier, 15.0)` - Limits maximum growth
      // - Higher cap (25.0, 50.0) = Circles can get MUCH bigger = MORE dramatic
      // - Lower cap (8.0, 10.0) = Circles stay smaller = LESS dramatic
      // - Current: 15x max = balanced
      totalMultiplier = min(totalMultiplier, 15.0);
      
      // Final size: base size multiplied by audio-reactive factor
      // Can inflate from 5px base to 300px (15x) with loud music
      let s = baseSize * totalMultiplier;
      
      // Ensure minimum size so circles are always visible
      s = max(s, 2);
      
      // ============================================
      // COLOR INTENSITY EXAGGERATION SYSTEM
      // ============================================
      // Controls how much colors intensify with audio input
      
      // **EXAGGERATION CONTROL: Volume Color Boost**
      // `(volumeSmooth * 80) + 10`
      // - `* 80` - Multiplier: Higher (150, 300) = Colors get MUCH brighter = MORE dramatic
      // - `+ 10` - Minimum boost: Higher (30, 50) = Colors always enhanced = MORE dramatic baseline
      // - Current: 80x multiplier + 10 minimum = balanced
      // - To exaggerate MORE: Change to `(volumeSmooth * 200) + 50` for extreme saturation
      // - To exaggerate LESS: Change to `(volumeSmooth * 40) + 0` for subtle enhancement
      let colorBoost = audioStarted ? (volumeSmooth * 80) + 10 : 0;
      
      // **EXAGGERATION CONTROL: Frequency-Specific Color Boosts**
      // `(bassSmooth * 2.5) + 8` - Red channel boost from bass
      // - `* 2.5` - Multiplier: Higher (5.0, 10.0) = MORE red on bass hits = MORE dramatic
      // - `+ 8` - Minimum boost: Higher (20, 30) = Always some red tint = MORE dramatic
      // - Current: 2.5x multiplier + 8 minimum = balanced
      // - To exaggerate MORE: Increase multiplier to 5.0-10.0, increase minimum to 20-30
      // - To exaggerate LESS: Decrease multiplier to 1.0-1.5, decrease minimum to 0-3
      let rBoost = audioStarted ? (bassSmooth * 2.5) + 8 : 0;  // Red from bass
      let gBoost = audioStarted ? (midSmooth * 2.0) + 6 : 0;   // Green from mid
      let bBoost = audioStarted ? (trebleSmooth * 2.2) + 5 : 0; // Blue from treble
      
      // Apply DRAMATIC audio-enhanced colors
      // Colors can become extremely vibrant and saturated
      // `constrain(value, min, max)` - Clamps values to valid range
      let rFinal = constrain(r + colorBoost + rBoost, 0, 255);
      let gFinal = constrain(g + colorBoost + gBoost, 0, 255);
      let bFinal = constrain(b + colorBoost + bBoost, 0, 255);
      
      // `fill(r, g, b)` - Sets the fill color for shapes
      // Uses audio-enhanced RGB values from the video pixel
      // Colors become more vibrant and intense with audio input
      fill(rFinal, gFinal, bFinal);
      
      // ============================================
      // POSITION & PULSE EXAGGERATION SYSTEM
      // ============================================
      // Controls how much circles move and pulse with audio
      
      // **EXAGGERATION CONTROL: Pulse Movement**
      // `sin(frameCount * 0.15 + bassSmooth * 0.02) * (bassSmooth * 1.2 + 8)`
      // - `* 1.2` - Pulse strength multiplier: Higher (3.0, 5.0) = BIGGER movements = MORE dramatic
      // - `+ 8` - Minimum movement: Higher (20, 50) = Always moving = MORE dramatic
      // - `* 0.02` - Frequency modulation: Higher (0.05, 0.1) = Faster pulsing = MORE dramatic
      // - `0.15` - Base pulse speed: Higher (0.3, 0.5) = Faster oscillation = MORE dramatic
      // - Current: 1.2x multiplier + 8px minimum = balanced
      // - To exaggerate MORE: Change to `(bassSmooth * 5.0 + 50)` for extreme pulsing
      // - To exaggerate LESS: Change to `(bassSmooth * 0.5 + 2)` for subtle movement
      // **FIX FOR CAMERA SHAKE**: Only apply minimum movement when there's actual audio input
      // Check if audio values are above threshold to prevent sudden shift when audio starts
      // This prevents the "shake" that happens when START AUDIO is clicked but no sound is playing
      let hasAudioInput = audioStarted && (bassSmooth > 5 || midSmooth > 5 || volumeSmooth > 0.01);
      let minPulseX = hasAudioInput ? 8 : 0;  // Only add minimum if audio is actually detected
      let minPulseY = hasAudioInput ? 6 : 0;  // Only add minimum if audio is actually detected
      let pulseX = audioStarted ? sin(frameCount * 0.15 + bassSmooth * 0.02) * (bassSmooth * 1.2 + minPulseX) : 0;
      let pulseY = audioStarted ? cos(frameCount * 0.12 + midSmooth * 0.015) * (midSmooth * 1.0 + minPulseY) : 0;
      
      // **EXAGGERATION CONTROL: Volume-Based Spread**
      // `(volumeSmooth * 20) + 5` - How much circles spread apart with volume
      // - `* 20` - Spread multiplier: Higher (50, 100) = Circles spread FARTHER = MORE dramatic
      // - `+ 5` - Minimum spread: Higher (15, 30) = Always some spread = MORE dramatic
      // - Current: 20x multiplier + 5px minimum = balanced
      // - To exaggerate MORE: Change to `(volumeSmooth * 100) + 30` for extreme expansion
      // - To exaggerate LESS: Change to `(volumeSmooth * 10) + 0` for subtle spread
      // 
      // **FIX FOR CAMERA SHAKE**: Only apply minimum spread when there's actual audio input
      let minSpread = hasAudioInput ? 5 : 0;  // Only add minimum if audio is actually detected
      let volumeSpread = audioStarted ? (volumeSmooth * 20) + minSpread : 0;
      
      // Calculate final position with dramatic audio-reactive offsets
      let xPos = i * scl + pulseX + volumeSpread;
      let yPos = j * scl + pulseY + volumeSpread;
      
      // `ellipse(x, y, width, height)` - Draws a circle
      // `xPos, yPos` - Position with audio-reactive offset
      // `s, s` - Circle diameter (same for width and height = perfect circle)
      // Circle size and position vary based on pixel brightness and audio input
      ellipse(xPos, yPos, s, s);
    }
  }
}

