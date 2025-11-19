# UNISEX XL Patterns

This folder contains musical patterns and compositions for both Tone.js and Strudel live coding modes.

## 📁 Folder Structure

```
patterns/
├── strudel/           # Strudel mini-notation patterns
│   ├── techno/        # Techno and industrial patterns
│   ├── experimental/  # Experimental compositions
│   └── der-der/       # Der-der track versions
└── tonejs/            # Tone.js JavaScript patterns
    └── track-1/       # Track 1 variations
```

## 🎵 Strudel Patterns

### Techno (`strudel/techno/`)
- **berlin-techno.strudel** - Berlin-style techno pattern
- **industrial-157bpm.strudel** - Industrial techno at 157 BPM (0.654 CPS)
- **techno-roland.strudel** - Roland-inspired techno groove
- **industrial-pattern.md** - Documentation for industrial patterns

### Experimental (`strudel/experimental/`)
- **chord-layer-progression.strudel** - Chord progressions and layering
- **visualizers.strudel** - Visual programming experiments

### Der-der (`strudel/der-der/`)
- **v1.strudel** - First version using Strudel syntax
- **v2.strudel** - Enhanced version with custom samples
- **v1.js** - JavaScript hybrid version

## 🎹 Tone.js Patterns

### Track 1 (`tonejs/track-1/`)
- **basic.js** - Basic Tone.js pattern with sequences
- **with-sliders.js** - Interactive pattern controlled by UI sliders
- **hybrid.js** - Combination of Tone.js and Strudel concepts
- **hybrid-documented.js** - Well-documented hybrid approach

## 📝 File Naming Conventions

### Strudel Files
- **Extension**: `.strudel` for Strudel mini-notation code
- **Format**: `descriptive-name.strudel`
- **Example**: `berlin-techno.strudel`

### Tone.js Files
- **Extension**: `.js` for JavaScript code
- **Format**: `descriptive-name.js`
- **Example**: `basic.js`

### Documentation Files
- **Extension**: `.md` for Markdown documentation
- **Format**: `descriptive-name.md`
- **Example**: `industrial-pattern.md`

### Version Suffixes
When creating multiple versions of the same pattern:
- Use `-v1`, `-v2`, `-v3` etc.
- Or use semantic names: `-basic`, `-enhanced`, `-final`

## 🏷️ Pattern Metadata Format

Each pattern should include header comments with metadata:

### Strudel Pattern Template
```javascript
// Title: Industrial Techno
// BPM: 157
// CPS: 0.654
// Key: B minor
// Genre: Industrial Techno
// Author: [Your Name]
// Description: Heavy industrial techno with distorted bass and aggressive drums
// Created: 2024-11-18

setcps(0.654)

stack(
  // Your pattern here
)
```

### Tone.js Pattern Template
```javascript
/**
 * Title: Basic Melody
 * BPM: 120
 * Key: C major
 * Genre: Ambient
 * Author: [Your Name]
 * Description: Simple melodic sequence with ambient pads
 * Created: 2024-11-18
 */

const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '8n', time);
}, ['C4', 'E4', 'G4', 'B4'], '4n');

melody.start(0);
```

## 🔧 How to Use Patterns

### Loading in Tone.js Mode
1. Open `index.html` in your browser
2. Copy pattern code from `tonejs/` folder
3. Paste into the editor
4. Press **Run** or `Cmd/Ctrl+Enter`

### Loading in Strudel Mode
1. Open `strudel.html` in your browser
2. Copy pattern code from `strudel/` folder
3. Paste into the editor
4. Press **Run** or `Cmd/Ctrl+Enter`

## 🎼 Pattern Categories

### Techno
Fast-paced electronic music with 4/4 kick drums, typically 120-140 BPM.

### Industrial
Aggressive, distorted sounds with heavy processing, typically 150-170 BPM.

### Experimental
Patterns exploring unusual techniques, generative algorithms, or sound design.

### Hybrid
Patterns combining both Tone.js and Strudel concepts or syntax.

## 📚 Learning Resources

### Strudel
- [Strudel Documentation](https://strudel.tidalcycles.org/)
- [TidalCycles Patterns](https://tidalcycles.org/docs/patternlib/tutorials/pattern)
- Mini-notation guide in pattern comments

### Tone.js
- [Tone.js Documentation](https://tonejs.github.io/)
- [Tone.js Examples](https://tonejs.github.io/examples/)
- [Web Audio API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## 🤝 Contributing Patterns

When adding new patterns:

1. **Choose the right folder** - `strudel/` or `tonejs/`
2. **Use proper file extensions** - `.strudel` or `.js`
3. **Include metadata** - Title, BPM, key, genre, author
4. **Add comments** - Explain complex sections
5. **Test thoroughly** - Ensure pattern plays without errors
6. **Document parameters** - Note any custom sliders or controls

## 📊 Pattern Statistics

- **Total Patterns**: 16
  - Strudel: 8 files
  - Tone.js: 8 files
- **Genres**: Techno, Industrial, Experimental, Ambient, Drum & Bass
- **BPM Range**: 120-202 (techno to DnB)

## 🔗 Related Files

- `/samples/` - Audio samples used in patterns
- `/samples.md` - Documentation for available samples
- `/src/utils/examples.ts` - Built-in example patterns
