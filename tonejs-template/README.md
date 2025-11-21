# Tone.js Template

A simple, clean starter template for creating music with Tone.js.

## What's Included

- **index.html** - Clean interface with play/stop controls
- **script.js** - Example techno pattern with:
  - Kick drum (four on the floor)
  - Snare (on beats 2 and 4)
  - Hi-hats (rolling eighth notes)
  - Bass synth (simple riff)
  - 128 BPM tempo

## Quick Start

1. Open `index.html` in your browser
2. Click **play** to start the music
3. Click **stop** to stop

## Design

This template follows the UNISEX XL UI Design Guide:
- Times New Roman typography
- White background with black text
- Simple text links with underline on hover
- Minimal decoration, no rounded corners

## How to Customize

Edit `script.js` to create your own patterns:

### Change the BPM
```javascript
Tone.Transport.bpm.value = 140; // Your desired BPM
```

### Modify Patterns
The patterns use Tone.Sequence - edit the arrays:
```javascript
const kickPattern = new Tone.Sequence(
    (time, note) => {
        kick.triggerAttackRelease("C1", "8n", time);
    },
    ["C1", null, "C1", null], // Your pattern here
    "8n" // Timing (8th notes)
);
```

### Add New Instruments
```javascript
const mysynth = new Tone.Synth().toDestination();

const myPattern = new Tone.Sequence(
    (time, note) => {
        mysynth.triggerAttackRelease(note, "8n", time);
    },
    ["C4", "E4", "G4", "B4"],
    "4n"
);
```

### Start Your New Pattern
```javascript
myPattern.start(0);
```

## Tone.js Resources

- [Tone.js Docs](https://tonejs.github.io/)
- [Tone.js Examples](https://tonejs.github.io/examples/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

## Tips

- Open browser console (F12) to see debug messages
- Refresh page after editing script.js
- Try different synthesizers (Synth, MonoSynth, FMSynth, AMSynth)
- Experiment with effects (Reverb, Delay, Distortion, Filter)
- Use Tone.Loop for more complex timing patterns

## Example Modifications

### Add Reverb
```javascript
const reverb = new Tone.Reverb(2).toDestination();
bass.connect(reverb);
```

### Change Bass Notes
```javascript
const bassPattern = new Tone.Sequence(
    (time, note) => {
        if (note) {
            bass.triggerAttackRelease(note, "8n", time);
        }
    },
    ["E1", null, "E1", "G1", "A1", null, "D1", "E1"], // New pattern
    "8n"
);
```

### Add a Melody
```javascript
const melody = new Tone.Synth({
    oscillator: { type: "triangle" }
}).toDestination();

const melodyPattern = new Tone.Sequence(
    (time, note) => {
        if (note) {
            melody.triggerAttackRelease(note, "8n", time);
        }
    },
    ["C4", "E4", null, "G4", "A4", null, "G4", "E4"],
    "8n"
);

// Don't forget to start it in the play button handler!
melodyPattern.start(0);
```

## License

Free to use for any purpose.
