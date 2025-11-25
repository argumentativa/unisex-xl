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
      { label: 'Gallery', href: './gallery.html' },
      { label: 'Main App', href: './index.html' },
      { label: 'Step Sequencer', href: './sequencer.html' },
      { label: 'Character Orchestra', href: './character-orchestra.html' },
      { label: 'P5.js Hub', href: './p5/index.html' },
      { label: 'Pattern Docs', href: './docs/index.html' }
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
          // Resolve relative path to absolute URL
          // This ensures navigation works from any subdirectory
          const rootPath = this.getRootPath();
          
          // Build absolute path from root
          const targetPath = link.href.startsWith('./')
            ? link.href.replace('./', '')
            : link.href;
          
          // Construct path, handling root vs subdirectory cases
          const absolutePath = rootPath 
            ? `${rootPath}/${targetPath}`
            : `/${targetPath}`;
          
          window.location.href = absolutePath;
        }
      });
    });
  }

  /**
   * Get the root path of the application
   * Handles both root-level and subdirectory deployments
   */
  private getRootPath(): string {
    const pathname = window.location.pathname;
    // If pathname starts with /unisex-xl/, return that base
    if (pathname.startsWith('/unisex-xl/')) {
      return '/unisex-xl';
    }
    // Check for other common base paths (e.g., if deployed to a subdirectory)
    const match = pathname.match(/^\/([^\/]+)/);
    if (match && match[1] !== '') {
      // If we're in a subdirectory, return the base path
      return `/${match[1]}`;
    }
    // Root level deployment
    return '';
  }

  private isLinkActive(href: string, currentPath: string): boolean {
    // Check for index.html or root
    if (href === './index.html') {
      return currentPath.includes('index.html') || 
             currentPath.endsWith('/') || 
             currentPath.endsWith('/unisex-xl/');
    }
    
    // Check for gallery.html
    if (href === './gallery.html') {
      return currentPath.includes('gallery.html');
    }
    
    // Check for Pattern Docs (docs/index.html)
    if (href === './docs/index.html') {
      return currentPath.includes('docs/index.html') || currentPath.includes('docs/');
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

