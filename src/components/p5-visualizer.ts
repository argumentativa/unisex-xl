/**
 * P5Visualizer - Advanced audio visualization using p5.js
 * Integrates with Tone.js Analyser for real-time audio reactive visuals
 */

import p5 from 'p5';
import type { Analyser } from 'tone';

export interface VisualizerConfig {
  width?: number;
  height?: number;
  backgroundColor?: string;
  strokeColor?: string;
  fillColor?: string;
  mode?: 'waveform' | 'frequency' | 'circular' | 'particles' | 'mesh';
}

export class P5Visualizer {
  private p5Instance: p5 | null = null;
  private analyzer: Analyser | null = null;
  private config: Required<VisualizerConfig>;
  private mode: 'waveform' | 'frequency' | 'circular' | 'particles' | 'mesh';
  private particles: Particle[] = [];
  private rotation: number = 0;

  constructor(container: HTMLElement, config: VisualizerConfig = {}) {
    this.config = {
      width: config.width || container.clientWidth || 800,
      height: config.height || container.clientHeight || 600,
      backgroundColor: config.backgroundColor || '#000000',
      strokeColor: config.strokeColor || '#00ff88',
      fillColor: config.fillColor || '#ff00ff',
      mode: config.mode || 'waveform',
    };

    this.mode = this.config.mode;

    // Initialize particles for particle mode
    for (let i = 0; i < 100; i++) {
      this.particles.push(new Particle());
    }

    // Create p5 instance in instance mode
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
  setMode(mode: 'waveform' | 'frequency' | 'circular' | 'particles' | 'mesh'): void {
    this.mode = mode;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<VisualizerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Main p5 sketch
   */
  private sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(this.config.width, this.config.height);
      p.colorMode(p.RGB);
      p.frameRate(60);
    };

    p.draw = () => {
      // Draw background with slight transparency for trail effect
      const bg = p.color(this.config.backgroundColor);
      bg.setAlpha(30);
      p.background(bg);

      if (!this.analyzer) {
        this.drawIdleState(p);
        return;
      }

      // Get audio data from Tone.js Analyser
      const waveform = this.analyzer.getValue() as Float32Array;

      // Draw based on current mode
      switch (this.mode) {
        case 'waveform':
          this.drawWaveform(p, waveform);
          break;
        case 'frequency':
          this.drawFrequency(p, waveform);
          break;
        case 'circular':
          this.drawCircular(p, waveform);
          break;
        case 'particles':
          this.drawParticles(p, waveform);
          break;
        case 'mesh':
          this.drawMesh(p, waveform);
          break;
      }

      this.rotation += 0.01;
    };

    // Handle window resize
    p.windowResized = () => {
      if (this.config.width && this.config.height) {
        p.resizeCanvas(this.config.width, this.config.height);
      }
    };
  };

  /**
   * Draw idle state when no audio is playing
   */
  private drawIdleState(p: p5): void {
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.noFill();
    p.stroke(this.config.strokeColor);
    p.strokeWeight(2);

    const time = p.millis() * 0.001;
    for (let i = 0; i < 5; i++) {
      const radius = 50 + i * 30 + Math.sin(time + i) * 10;
      p.circle(0, 0, radius * 2);
    }
    p.pop();
  }

  /**
   * Draw waveform visualization
   */
  private drawWaveform(p: p5, waveform: Float32Array): void {
    p.stroke(this.config.strokeColor);
    p.strokeWeight(2);
    p.noFill();

    p.beginShape();
    for (let i = 0; i < waveform.length; i++) {
      const x = p.map(i, 0, waveform.length - 1, 0, p.width);
      const y = p.map(waveform[i], -1, 1, p.height, 0);
      p.vertex(x, y);
    }
    p.endShape();
  }

  /**
   * Draw frequency bars visualization
   */
  private drawFrequency(p: p5, waveform: Float32Array): void {
    const barWidth = p.width / waveform.length;

    for (let i = 0; i < waveform.length; i++) {
      const amplitude = Math.abs(waveform[i]);
      const barHeight = p.map(amplitude, 0, 1, 0, p.height);

      // Color based on frequency
      const hue = p.map(i, 0, waveform.length, 0, 360);
      p.fill(hue, 100, 100);
      p.noStroke();

      const x = i * barWidth;
      const y = p.height - barHeight;

      p.rect(x, y, barWidth - 1, barHeight);
    }
  }

  /**
   * Draw circular radial visualization
   */
  private drawCircular(p: p5, waveform: Float32Array): void {
    p.push();
    p.translate(p.width / 2, p.height / 2);
    p.rotate(this.rotation);

    p.noFill();
    p.stroke(this.config.strokeColor);
    p.strokeWeight(2);

    p.beginShape();
    for (let i = 0; i < waveform.length; i++) {
      const angle = p.map(i, 0, waveform.length, 0, p.TWO_PI);
      const amplitude = Math.abs(waveform[i]);
      const radius = p.map(amplitude, 0, 1, 100, 300);

      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
    p.pop();
  }

  /**
   * Draw particle system visualization
   */
  private drawParticles(p: p5, waveform: Float32Array): void {
    this.particles.forEach((particle, i) => {
      // Update particle based on audio
      const freqIndex = Math.floor(p.map(i, 0, this.particles.length, 0, waveform.length));
      const amplitude = Math.abs(waveform[freqIndex]);

      particle.update(p, amplitude);
      particle.draw(p, this.config.fillColor);
    });
  }

  /**
   * Draw mesh/grid visualization
   */
  private drawMesh(p: p5, waveform: Float32Array): void {
    const cols = 40;
    const rows = 30;
    const gridW = p.width / cols;
    const gridH = p.height / rows;

    p.stroke(this.config.strokeColor);
    p.strokeWeight(1);
    p.noFill();

    for (let i = 0; i < rows; i++) {
      p.beginShape();
      for (let j = 0; j < cols; j++) {
        const index = Math.floor(p.map(j, 0, cols, 0, waveform.length - 1));
        const amplitude = Math.abs(waveform[index]);

        const x = j * gridW;
        const y = i * gridH;
        const z = p.map(amplitude, 0, 1, 0, 100) * Math.sin(i * 0.2 + this.rotation);

        p.vertex(x, y + z);
      }
      p.endShape();
    }
  }

  /**
   * Destroy the p5 instance and clean up
   */
  destroy(): void {
    this.p5Instance?.remove();
    this.p5Instance = null;
    this.analyzer = null;
    this.particles = [];
  }
}

/**
 * Particle class for particle visualization mode
 */
class Particle {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
  size: number = 0;
  alpha: number = 255;

  constructor() {
    this.reset();
  }

  reset(): void {
    // Random position
    this.x = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 800);
    this.y = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 600);

    // Random velocity
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;

    this.size = Math.random() * 5 + 2;
    this.alpha = 255;
  }

  update(p: p5, amplitude: number): void {
    // Move particle
    this.x += this.vx * (1 + amplitude * 5);
    this.y += this.vy * (1 + amplitude * 5);

    // Add some randomness based on audio
    this.vx += (Math.random() - 0.5) * 0.1 * amplitude;
    this.vy += (Math.random() - 0.5) * 0.1 * amplitude;

    // Damping
    this.vx *= 0.99;
    this.vy *= 0.99;

    // Scale size with audio
    this.size = 2 + amplitude * 10;

    // Wrap around screen
    if (this.x < 0) this.x = p.width;
    if (this.x > p.width) this.x = 0;
    if (this.y < 0) this.y = p.height;
    if (this.y > p.height) this.y = 0;
  }

  draw(p: p5, fillColor: string): void {
    p.push();
    p.noStroke();

    // Parse color and add alpha
    const col = p.color(fillColor);
    col.setAlpha(this.alpha);
    p.fill(col);

    p.circle(this.x, this.y, this.size);
    p.pop();
  }
}
