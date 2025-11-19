/**
 * Code Executor - Safely executes user's Tone.js code
 */

import * as Tone from 'tone';
import type { AudioEngine } from './audioEngine';
import type { ConsoleMessage } from '../types';

export class CodeExecutor {
  private audioEngine: AudioEngine;
  private consoleMessages: ConsoleMessage[] = [];
  private onConsoleUpdate?: (messages: ConsoleMessage[]) => void;

  constructor(audioEngine: AudioEngine) {
    this.audioEngine = audioEngine;
  }

  /**
   * Set callback for console updates
   */
  setConsoleCallback(callback: (messages: ConsoleMessage[]) => void): void {
    this.onConsoleUpdate = callback;
  }

  /**
   * Log a message to console
   */
  private log(type: ConsoleMessage['type'], message: string): void {
    const consoleMessage: ConsoleMessage = {
      type,
      message,
      timestamp: new Date()
    };
    this.consoleMessages.push(consoleMessage);
    if (this.onConsoleUpdate) {
      this.onConsoleUpdate(this.consoleMessages);
    }
  }

  /**
   * Clear console
   */
  clearConsole(): void {
    this.consoleMessages = [];
    if (this.onConsoleUpdate) {
      this.onConsoleUpdate(this.consoleMessages);
    }
  }

  /**
   * Execute Tone.js code
   */
  async execute(code: string): Promise<void> {
    try {
      // Clear previous scheduled events
      this.audioEngine.stop();

      this.log('info', 'Executing Tone.js code...');

      // Create a safe execution context with Tone.js and audio engine access
      const context = {
        Tone,
        Transport: this.audioEngine.getTransport(),
        synth: this.audioEngine.getInstrument('synth')?.instance,
        bass: this.audioEngine.getInstrument('bass')?.instance,
        drums: this.audioEngine.getInstrument('drums')?.instance,
        console: {
          log: (...args: any[]) => this.log('info', args.join(' ')),
          error: (...args: any[]) => this.log('error', args.join(' ')),
          warn: (...args: any[]) => this.log('warning', args.join(' '))
        }
      };

      // Create function from code
      const func = new Function(...Object.keys(context), code);

      // Execute code with context
      func(...Object.values(context));

      this.log('success', 'Tone.js code executed successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Error: ${errorMessage}`);
      console.error('Tone.js execution error:', error);
    }
  }

  /**
   * Get console messages
   */
  getConsoleMessages(): ConsoleMessage[] {
    return this.consoleMessages;
  }
}
