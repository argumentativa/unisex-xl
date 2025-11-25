/**
 * Code Executor - Simple JavaScript code execution with audio engine access
 */

import * as Tone from 'tone';
import type { AudioEngine } from './audio';

export class CodeExecutor {
  private audioEngine: AudioEngine;

  constructor(audioEngine: AudioEngine) {
    this.audioEngine = audioEngine;
  }

  /**
   * Execute user code with audio engine exposed globally
   */
  async execute(code: string): Promise<void> {
    try {
      // Stop any existing scheduled events
      this.audioEngine.stop();

      // Get analyzer for routing audio through visualization
      const analyzer = this.audioEngine.getAnalyzer();

      // Create execution context with Tone.js and audio engine access
      const context = {
        Tone,
        Transport: this.audioEngine.getTransport(),
        synth: this.audioEngine.getInstrument('synth')?.instance,
        bass: this.audioEngine.getInstrument('bass')?.instance,
        drums: this.audioEngine.getInstrument('drums')?.instance,
        analyzer, // Expose analyzer so user code can connect to it
        console: {
          log: (...args: any[]) => console.log(...args),
          error: (...args: any[]) => console.error(...args),
          warn: (...args: any[]) => console.warn(...args)
        }
      };

      // Create function from code and execute
      const func = new Function(...Object.keys(context), code);
      func(...Object.values(context));
    } catch (error) {
      console.error('Code execution error:', error);
      throw error;
    }
  }
}



