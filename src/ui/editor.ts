/**
 * Editor Component - Monaco Editor wrapper
 * Uses Monaco Editor (VS Code's editor) for stability and features
 */

import * as monaco from 'monaco-editor';

export class Editor {
  private editor: monaco.editor.IStandaloneCodeEditor | null = null;
  private theme: 'vs-dark' | 'vs-light' = 'vs-dark';

  /**
   * Initialize Monaco Editor
   */
  init(container: HTMLElement, initialValue: string): void {
    this.editor = monaco.editor.create(container, {
      value: initialValue,
      language: 'javascript',
      theme: this.theme,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      lineNumbers: 'on',
      roundedSelection: false,
      scrollBeyondLastLine: false,
      readOnly: false,
      cursorStyle: 'line',
      tabSize: 2,
      insertSpaces: true,
      wordWrap: 'on',
      bracketPairColorization: { enabled: true },
      formatOnPaste: true,
      formatOnType: true
    });
  }

  /**
   * Get editor value
   */
  getValue(): string {
    return this.editor?.getValue() || '';
  }

  /**
   * Set editor value
   */
  setValue(value: string): void {
    this.editor?.setValue(value);
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.theme = this.theme === 'vs-dark' ? 'vs-light' : 'vs-dark';
    monaco.editor.setTheme(this.theme);
  }

  /**
   * Get current theme
   */
  getTheme(): string {
    return this.theme;
  }

  /**
   * Dispose editor
   */
  dispose(): void {
    this.editor?.dispose();
  }
}

