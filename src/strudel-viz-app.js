/**
 * Strudel + Visualizer Application
 * Clean implementation using @strudel/web and aggressive ASCII visualizer
 */

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
  vizPreset: null,
  console: null,
  statusIndicator: null,
  
  // Pattern library
  patterns: {},
  
  // Init
  async init() {
    this.log('🚀 Initializing Strudel + Visualizer...', 'info');
    
    // Get DOM elements
    this.getElements();
    
    // Initialize Strudel
    await this.initStrudel();
    
    // Initialize visualizer
    this.initVisualizer();
    
    // Load pattern library
    await this.loadPatternLibrary();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Setup keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    this.updateStatus('READY');
    this.log('✅ System ready - Press Ctrl+Enter to play!', 'success');
  },
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  getElements() {
    this.playBtn = document.getElementById('playBtn');
    this.stopBtn = document.getElementById('stopBtn');
    this.codeEditor = document.getElementById('codeEditor');
    this.patternSelect = document.getElementById('patternSelect');
    this.vizPreset = document.getElementById('vizPreset');
    this.console = document.getElementById('console');
    this.statusIndicator = document.getElementById('statusIndicator');
  },
  
  async initStrudel() {
    try {
      this.log('🎵 Initializing Strudel via @strudel/web...', 'info');
      
      // Wait for @strudel/web to load
      if (typeof initStrudel === 'undefined') {
        // Wait a bit for script to load
        await new Promise(resolve => setTimeout(resolve, 500));
        if (typeof initStrudel === 'undefined') {
          throw new Error('@strudel/web not loaded. Check network connection.');
        }
      }
      
      // Initialize Strudel (handles all modules, soundfonts, synths automatically)
      await initStrudel();
      
      this.log('✅ Strudel initialized', 'success');
      
      // Get evaluate function from webaudioRepl
      // @strudel/web sets up webaudioRepl internally, we need to access it
      const webaudioModule = await import('https://unpkg.com/@strudel/webaudio@latest');
      const webaudioReplFn = webaudioModule.webaudioRepl || webaudioModule.default?.webaudioRepl;
      
      if (webaudioReplFn) {
        const transpilerModule = await import('https://unpkg.com/@strudel/transpiler@latest');
        const transpilerFn = transpilerModule.transpiler || transpilerModule.default?.transpiler || transpilerModule;
        
        const { evaluate, scheduler } = webaudioReplFn({
          transpiler: transpilerFn,
          onToggle: (playing) => {
            this.updateStatus(playing ? 'PLAYING' : 'STOPPED');
            this.log(playing ? '▶️ Pattern started' : '⏹️ Pattern stopped', playing ? 'success' : 'info');
          },
          onError: (error) => {
            this.log(`❌ Strudel error: ${error.message}`, 'error');
            console.error('Strudel error:', error);
          }
        });
        
        this.evaluate = evaluate;
        this.silence = scheduler?.stop || (() => {
          if (typeof hush === 'function') {
            hush();
          } else if (Tone && Tone.Transport) {
            Tone.Transport.stop();
          }
        });
        
        this.log('✅ Strudel evaluate function ready', 'success');
      } else {
        throw new Error('Could not get evaluate function from webaudioRepl');
      }
      
    } catch (error) {
      this.log(`❌ Strudel initialization error: ${error.message}`, 'error');
      console.error('Strudel init error:', error);
      throw error;
    }
  },
  
  initVisualizer() {
    try {
      this.log('🎨 Initializing visualizer...', 'info');
      this.visualizer = new LiveCodingVisualizer('visualizer-container');
      this.log('✅ Visualizer initialized', 'success');
    } catch (error) {
      this.log(`❌ Visualizer error: ${error.message}`, 'error');
      console.error('Visualizer error:', error);
    }
  },
  
  async loadPatternLibrary() {
    this.log('📚 Loading pattern library...', 'info');
    
    this.patterns = {
      'Industrial 157 BPM (Advanced)': 'patterns/strudel/techno/industrial-157bpm-advanced.strudel',
      'Industrial 157 BPM': 'patterns/strudel/techno/industrial-157bpm.strudel',
      'Berlin Techno': 'patterns/strudel/techno/berlin-techno.strudel',
      'Techno Roland': 'patterns/strudel/techno/techno-roland.strudel',
      'Der Der v1': 'patterns/strudel/der-der/v1.strudel',
      'Der Der v2': 'patterns/strudel/der-der/v2.strudel',
    };
    
    Object.keys(this.patterns).forEach(name => {
      const option = document.createElement('option');
      option.value = name;
      option.textContent = name;
      this.patternSelect.appendChild(option);
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
      
      this.patternSelect.value = '';
    } catch (error) {
      this.log(`❌ Error loading pattern: ${error.message}`, 'error');
      console.error('Pattern load error:', error);
    }
  },
  
  // ============================================
  // PLAYBACK CONTROL
  // ============================================
  
  async play() {
    if (this.isPlaying) {
      await this.stop();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    try {
      // Start Tone.js context (required for audio)
      if (Tone.context.state !== 'running') {
        await Tone.start();
        this.log('🎵 Tone.js context started', 'success');
      }
      
      // Start visualizer audio connection
      if (this.visualizer) {
        this.visualizer.startAudio();
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
      this.updateStatus('PLAYING');
      this.log('🎵 Playing!', 'success');
      
    } catch (error) {
      this.log(`❌ Error: ${error.message}`, 'error');
      console.error('Playback error:', error);
      this.isPlaying = false;
      this.updatePlaybackUI();
      this.updateStatus('ERROR');
    }
  },
  
  async stop() {
    if (!this.isPlaying) return;
    
    if (this.silence) {
      this.silence();
    }
    
    this.isPlaying = false;
    this.updatePlaybackUI();
    this.updateStatus('STOPPED');
    this.log('⏹️ Stopped', 'info');
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
  
  updateStatus(status) {
    if (this.statusIndicator) {
      this.statusIndicator.textContent = status;
      
      // Color coding
      const colors = {
        'READY': '#00ff00',
        'PLAYING': '#ffff00',
        'STOPPED': '#888',
        'ERROR': '#ff0000',
        'INITIALIZING': '#00ffff'
      };
      
      this.statusIndicator.style.borderColor = colors[status] || '#00ff00';
    }
  },
  
  // ============================================
  // EVENT LISTENERS
  // ============================================
  
  setupEventListeners() {
    // Playback controls
    this.playBtn.addEventListener('click', () => this.play());
    this.stopBtn.addEventListener('click', () => this.stop());
    
    // Pattern loading
    this.patternSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        this.loadPattern(e.target.value);
      }
    });
    
    // Visual preset
    this.vizPreset.addEventListener('change', (e) => {
      if (this.visualizer) {
        this.visualizer.setPreset(e.target.value);
        this.log(`🎨 Visual preset: ${e.target.value}`, 'info');
      }
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
    });
    
    this.log('⌨️ Keyboard shortcuts enabled (Ctrl+Enter to play, Ctrl+. to stop)', 'info');
  },
  
  // ============================================
  // CONSOLE/LOGGING
  // ============================================
  
  log(message, type = 'info') {
    const timestamp = `[${new Date().toLocaleTimeString()}]`;
    console.log(`${timestamp} ${message}`);
    
    if (this.console) {
      try {
        const line = document.createElement('div');
        line.className = `console-line ${type}`;
        line.textContent = `${timestamp} ${message}`;
        this.console.appendChild(line);
        this.console.scrollTop = this.console.scrollHeight;
        
        // Keep console manageable
        while (this.console.children.length > 50) {
          this.console.removeChild(this.console.firstChild);
        }
      } catch (error) {
        // Silently fail if console has issues
      }
    }
  }
};

// ============================================
// START APPLICATION
// ============================================

// Wait for DOM and libraries
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Wait for p5 and Tone to load
    const checkLibraries = setInterval(() => {
      if (typeof p5 !== 'undefined' && typeof Tone !== 'undefined') {
        clearInterval(checkLibraries);
        App.init();
      }
    }, 100);
    
    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkLibraries);
      if (typeof p5 === 'undefined' || typeof Tone === 'undefined') {
        App.log('❌ Libraries failed to load', 'error');
      }
    }, 10000);
  });
} else {
  // DOM already ready
  const checkLibraries = setInterval(() => {
    if (typeof p5 !== 'undefined' && typeof Tone !== 'undefined') {
      clearInterval(checkLibraries);
      App.init();
    }
  }, 100);
  
  setTimeout(() => {
    clearInterval(checkLibraries);
    if (typeof p5 === 'undefined' || typeof Tone === 'undefined') {
      App.log('❌ Libraries failed to load', 'error');
    }
  }, 10000);
}

