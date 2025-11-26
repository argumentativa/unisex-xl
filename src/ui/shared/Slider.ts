/**
 * Slider Component
 * Reusable slider component for consistent UI across the app
 */

export interface SliderOptions {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value?: number;
  displayFormat?: 'percentage' | 'raw' | 'custom';
  customFormatter?: (value: number) => string;
  onChange?: (value: number) => void;
  className?: string;
  showValue?: boolean;
}

export class Slider {
  private element!: HTMLElement;
  private slider!: HTMLInputElement;
  private valueDisplay?: HTMLElement;
  private currentValue: number;
  private options: SliderOptions;

  constructor(options: SliderOptions) {
    this.options = {
      step: 0.01,
      value: options.min,
      displayFormat: 'percentage',
      showValue: true,
      ...options
    };
    this.currentValue = this.options.value!;

    this.createElement();
    this.setupEventListeners();
  }

  private createElement(): void {
    // Main container
    this.element = document.createElement('div');
    this.element.className = 'slider-control';
    if (this.options.className) {
      this.element.classList.add(this.options.className);
    }

    // Label (if provided)
    if (this.options.label) {
      const labelEl = document.createElement('label');
      labelEl.className = 'slider-label';
      labelEl.textContent = this.options.label;
      this.element.appendChild(labelEl);
    }

    // Slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';

    // Slider input
    this.slider = document.createElement('input');
    this.slider.type = 'range';
    this.slider.min = this.options.min.toString();
    this.slider.max = this.options.max.toString();
    this.slider.step = this.options.step!.toString();
    this.slider.value = this.currentValue.toString();
    this.slider.className = 'slider';

    // Value display (if enabled)
    if (this.options.showValue) {
      this.valueDisplay = document.createElement('span');
      this.valueDisplay.className = 'slider-value';
      this.updateValueDisplay();
    }

    sliderContainer.appendChild(this.slider);
    if (this.valueDisplay) {
      sliderContainer.appendChild(this.valueDisplay);
    }

    this.element.appendChild(sliderContainer);

    // Update initial visual state
    this.updateVisualState();
  }

  private setupEventListeners(): void {
    this.slider.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.currentValue = value;
      
      this.updateValueDisplay();
      this.updateVisualState();
      
      if (this.options.onChange) {
        this.options.onChange(value);
      }
    });
  }

  private updateValueDisplay(): void {
    if (!this.valueDisplay) return;

    let displayText: string;
    
    switch (this.options.displayFormat) {
      case 'percentage':
        const percentage = ((this.currentValue - this.options.min) / (this.options.max - this.options.min)) * 100;
        displayText = `${Math.round(percentage)}%`;
        break;
      case 'raw':
        displayText = Math.round(this.currentValue).toString();
        break;
      case 'custom':
        displayText = this.options.customFormatter 
          ? this.options.customFormatter(this.currentValue)
          : this.currentValue.toString();
        break;
      default:
        displayText = this.currentValue.toString();
    }

    this.valueDisplay.textContent = displayText;
  }

  private updateVisualState(): void {
    // Update active state
    this.element.classList.toggle('active', this.currentValue > this.options.min);
    
    // Update slider background gradient
    const percentage = ((this.currentValue - this.options.min) / (this.options.max - this.options.min)) * 100;
    this.slider.style.setProperty('--slider-value', `${percentage}%`);
  }

  /**
   * Get the slider container element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Get current slider value
   */
  getValue(): number {
    return this.currentValue;
  }

  /**
   * Set slider value programmatically
   */
  setValue(value: number): void {
    const clampedValue = Math.max(this.options.min, Math.min(this.options.max, value));
    this.currentValue = clampedValue;
    this.slider.value = clampedValue.toString();
    this.updateValueDisplay();
    this.updateVisualState();
    
    if (this.options.onChange) {
      this.options.onChange(clampedValue);
    }
  }
}

