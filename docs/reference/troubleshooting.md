# Troubleshooting Guide

Common problems and solutions for Tone.js and Strudel.

## Quick Diagnostic Checklist

```javascript
// Run this to check your setup:
console.log("1. Audio Context:", Tone.context.state);
console.log("2. Transport State:", Tone.Transport.state);
console.log("3. BPM:", Tone.Transport.bpm.value);
console.log("4. Position:", Tone.Transport.position);

// Expected output:
// 1. Audio Context: "running"
// 2. Transport State: "started"
// 3. BPM: 120 (or your tempo)
// 4. Position: "0:0:0" (or current position)
```

---

## No Sound

### Problem: Nothing plays, complete silence

**Checklist:**

1. **Did you call `Tone.start()`?**
   ```javascript
   // REQUIRED before any audio
   await Tone.start();
   console.log("Audio ready!");
   ```

2. **Is Transport running?**
   ```javascript
   Tone.Transport.start();
   
   // Check state
   console.log(Tone.Transport.state); // Should be "started"
   ```

3. **Is audio connected to output?**
   ```javascript
   // Make sure synth connects to destination
   synth.toDestination();
   
   // OR explicitly
   synth.connect(Tone.Destination);
   ```

4. **Is volume too low?**
   ```javascript
   synth.volume.value = 0;  // 0dB = maximum
   // Negative values = quieter
   ```

5. **Check browser console for errors**
   - Press F12 (Chrome/Firefox)
   - Look for red error messages
   - Common: "AudioContext suspended" → call `Tone.start()`

---

## Tone.js Specific Issues

### Pattern Doesn't Loop

**Problem:** Sequence plays once then stops

**Solution:**
```javascript
// Make sure .start(0) is called
const seq = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, "8n", time);
}, ["C4", "E4", "G4"], "8n").start(0); // ← Don't forget!

// And Transport is started
Tone.Transport.start();
```

### Timing Feels Off

**Problem:** Notes play at wrong times or feel delayed

**Solution:**
```javascript
// 1. Use the 'time' parameter
const loop = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "8n", time); // ← Pass 'time'
}, "4n");

// DON'T do this:
const loop = new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "8n"); // ✗ Missing time parameter
}, "4n");

// 2. Reduce latency
Tone.context.latencyHint = "interactive";
```

### Clicks/Pops in Audio

**Problem:** Crackling or popping sounds

**Solution:**
```javascript
// 1. Use envelope releases
synth.envelope.release = 0.1; // Fade out slightly

// 2. Add volume ramping
synth.volume.rampTo(-12, 0.01); // Quick ramp

// 3. Increase buffer size
Tone.context.latencyHint = "playback"; // More buffer

// 4. Use limiter to prevent clipping
const limiter = new Tone.Limiter(-1).toDestination();
synth.connect(limiter);
```

### Effects Not Heard

**Problem:** Added effects but sound unchanged

**Solution:**
```javascript
// 1. Check signal chain
synth.chain(reverb, Tone.Destination); // ✓ Correct

// NOT:
synth.toDestination();
reverb.toDestination(); // ✗ Parallel, not chained

// 2. Check wet/dry mix
reverb.wet.value = 0.5; // Should be > 0

// 3. Check effect parameters
console.log(reverb.decay); // Check it's not 0
```

### Memory Leaks / Performance Issues

**Problem:** App gets slower over time

**Solution:**
```javascript
// Dispose of unused instruments
synth.dispose();
seq.dispose();

// Stop and clear Transport
Tone.Transport.stop();
Tone.Transport.cancel(); // Clear scheduled events

// Clear loops
loop.stop();
loop.dispose();
```

---

## Strudel Specific Issues

### Samples Not Loading

**Problem:** Custom samples don't play

**Checklist:**

1. **Correct folder structure?**
   ```
   ✓ samples/kick/Kit01_Kick.wav
   ✗ samples/Kit01_Kick.wav
   ```

2. **Folder name matches code?**
   ```javascript
   // Folder: samples/kick/
   s("kick") // ✓ Correct
   
   // NOT:
   s("Kit01_Kick") // ✗ Wrong
   ```

3. **Samples loaded in UI?**
   - Click "Load Samples" button
   - Select your `samples/` folder
   - Wait for confirmation

4. **Check browser console**
   - F12 → Console tab
   - Look for 404 errors (file not found)

### Pattern Not Playing

**Problem:** Code runs but no sound

**Solution:**
```javascript
// 1. Check tempo is set
setcps(0.5) // Must set tempo

// 2. Verify pattern syntax
s("bd sd bd sd") // ✓ Correct
s(bd sd bd sd)   // ✗ Missing quotes

// 3. Check for errors in console
// F12 → Console → look for red errors

// 4. Try simplest possible pattern
s("bd") // Should at least play one kick
```

### Timing Feels Wrong

**Problem:** Pattern doesn't sync or feels off

**Solution:**
```javascript
// 1. Verify CPS (tempo)
setcps(0.5) // 120 BPM
// Not: setcps(120) // ✗ Way too fast!

// 2. Check for competing tempo settings
// Only use ONE setcps() per pattern

// 3. Verify pattern length
s("bd sd bd sd") // 4 steps = 1 cycle
s("bd sd bd sd").slow(2) // 2 cycles
```

### Sliders Not Working

**Problem:** Sliders appear but don't affect sound

**Solution:**
```javascript
// Make sure slider is actually connected
note("c4")
  .s("sawtooth")
  .lpf(slider(800, 200, 2000)) // ✓ Connected

// NOT:
slider(800, 200, 2000) // ✗ Not connected to anything
note("c4").s("sawtooth").lpf(800)
```

### Visualizations Not Showing

**Problem:** `_punchcard()` or `_scope()` not visible

**Solution:**
```javascript
// 1. Make sure visualization is last
s("bd sd bd sd")
  .lpf(1000)
  ._punchcard() // ✓ Last in chain

// 2. Check visualization syntax
._punchcard({
  labels: 1,
  cycles: 2
}) // ✓ Correct options

// 3. One visualization per pattern
// Can't use multiple on same pattern
```

---

## JavaScript Errors

### "Uncaught ReferenceError: X is not defined"

**Problem:** Variable or function doesn't exist

**Example:**
```
Uncaught ReferenceError: synth is not defined
```

**Solution:**
```javascript
// Make sure variable is declared BEFORE use
const synth = new Tone.Synth().toDestination(); // Declare first
synth.triggerAttackRelease("C4", "8n"); // Then use

// NOT:
synth.triggerAttackRelease("C4", "8n"); // ✗ synth doesn't exist yet
const synth = new Tone.Synth().toDestination();
```

### "Uncaught TypeError: Cannot read property 'X' of undefined"

**Problem:** Trying to access property of undefined variable

**Example:**
```
TypeError: Cannot read property 'start' of undefined
```

**Solution:**
```javascript
// Check variable is assigned
console.log(loop); // undefined?

// Make sure function returns value
const loop = new Tone.Loop(...); // ✓ Returns loop object
loop.start(); // Now this works
```

### "Uncaught SyntaxError: Unexpected token"

**Problem:** Code syntax error (typo, missing bracket, etc.)

**Solution:**
```javascript
// Check matching brackets
const seq = new Tone.Sequence(...) // ✗ Missing closing )
const seq = new Tone.Sequence(...)) // ✗ Extra )
const seq = new Tone.Sequence(...) // ✓ Correct

// Check commas
["C4" "E4"] // ✗ Missing comma
["C4", "E4"] // ✓ Correct
```

---

## Audio Context Issues

### "The AudioContext was not allowed to start"

**Problem:** Browser blocks audio without user interaction

**Solution:**
```javascript
// Must be triggered by user action (click, keypress)
document.addEventListener('click', async () => {
  await Tone.start();
  console.log("Audio ready!");
});

// Or add a "Start Audio" button
// <button onclick="Tone.start()">Start Audio</button>
```

### "AudioContext is suspended"

**Problem:** Browser suspended audio context

**Solution:**
```javascript
// Resume context
if (Tone.context.state !== 'running') {
  await Tone.context.resume();
}

// Or restart
await Tone.start();
```

---

## Performance Issues

### Choppy/Stuttering Audio

**Causes & Solutions:**

1. **Too many simultaneous effects**
   ```javascript
   // Reduce number of effects in chain
   synth.chain(reverb, Tone.Destination); // ✓ Lighter
   
   // Instead of:
   synth.chain(chorus, delay, reverb, phaser, Tone.Destination); // ✗ Heavy
   ```

2. **Too many voices**
   ```javascript
   // Limit polyphony
   const poly = new Tone.PolySynth({
     maxPolyphony: 4 // Limit to 4 voices
   });
   ```

3. **Increase buffer size**
   ```javascript
   Tone.context.latencyHint = "playback"; // Larger buffer
   ```

4. **Close other tabs/applications**
   - Browser audio processing is CPU-intensive
   - Close unnecessary tabs

---

## Common Mistakes

### Mistake 1: Forgetting to Start Transport

```javascript
// ✗ WRONG - Transport never started
const seq = new Tone.Sequence(...).start(0);
// Nothing plays!

// ✓ CORRECT
const seq = new Tone.Sequence(...).start(0);
Tone.Transport.start(); // Start the clock!
```

### Mistake 2: Wrong Time Parameter

```javascript
// ✗ WRONG - Not using 'time' parameter
new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "8n"); // Out of sync!
}, "4n");

// ✓ CORRECT
new Tone.Loop((time) => {
  synth.triggerAttackRelease("C4", "8n", time); // In sync!
}, "4n");
```

### Mistake 3: Breaking Signal Chain

```javascript
// ✗ WRONG - Parallel, not series
synth.toDestination();
reverb.toDestination();
// Reverb isn't in the signal path!

// ✓ CORRECT
synth.connect(reverb);
reverb.toDestination();
// Or: synth.chain(reverb, Tone.Destination);
```

### Mistake 4: Not Disposing Resources

```javascript
// ✗ WRONG - Memory leak
for (let i = 0; i < 100; i++) {
  const synth = new Tone.Synth();
  // Creates 100 synths, never cleaned up!
}

// ✓ CORRECT
const synth = new Tone.Synth();
// Reuse same synth
// Or dispose when done:
synth.dispose();
```

### Mistake 5: Wrong Note Format

```javascript
// ✗ WRONG
triggerAttackRelease("C", "8n") // Missing octave
triggerAttackRelease("c4", "8n") // Lowercase (works but inconsistent)
triggerAttackRelease("C-4", "8n") // Wrong separator

// ✓ CORRECT
triggerAttackRelease("C4", "8n") // Uppercase + octave number
```

---

## Browser-Specific Issues

### Safari

**Problem:** Audio doesn't work in Safari

**Solutions:**
- Ensure `Tone.start()` called on user interaction
- Update to latest Safari version
- Try different latencyHint: `Tone.context.latencyHint = "playback"`

### Firefox

**Problem:** Glitchy audio in Firefox

**Solutions:**
- Check microphone permissions aren't blocking audio
- Increase buffer size: `Tone.context.latencyHint = "playback"`
- Update Firefox to latest version

### Mobile Browsers

**Problem:** Audio issues on mobile (iOS/Android)

**Solutions:**
- Always require user tap before audio
- Use simpler effect chains (limited CPU)
- Test on actual device (not just simulator)
- iOS requires muted autoplay: Set initial gain to 0, then ramp up

---

## Debug Tools

### Console Logging

```javascript
// Log synth state
console.log("Volume:", synth.volume.value);
console.log("Envelope:", synth.envelope);
console.log("Oscillator type:", synth.oscillator.type);

// Log Transport state
console.log("BPM:", Tone.Transport.bpm.value);
console.log("Position:", Tone.Transport.position);
console.log("State:", Tone.Transport.state);

// Log effect parameters
console.log("Reverb decay:", reverb.decay);
console.log("Reverb wet:", reverb.wet.value);
```

### Test Individual Components

```javascript
// Test synth alone
const synth = new Tone.Synth().toDestination();
synth.triggerAttackRelease("C4", "8n"); // Hear it?

// Test effect alone
const reverb = new Tone.Reverb(2).toDestination();
// Connect test tone
const osc = new Tone.Oscillator(440).connect(reverb);
osc.start();
setTimeout(() => osc.stop(), 1000); // Play 1 second
```

### Simplified Pattern

```javascript
// If complex pattern fails, try simplest version:
s("bd") // Just one sound

// Then build up:
s("bd sd") // Two sounds
s("bd sd bd sd") // Full pattern
s("bd sd bd sd").lpf(1000) // Add effects
```

---

## Getting Help

### Include This Info When Asking for Help

1. **What you're trying to do**
2. **Your code** (simplified example)
3. **Error message** (from browser console)
4. **What you've tried** already
5. **Browser and version**

**Example:**
```
I'm trying to create a bass pattern but it doesn't play.

Code:
const bass = new Tone.FMSynth().toDestination();
const pattern = new Tone.Sequence(...).start(0);

Error in console:
"Uncaught TypeError: Cannot read property 'start' of undefined"

I've tried:
- Calling Tone.start()
- Checking Transport.start()

Browser: Chrome 120
```

### Resources

- **Tone.js Forum**: https://github.com/Tonejs/Tone.js/discussions
- **Strudel Discord**: https://discord.gg/strudel (check Strudel website)
- **MDN Web Audio API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **Stack Overflow**: Tag questions with `tone.js` or `strudel`

---

## Quick Fixes Summary

| Problem | Quick Fix |
|---------|-----------|
| No sound | `await Tone.start()` then `Transport.start()` |
| Pattern won't loop | Add `.start(0)` to sequence |
| Timing off | Use `time` parameter in callbacks |
| Clicks/pops | Add envelope release: `synth.envelope.release = 0.1` |
| Effect not heard | Check `wet` value > 0 and signal chain |
| Memory leak | Call `.dispose()` on unused synths |
| Samples won't load | Check folder structure and names |
| Slider not working | Connect it to a parameter: `.lpf(slider(...))` |
| Audio suspended | Call `Tone.start()` on user click |
| Too slow/laggy | Reduce effect chain, increase buffer size |

---

## Next Steps

- Review [Tone Basics](./tone-basics.md) for fundamentals
- Check [Strudel Basics](./strudel-basics.md) for syntax
- Try [Templates](./templates.md) that work for sure
- Learn [Timing](./timing.md) for rhythm issues
