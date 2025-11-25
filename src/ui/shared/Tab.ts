/**
 * Tab Component
 * Reusable tab component with active/hover states
 */

export interface TabOptions {
  /** Tab label text */
  label: string;
  /** Whether tab is active */
  active?: boolean;
  /** Whether to show notification dot */
  showNotification?: boolean;
  /** Click callback */
  onClick?: (tab: Tab) => void;
  /** Additional CSS classes */
  className?: string;
}

export class Tab {
  private element: HTMLElement;
  private label: string;
  private isActive: boolean;
  private showNotification: boolean;
  private onClick?: (tab: Tab) => void;

  constructor(options: TabOptions) {
    this.label = options.label;
    this.isActive = options.active || false;
    this.showNotification = options.showNotification || false;
    this.onClick = options.onClick;

    this.element = document.createElement('span');
    this.element.className = `tab ${options.className || ''}`;
    if (this.isActive) {
      this.element.classList.add('active');
    }

    this.render();
    this.attachEvents();
  }

  private render(): void {
    const textNode = document.createTextNode(this.label);
    this.element.appendChild(textNode);

    if (this.showNotification) {
      const notification = document.createElement('span');
      notification.className = 'tab-notification';
      this.element.appendChild(notification);
    }
  }

  private attachEvents(): void {
    this.element.addEventListener('click', () => {
      if (this.onClick) {
        this.onClick(this);
      }
    });
  }

  setActive(active: boolean): void {
    this.isActive = active;
    if (active) {
      this.element.classList.add('active');
    } else {
      this.element.classList.remove('active');
    }
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getLabel(): string {
    return this.label;
  }
}

/**
 * Tab Container Component
 * Manages a group of tabs with single active state
 */
export class TabContainer {
  private container: HTMLElement;
  private tabs: Tab[] = [];
  private activeTab: Tab | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.classList.add('tab-container');
  }

  addTab(options: TabOptions): Tab {
    const tab = new Tab({
      ...options,
      onClick: (clickedTab) => {
        this.setActiveTab(clickedTab);
        if (options.onClick) {
          options.onClick(clickedTab);
        }
      }
    });

    this.tabs.push(tab);
    this.container.appendChild(tab.getElement());

    if (options.active) {
      this.setActiveTab(tab);
    }

    return tab;
  }

  setActiveTab(tab: Tab): void {
    // Deactivate all tabs
    this.tabs.forEach(t => t.setActive(false));
    
    // Activate selected tab
    tab.setActive(true);
    this.activeTab = tab;
  }

  getActiveTab(): Tab | null {
    return this.activeTab;
  }

  getTabs(): Tab[] {
    return this.tabs;
  }

  getElement(): HTMLElement {
    return this.container;
  }
}

