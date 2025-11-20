/**
 * Visualizer Component - Unified audio visualization using Canvas2D
 * Supports waveform and frequency bar modes
 */

import type * as Tone from 'tone';

export type VisualizerMode = 'waveform' | 'frequency';

export class Visualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyzer: Tone.Analyser | null = null;
  private animationId: number | null = null;
  private mode: VisualizerMode = 'waveform';

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Could not get canvas context');
    }
    this.ctx = context;
  }

  /**
   * Set analyzer for visualization
   */
  setAnalyzer(analyzer: Tone.Analyser): void {
    this.analyzer = analyzer;
    this.startVisualization();
  }

  /**
   * Set visualization mode
   */
  setMode(mode: VisualizerMode): void {
    this.mode = mode;
  }

  /**
   * Start visualization loop
   */
  private startVisualization(): void {
    const draw = () => {
      if (!this.analyzer) return;

      const values = this.analyzer.getValue() as Float32Array;
      const width = this.canvas.width;
      const height = this.canvas.height;

      // Clear canvas with slight transparency for trail effect
      this.ctx.fillStyle = 'rgba(30, 30, 30, 0.3)';
      this.ctx.fillRect(0, 0, width, height);

      if (this.mode === 'waveform') {
        this.drawWaveform(values, width, height);
      } else {
        this.drawFrequency(values, width, height);
      }

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  /**
   * Draw waveform visualization
   */
  private drawWaveform(values: Float32Array, width: number, height: number): void {
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#00d4ff';
    this.ctx.beginPath();

    const sliceWidth = width / values.length;
    let x = 0;

    for (let i = 0; i < values.length; i++) {
      const v = (values[i] + 1) / 2; // Normalize to 0-1
      const y = v * height;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    this.ctx.stroke();
  }

  /**
   * Draw frequency bars visualization
   */
  private drawFrequency(values: Float32Array, width: number, height: number): void {
    const barCount = 64;
    const barWidth = width / barCount;
    const dataStep = Math.floor(values.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const dataIndex = i * dataStep;
      const amplitude = Math.abs(values[dataIndex] || 0);
      const barHeight = amplitude * height;

      const x = i * barWidth;
      const y = height - barHeight;

      // Color gradient based on frequency
      const hue = (i / barCount) * 360;
      this.ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
      this.ctx.fillRect(x, y, barWidth - 2, barHeight);
    }
  }

  /**
   * Stop visualization
   */
  stop(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Clear canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Resize canvas
   */
  resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}



