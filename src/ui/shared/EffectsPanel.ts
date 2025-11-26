/**
 * Effects Panel Component
 * Reusable expandable panel for per-instrument effects
 */

import * as Tone from 'tone';
import type { EffectType } from '../../types';

export interface EffectsPanelOptions {
  characterName: string;
  characterIcon?: string;
  onEffectChange?: (type: EffectType, value: number) => void;
}

export class EffectsPanel {
  private element!: HTMLElement;
  private header!: HTMLElement;
  private content!: HTMLElement;
  private effects: Map<EffectType, Tone.ToneAudioNode> = new Map();
  private effectChain: Tone.ToneAudioNode[] = [];
  private isExpanded: boolean = false;
  
  // Effect instances
  private reverb!: Tone.Reverb;
  private delay!: Tone.FeedbackDelay;
  private distortion!: Tone.Distortion;
  private bitcrusher!: Tone.BitCrusher;
  
  // Effect values
  private effectValues: Map<EffectType, number> = new Map([
    ['reverb', 0],
    ['delay', 0],
    ['distortion', 0],
    ['bitcrusher', 0]
  ]);

  private onEffectChangeCallback?: (type: EffectType, value: number) => void;

  constructor(private synth: Tone.ToneAudioNode, options: EffectsPanelOptions) {
    this.onEffectChangeCallback = options.onEffectChange;
    this.initializeEffects();
    this.createUI(options);
    this.connectSynth();
  }

  private initializeEffects(): void {
    // Create effect instances
    this.reverb = new Tone.Reverb({ 
      decay: 2, 
      wet: 0
    });
    
    this.delay = new Tone.FeedbackDelay({ 
      delayTime: '8n', 
      feedback: 0.2, 
      wet: 0 
    });
    
    this.distortion = new Tone.Distortion({ 
      distortion: 0, 
      wet: 0 
    });
    
    this.bitcrusher = new Tone.BitCrusher(16);
    this.bitcrusher.wet.value = 0;
    
    // Build effect chain: distortion → bitcrusher → delay → reverb
    this.effectChain = [
      this.distortion,
      this.bitcrusher,
      this.delay,
      this.reverb
    ];
    
    // Connect effects in series
    for (let i = 0; i < this.effectChain.length - 1; i++) {
      this.effectChain[i].connect(this.effectChain[i + 1]);
    }
    
    // Connect last effect to destination
    this.effectChain[this.effectChain.length - 1].toDestination();
  }

  private connectSynth(): void {
    // Connect synth to first effect in chain
    this.synth.connect(this.effectChain[0]);
  }

  private createUI(options: EffectsPanelOptions): void {
    // Main container
    this.element = document.createElement('div');
    this.element.className = 'effects-panel';
    this.element.setAttribute('data-character', options.characterName);

    // Header (clickable to expand/collapse)
    this.header = document.createElement('div');
    this.header.className = 'effects-panel-header';
    this.header.innerHTML = `
      <span class="effects-panel-icon">${options.characterIcon || '🎵'}</span>
      <span class="effects-panel-name">${options.characterName}</span>
      <span class="effects-panel-toggle">▼</span>
    `;
    this.header.addEventListener('click', () => this.toggle());

    // Content (collapsible)
    this.content = document.createElement('div');
    this.content.className = 'effects-panel-content';
    this.content.style.display = 'none';

    // Create effect controls
    this.createEffectControl('reverb', '🌊 Reverb', 0, 1, 0.01);
    this.createEffectControl('delay', '🔁 Delay', 0, 1, 0.01);
    this.createEffectControl('distortion', '🔥 Distortion', 0, 1, 0.01);
    this.createEffectControl('bitcrusher', '💎 Bitcrusher', 0, 1, 0.01);

    // Assemble
    this.element.appendChild(this.header);
    this.element.appendChild(this.content);
  }

  private createEffectControl(
    type: EffectType,
    label: string,
    min: number,
    max: number,
    step: number
  ): void {
    const control = document.createElement('div');
    control.className = 'effect-control';
    control.setAttribute('data-effect', type);

    const labelEl = document.createElement('label');
    labelEl.className = 'effect-label';
    labelEl.textContent = label;

    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'effect-slider-container';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min.toString();
    slider.max = max.toString();
    slider.step = step.toString();
    slider.value = '0';
    slider.className = 'effect-slider';
    slider.setAttribute('data-effect-type', type);

    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'effect-value';
    valueDisplay.textContent = '0%';

    slider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.setEffect(type, value);
      valueDisplay.textContent = `${Math.round(value * 100)}%`;
      
      // Visual feedback
      control.classList.toggle('active', value > 0);
      
      // Update slider background gradient
      const percentage = (value / (max - min)) * 100;
      slider.style.setProperty('--slider-value', `${percentage}%`);
    });

    sliderContainer.appendChild(slider);
    sliderContainer.appendChild(valueDisplay);

    control.appendChild(labelEl);
    control.appendChild(sliderContainer);

    this.content.appendChild(control);
  }

  private toggle(): void {
    this.isExpanded = !this.isExpanded;
    this.content.style.display = this.isExpanded ? 'block' : 'none';
    
    const toggle = this.header.querySelector('.effects-panel-toggle');
    if (toggle) {
      toggle.textContent = this.isExpanded ? '▲' : '▼';
    }
    
    this.element.classList.toggle('expanded', this.isExpanded);
  }

  setEffect(type: EffectType, value: number): void {
    this.effectValues.set(type, value);

    switch (type) {
      case 'reverb':
        (this.reverb as Tone.Reverb).wet.value = value;
        break;
      case 'delay':
        (this.delay as Tone.FeedbackDelay).wet.value = value;
        break;
      case 'distortion':
        (this.distortion as Tone.Distortion).wet.value = value;
        break;
      case 'bitcrusher':
        // Bitcrusher: value 0-1 maps to bits 16-1
        const bits = Math.round(16 - (value * 15));
        const oldCrusher = this.bitcrusher;
        const crusherIndex = this.effectChain.indexOf(oldCrusher);

        if (crusherIndex > 0) {
          this.effectChain[crusherIndex - 1].disconnect(oldCrusher);
        }
        oldCrusher.disconnect();
        oldCrusher.dispose();

        const newCrusher = new Tone.BitCrusher(bits);
        newCrusher.wet.value = value > 0 ? 1 : 0;

        if (crusherIndex > 0) {
          this.effectChain[crusherIndex - 1].connect(newCrusher);
        }
        if (crusherIndex < this.effectChain.length - 1) {
          newCrusher.connect(this.effectChain[crusherIndex + 1]);
        }

        this.effectChain[crusherIndex] = newCrusher;
        this.bitcrusher = newCrusher;
        break;
    }

    // Notify callback if provided
    if (this.onEffectChangeCallback) {
      this.onEffectChangeCallback(type, value);
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  dispose(): void {
    // Clean up effects
    this.effectChain.forEach(effect => {
      effect.dispose();
    });
    this.synth.disconnect();
  }
}

