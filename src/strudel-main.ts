/**
 * UNISEX XL - Strudel Live Coding Editor (Simplified)
 */

import { repl } from '@strudel/repl';
import { EditorComponent } from './components/editor';

console.log('[Strudel] Starting...');

// Simple console logging
const logs: string[] = [];
function log(msg: string, type = 'info') {
  const time = new Date().toLocaleTimeString();
  logs.push(`[${time}] ${msg}`);
  const consoleEl = document.getElementById('console');
  if (consoleEl) {
    const colorClass = `console-${type}`;
    consoleEl.innerHTML = logs.map(l => `<div class="${colorClass}">${l}</div>`).join('');
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }
  console.log(`[Strudel] ${msg}`);
}

// Initialize Strudel REPL
let evaluator: any;
try {
  evaluator = repl();
  log('Strudel REPL initialized', 'success');
} catch (error) {
  log(`Failed to initialize Strudel: ${error}`, 'error');
  console.error(error);
}

// Initialize Monaco Editor
const editorComponent = new EditorComponent();
const editorContainer = document.getElementById('editor') as HTMLElement;

// Default Strudel code
const defaultCode = `// Strudel Basic Pattern
note("c a f e").s("sawtooth")`;

const editor = editorComponent.init(editorContainer, defaultCode);

// Get buttons
const runBtn = document.getElementById('runCode') as HTMLButtonElement;
const stopBtn = document.getElementById('stopCode') as HTMLButtonElement;
const clearBtn = document.getElementById('clearCode') as HTMLButtonElement;
const exampleBtn = document.getElementById('loadExample') as HTMLButtonElement;
const themeBtn = document.getElementById('themeToggle') as HTMLButtonElement;
const statusText = document.getElementById('statusText') as HTMLSpanElement;

// Run code
runBtn?.addEventListener('click', async () => {
  const code = editorComponent.getValue();
  log('Evaluating pattern...');
  statusText.textContent = 'Running...';

  try {
    if (!evaluator) {
      throw new Error('Strudel not initialized');
    }

    const result = await evaluator.evaluate(code);

    if (result?.error) {
      log(`Error: ${result.error}`, 'error');
      statusText.textContent = 'Error - check console';
    } else {
      log('Pattern playing!', 'success');
      statusText.textContent = 'Playing';
    }
  } catch (error: any) {
    log(`Error: ${error.message || error}`, 'error');
    statusText.textContent = 'Error - check console';
    console.error(error);
  }
});

// Stop
stopBtn?.addEventListener('click', () => {
  try {
    if (evaluator) {
      evaluator.stop?.();
      log('Stopped');
      statusText.textContent = 'Stopped';
    }
  } catch (error) {
    log('Error stopping', 'error');
  }
});

// Clear
clearBtn?.addEventListener('click', () => {
  editorComponent.setValue('');
  statusText.textContent = 'Cleared';
});

// Load example
const examples = [
  `// Basic notes\nnote("c a f e").s("sawtooth")`,
  `// Drums\nstack(\n  s("bd bd bd bd"),\n  s("~ cp ~ cp")\n)`,
  `// Bass pattern\nnote("c2 c2 g2 f2").s("sawtooth").lpf(300)`,
  `// Industrial pattern\nsetcps(0.654)\nstack(\n  note("b1 e2 b1 d3").s("supersaw").lpf(300),\n  s("bd ~ bd ~"),\n  s("~ cp ~ cp")\n)`
];

exampleBtn?.addEventListener('click', () => {
  const example = examples[Math.floor(Math.random() * examples.length)];
  editorComponent.setValue(example);
  log('Example loaded');
  statusText.textContent = 'Example loaded';
});

// Theme toggle
themeBtn?.addEventListener('click', () => {
  editorComponent.toggleTheme();
  document.body.classList.toggle('light-theme');
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
    e.preventDefault();
    runBtn?.click();
  }
  if (e.key === 'Escape') {
    e.preventDefault();
    stopBtn?.click();
  }
});

log('Strudel editor ready!', 'success');
statusText.textContent = 'Ready - Press Run or Cmd/Ctrl+Enter';
