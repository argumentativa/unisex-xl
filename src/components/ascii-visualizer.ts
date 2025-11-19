/**
 * AsciiVisualizer - Audio-reactive ASCII art visualization
 * Combines p5.js ASCII art techniques with Tone.js audio analysis
 */

import p5 from 'p5';
import type { Analyser } from 'tone';

export interface AsciiVisualizerConfig {
  width?: number;
  height?: number;
  mode?: 'grid' | 'waveform' | 'circular' | 'reactive';
  colorMode?: 'mono' | 'color' | 'hue' | 'energy';
  asciiDensity?: 'low' | 'medium' | 'high';
}

export class AsciiVisualizer {
  private p5Instance: p5 | null = null;
  private analyzer: Analyser | null = null;
  private config: Required<AsciiVisualizerConfig>;
  
  // ASCII character sets (ordered from dense to sparse)
  private charSets = {
    low: "@#*+=-:. ",
    medium: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzc+-:. ",
    high: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,^`'. "
  };
  
  private asciiChar: string;
  private cols: number = 60;
  private rows: number = 30;

  constructor(container: HTMLElement, config: AsciiVisualizerConfig = {}) {
    this.config = {
      width: config.width || container.clientWidth || 800,
      height: config.height || container.clientHeight || 400,
      mode: config.mode || 'reactive',
      colorMode: config.colorMode || 'color',
      asciiDensity: config.asciiDensity || 'medium',
    };

    this.asciiChar = this.charSets[this.config.asciiDensity];
    
    // Create p5 instance
    this.p5Instance = new p5(this.sketch.bind(this), container);
  }

  /**
   * Set the Tone.js Analyser for audio data
   */
  setAnalyzer(analyzer: Analyser): void {
    this.analyzer = analyzer;
  }

  /**
   * Change visualization mode
   */
  setMode(mode: 'grid' | 'waveform' | 'circular' | 'reactive'): void {
    this.config.mode = mode;
  }

  /**
   * Change color mode
   */
  setColorMode(mode: 'mono' | 'color' | 'hue' | 'energy'): void {
    this.config.colorMode = mode;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AsciiVisualizerConfig>): void {
    this.config = { ...this.config, ...config };
    if (config.asciiDensity) {
      this.asciiChar = this.charSets[config.asciiDensity];
    }
  }

  /**
   * Main p5 sketch
   */
  private sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(this.config.width, this.config.height);
      p.textStyle(p.BOLD);
      p.textAlign(p.CENTER, p.CENTER);
      p.frameRate(30); // Lower framerate for ASCII (performance)
    };

    p.draw = () => {
      p.background(0);

      if (!this.analyzer) {
        this.drawIdleState(p);
        return;
      }

      // Get audio data
      const waveform = this.analyzer.getValue() as Float32Array;
      
      // Calculate grid dimensions
      const cellW = p.width / this.cols;
      const cellH = p.height / this.rows;

      // Draw based on mode
      switch (this.config.mode) {
        case 'grid':
          this.drawGrid(p, waveform, cellW, cellH);
          break;
        case 'waveform':
          this.drawWaveformAscii(p, waveform, cellW, cellH);
          break;
        case 'circular':
          this.drawCircularAscii(p, waveform);
          break;
        case 'reactive':
          this.drawReactiveGrid(p, waveform, cellW, cellH);
          break;
      }
    };

    // Handle window resize
    p.windowResized = () => {
      p.resizeCanvas(this.config.width, this.config.height);
    };
  };

  /**
   * Draw idle state animation
   */
  private drawIdleState(p: p5): void {
    const time = p.millis() * 0.001;
    const cellW = p.width / this.cols;
    const cellH = p.height / this.rows;

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        const wave = Math.sin(i * 0.1 + time) * Math.cos(j * 0.1 + time);
        const charIndex = Math.min(
          Math.floor(p.map(wave, -1, 1, 0, this.asciiChar.length - 1)),
          this.asciiChar.length - 1
        );
        const char = this.asciiChar.charAt(charIndex) || '.';
        
        p.fill(0, 255, 255);
        p.textSize(cellH * 0.8);
        p.text(char, i * cellW + cellW/2, j * cellH + cellH/2);
      }
    }
  }

  /**
   * Draw static grid that responds to audio
   */
  private drawGrid(p: p5, waveform: Float32Array, cellW: number, cellH: number): void {
    // Calculate overall audio energy
    const energy = waveform.reduce((sum, val) => sum + Math.abs(val), 0) / waveform.length;

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        // Map position to waveform (ensure valid index)
        const waveIndex = Math.min(
          Math.floor((i / this.cols) * (waveform.length - 1)),
          waveform.length - 1
        );
        const amp = Math.abs(waveform[waveIndex] || 0);
        
        // Pick character based on amplitude (ensure valid index)
        const charIndex = Math.min(
          Math.floor(p.map(amp, 0, 1, 0, this.asciiChar.length - 1)),
          this.asciiChar.length - 1
        );
        const char = this.asciiChar.charAt(charIndex) || '.';
        
        // Size reacts to energy
        const reactiveSize = cellH * (0.6 + energy * 3);
        
        // Apply color mode
        this.applyColor(p, i, j, this.cols, this.rows, energy, amp);
        
        p.textSize(reactiveSize);
        p.text(char, i * cellW + cellW/2, j * cellH + cellH/2);
      }
    }
  }

  /**
   * Draw waveform using ASCII characters
   */
  private drawWaveformAscii(p: p5, waveform: Float32Array, cellW: number, cellH: number): void {
    for (let i = 0; i < this.cols; i++) {
      // Get waveform value for this column (ensure valid index)
      const waveIndex = Math.min(
        Math.floor(p.map(i, 0, this.cols, 0, waveform.length - 1)),
        waveform.length - 1
      );
      const value = waveform[waveIndex] || 0;
      
      // Map to row position
      const row = Math.floor(p.map(value, -1, 1, 0, this.rows - 1));
      
      // Get amplitude for character selection (ensure valid index)
      const amp = Math.abs(value);
      const charIndex = Math.min(
        Math.floor(amp * (this.asciiChar.length - 1)),
        this.asciiChar.length - 1
      );
      const char = this.asciiChar.charAt(charIndex) || '.';
      
      // Apply color
      this.applyColor(p, i, row, this.cols, this.rows, amp, amp);
      
      p.textSize(cellH * 0.8);
      p.text(char, i * cellW + cellW/2, row * cellH + cellH/2);
    }
  }

  /**
   * Draw circular radial ASCII pattern
   */
  private drawCircularAscii(p: p5, waveform: Float32Array): void {
    p.push();
    p.translate(p.width / 2, p.height / 2);
    
    const numRings = 15;
    const charsPerRing = 40;
    
    for (let ring = 0; ring < numRings; ring++) {
      const radius = (ring + 1) * (Math.min(p.width, p.height) / (numRings * 2.5));
      
      for (let i = 0; i < charsPerRing; i++) {
        const angle = (i / charsPerRing) * p.TWO_PI;
        
        // Get waveform value (ensure valid index)
        const waveIndex = Math.floor((i / charsPerRing) * (waveform.length - 1));
        const amp = Math.abs(waveform[waveIndex] || 0);
        
        // Modulate radius with audio
        const reactiveRadius = radius * (1 + amp * 0.5);
        
        const x = reactiveRadius * Math.cos(angle);
        const y = reactiveRadius * Math.sin(angle);
        
        // Pick character (ensure valid index and fallback)
        const charIndex = Math.min(
          Math.floor(amp * (this.asciiChar.length - 1)),
          this.asciiChar.length - 1
        );
        const char = this.asciiChar.charAt(charIndex) || '.';
        
        // Apply color
        const hue = p.map(ring, 0, numRings, 0, 360);
        p.colorMode(p.HSB);
        p.fill(hue, 100, 100);
        
        p.textSize(12 + amp * 8);
        p.text(char, x, y);
      }
    }
    
    p.pop();
  }

  /**
   * Draw fully reactive grid (size, color, character all react)
   */
  private drawReactiveGrid(p: p5, waveform: Float32Array, cellW: number, cellH: number): void {
    const energy = waveform.reduce((sum, val) => sum + Math.abs(val), 0) / waveform.length;
    const time = p.millis() * 0.001;

    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        // Get audio data for this position (ensure valid index)
        const waveIndex = Math.min(
          Math.floor((i / this.cols) * (waveform.length - 1)),
          waveform.length - 1
        );
        const amp = Math.abs(waveform[waveIndex] || 0);
        
        // Add wave effect
        const wave = Math.sin(i * 0.1 + time * 2) * Math.cos(j * 0.1 + time * 2);
        const combinedAmp = (amp + Math.abs(wave) * 0.3) / 1.3;
        
        // Character selection based on combined amplitude (ensure valid index)
        const charIndex = Math.min(
          Math.floor(combinedAmp * (this.asciiChar.length - 1)),
          this.asciiChar.length - 1
        );
        const char = this.asciiChar.charAt(charIndex) || '.';
        
        // Size pulsates with energy
        const pulse = Math.sin(time * 3) * 0.1;
        const reactiveSize = cellH * (0.5 + energy * 2 + pulse);
        
        // Apply color mode
        this.applyColor(p, i, j, this.cols, this.rows, energy, amp);
        
        p.textSize(reactiveSize);
        p.text(char, i * cellW + cellW/2, j * cellH + cellH/2);
      }
    }
  }

  /**
   * Apply color based on color mode
   */
  private applyColor(
    p: p5,
    i: number,
    _j: number,
    cols: number,
    _rows: number,
    energy: number,
    _amplitude: number
  ): void {
    switch (this.config.colorMode) {
      case 'mono':
        p.fill(255);
        break;
        
      case 'color':
        const hue = p.map(i, 0, cols, 0, 360);
        p.colorMode(p.HSB);
        p.fill(hue, 100, 100);
        break;
        
      case 'hue':
        const timeHue = (p.millis() * 0.05) % 360;
        p.colorMode(p.HSB);
        p.fill(timeHue, 80, 100);
        break;
        
      case 'energy':
        const energyHue = p.map(energy, 0, 1, 180, 0); // Blue to red
        p.colorMode(p.HSB);
        p.fill(energyHue, 100, 100);
        break;
    }
  }

  /**
   * Destroy the visualizer
   */
  destroy(): void {
    this.p5Instance?.remove();
    this.p5Instance = null;
    this.analyzer = null;
  }
}

