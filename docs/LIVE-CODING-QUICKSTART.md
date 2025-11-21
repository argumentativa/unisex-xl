# 🚀 Live Coding + Visualizer - Quick Start

## Open the App
```
/Users/miguelarias/Code/unisex-xl/live-coding.html
```
Or click **"🎵 Live Coding + Viz"** from any index page

## Basic Workflow

### 1. Load a Pattern
- Click dropdown: **"📁 Load Pattern..."**
- Select: **"Industrial 157 BPM (Advanced)"**

### 2. Play
- Press **`Ctrl+Enter`** (or click ▶️ PLAY)
- Watch the visualization react!

### 3. Experiment
- Edit the code
- Press **`Ctrl+Enter`** to hear changes instantly
- Try different visual presets (dropdown in toolbar)

## Essential Shortcuts

```
Ctrl+Enter    Play/Restart pattern
Ctrl+.        Stop
Ctrl+S        Save pattern
Ctrl+E        Fullscreen visualizer
?             Show all shortcuts
```

## Visual Intensity

Can't see reactions? Switch preset:
- **Aggressive** (default) - Balanced
- **Extreme** - MAXIMUM effect for performances
- **Subtle** - Gentle for studio work

## Modes

Quick switch with toolbar buttons:

**💻 Live Coding** - 50/50 split, all features
**🎤 Performance** - Big visualizer, small editor
**🏭 Studio** - Big editor, full console

## Why It's Better

✅ **No BlackHole setup** - Works instantly
✅ **Obvious reactions** - 0.5-4.0x size changes!
✅ **Pattern library** - Load examples fast
✅ **Keyboard shortcuts** - Professional workflow
✅ **Three modes** - Adapts to your use case

## Troubleshooting

**Not seeing visual reactions?**
1. Pattern is playing? (check console)
2. Visual preset = "Extreme"?
3. Try "Industrial 157 BPM" pattern (strong bass)

**Pattern won't load?**
- Check browser console for errors
- Make sure `.strudel` files exist in `/patterns/`

## Pattern Example

```javascript
cps(0.654) // 157 BPM

stack(
  // Kick - drives the bass pulse
  s("bd ~ bd ~")
    .gain(1.2),
  
  // Bass - creates color shifts
  note("b1 e2 b1 d3")
    .s("sawtooth")
    .lpf(400)
    .gain(0.8),
  
  // Hi-hats - add sparkle
  s("hh*8")
    .hpf(8000)
    .gain(0.4)
)
```

Press **`Ctrl+Enter`** and watch it react!

## Next Steps

1. **Try all patterns** in the library
2. **Experiment** with different visual presets
3. **Save** your creations with `Ctrl+S`
4. **Switch modes** for different workflows
5. **Read full docs**: `LIVE-CODING-README.md`

---

**Enjoy live coding! 🎵✨**

