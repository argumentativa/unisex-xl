/**
 * Code Executor - Safely executes user's Tone.js or Strudel code
 */

import * as Tone from 'tone';
import type { AudioEngine } from './audioEngine';
import type { StrudelEngine } from './strudelEngine';
import type { ConsoleMessage, CodeMode } from '../types';

export class CodeExecutor {
  private audioEngine: AudioEngine;
  private strudelEngine?: StrudelEngine;
  private consoleMessages: ConsoleMessage[] = [];
  private onConsoleUpdate?: (messages: ConsoleMessage[]) => void;
  private mode: CodeMode = 'tonejs';

  constructor(audioEngine: AudioEngine, strudelEngine?: StrudelEngine) {
    this.audioEngine = audioEngine;
    this.strudelEngine = strudelEngine;
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
   * Set execution mode
   */
  setMode(mode: CodeMode): void {
    this.mode = mode;
    this.log('info', `Mode switched to: ${mode}`);
  }

  /**
   * Get current mode
   */
  getMode(): CodeMode {
    return this.mode;
  }

  /**
   * Execute user code based on current mode
   */
  async execute(code: string): Promise<void> {
    if (this.mode === 'strudel') {
      await this.executeStrudel(code);
    } else {
      await this.executeToneJS(code);
    }
  }

  /**
   * Execute Tone.js code
   */
  private async executeToneJS(code: string): Promise<void> {
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
   * Execute Strudel code
   */
  private async executeStrudel(code: string): Promise<void> {
    try {
      if (!this.strudelEngine) {
        this.log('error', 'Strudel engine not initialized');
        return;
      }

      // Stop Tone.js transport when using Strudel
      this.audioEngine.stop();

      this.log('info', 'Executing Strudel code...');

      // Evaluate Strudel pattern
      const result = await this.strudelEngine.evaluate(code);

      if (result.error) {
        this.log('error', `Strudel error: ${result.error}`);
      } else {
        this.log('success', 'Strudel pattern loaded successfully!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log('error', `Error: ${errorMessage}`);
      console.error('Strudel execution error:', error);
    }
  }

  /**
   * Get console messages
   */
  getConsoleMessages(): ConsoleMessage[] {
    return this.consoleMessages;
  }
}
