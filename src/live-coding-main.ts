/**
 * UNISEX XL - Live Coding + Visualizer Entry Point
 * Proper Strudel initialization following https://strudel.cc/technical-manual/project-start/
 */

import { webaudioRepl, registerSynthSounds, registerZZFXSounds } from '@strudel/webaudio';
import { evalScope } from '@strudel/core';
import * as strudel from '@strudel/core';
import * as mini from '@strudel/mini';
import * as soundfonts from '@strudel/soundfonts';
import * as tonal from '@strudel/tonal';
import { transpiler } from '@strudel/transpiler';

console.log('[Live Coding] Initializing Strudel...');

// Initialize Strudel scope with all necessary modules
// This makes Strudel functions available globally
await Promise.all([
  evalScope(strudel, mini, soundfonts, tonal),
  registerSynthSounds(), // Register built-in synthesis sounds
  registerZZFXSounds(), // Register chiptune-style sounds
  soundfonts.registerSoundfonts(), // Register MIDI soundfonts
]);

console.log('[Live Coding] Strudel modules loaded');

// Initialize the REPL
// This provides evaluate() function and audio output
const { evaluate, scheduler } = webaudioRepl({
  transpiler, // Add transpiler for code transformation
  onToggle: (playing: boolean) => {
    console.log(playing ? '[Live Coding] ▶️ Pattern started' : '[Live Coding] ⏹️ Pattern stopped');
    // Dispatch custom event for app to handle
    window.dispatchEvent(new CustomEvent('strudel-toggle', { detail: { playing } }));
  },
  onError: (error: Error) => {
    console.error('[Live Coding] Strudel error:', error);
    // Dispatch custom event for app to handle
    window.dispatchEvent(new CustomEvent('strudel-error', { detail: error }));
  }
});

console.log('[Live Coding] Strudel REPL initialized');

// Expose Strudel API globally for the app
declare global {
  interface Window {
    strudel: {
      evaluate: (code: string) => Promise<any>;
      stop: () => void;
      silence: () => void; // Alias for stop
      scheduler: typeof scheduler;
    };
  }
}

window.strudel = {
  evaluate: async (code: string) => {
    try {
      // Evaluate the code using the REPL
      const result = await evaluate(code);
      return result;
    } catch (error: any) {
      console.error('[Live Coding] Evaluation error:', error);
      throw error;
    }
  },
  stop: () => {
    try {
      scheduler.stop();
    } catch (error: any) {
      console.error('[Live Coding] Stop error:', error);
    }
  },
  // Alias for compatibility with existing code
  silence: () => {
    try {
      scheduler.stop();
    } catch (error: any) {
      console.error('[Live Coding] Stop error:', error);
    }
  },
  scheduler
};

console.log('[Live Coding] ✅ Strudel API exposed on window.strudel');
console.log('[Live Coding] ✅ Ready!');

// Dispatch ready event for app initialization
// The live-coding-app.js will listen for this event
window.dispatchEvent(new CustomEvent('strudel-ready'));
