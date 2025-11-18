/**
 * Strudel Engine - Manages Strudel pattern evaluation and audio playback
 */

import { repl, controls } from '@strudel/core';
import { getAudioContext, webaudioOutput, initAudioOnFirstClick } from '@strudel/webaudio';

export class StrudelEngine {
  private evaluator: any;
  private isInitialized: boolean = false;
  private currentPattern: any = null;
  private scheduler: any = null;

  constructor() {
    this.initializeStrudel();
  }

  /**
   * Initialize Strudel REPL and audio context
   */
  private async initializeStrudel(): Promise<void> {
    try {
      // Initialize audio on first user interaction
      await initAudioOnFirstClick();

      // Create evaluator with core controls
      this.evaluator = repl({
        defaultOutput: webaudioOutput,
        getTime: () => getAudioContext().currentTime,
      });

      this.isInitialized = true;
      console.log('Strudel engine initialized');
    } catch (error) {
      console.error('Failed to initialize Strudel:', error);
    }
  }

  /**
   * Start audio context (required by browser security)
   */
  async start(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeStrudel();
    }

    const audioContext = getAudioContext();
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }
  }

  /**
   * Evaluate and play Strudel code
   */
  async evaluate(code: string): Promise<{ error?: string; success: boolean }> {
    try {
      await this.start();

      // Stop current pattern if running
      if (this.scheduler) {
        this.scheduler.stop();
        this.scheduler = null;
      }

      // Evaluate the code
      const result = this.evaluator.evaluate(code);

      if (result.error) {
        return { error: result.error.message || String(result.error), success: false };
      }

      // Start the pattern
      if (result.pattern) {
        this.currentPattern = result.pattern;
        this.scheduler = this.currentPattern.scheduler || result.scheduler;
      }

      return { success: true };
    } catch (error: any) {
      return { error: error.message || String(error), success: false };
    }
  }

  /**
   * Stop all playing patterns
   */
  stop(): void {
    if (this.scheduler) {
      this.scheduler.stop();
      this.scheduler = null;
    }
    this.currentPattern = null;
  }

  /**
   * Pause playback
   */
  pause(): void {
    if (this.scheduler) {
      this.scheduler.pause();
    }
  }

  /**
   * Resume playback
   */
  play(): void {
    if (this.scheduler) {
      this.scheduler.start();
    }
  }

  /**
   * Set cycles per second (tempo)
   */
  setCPS(cps: number): void {
    controls.cps = cps;
  }

  /**
   * Get current CPS
   */
  getCPS(): number {
    return controls.cps || 0.5;
  }

  /**
   * Convert BPM to CPS
   */
  bpmToCPS(bpm: number): number {
    return bpm / 60 / 4; // Assuming 4 beats per cycle
  }

  /**
   * Convert CPS to BPM
   */
  cpsToBPM(cps: number): number {
    return cps * 60 * 4;
  }

  /**
   * Set BPM (convenience method)
   */
  setBPM(bpm: number): void {
    this.setCPS(this.bpmToCPS(bpm));
  }

  /**
   * Get current BPM
   */
  getBPM(): number {
    return this.cpsToBPM(this.getCPS());
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get audio context
   */
  getAudioContext(): AudioContext {
    return getAudioContext();
  }
}
