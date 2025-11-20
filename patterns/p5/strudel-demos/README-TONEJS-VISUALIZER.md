# 🎵 Tone.js Audio-Reactive ASCII Visualizer

A real-time audio visualizer that analyzes Tone.js output and animates ASCII art based on frequency content. Perfect for live coding performances with Strudel or Tone.js!

## 🚀 Quick Start

### Option 1: Split-Screen Demo (RECOMMENDED for Live Performance)
Open `demo-with-strudel.html` for an all-in-one experience:
- **Left Panel**: Strudel live coding editor
- **Right Panel**: Audio-reactive ASCII visualizer
- **Single Page**: Everything works together seamlessly

**Instructions:**
1. Open `demo-with-strudel.html` in your browser
2. Click "START PATTERN" (left side) to play the industrial track
3. Click "START VISUALIZER" (right side) to enable visual analysis
4. Watch the ASCII art dance to your music! 🎉

### Option 2: Separate Tabs (Testing Setup)
Use separate pages for music and visuals:

**Tab 1 - Music:**
1. Open `test-tonejs.html`
2. Click "START TEST PATTERN" (157 BPM industrial beat)

**Tab 2 - Visualizer:**
1. Open `image-ascii-color-bold.html`
2. Click "START TONE.JS AUDIO"
3. The visualizer will analyze audio from ANY Tone.js output in your browser!

### Option 3: Your Own Strudel/Tone.js Code
1. Open your existing Strudel or Tone.js project in one tab
2. Open `image-ascii-color-bold.html` in another tab
3. Start both - the visualizer automatically detects Tone.js audio!

---

## 🎨 Visual Effects

### Frequency-Based Reactions
| Frequency Range | Visual Effect | Best For |
|----------------|---------------|----------|
| **Bass** (20-250 Hz) | Pulses character size, boosts RED | Kick drums, bass synths |
| **Mid** (250-4000 Hz) | Wave patterns, boosts GREEN | Snares, vocals, leads |
| **Treble** (4000-20000 Hz) | White sparkles, boosts BLUE | Hi-hats, cymbals, effects |
| **Volume** | Overall brightness modulation | Dynamic range, builds |

### Character Effects
- **Size Pulsing**: Bass frequencies make characters pulse larger
- **Wave Motion**: Mid frequencies create flowing wave patterns
- **Color Shifting**: Each frequency range boosts different RGB channels
- **Stroke Weight**: Volume affects outline thickness
- **Sparkle Mode**: High treble adds white outlines for shimmer

---

## 🔧 Technical Details

### Audio Analysis
- **FFT Size**: 512 bins for detailed frequency analysis
- **Smoothing**: 0.8 smoothing factor to reduce jitter
- **Sample Rate**: Adapts to your system (typically 48kHz)
- **Latency**: Near-zero latency (direct Tone.Destination connection)

### Connection Architecture
```
Your Code → Tone.Destination → FFT Analyzer → Visual Effects
                             → Meter       → Brightness
                             → Waveform    → Future features
```

### Files Overview
```
p5js/
├── image-ascii-color-bold.html       # Main visualizer page
├── image-ascii-color-bold.js         # Visualizer logic (Tone.js version)
├── demo-with-strudel.html            # All-in-one split-screen demo
├── test-tonejs.html                  # Simple Tone.js test pattern
├── img/dandy.jpg                     # Source image for ASCII art
├── libraries/
│   └── p5.min.js                     # p5.js graphics library
└── README-TONEJS-VISUALIZER.md       # This file
```

---

## 🎹 Live Performance Setup

### Recommended Workflow

**Single-Screen Setup:**
```
1. Open demo-with-strudel.html in fullscreen
2. Edit code on the left
3. Press Ctrl+Enter to run (or click START)
4. Visuals react in real-time on the right
```

**Dual-Monitor Setup:**
```
Monitor 1: Your Strudel/Tone.js code editor
Monitor 2: image-ascii-color-bold.html (fullscreen visualizer)
```

**Projection Setup:**
```
Laptop: Control music and code
Projector: Display image-ascii-color-bold.html for audience
```

### Performance Tips
1. **Start visualizer AFTER starting audio** - ensures proper Tone.js initialization
2. **Use heavy bass** - industrial, techno, drum & bass work best
3. **Build dynamics** - contrast between quiet and loud sections looks amazing
4. **Adjust sensitivity** - see customization section below

---

## ⚙️ Customization

### Sensitivity Adjustments

**In `image-ascii-color-bold.js`:**

```javascript
// Line 169 - Overall sensitivity
return constrain(average * 800, 0, 255);
// Increase multiplier (e.g., 1000) for more reaction
// Decrease (e.g., 600) for subtler effects

// Line 243 - Bass pulse intensity
let bassPulse = map(bassSmooth, 0, 255, 1.0, 1.3);
//                                        ^^^  ^^^
//                                        min  max size multiplier

// Lines 268, 271, 274 - Color boost amounts
r = r + map(bassSmooth, 0, 255, 0, 40);  // Bass → RED
g = g + map(mid, 0, 255, 0, 30);         // Mid → GREEN
b = b + map(treble, 0, 255, 0, 35);      // Treble → BLUE
//                              ^^
//                              Increase for more color intensity
```

### Frequency Range Adjustments

```javascript
// Lines 34-36
const BASS_RANGE = [20, 250];      // Lower = deeper bass only
const MID_RANGE = [250, 4000];     // Adjust for vocals/leads
const TREBLE_RANGE = [4000, 20000]; // Higher = only brightest highs
```

### Animation Speed

```javascript
// Line 247 - Wave pattern speed
let wave = sin((i + j) * 0.1 + frameCount * 0.05) * 0.5 + 0.5;
//                                            ^^^^
//                                            Increase for faster waves
```

### Hide Debug Display

```javascript
// Line 287 - Comment out to hide audio level meters
// drawAudioDebug();
```

---

## 🎵 Works With

### ✅ Compatible
- Strudel patterns (all formats)
- Tone.js synthesizers
- Tone.js samplers
- Tone.js effects chains
- Any audio routed through `Tone.Destination`

### ❌ Not Compatible
- Regular `<audio>` elements (use Tone.Player to wrap them)
- Web Audio API directly (must use Tone.js)
- External audio sources (use `test-tonejs.html` approach)

---

## 🐛 Troubleshooting

### Visualizer Not Reacting
1. **Check audio is playing** - You should hear sound
2. **Start visualizer AFTER audio** - Click "START TONE.JS AUDIO" after music starts
3. **Check console** - Open browser DevTools (F12) for error messages
4. **Try test pattern** - Use `test-tonejs.html` to verify setup

### Low/No Visual Response
1. **Increase sensitivity** - See customization section (Line 169)
2. **Add more bass/treble** - Mid-heavy music has less visual impact
3. **Check volume** - Louder music = more reaction
4. **Try the demo** - `demo-with-strudel.html` is pre-configured

### Audio Latency
- **Should be near-zero** - Direct connection to Tone.Destination
- **If delayed** - Close other tabs using audio
- **System lag** - Try reducing canvas resolution (adjust `w` and `h` variables)

### Browser Compatibility
- **Chrome/Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ⚠️ May require user interaction for audio start

---

## 🎨 Image Customization

Want to use your own image?

1. Place your image in `p5js/img/` folder
2. Name it something memorable (e.g., `myface.jpg`)
3. Edit `image-ascii-color-bold.js` line 21:

```javascript
// Change this:
img = loadImage("img/dandy.jpg");

// To this:
img = loadImage("img/myface.jpg");
```

**Best Results:**
- High contrast images work best
- Faces, portraits, logos are ideal
- Square or portrait orientation preferred
- Resolution: 800x800 or larger

---

## 🔥 Pro Tips

1. **Industrial/Heavy Bass** - Your 157 BPM pattern will look AMAZING
2. **Build Dynamics** - Start quiet, build to drop for dramatic effect
3. **Filter Sweeps** - Moving from bass → treble creates flowing motion
4. **Rhythmic Patterns** - Syncopated rhythms = interesting wave patterns
5. **Live Coding** - Edit code on the fly, effects update in real-time

---

## 📝 Credits

- **p5.js** - Graphics rendering
- **Tone.js** - Audio analysis and synthesis
- **Strudel** - Live coding music notation
- **Original Concept** - Audio-reactive ASCII art with microphone
- **Tone.js Integration** - Converted for live performance use

---

## 🚀 Next Steps

Ready to perform? Try these:

1. **Test the demo** - `demo-with-strudel.html`
2. **Load your pattern** - Replace the Strudel code with yours
3. **Customize visuals** - Adjust sensitivity and colors
4. **Go fullscreen** - Press F11 for immersive experience
5. **Perform live** - Code music, watch visuals react!

**Have fun and make some noise! 🎵🔥**

