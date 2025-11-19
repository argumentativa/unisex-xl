/**
 * Live Coding Visualizer - Aggressive ASCII visualization with direct Tone.js connection
 * Adapted from image-ascii-color-bold-OPTIMIZED-autostart.js
 * NO microphone needed - connects directly to Tone.js Destination
 */

// ============================================
// VISUALIZER CLASS
// ============================================

class LiveCodingVisualizer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.p5Instance = null;
    this.toneAnalyzer = null;
    this.toneFFT = null;
    this.toneMeter = null;
    this.audioStarted = false;
    
    // Visual settings
    this.preset = 'aggressive'; // aggressive, extreme, subtle
    this.presets = {
      aggressive: { bassPulseRange: [1.0, 3.0], sizeMultiplier: 1.0 },
      extreme: { bassPulseRange: [0.2, 6.0], sizeMultiplier: 1.5 },
      subtle: { bassPulseRange: [0.8, 1.5], sizeMultiplier: 0.8 }
    };
    
    // Image and resolution
    this.img = null;
    this.w = 24;
    this.h = 16;
    this.size = 0;
    this.halfSize = 0;
    this.baseCharSize = 0;
    
    // ASCII settings
    this.asciiChars = "█▓▒░@%#*+=:. ";
    this.targetFPS = 60;
    this.showDebug = true;
    
    // Audio values
    this.bass = 0;
    this.mid = 0;
    this.treble = 0;
    this.volume = 0;
    this.bassSmooth = 0;
    this.volumeSmooth = 0;
    
    // Initialize p5
    this.initP5();
  }
  
  // ============================================
  // TONE.JS AUDIO CONNECTION
  // ============================================
  
  startAudio() {
    if (this.audioStarted) return;
    
    console.log('🎵 Connecting visualizer to Tone.js...');
    
    // Create Tone.js analyzers (NOT p5.sound!)
    this.toneFFT = new Tone.FFT(256);
    this.toneMeter = new Tone.Meter();
    
    // Connect to Tone.js Destination (master output)
    Tone.Destination.connect(this.toneFFT);
    Tone.Destination.connect(this.toneMeter);
    
    this.audioStarted = true;
    console.log('✅ Visualizer connected to Tone.js audio stream');
  }
  
  stopAudio() {
    if (!this.audioStarted) return;
    
    if (this.toneFFT) {
      Tone.Destination.disconnect(this.toneFFT);
      this.toneFFT.dispose();
      this.toneFFT = null;
    }
    
    if (this.toneMeter) {
      Tone.Destination.disconnect(this.toneMeter);
      this.toneMeter.dispose();
      this.toneMeter = null;
    }
    
    this.audioStarted = false;
    this.bass = 0;
    this.mid = 0;
    this.treble = 0;
    this.volume = 0;
    this.bassSmooth = 0;
    this.volumeSmooth = 0;
    
    console.log('🔇 Visualizer disconnected from audio');
  }
  
  // ============================================
  // AUDIO ANALYSIS (from Tone.js)
  // ============================================
  
  analyzeAudio() {
    if (!this.audioStarted || !this.toneFFT || !this.toneMeter) return;
    
    // Get FFT spectrum from Tone.js
    const spectrum = this.toneFFT.getValue();
    
    // Calculate frequency band energies
    // Bass: 20-250 Hz, Mid: 250-4000 Hz, Treble: 4000-20000 Hz
    this.bass = this.getFrequencyEnergy(spectrum, 20, 250) * 4.0;
    this.mid = this.getFrequencyEnergy(spectrum, 250, 4000) * 4.0;
    this.treble = this.getFrequencyEnergy(spectrum, 4000, 20000) * 4.0;
    
    // Get overall volume
    const meterValue = this.toneMeter.getValue();
    this.volume = this.p5Instance.map(
      this.p5Instance.constrain(meterValue, -60, 0),
      -60, 0, 0, 1
    );
    
    // Smooth values
    this.bassSmooth = this.p5Instance.lerp(this.bassSmooth, this.bass, 0.7);
    this.volumeSmooth = this.p5Instance.lerp(this.volumeSmooth, this.volume, 0.6);
  }
  
  getFrequencyEnergy(spectrum, minFreq, maxFreq) {
    const nyquist = Tone.context.sampleRate / 2;
    const binCount = spectrum.length;
    const lowBin = Math.floor((minFreq / nyquist) * binCount);
    const highBin = Math.floor((maxFreq / nyquist) * binCount);
    
    let sum = 0;
    let count = 0;
    
    for (let i = lowBin; i <= highBin && i < binCount; i++) {
      // Convert from dB to linear
      const linear = Math.pow(10, spectrum[i] / 20);
      sum += linear;
      count++;
    }
    
    const average = count > 0 ? sum / count : 0;
    return this.p5Instance.constrain(average * 800, 0, 255);
  }
  
  // ============================================
  // VISUAL PRESET MANAGEMENT
  // ============================================
  
  setPreset(preset) {
    if (this.presets[preset]) {
      this.preset = preset;
      console.log(`🎨 Visual preset: ${preset}`);
    }
  }
  
  // ============================================
  // P5.JS SKETCH
  // ============================================
  
  initP5() {
    const sketch = (p) => {
      p.preload = () => {
        this.img = p.loadImage('p5js/assets/dandy.jpg');
      };
      
      p.setup = () => {
        // Resize image
        this.img.resize(this.w, 0);
        this.h = this.img.height;
        
        // Create canvas
        const canvasWidth = this.container.clientWidth;
        const canvasHeight = (canvasWidth * this.h) / this.w;
        p.createCanvas(canvasWidth, canvasHeight);
        
        // Performance optimizations
        p.noSmooth();
        p.frameRate(this.targetFPS);
        
        // Calculate sizes
        this.size = p.width / this.img.width;
        this.halfSize = this.size / 2;
        this.baseCharSize = this.size * 1.1;
        
        console.log('🎨 Visualizer initialized');
        console.log(`📐 Resolution: ${this.w}x${this.h} | FPS: ${this.targetFPS}`);
      };
      
      p.draw = () => {
        p.background(0);
        
        // Analyze audio
        this.analyzeAudio();
        
        // Debug logging
        if (this.showDebug && p.frameCount % 30 === 0) {
          console.log(`🎵 Bass=${Math.floor(this.bassSmooth)} Mid=${Math.floor(this.mid)} Treble=${Math.floor(this.treble)} Vol=${this.volume.toFixed(3)}`);
        }
        
        // Flash background on heavy bass
        if (this.audioStarted && this.bassSmooth > 200) {
          p.background(20, 0, 0);
        }
        
        // Pre-calculate effects (once per frame!)
        const currentPreset = this.presets[this.preset];
        const effects = {
          volumeBoost: this.audioStarted ? p.map(this.volumeSmooth, 0, 0.3, 0, 150) : 0,
          trebleBoost: this.audioStarted ? p.map(this.treble, 0, 255, 0, 100) : 0,
          bassPulse: this.audioStarted ? 
            p.map(this.bassSmooth, 0, 255, currentPreset.bassPulseRange[0], currentPreset.bassPulseRange[1]) : 
            1.0,
          midEffect: this.audioStarted ? p.map(this.mid, 0, 255, 1.0, 2.0) : 1.0,
          bassBoost: this.audioStarted ? p.map(this.bassSmooth, 0, 255, 0, 200) : 0,
          midBoost: this.audioStarted ? p.map(this.mid, 0, 255, 0, 180) : 0,
          trebleColorBoost: this.audioStarted ? p.map(this.treble, 0, 255, 0, 190) : 0,
          colorShift: this.audioStarted ? p.sin(p.frameCount * 0.05 + this.bassSmooth * 0.01) * 50 : 0,
          brightnessFlash: (this.audioStarted && this.bassSmooth > 150) ? 1.3 : 1.0
        };
        
        // Render ASCII
        this.renderASCII(p, effects);
        
        // Debug panel
        if (this.audioStarted && this.showDebug) {
          this.drawDebugPanel(p);
        }
      };
      
      p.windowResized = () => {
        const canvasWidth = this.container.clientWidth;
        const canvasHeight = (canvasWidth * this.h) / this.w;
        p.resizeCanvas(canvasWidth, canvasHeight);
        this.size = p.width / this.img.width;
        this.halfSize = this.size / 2;
        this.baseCharSize = this.size * 1.1;
      };
    };
    
    this.p5Instance = new p5(sketch, this.container);
  }
  
  // ============================================
  // ASCII RENDERING
  // ============================================
  
  renderASCII(p, effects) {
    this.img.loadPixels();
    
    p.textSize(this.size);
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    
    for (let i = 0; i < this.img.width; i++) {
      for (let j = 0; j < this.img.height; j++) {
        // Get pixel
        const pixelVal = this.img.get(i, j);
        let bright = p.brightness(pixelVal);
        
        // Brightness modifier
        if (this.audioStarted) {
          bright = bright + effects.volumeBoost;
          bright = p.map(bright, 0, 255, effects.trebleBoost, 255 - effects.trebleBoost);
          bright = bright * effects.brightnessFlash;
          bright = p.constrain(bright, 0, 255);
        }
        
        // Get ASCII character
        const charIndex = Math.floor(p.map(bright, 0, 255, this.asciiChars.length - 1, 0));
        const char = this.asciiChars.charAt(charIndex) || ' ';
        
        // Color modifier
        let r = p.red(pixelVal);
        let g = p.green(pixelVal);
        let b = p.blue(pixelVal);
        
        if (this.audioStarted) {
          r = r * 1.5 + effects.bassBoost;
          g = g * 1.5 + effects.midBoost;
          b = b * 1.5 + effects.trebleColorBoost;
          
          if (this.mid > 100) {
            r *= 0.7;
            b *= 0.7;
          }
          
          if (this.treble > 150) {
            r += (this.treble - 150);
            g += (this.treble - 150);
            b += (this.treble - 150);
          }
          
          r = r + effects.colorShift;
          g = g - effects.colorShift * 0.5;
          b = b + effects.colorShift * 0.8;
          
          r = p.constrain(r, 0, 255);
          g = p.constrain(g, 0, 255);
          b = p.constrain(b, 0, 255);
        }
        
        p.fill(r, g, b);
        
        // Size modifier (AGGRESSIVE!)
        let charSize = this.baseCharSize * effects.bassPulse;
        
        if (this.audioStarted) {
          // Wave effect
          let wave = p.sin((i + j) * 0.1 + p.frameCount * 0.1) * 0.5 + 0.5;
          charSize *= (1 + (wave * (effects.midEffect - 1)));
          
          // Ripple from center
          let distFromCenter = p.dist(i, j, this.img.width / 2, this.img.height / 2);
          let ripple = p.sin(distFromCenter * 0.3 - p.frameCount * 0.15 - this.bassSmooth * 0.05) * 0.5 + 0.5;
          charSize *= (1 + ripple * 0.5);
          
          // Position variation
          let variation = p.sin(i * 0.5 + p.frameCount * 0.08) * p.cos(j * 0.5 + p.frameCount * 0.06);
          variation *= p.map(this.treble, 0, 255, 0, 0.6);
          charSize *= (1 + variation);
          
          // Volume jitter
          if (this.volume > 0.2) {
            let jitter = p.sin(i * j * 0.1 + p.frameCount * 0.2) * p.map(this.volume, 0.2, 1.0, 0, 0.4);
            charSize *= (1 + jitter);
          }
        }
        
        p.textSize(charSize);
        
        // Draw character
        const x = i * this.size + this.halfSize;
        const y = j * this.size + this.halfSize;
        p.text(char, x, y);
      }
    }
  }
  
  // ============================================
  // DEBUG PANEL
  // ============================================
  
  drawDebugPanel(p) {
    p.push();
    p.fill(0, 0, 0, 180);
    p.noStroke();
    p.rect(10, p.height - 150, 250, 140, 10);
    
    p.fill(255);
    p.textSize(14);
    p.textAlign(p.LEFT, p.TOP);
    p.textStyle(p.BOLD);
    p.text('AUDIO LEVELS', 20, p.height - 140);
    
    p.textStyle(p.NORMAL);
    p.textSize(12);
    
    // Bass bar
    p.fill(255, 50, 50);
    p.rect(20, p.height - 115, p.map(this.bassSmooth, 0, 255, 0, 200), 20, 3);
    p.fill(255);
    p.text(`BASS: ${Math.floor(this.bassSmooth)}`, 20, p.height - 93);
    
    // Mid bar
    p.fill(50, 255, 50);
    p.rect(20, p.height - 75, p.map(this.mid, 0, 255, 0, 200), 20, 3);
    p.fill(255);
    p.text(`MID: ${Math.floor(this.mid)}`, 20, p.height - 53);
    
    // Treble bar
    p.fill(50, 50, 255);
    p.rect(20, p.height - 35, p.map(this.treble, 0, 255, 0, 200), 20, 3);
    p.fill(255);
    p.text(`TREBLE: ${Math.floor(this.treble)}`, 20, p.height - 13);
    
    p.pop();
  }
  
  // ============================================
  // PUBLIC METHODS
  // ============================================
  
  toggleDebug() {
    this.showDebug = !this.showDebug;
  }
  
  destroy() {
    this.stopAudio();
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }
  }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LiveCodingVisualizer;
}

