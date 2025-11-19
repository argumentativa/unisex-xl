// ========================================
// TEMPO CONTROL
// ========================================
// Set tempo to 157 BPM
// EDIT: Change number to any BPM (60-200 recommended)
// Examples: 120 = house, 140 = techno, 170 = drum & bass
Transport.bpm.value = 157;

// ========================================
// CREATE ALL CUSTOM EFFECTS
// ========================================

// Bass effects chain - Auto-Filter
// Creates sweeping/wobbling filter effect on bass
const bassFilter = new Tone.AutoFilter({
  frequency: "8n",        // EDIT: How fast filter sweeps. Try: "4n" (faster), "16n" (slower), "2n" (very fast)
                          // Options: "1n", "2n", "4n", "8n", "16n" or numbers like 0.5, 1, 2
  baseFrequency: 200,     // EDIT: Starting filter cutoff in Hz. Try: 100 (darker), 400 (brighter)
                          // Range: 20-2000 Hz
  octaves: 2,             // EDIT: How far filter sweeps (in octaves). Try: 1 (subtle), 4 (extreme)
                          // Range: 0.5-8
  filter: {
    type: "lowpass",      // EDIT: Filter type. Options: "lowpass", "highpass", "bandpass", "notch"
    rolloff: -24,         // EDIT: Steepness of filter. Options: -12, -24, -48, -96 (higher = sharper)
    Q: 2                  // EDIT: Filter resonance/emphasis. Try: 1 (smooth), 10 (peaky/resonant)
                          // Range: 0.1-20
  }
}).toDestination().start();

// Bass Distortion - Adds grit and harmonic content
const bassDistortion = new Tone.Distortion(
  0.8                     // EDIT: Distortion amount. Try: 0.3 (mild), 1.5 (heavy), 3 (extreme)
                          // Range: 0-10 (0 = clean, 10 = total destruction)
).connect(bassFilter);

// Synth effects - Phaser
// Creates sweeping, spacey effect
const synthPhaser = new Tone.Phaser({
  frequency: 0.5,         // EDIT: Phaser sweep speed in Hz. Try: 0.2 (slow), 2 (fast)
                          // Range: 0.1-10
  octaves: 3,             // EDIT: Sweep range. Try: 1 (subtle), 6 (dramatic)
                          // Range: 0.5-8
  baseFrequency: 350      // EDIT: Center frequency. Try: 200 (darker), 800 (brighter)
                          // Range: 100-5000 Hz
}).toDestination();

// Ping-Pong Delay - Stereo bouncing echo
const pingPongDelay = new Tone.PingPongDelay({
  delayTime: "8n",        // EDIT: Echo timing. Try: "4n" (faster), "16n" (slower), "8t" (triplet)
                          // Options: "1n", "2n", "4n", "8n", "16n", or seconds like 0.25
  feedback: 0.3,          // EDIT: Echo repeats. Try: 0.1 (few repeats), 0.7 (many repeats)
                          // Range: 0-0.95 (higher = more repeats, be careful above 0.8!)
  wet: 0.4                // EDIT: Effect mix. Try: 0.2 (subtle), 0.8 (dominant)
                          // Range: 0-1 (0 = no effect, 1 = 100% effect)
}).toDestination();

// Tremolo - Volume pulsing effect
const tremolo = new Tone.Tremolo(
  4,                      // EDIT: Pulse speed in Hz. Try: 2 (slow throb), 8 (fast chop)
                          // Range: 0.1-50
  0.5                     // EDIT: Pulse depth. Try: 0.2 (subtle), 0.9 (extreme volume change)
                          // Range: 0-1 (0 = no effect, 1 = full on/off)
).toDestination().start();

// Pad effects - Chorus
// Makes sound wider and thicker
const padChorus = new Tone.Chorus({
  frequency: 1.5,         // EDIT: Modulation speed in Hz. Try: 0.5 (slow), 4 (fast warble)
                          // Range: 0.1-10
  delayTime: 3.5,         // EDIT: Chorus delay in ms. Try: 2 (tight), 8 (wide)
                          // Range: 2-20
  depth: 0.7,             // EDIT: Modulation intensity. Try: 0.3 (subtle), 1 (full)
                          // Range: 0-1
  wet: 0.5                // EDIT: Effect mix. Try: 0.3 (hint), 0.8 (thick)
                          // Range: 0-1
}).toDestination().start();

// Big Reverb - Cathedral-like space
const bigReverb = new Tone.Reverb(
  8                       // EDIT: Decay time in seconds. Try: 2 (room), 4 (hall), 15 (cathedral)
                          // Range: 0.1-20 (higher = longer tail, more washy)
).toDestination();

// Drum effects - Bit Crusher
// Lo-fi digital distortion
const drumCrusher = new Tone.BitCrusher(
  4                       // EDIT: Bit depth. Try: 8 (mild crunch), 2 (extreme degradation), 16 (clean)
                          // Range: 1-16 (1 = most destroyed, 16 = cleanest)
).toDestination();

// ========================================
// CONNECT INSTRUMENTS TO EFFECTS
// ========================================

// Bass → Distortion → Auto-Filter → Output
bass.disconnect();                    // Unplug from default output
bass.connect(bassDistortion);         // Plug into our custom effect chain

// Synth → Phaser + Ping-Pong Delay + Tremolo → Output
synth.disconnect();                   // Unplug from default
synth.fan(synthPhaser, pingPongDelay, tremolo);  // Split signal to 3 effects simultaneously

// Drums → Bit Crusher → Output
drums.disconnect();                   // Unplug from default
drums.connect(drumCrusher);           // Plug into crusher

// ========================================
// INDUSTRIAL BASS PATTERN
// ========================================

// Array of bass notes to play in sequence
// EDIT: Change notes to any valid note (C1-C6). Format: 'NOTE + OCTAVE'
// Examples: 'C2', 'F#3', 'Bb2', 'D1'
const bassNotes = ['B1', 'E2', 'B1', 'D3', 'B1', 'B2', 'B1', 'B1', 
                   'B2', 'B1', 'B2', 'B1', 'B2', 'A2', 'B1', 'B2'];

// Transpose amounts (in semitones) that cycle through the pattern
// EDIT: Add more values or change numbers (positive = up, negative = down)
// Examples: [0, 0, 5, 7] = cycle through 4 values
//           [0, 7, 12] = root, fifth, octave
const transposePattern = [0, 0, 0, 5, 7];
let transposeIndex = 0;               // Tracker for which transpose value to use

// Create the bass sequence
const bassline = new Tone.Sequence((time, note) => {
  // Calculate which transpose value to use (cycles every 16 notes)
  const transpose = transposePattern[Math.floor(transposeIndex / 16) % transposePattern.length];
  
  // Apply transposition to the note
  const transposedNote = Tone.Frequency(note).transpose(transpose).toNote();
  
  // Play the note
  bass.triggerAttackRelease(
    transposedNote,       // The note to play
    '2n',                 // EDIT: Note length. Try: '4n' (shorter), '1n' (longer), '8n' (staccato)
                          // Options: '1n', '2n', '4n', '8n', '16n' (longer to shorter)
    time                  // When to play (provided by Sequence)
  );
  transposeIndex++;
}, 
bassNotes,                // The note array to loop through
'2n'                      // EDIT: How often to trigger next note. Try: '4n' (faster), '1n' (slower)
);

bassline.start(0);        // EDIT: Start time. 0 = immediately, '4m' = after 4 measures

// ========================================
// DRUMS
// ========================================

// Kick drum pattern: plays on beats 1 and 3
const kick = new Tone.Loop((time) => {
  drums.triggerAttackRelease(
    'C1',                 // EDIT: Drum pitch. Try: 'C0' (deeper), 'E1' (higher)
    '16n',                // EDIT: Drum length. Try: '8n' (longer), '32n' (shorter)
    time
  );
}, 
'2n'                      // EDIT: Loop interval. Try: '4n' (faster), '1n' (slower)
);
kick.start(0);            // EDIT: Start time. Try: '1m' to delay entrance

// Snare pattern: plays on beats 2 and 4
const snare = new Tone.Loop((time) => {
  drums.triggerAttackRelease(
    'E1',                 // EDIT: Try: 'G1' (sharper), 'D1' (deeper)
    '16n',                // EDIT: Snare length
    time
  );
}, 
'2n'                      // EDIT: Loop interval
);
snare.start('4n');        // EDIT: Offset timing. '4n' = starts 1 beat later (for backbeat)

// Hi-hat pattern: plays every 3rd beat
const hat = new Tone.Loop((time) => {
  drums.triggerAttackRelease(
    'A1',                 // EDIT: Try: 'C2' (brighter), 'G1' (darker)
    '32n',                // EDIT: Very short for hi-hat. Try: '64n' (sharper)
    time
  );
}, 
'1m'                      // EDIT: Loop interval. Try: '2n' (faster hats), '4n' (busier)
);
hat.start('2n');          // EDIT: Offset. Try: '0' (start immediately), '1m' (after 1 bar)

// ========================================
// SYNTH LAYERS
// ========================================

// Melodic stabs - Rhythmic melody with rests
const synthMelody = new Tone.Sequence((time, note) => {
  if (note !== null) {    // null = rest/silence
    synth.triggerAttackRelease(
      note,               // The note to play
      '16n',              // EDIT: Note length. Try: '8n' (longer), '32n' (staccato)
      time
    );
  }
}, 
[
  // EDIT: Change notes or add more. Use null for rests
  // Try: ['C4', 'E4', null, 'G4'] for different melody
  'B4', null, 'D5', null,
  'F#4', null, 'B4', null,
  'A4', null, 'F#4', null,
  'D5', null, 'B4', null
], 
'8n'                      // EDIT: Step interval. Try: '4n' (slower), '16n' (faster)
);
synthMelody.start(0);     // EDIT: Start time

// Arpeggio - Fast cycling notes
const arp = new Tone.Pattern((time, note) => {
  synth.triggerAttackRelease(
    note, 
    '32n',                // EDIT: Very short notes. Try: '16n' (longer)
    time, 
    0.3                   // EDIT: Velocity (volume). Try: 0.1 (quiet), 0.6 (loud)
                          // Range: 0-1
  );
}, 
['B5', 'D6', 'F#5', 'A5'], // EDIT: Change arpeggio notes
'upDown'                  // EDIT: Pattern direction. Options: 'up', 'down', 'upDown', 'downUp', 'random'
);
arp.start('2m');          // EDIT: Entrance time. Try: '0' (immediate), '4m' (later)

// Pad chord - Sustained atmospheric chord
const padSynth = synth;   // Using same synth instance
const padChord = new Tone.Loop((time) => {
  synth.triggerAttackRelease(
    ['B3', 'D4', 'F#4'],  // EDIT: Chord notes (array). Try: ['C3', 'E3', 'G3'] for C major
    '2m',                 // EDIT: Chord length. Try: '1m' (shorter), '4m' (longer drone)
    time, 
    0.15                  // EDIT: Volume. Try: 0.1 (quieter), 0.3 (louder)
  );
}, 
'2m'                      // EDIT: How often chord repeats
);
padChord.start('4m');     // EDIT: Entrance time. Try: '2m' (earlier), '8m' (later)

// ========================================
// AUTOMATION & MODULATION
// ========================================

// Open bass filter over time - Creates build/energy
Transport.schedule((time) => {
  bassFilter.baseFrequency = 400;  // EDIT: Target frequency. Try: 600 (brighter), 200 (no change)
  console.log('🎛️ Bass filter opened');
}, 
'8m'                      // EDIT: When to trigger. Try: '4m' (sooner), '16m' (later)
);                        // Timing format: '1m' = 1 measure, '4m' = 4 measures

// Increase distortion - Adds intensity over time
Transport.schedule((time) => {
  bassDistortion.distortion = 1.2;  // EDIT: Target amount. Try: 0.5 (decrease), 2 (extreme)
  console.log('🔥 Distortion increased');
}, 
'4m'                      // EDIT: When to trigger
);

// Modulate phaser with LFO - Adds organic movement
const phaserLFO = new Tone.LFO(
  0.1,                    // EDIT: LFO speed in Hz. Try: 0.05 (slower), 0.5 (faster wobble)
                          // Range: 0.01-10
  0.2,                    // EDIT: Minimum LFO value. Range: 0-10
  2                       // EDIT: Maximum LFO value. Range: 0-10
                          // LFO will oscillate between min (0.2) and max (2)
);
phaserLFO.connect(synthPhaser.frequency);
phaserLFO.start();

// Gradually increase bit crushing - More lo-fi over time
Transport.schedule((time) => {
  drumCrusher.bits = 2;   // EDIT: Target bit depth. Try: 1 (extreme), 6 (moderate)
  console.log('💥 Drums heavily crushed');
}, 
'12m'                     // EDIT: When to trigger
);

console.log('🔊 INDUSTRIAL TECHNO - 157 BPM');
console.log('');
console.log('✨ Effects loaded:');
console.log('   BASS: Auto-filter + Distortion (0.8→1.2)');
console.log('   SYNTH: Phaser + Ping-pong delay + Tremolo');
console.log('   DRUMS: Bit crusher (4 bits→2 bits)');
console.log('   PAD: Chorus + Big reverb');
console.log('');
console.log('🎬 Timeline:');
console.log('   0:00 - Pattern starts');
console.log('   0:08 - Arpeggio enters');          // 2m at 157 BPM ≈ 8 seconds
console.log('   0:16 - Pad chord enters');          // 4m ≈ 16 seconds
console.log('   0:16 - Distortion ramps up');
console.log('   0:32 - Filter opens');              // 8m ≈ 32 seconds
console.log('   0:48 - Bit crusher intensifies');   // 12m ≈ 48 seconds