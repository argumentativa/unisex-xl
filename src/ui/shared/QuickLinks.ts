/**
 * Quick Links Component
 * Global navigation component using Tab component
 * Displays quick links to main app sections
 */

import { TabContainer, Tab } from './Tab';

export interface QuickLink {
  label: string;
  href: string;
  showNotification?: boolean;
}

export class QuickLinks {
  private container: HTMLElement;
  private tabContainer: TabContainer;
  private links: QuickLink[];

  constructor(container: HTMLElement) {
    this.container = container;
    this.container.classList.add('quick-links');
    
    // Define all quick links
    this.links = [
      { label: 'Main App', href: './index.html' },
      { label: 'Step Sequencer', href: './sequencer.html' },
      { label: 'Character Orchestra', href: './character-orchestra.html' },
      { label: 'P5.js Hub', href: './p5/index.html' }
    ];

    // Initialize tab container
    this.tabContainer = new TabContainer(this.container);
    this.render();
  }

  private render(): void {
    const currentPath = window.location.pathname;
    
    this.links.forEach(link => {
      const isActive = this.isLinkActive(link.href, currentPath);
      
      this.tabContainer.addTab({
        label: link.label,
        active: isActive,
        showNotification: link.showNotification,
        onClick: () => {
          window.location.href = link.href;
        }
      });
    });
  }

  private isLinkActive(href: string, currentPath: string): boolean {
    // Check for index.html or root
    if (href === './index.html') {
      return currentPath.includes('index.html') || 
             currentPath.endsWith('/') || 
             currentPath.endsWith('/unisex-xl/');
    }
    
    // Check for other pages
    return currentPath.includes(href.replace('./', ''));
  }

  /**
   * Initialize QuickLinks component on a container element
   */
  static init(containerId: string): QuickLinks | null {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`QuickLinks: Container with id "${containerId}" not found`);
      return null;
    }
    return new QuickLinks(container);
  }

  /**
   * Initialize QuickLinks component on a container element (querySelector)
   */
  static initSelector(selector: string): QuickLinks | null {
    const container = document.querySelector(selector) as HTMLElement;
    if (!container) {
      console.warn(`QuickLinks: Container with selector "${selector}" not found`);
      return null;
    }
    return new QuickLinks(container);
  }

  getContainer(): HTMLElement {
    return this.container;
  }

  getTabContainer(): TabContainer {
    return this.tabContainer;
  }
}

