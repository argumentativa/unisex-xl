# P5.js Patterns & Demos

All P5.js visual patterns and demos consolidated in one place.

## Quick Access

**Browse all demos**: [index.html](./index.html)

## 📁 Directory Structure

```
patterns/p5/
├── image-ascii/         # Image-based ASCII art (10 demos)
├── video-ascii/         # Webcam ASCII art (3 demos)
├── strudel-demos/       # Strudel integration demos
├── audio-reactive/      # Audio-reactive patterns
├── circles/             # Circles pattern
├── faces/               # Face detection pattern
├── snore/               # Video pattern example
├── misc/                # Experimental demos
└── demos-legacy/        # Legacy demo files
```

## Featured Demos ⭐

### 🎵 Strudel + ASCII Visualizer
**[strudel-demos/demo-with-strudel.html](strudel-demos/demo-with-strudel.html)**
- Full split-screen interface
- Live coding editor (Strudel) + ASCII visualizer
- Industrial techno pattern (157 BPM)
- Keyboard shortcuts: `Ctrl+Enter` to play, `Ctrl+.` to stop

### 🖼️ Optimized ASCII Visualizer
**[image-ascii/image-ascii-color-bold-OPTIMIZED.html](image-ascii/image-ascii-color-bold-OPTIMIZED.html)**
- Performance-optimized version
- Audio-reactive with BlackHole/system audio
- Bold colored ASCII characters
- Real-time frequency analysis (bass, mid, treble)

### 🎭 Optimized ASCII (Auto-start)
**[image-ascii/image-ascii-color-bold-OPTIMIZED-autostart.html](image-ascii/image-ascii-color-bold-OPTIMIZED-autostart.html)**
- Same optimization as above, but auto-starts audio
- No button - perfect for live performances
- Clean full-screen visualization

### 🎤 Microphone ASCII
**[image-ascii/image-ascii-color-bold-mic.html](image-ascii/image-ascii-color-bold-mic.html)**
- Uses microphone input for audio reactivity
- No external audio routing needed
- Perfect for live performances

## All Categories

### 🖼️ Image ASCII Art (10 demos)

1. **[image-ascii.html](image-ascii/image-ascii.html)** - Basic monochrome
2. **[image-ascii-color.html](image-ascii/image-ascii-color.html)** - With color
3. **[image-ascii-color-bold.html](image-ascii/image-ascii-color-bold.html)** - Bold + audio reactive ⭐
4. **[image-ascii-color-bold-mic.html](image-ascii/image-ascii-color-bold-mic.html)** - Microphone input 🎤
5. **[image-ascii-color-bold-OPTIMIZED.html](image-ascii/image-ascii-color-bold-OPTIMIZED.html)** - Performance optimized ⭐
6. **[image-ascii-color-bold-OPTIMIZED-autostart.html](image-ascii/image-ascii-color-bold-OPTIMIZED-autostart.html)** - Auto-start (live performance) 🎭
7. **[image-ascii-color-bold-strudel.html](image-ascii/image-ascii-color-bold-strudel.html)** - Strudel integration 🎵
8. **[man.html](image-ascii/man.html)** - Portrait visualization
9. **[unai.html](image-ascii/unai.html)** - Portrait visualization
10. **[test-audio-devices.html](image-ascii/test-audio-devices.html)** - Audio device testing

### 📹 Video ASCII Art (3 demos)

1. **[index.html](video-ascii/index.html)** - Video ASCII pattern (original)
2. **[video-ascii.html](video-ascii/video-ascii.html)** - Basic webcam ASCII
3. **[video-ascii-bold.html](video-ascii/video-ascii-bold.html)** - Bold version with enhanced contrast

### 🎵 Strudel Integration (2 demos)

1. **[demo-with-strudel.html](strudel-demos/demo-with-strudel.html)** - Full split-screen environment ⭐🎵
2. **[test-tonejs.html](strudel-demos/test-tonejs.html)** - Tone.js test pattern

### 🎪 Pattern Examples

- **[audio-reactive/](audio-reactive/)** - Audio-reactive circles pattern
- **[circles/](circles/)** - Simple circles pattern
- **[faces/](faces/)** - Face detection pattern
- **[snore/](snore/)** - Video playback pattern

### 🧪 Experimental

- **[misc/](misc/)** - Experimental demos
- **[demos-legacy/](demos-legacy/)** - Legacy demo files

## Technical Details

- **Graphics**: p5.js v2.1.1
- **Audio**: Tone.js v15.0.4, p5.sound.js
- **Live Coding**: Strudel (@strudel/repl)
- **ASCII Characters**: Custom density-based character sets
- **Resolution**: Various (64×48 to 128×96)

## Audio Routing

### For BlackHole Audio (macOS)
1. Install [BlackHole](https://github.com/ExistentialAudio/BlackHole)
2. Configure Multi-Output Device in Audio MIDI Setup
3. Select BlackHole as input in demos

### For Microphone
- Use the `-mic.html` versions
- Grant microphone permissions when prompted

## Navigation

- **Main Patterns**: [../README.md](../README.md)
- **Main App**: [../../index.html](../../index.html)

## Performance Tips

- Use OPTIMIZED versions for better performance
- Close unused browser tabs
- Reduce canvas size for lower-end machines
- Disable audio analysis debug overlay if needed

## Migration Notes

This directory consolidates all P5.js demos from:
- `p5js/demos/` (image-ascii, video-ascii, strudel, misc)
- `demos/ascii/` (legacy demos)

All demos are now in one organized location for easier discovery and maintenance.

---

**Legend**: ⭐ Featured | 🎵 Live Coding | 🎤 Microphone Input | 🎭 Live Performance
