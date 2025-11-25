/**
 * Type declarations for Strudel modules
 * These modules don't ship with TypeScript declarations
 */

declare module '@strudel/webaudio' {
  export function webaudioRepl(...args: any[]): any;
  export function registerSynthSounds(): Promise<void>;
  export function registerZZFXSounds(): Promise<void>;
  export const webaudioInit: any;
  export const getAudioContext: any;
}

declare module '@strudel/core' {
  export function evalScope(...modules: any[]): Promise<void>;
  export const repl: any;
  export const controls: any;
  export const Pattern: any;
  export const stack: any;
  export const sequence: any;
  export const cat: any;
  export const fastcat: any;
  export const slowcat: any;
  export const s: any;
  export const note: any;
  export const n: any;
}

declare module '@strudel/mini' {
  export const mini: any;
  export function miniParser(input: string): any;
}

declare module '@strudel/soundfonts' {
  export const soundfonts: any;
  export function loadSoundfont(name: string): Promise<any>;
}

declare module '@strudel/tonal' {
  export const Scale: any;
  export const Chord: any;
  export const Note: any;
}

declare module '@strudel/transpiler' {
  export function transpiler(code: string): string;
  export const transpile: any;
}
