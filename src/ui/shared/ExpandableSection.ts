/**
 * Expandable Section Component
 * Reusable expandable/collapsible section with smooth animations
 */

export interface ExpandableSectionOptions {
  /** Selector for the trigger element (default: 'h2') */
  triggerSelector?: string;
  /** Selector for the collapsible content (default: '.expandable-content') */
  contentSelector?: string;
  /** Default expanded state (default: false) */
  defaultExpanded?: boolean;
  /** Callback when section expands */
  onExpand?: (section: HTMLElement) => void;
  /** Callback when section collapses */
  onCollapse?: (section: HTMLElement) => void;
}

export class ExpandableSection {
  private section: HTMLElement;
  private trigger: HTMLElement | null;
  private content: HTMLElement | null;
  private options: Required<ExpandableSectionOptions>;
  private isExpanded: boolean;

  constructor(section: HTMLElement, options: ExpandableSectionOptions = {}) {
    this.section = section;
    this.options = {
      triggerSelector: 'h2',
      contentSelector: '.expandable-content',
      defaultExpanded: false,
      onExpand: () => {},
      onCollapse: () => {},
      ...options
    };
    
    this.trigger = section.querySelector(this.options.triggerSelector);
    this.content = section.querySelector(this.options.contentSelector);
    this.isExpanded = this.options.defaultExpanded;
    
    this.init();
  }

  private init(): void {
    if (!this.trigger) return;
    
    // Set initial state
    this.section.setAttribute('data-expanded', String(this.isExpanded));
    if (this.isExpanded) {
      this.section.classList.add('expanded');
    }
    
    // Add click handler
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });
  }

  expand(): void {
    if (this.isExpanded) return;
    this.isExpanded = true;
    this.section.setAttribute('data-expanded', 'true');
    this.section.classList.add('expanded');
    this.options.onExpand(this.section);
  }

  collapse(): void {
    if (!this.isExpanded) return;
    this.isExpanded = false;
    this.section.setAttribute('data-expanded', 'false');
    this.section.classList.remove('expanded');
    this.options.onCollapse(this.section);
  }

  toggle(): void {
    if (this.isExpanded) {
      this.collapse();
    } else {
      this.expand();
    }
  }

  getElement(): HTMLElement {
    return this.section;
  }

  getIsExpanded(): boolean {
    return this.isExpanded;
  }
}

/**
 * Initialize all expandable sections on the page
 */
export function initExpandableSections(options: ExpandableSectionOptions = {}): ExpandableSection[] {
  const selector = '.expandable-section';
  const sections = document.querySelectorAll<HTMLElement>(selector);
  const instances: ExpandableSection[] = [];
  
  sections.forEach(section => {
    instances.push(new ExpandableSection(section, options));
  });
  
  return instances;
}

