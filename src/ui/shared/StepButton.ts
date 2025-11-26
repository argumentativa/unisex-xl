/**
 * Unified Step Button Component
 * Works for both Sequencer (hue-based) and Character Orchestra (character-based) modes
 * Handles note cycling (OFF → C → C# → ... → B → OFF) and preview sound on click
 */

import type { Character } from '../character-orchestra/Character';

export interface StepState {
  isActive: boolean;
  noteIndex: number;
  pressCount: number;
}

export const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Unified color palette for the 12 chromatic steps
export const COLOR_PALETTE = [
  '#FFCBA4', // C - Peach
  '#E2725B', // C# - Terracotta
  '#FBCEB1', // D - Apricot
  '#F4D03F', // D# - Golden Hour
  '#7FCDCD', // E - Aqua Dream
  '#93E9BE', // F - Seafoam
  '#4A9B9B', // F# - Teal
  '#63B3B3', // G - Lagoon
  '#DCAE96', // G# - Dusty Rose
  '#B2C9AB', // A - Sage
  '#C5B4E3', // A# - Lavender Haze
  '#F8EDD3'  // B - Warm Cream
];

type ColorConfig =
  | { mode: 'hue'; hue: number }
  | { mode: 'character'; character: Character };

export interface StepButtonCallbacks {
  /** Called when step state changes (for parent to track pattern state) */
  onStateChange: (stepIndex: number, newState: StepState) => void;
  /** Called to play preview sound (parent provides the instrument) */
  onPlayPreview?: (noteIndex: number) => void;
}

export class StepButton {
  private element: HTMLButtonElement;
  private stepIndex: number;
  private stepState: StepState;
  private colorConfig: ColorConfig;
  private callbacks: StepButtonCallbacks;
  private interactionLevel: number = 0;
  private rowActivity: number = 0;
  private hue: number; // Computed hue for both modes
  private longPressTimer: number | null = null;
  private longPressDuration: number = 500; // milliseconds
  private isLongPress: boolean = false;
  private touchHandled: boolean = false; // Flag to prevent double-triggering
  private indicatorSvg: SVGSVGElement | null = null; // SVG indicator element
  private indicatorPaths: SVGPathElement[] = []; // Array of 12 path elements

  constructor(
    stepIndex: number,
    stepState: StepState,
    colorConfig: ColorConfig,
    callbacks: StepButtonCallbacks
  ) {
    this.stepIndex = stepIndex;
    this.stepState = { ...stepState };
    this.colorConfig = colorConfig;
    this.callbacks = callbacks;

    // Compute hue based on mode
    if (colorConfig.mode === 'hue') {
      this.hue = colorConfig.hue;
    } else {
      // Extract hue from character's baseColor
      this.hue = this.extractHueFromHex(colorConfig.character.baseColor);
    }

    // Create button element
    this.element = document.createElement('button');
    this.element.className = this.getButtonClassName();
    this.element.setAttribute('data-step', stepIndex.toString());
    this.element.setAttribute('aria-label', `Step ${stepIndex + 1}`);

    // Add click handler - handles note cycling internally
    // Note: On mobile, touch events may fire before click, so we handle taps in touchend
    this.element.addEventListener('click', (e) => {
      // Skip click if we already handled it via touch
      if (!this.touchHandled) {
        this.handleClick();
      }
      this.touchHandled = false; // Reset flag
    });

    // Add touch event handlers for mobile long press
    this.element.addEventListener('touchstart', (e) => {
      this.handleLongPressStart(e);
    });
    this.element.addEventListener('touchend', (e) => {
      this.handleLongPressEnd(e);
    });
    this.element.addEventListener('touchcancel', () => {
      this.clearLongPressTimer();
    });

    // Add mouse event handlers for desktop long press
    this.element.addEventListener('mousedown', (e) => {
      this.handleLongPressStart(e);
    });
    this.element.addEventListener('mouseup', (e) => {
      this.handleLongPressEnd(e);
    });
    this.element.addEventListener('mouseleave', () => {
      this.clearLongPressTimer();
    });

    // Prevent context menu on long press
    this.element.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });

    // Create indicator SVG
    this.createIndicator();

    // Update initial state
    this.updateState();
  }

  /**
   * Handle click - cycle through notes and play preview
   * OFF → C (0) → C# (1) → D (2) → ... → B (11) → OFF
   */
  private handleClick(): void {
    // If this was a long press, skip normal click behavior
    if (this.isLongPress) {
      this.isLongPress = false;
      return;
    }

    // Cycle to next note
    let newNoteIndex = this.stepState.noteIndex + 1;

    // If we exceed 11 (B), wrap back to -1 (OFF)
    if (newNoteIndex > 11) {
      newNoteIndex = -1;
    }

    const isActive = newNoteIndex >= 0;

    // Update state
    this.stepState = {
      isActive,
      noteIndex: newNoteIndex,
      pressCount: this.stepState.pressCount + 1
    };

    // Update hue based on note (for hue mode)
    if (this.colorConfig.mode === 'hue' && isActive) {
      this.hue = newNoteIndex * 30; // 360° / 12 = 30° per note
    }

    // Update visuals
    this.updateState();

    // Notify parent of state change
    this.callbacks.onStateChange(this.stepIndex, { ...this.stepState });

    // Play preview sound if active and callback provided
    if (isActive && this.callbacks.onPlayPreview) {
      this.callbacks.onPlayPreview(newNoteIndex);
    }
  }

  /**
   * Handle long press start - start timer
   */
  private handleLongPressStart(e: TouchEvent | MouseEvent): void {
    this.clearLongPressTimer();
    this.isLongPress = false;
    this.touchHandled = false;

    // Prevent default only for touch events to avoid scrolling/zooming
    if (e.type === 'touchstart') {
      e.preventDefault();
    }

    this.longPressTimer = window.setTimeout(() => {
      this.handleLongPress();
    }, this.longPressDuration);
  }

  /**
   * Handle long press end - check if long press occurred
   */
  private handleLongPressEnd(e: TouchEvent | MouseEvent): void {
    const wasShortPress = this.longPressTimer !== null;
    
    if (this.longPressTimer !== null) {
      // Timer was still running, so it was a short press
      this.clearLongPressTimer();
    }
    
    // Prevent default for touch events
    if (e.type === 'touchend') {
      e.preventDefault();
    }
    
    // If it was a short press (not a long press), handle the tap
    if (wasShortPress && !this.isLongPress) {
      if (e.type === 'touchend') {
        // For touch events, handle click directly (since we prevented default)
        this.touchHandled = true; // Flag to prevent click event from also firing
        this.handleClick();
      }
      // For mouse events, let the click handler handle it naturally
    }
  }

  /**
   * Clear long press timer
   */
  private clearLongPressTimer(): void {
    if (this.longPressTimer !== null) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  /**
   * Handle long press - immediately turn off the step
   */
  private handleLongPress(): void {
    this.clearLongPressTimer();
    this.isLongPress = true;

    // Immediately set to OFF state
    this.stepState = {
      isActive: false,
      noteIndex: -1,
      pressCount: this.stepState.pressCount + 1
    };

    // Update visuals
    this.updateState();

    // Notify parent of state change
    this.callbacks.onStateChange(this.stepIndex, { ...this.stepState });

    // Don't play preview sound when turning off
  }

  /**
   * Get appropriate button class name based on mode
   */
  private getButtonClassName(): string {
    if (this.colorConfig.mode === 'character') {
      return 'step-button character-mode';
    }
    return 'step-button';
  }

  /**
   * Extract hue from hex color
   */
  private extractHueFromHex(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;

    if (max !== min) {
      const d = max - min;
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return Math.round(h * 360);
  }

  /**
   * Get button element
   */
  getElement(): HTMLButtonElement {
    return this.element;
  }

  /**
   * Update step state
   */
  setStepState(stepState: StepState): void {
    this.stepState = { ...stepState };
    this.updateState();
  }

  /**
   * Get current step state
   */
  getStepState(): StepState {
    return { ...this.stepState };
  }

  /**
   * Get note name from noteIndex
   */
  getNoteName(): string {
    return CHROMATIC_NOTES[this.stepState.noteIndex] || 'C';
  }

  /**
   * Set current step highlight
   */
  setCurrentStep(isCurrent: boolean): void {
    this.element.classList.toggle('current-step', isCurrent);
  }

  /**
   * Update interaction level (for sequencer mode)
   */
  setInteractionLevel(level: number, rowActivity: number = 0): void {
    this.interactionLevel = level;
    this.rowActivity = rowActivity;
    this.updateState();
  }

  /**
   * Update button visual state
   */
  private updateState(): void {
    // Remove all state classes
    this.element.classList.remove('active', 'inactive');

    // Add appropriate class
    if (this.stepState.isActive) {
      this.element.classList.add('active');
    } else {
      this.element.classList.add('inactive');
    }

    // Apply color based on mode
    if (this.colorConfig.mode === 'character') {
      this.applyCharacterColor();
    } else {
      this.applyHueColor();
    }

    // Update content based on mode
    this.updateContent();

    // Add glow effect for active steps
    if (this.stepState.isActive) {
      this.element.classList.add('glow-active');
    } else {
      this.element.classList.remove('glow-active');
    }

    // Update indicator
    this.updateIndicator();
  }

  /**
   * Apply color for hue mode (Sequencer/Demo)
   * Uses unified COLOR_PALETTE for consistent colors
   */
  private applyHueColor(): void {
    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      // OFF state: let CSS handle it (white background)
      this.element.style.backgroundColor = '';
      this.element.style.color = '';
      return;
    }

    // Active state: use unified color palette
    const color = COLOR_PALETTE[this.stepState.noteIndex];
    this.element.style.backgroundColor = color;
    this.element.style.color = '#333333';
  }

  /**
   * Apply color for character mode (Character Orchestra)
   * Uses unified COLOR_PALETTE for consistent colors across all modes
   */
  private applyCharacterColor(): void {
    if (this.colorConfig.mode !== 'character') return;

    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      // OFF state: let CSS handle it (white background)
      this.element.style.backgroundColor = '';
      this.element.style.color = '';
      return;
    }

    // Active state: use unified color palette
    const color = COLOR_PALETTE[this.stepState.noteIndex];
    this.element.style.backgroundColor = color;
    this.element.style.color = '#333333';
  }

  /**
   * Calculate saturation (for hue mode)
   */
  private calculateSaturation(): number {
    if (!this.stepState.isActive) return 0;
    return 100; // Always 100% when active - maximum saturation for vibrant colors
  }

  /**
   * Calculate lightness (for hue mode)
   */
  private calculateLightness(): number {
    if (!this.stepState.isActive) return 20;

    // Brighter base lightness values for more vibrant colors
    let baseLightness = 55;
    switch (this.interactionLevel) {
      case 0: return 55; // Much brighter default
      case 1: baseLightness = 58; break;
      case 2: baseLightness = 62; break;
      case 3: baseLightness = 66; break;
      case 4: baseLightness = 70; break;
      case 5: baseLightness = 75; break;
      default: baseLightness = 55;
    }

    const rowBoost = this.rowActivity * 15;
    return Math.min(baseLightness + rowBoost, 90);
  }

  /**
   * Update button content
   */
  private updateContent(): void {
    if (this.colorConfig.mode === 'character') {
      this.renderCharacterContent();
    } else {
      // Sequencer mode: empty button (just color)
      // Clear content but preserve indicator
      const indicator = this.element.querySelector('.step-button-indicator');
      this.element.innerHTML = '';
      if (indicator) {
        this.element.appendChild(indicator);
      }
      const noteName = this.getNoteName();
      this.element.setAttribute('aria-label', 
        `Step ${this.stepIndex + 1} - ${noteName} (${this.stepState.pressCount} presses)`
      );
    }
  }

  /**
   * Render character mode content (note only, no emoji)
   */
  private renderCharacterContent(): void {
    if (this.colorConfig.mode !== 'character') return;

    const character = this.colorConfig.character;

    if (!this.stepState.isActive || this.stepState.noteIndex === -1) {
      // Clear content but preserve indicator SVG
      const existingIndicator = this.element.querySelector('.step-button-indicator');
      this.element.innerHTML = '';
      if (existingIndicator) {
        this.element.appendChild(existingIndicator);
      }
      this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${character.name} (off)`);
      return;
    }

    // Note label only (no emoji)
    const noteLabel = document.createElement('div');
    noteLabel.className = 'step-note-label';
    
    if (character.canPitch && this.stepState.noteIndex >= 0) {
      noteLabel.textContent = CHROMATIC_NOTES[this.stepState.noteIndex];
    } else {
      noteLabel.textContent = '♪';
    }

    // Clear content but preserve indicator SVG
    const existingIndicator = this.element.querySelector('.step-button-indicator');
    this.element.innerHTML = '';
    this.element.appendChild(noteLabel);
    if (existingIndicator) {
      this.element.appendChild(existingIndicator);
    }

    const noteText = character.canPitch 
      ? CHROMATIC_NOTES[this.stepState.noteIndex] 
      : '♪';
    this.element.setAttribute('aria-label', `Step ${this.stepIndex + 1} - ${character.name} - ${noteText}`);
  }

  /**
   * Create SVG indicator with 12 segments
   */
  private createIndicator(): void {
    // Create SVG container
    const svgContainer = document.createElement('div');
    svgContainer.className = 'step-button-indicator';
    
    this.indicatorSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.indicatorSvg.setAttribute('viewBox', '0 0 100 100');
    this.indicatorSvg.setAttribute('preserveAspectRatio', 'none');
    this.indicatorSvg.style.width = '100%';
    this.indicatorSvg.style.height = '100%';
    this.indicatorSvg.style.position = 'absolute';
    this.indicatorSvg.style.top = '0';
    this.indicatorSvg.style.left = '0';
    this.indicatorSvg.style.pointerEvents = 'none';
    this.indicatorSvg.style.overflow = 'visible';

    // Create 12 path segments (30° each)
    const centerX = 50;
    const centerY = 50;
    const radius = 48; // Slightly smaller than viewBox to account for stroke width
    const innerRadius = radius - 3; // Inner radius for stroke effect
    
    for (let i = 0; i < 12; i++) {
      const startAngle = (i * 30 - 90) * (Math.PI / 180); // Start at top (-90°)
      const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
      
      // Calculate points for arc
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const x3 = centerX + innerRadius * Math.cos(endAngle);
      const y3 = centerY + innerRadius * Math.sin(endAngle);
      const x4 = centerX + innerRadius * Math.cos(startAngle);
      const y4 = centerY + innerRadius * Math.sin(startAngle);
      
      // Create path for segment
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const largeArcFlag = 0; // 30° segments are always small arcs
      
      const pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        L ${x3} ${y3}
        A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
        Z
      `.trim();
      
      path.setAttribute('d', pathData);
      path.setAttribute('fill', '#E0E0E0'); // Default inactive color
      path.setAttribute('stroke', 'none');
      path.setAttribute('class', `indicator-segment indicator-segment-${i}`);
      
      this.indicatorSvg.appendChild(path);
      this.indicatorPaths.push(path);
    }
    
    svgContainer.appendChild(this.indicatorSvg);
    this.element.appendChild(svgContainer);
    
    // Initially hide if OFF
    if (this.stepState.noteIndex === -1) {
      svgContainer.style.display = 'none';
    }
  }

  /**
   * Update indicator visual state based on current noteIndex
   */
  private updateIndicator(): void {
    if (!this.indicatorSvg || this.indicatorPaths.length === 0) return;
    
    const container = this.element.querySelector('.step-button-indicator') as HTMLElement;
    if (!container) return;
    
    // Hide indicator if OFF state
    if (this.stepState.noteIndex === -1) {
      container.style.display = 'none';
      return;
    }
    
    // Show indicator
    container.style.display = 'block';
    
    // Update each segment
    for (let i = 0; i < 12; i++) {
      const path = this.indicatorPaths[i];
      if (!path) continue;
      
      if (i === this.stepState.noteIndex) {
        // Active section: use note color
        const activeColor = COLOR_PALETTE[this.stepState.noteIndex];
        path.setAttribute('fill', activeColor);
        path.setAttribute('opacity', '1');
      } else {
        // Inactive sections: gray
        path.setAttribute('fill', '#E0E0E0');
        path.setAttribute('opacity', '0.5');
      }
    }
  }
}

