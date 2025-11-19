/**
 * UNISEX XL - Live Coding Application
 * Integrates Strudel live coding with aggressive ASCII visualization
 */

// ============================================
// APPLICATION STATE
// ============================================

const App = {
  // Strudel
  strudelPattern: null,
  isPlaying: false,
  evaluate: null,
  silence: null,
  
  // Visualizer
  visualizer: null,
  
  // UI Elements
  playBtn: null,
  stopBtn: null,
  codeEditor: null,
  patternSelect: null,
  saveBtn: null,
  console: null,
  modeIndicator: null,
  vizPreset: null,
  helpBtn: null,
  shortcutsHelp: null,
  loadingOverlay: null,
  mainContainer: null,
  patternLibrary: null,
  patternList: null,
  
  // Mode
  currentMode: 'live-coding', // live-coding, performance, studio
  
  // Pattern library
  patterns: {},
  
  // Init
  async init() {
    try {
      this.log('🚀 Initializing UNISEX XL Live Coding...', 'info');
      this.showLoading(true);
      
      // Wait for libraries to load
      await this.waitForLibraries();
      
      // Get DOM elements first (needed for logging)
      this.getElements();
      
      // Initialize Strudel
      if (typeof strudel === 'undefined') {
        throw new Error('Strudel library not loaded');
      }
      const { evaluate, silence } = strudel;
      this.evaluate = evaluate;
      this.silence = silence;
      
      // Initialize visualizer
      this.initVisualizer();
      
      // Load pattern library
      await this.loadPatternLibrary();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Setup keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Set initial mode
      this.setMode('live-coding');
      
      this.showLoading(false);
      this.log('✅ System ready - Press Ctrl+Enter to play!', 'success');
    } catch (error) {
      this.showLoading(false);
      this.log(`❌ Initialization error: ${error.message}`, 'error');
      console.error('App initialization error:', error);
      alert(`Failed to initialize app: ${error.message}\n\nCheck browser console for details.`);
    }
  },
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  async waitForLibraries() {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (attempts < maxAttempts) {
      if (typeof p5 !== 'undefined' && 
          typeof Tone !== 'undefined' && 
          typeof strudel !== 'undefined') {
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    throw new Error('Failed to load required libraries');
  },
  
  getElements() {
    this.playBtn = document.getElementById('playBtn');
    this.stopBtn = document.getElementById('stopBtn');
    this.codeEditor = document.getElementById('codeEditor');
    this.patternSelect = document.getElementById('patternSelect');
    this.saveBtn = document.getElementById('saveBtn');
    this.console = document.getElementById('console');
    this.modeIndicator = document.getElementById('modeIndicator');
    this.vizPreset = document.getElementById('vizPreset');
    this.helpBtn = document.getElementById('helpBtn');
    this.shortcutsHelp = document.getElementById('shortcutsHelp');
    this.loadingOverlay = document.getElementById('loadingOverlay');
    this.mainContainer = document.getElementById('main-container');
    this.patternLibrary = document.getElementById('patternLibrary');
    this.patternList = document.getElementById('patternList');
    
    // Verify critical elements exist
    const criticalElements = [
      { name: 'playBtn', el: this.playBtn },
      { name: 'codeEditor', el: this.codeEditor },
      { name: 'console', el: this.console },
      { name: 'visualizer-container', el: document.getElementById('visualizer-container') }
    ];
    
    const missing = criticalElements.filter(item => !item.el);
    if (missing.length > 0) {
      throw new Error(`Missing DOM elements: ${missing.map(m => m.name).join(', ')}`);
    }
  },
  
  initVisualizer() {
    try {
      this.log('🎨 Initializing visualizer...', 'info');
      
      if (typeof LiveCodingVisualizer === 'undefined') {
        throw new Error('LiveCodingVisualizer class not found. Make sure live-coding-visualizer.js is loaded.');
      }
      
      this.visualizer = new LiveCodingVisualizer('visualizer-container');
      this.log('✅ Visualizer initialized', 'success');
    } catch (error) {
      this.log(`❌ Visualizer error: ${error.message}`, 'error');
      console.error('Visualizer initialization error:', error);
    }
  },
  
  async loadPatternLibrary() {
    this.log('📚 Loading pattern library...', 'info');
    
    // Define available patterns
    this.patterns = {
      'Industrial 157 BPM (Advanced)': 'patterns/strudel/techno/industrial-157bpm-advanced.strudel',
      'Industrial 157 BPM': 'patterns/strudel/techno/industrial-157bpm.strudel',
      'Berlin Techno': 'patterns/strudel/techno/berlin-techno.strudel',
      'Techno Roland': 'patterns/strudel/techno/techno-roland.strudel',
      'Der Der v1': 'patterns/strudel/der-der/v1.strudel',
      'Der Der v2': 'patterns/strudel/der-der/v2.strudel',
    };
    
    // Populate pattern select dropdown
    Object.keys(this.patterns).forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      this.patternSelect.appendChild(option);
    });
    
    // Populate pattern library panel
    Object.keys(this.patterns).forEach(name => {
      const item = document.createElement('div');
      item.className = 'pattern-item';
      item.textContent = name;
      item.addEventListener('click', () => this.loadPattern(name));
      this.patternList.appendChild(item);
    });
    
    this.log(`✅ Loaded ${Object.keys(this.patterns).length} patterns`, 'success');
  },
  
  // ============================================
  // PATTERN MANAGEMENT
  // ============================================
  
  async loadPattern(name) {
    const path = this.patterns[name];
    if (!path) {
      this.log(`❌ Pattern not found: ${name}`, 'error');
      return;
    }
    
    try {
      this.log(`📂 Loading pattern: ${name}...`, 'info');
      const response = await fetch(path);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const code = await response.text();
      this.codeEditor.value = code;
      this.log(`✅ Loaded: ${name}`, 'success');
      
      // Reset dropdown
      this.patternSelect.value = '';
    } catch (error) {
      this.log(`❌ Error loading pattern: ${error.message}`, 'error');
      console.error('Pattern load error:', error);
    }
  },
  
  savePattern() {
    const code = this.codeEditor.value;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `pattern-${timestamp}.strudel`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    this.log(`💾 Saved: ${filename}`, 'success');
  },
  
  // ============================================
  // PLAYBACK CONTROL
  // ============================================
  
  async play() {
    if (this.isPlaying) {
      // Restart - stop then play
      await this.stop();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
      // Start Tone.js context
      await Tone.start();
      
      // Start visualizer audio connection
      if (this.visualizer) {
        this.visualizer.startAudio();
      } else {
        this.log('⚠️ Visualizer not initialized', 'error');
      }
      
      // Get code
      const code = this.codeEditor.value.trim();
      if (!code) {
        this.log('⚠️ No code to play', 'error');
        return;
      }
      
      // Evaluate and play pattern
      this.log('▶️ Starting pattern...', 'info');
      this.strudelPattern = await this.evaluate(code);
      
      this.isPlaying = true;
      this.updatePlaybackUI();
      this.log('🎵 Playing!', 'success');
      
    } catch (error) {
      this.log(`❌ Error: ${error.message}`, 'error');
      console.error('Playback error:', error);
      this.isPlaying = false;
      this.updatePlaybackUI();
    }
  },
  
  async stop() {
    if (!this.isPlaying) return;
    
    this.silence();
    this.isPlaying = false;
    this.updatePlaybackUI();
    this.log('⏹️ Stopped', 'info');
    
    // Keep visualizer connected to see audio decay
    // this.visualizer.stopAudio();
  },
  
  updatePlaybackUI() {
    if (this.isPlaying) {
      this.playBtn.classList.add('active');
      this.playBtn.textContent = '🔊 PLAYING';
    } else {
      this.playBtn.classList.remove('active');
      this.playBtn.textContent = '▶️ PLAY';
    }
  },
  
  // ============================================
  // MODE SWITCHING
  // ============================================
  
  setMode(mode) {
    this.currentMode = mode;
    
    // Update UI
    this.mainContainer.className = 'container';
    
    // Update mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      }
    });
    
    // Apply mode-specific layout
    switch (mode) {
      case 'performance':
        this.mainContainer.classList.add('performance-mode');
        this.patternLibrary.classList.add('hidden');
        this.console.classList.add('hidden');
        this.modeIndicator.textContent = 'PERFORMANCE MODE';
        this.log('🎤 Performance mode activated', 'info');
        break;
        
      case 'studio':
        this.mainContainer.classList.add('studio-mode');
        this.patternLibrary.classList.remove('hidden');
        this.console.classList.remove('hidden');
        this.modeIndicator.textContent = 'STUDIO MODE';
        this.log('🏭 Studio mode activated', 'info');
        break;
        
      case 'live-coding':
      default:
        // Default 50/50 split
        this.patternLibrary.classList.remove('hidden');
        this.console.classList.remove('hidden');
        this.modeIndicator.textContent = 'LIVE CODING MODE';
        this.log('💻 Live coding mode activated', 'info');
        break;
    }
  },
  
  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  setupEventListeners() {
    // Playback controls
    this.playBtn.addEventListener('click', () => this.play());
    this.stopBtn.addEventListener('click', () => this.stop());
    
    // Pattern management
    this.patternSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        this.loadPattern(e.target.value);
      }
    });
    
    this.saveBtn.addEventListener('click', () => this.savePattern());
    
    // Visual preset
    this.vizPreset.addEventListener('change', (e) => {
      if (this.visualizer) {
        this.visualizer.setPreset(e.target.value);
        this.log(`🎨 Visual preset: ${e.target.value}`, 'info');
      }
    });
    
    // Mode switching
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setMode(e.target.dataset.mode);
      });
    });
    
    // Help toggle
    this.helpBtn.addEventListener('click', () => {
      this.shortcutsHelp.classList.toggle('visible');
    });
  },
  
  // ============================================
  // KEYBOARD SHORTCUTS
  // ============================================
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Enter or Cmd+Enter: Play
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.play();
      }
      
      // Ctrl+. or Cmd+.: Stop
      if ((e.ctrlKey || e.metaKey) && e.key === '.') {
        e.preventDefault();
        this.stop();
      }
      
      // Ctrl+S or Cmd+S: Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        this.savePattern();
      }
      
      // Ctrl+E or Cmd+E: Toggle editor (fullscreen viz)
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        this.toggleEditor();
      }
      
      // Ctrl+O or Cmd+O: Open pattern dialog
      if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        this.patternSelect.focus();
      }
      
      // Ctrl+D or Cmd+D: Duplicate pattern
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        this.duplicatePattern();
      }
      
      // ?: Toggle help
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && e.target !== this.codeEditor) {
        e.preventDefault();
        this.shortcutsHelp.classList.toggle('visible');
      }
      
      // Esc: Hide help
      if (e.key === 'Escape') {
        this.shortcutsHelp.classList.remove('visible');
      }
    });
    
    this.log('⌨️ Keyboard shortcuts enabled', 'success');
  },
  
  toggleEditor() {
    const leftPanel = document.querySelector('.left-panel');
    if (leftPanel.style.display === 'none') {
      leftPanel.style.display = '';
      this.log('📝 Editor visible', 'info');
    } else {
      leftPanel.style.display = 'none';
      this.log('🖼️ Fullscreen visualizer', 'info');
    }
  },
  
  duplicatePattern() {
    const code = this.codeEditor.value;
    const newCode = `// Duplicate pattern\n${code}`;
    this.codeEditor.value = newCode;
    this.log('📋 Pattern duplicated', 'success');
  },
  
  // ============================================
  // CONSOLE/LOGGING
  // ============================================
  
  log(message, type = 'info') {
    // Always log to browser console
    const timestamp = `[${new Date().toLocaleTimeString()}]`;
    console.log(`${timestamp} ${message}`);
    
    // Also log to UI console if available
    if (this.console) {
      try {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = `${timestamp} ${message}`;
        this.console.appendChild(line);
        this.console.scrollTop = this.console.scrollHeight;
        
        // Keep console size manageable
        while (this.console.children.length > 50) {
          this.console.removeChild(this.console.firstChild);
        }
      } catch (error) {
        // Silently fail if console element has issues
        console.warn('Could not write to UI console:', error);
      }
    }
  },
  
  showLoading(show) {
    if (show) {
      this.loadingOverlay.classList.add('visible');
    } else {
      this.loadingOverlay.classList.remove('visible');
    }
  }
};

// ============================================
// START APPLICATION
// ============================================

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

