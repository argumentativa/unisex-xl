/**
 * Visualizer Component - Audio waveform visualization
 */

import type * as Tone from 'tone';

export class Visualizer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private analyzer: Tone.Analyser | null = null;
  private animationId: number | null = null;

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
   * Start visualization loop
   */
  private startVisualization(): void {
    const draw = () => {
      if (!this.analyzer) return;

      const values = this.analyzer.getValue() as Float32Array;
      const width = this.canvas.width;
      const height = this.canvas.height;

      // Clear canvas
      this.ctx.fillStyle = 'rgba(30, 30, 30, 0.3)';
      this.ctx.fillRect(0, 0, width, height);

      // Draw waveform
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

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
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
}
