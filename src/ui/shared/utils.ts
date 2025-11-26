/**
 * Shared UI Utilities
 */

/**
 * Handle button activation via click or keyboard (Enter/Space)
 * Provides consistent accessibility support across all buttons
 */
export function handleButtonActivate(element: HTMLElement, handler: () => void): void {
  element.addEventListener('click', handler);
  element.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  });
}
