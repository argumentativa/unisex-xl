/**
 * Simple Store Pattern for State Management
 * Centralizes playback state and syncs with Tone.Transport
 */

import * as Tone from 'tone';
import type { PlaybackState } from '../types';

type StateChangeCallback = (state: PlaybackState) => void;

class PlaybackStore {
  private state: PlaybackState = 'stopped';
  private subscribers: Set<StateChangeCallback> = new Set();
  private transportListenersInitialized = false;

  constructor() {
    this.initTransportListeners();
  }

  /**
   * Initialize Transport event listeners
   * This syncs the store with Tone.Transport state changes
   */
  private initTransportListeners(): void {
    if (this.transportListenersInitialized) return;

    Tone.Transport.on('start', () => this.setState('playing'));
    Tone.Transport.on('pause', () => this.setState('paused'));
    Tone.Transport.on('stop', () => this.setState('stopped'));

    this.transportListenersInitialized = true;
  }

  /**
   * Get current state
   */
  getState(): PlaybackState {
    return this.state;
  }

  /**
   * Set state and notify all subscribers
   */
  setState(newState: PlaybackState): void {
    if (this.state === newState) return;

    this.state = newState;
    this.notifySubscribers();
  }

  /**
   * Subscribe to state changes
   * Returns unsubscribe function
   */
  subscribe(callback: StateChangeCallback): () => void {
    this.subscribers.add(callback);

    // Immediately call with current state
    callback(this.state);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Notify all subscribers of state change
   */
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => {
      try {
        callback(this.state);
      } catch (error) {
        console.error('Error in state subscriber:', error);
      }
    });
  }
}

// Singleton instance
export const playbackStore = new PlaybackStore();

