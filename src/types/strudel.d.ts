/**
 * Type definitions for Strudel packages
 * These packages don't ship with TypeScript definitions
 */

declare module '@strudel/core' {
  export interface Pattern {
    play: () => void;
    stop: () => void;
    output: (outputFn: any) => Pattern;
  }

  export interface Scheduler {
    start: () => void;
    stop: () => void;
    pause: () => void;
  }

  export interface ReplContext {
    evaluate: (code: string) => Promise<any>;
    scheduler: Scheduler;
  }

  export interface ReplOptions {
    transpiler?: (code: string, options?: any) => { output: string; [key: string]: any };
    onToggle?: (playing: boolean) => void;
    onError?: (error: Error) => void;
  }

  export function repl(options?: ReplOptions): ReplContext;
  export function evalScope(...modules: any[]): Promise<any[]>;
  export const controls: any;
  export const note: any;
  export const stack: any;
  export const s: any;
  export const sound: any;
}

declare module '@strudel/webaudio' {
  import { ReplContext, ReplOptions } from '@strudel/core';

  export function getAudioContext(): AudioContext;
  export function webaudioOutput(): any;
  export function initAudioOnFirstClick(): void;
  export function webaudioRepl(options?: ReplOptions): ReplContext;
  export function registerSynthSounds(): Promise<void>;
  export function registerZZFXSounds(): void;
  export function samples(url: string): Promise<void>;
  export function aliasBank(url: string): void;
}

declare module '@strudel/mini' {
  export const mini: any;
  export const m: any;
  export const h: any;
  export function minify(thing: any): any;
}

declare module '@strudel/repl' {
  export const repl: any;
}

declare module '@strudel/soundfonts' {
  export function loadSoundfont(name: string): Promise<any>;
  export function registerSoundfonts(): void;
  export const soundfontList: any;
}

declare module '@strudel/tonal' {
  export const Note: any;
  export const Chord: any;
  export const Scale: any;
}

declare module '@strudel/transpiler' {
  export function transpiler(code: string, options?: any): { output: string; [key: string]: any };
  export function evaluate(code: string): Promise<any>;
}

declare module 'superdough' {
  export function getAnalyserById(id: number, fftSize?: number, smoothingTimeConstant?: number): AnalyserNode;
  export function getAnalyzerData(type?: 'time' | 'frequency', id?: number): Float32Array;
  export function getSuperdoughAudioController(): any;
  export function getDestination(): AudioNode;
}
