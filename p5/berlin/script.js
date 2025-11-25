// ========================================
// BERLIN TECHNO - 157 BPM
// Tone.js Version - Simplified (5 Instruments)
// ========================================

// Tone.js is loaded globally via script tag in index.html
const Tone = window.Tone;

// ========================================
// SETUP - BPM & TRANSPORT
// ========================================
Tone.Transport.bpm.value = 157; // setcps(0.654)

// ========================================
// AUDIO SAMPLES - 5 INSTRUMENTS
// ========================================
// Use relative paths from current directory
const kick909 = new Tone.Player("samples/kick/Kit01_Kick.wav");
const kick808 = new Tone.Player("samples/kick/Kit01_Kick.wav"); // Layered with 909
const snare = new Tone.Player("samples/snare/Kit01_Snare.wav");
const hihat = new Tone.Player("samples/hat/Kit01_Hat.wav");
// Bass and Stabs are synthesized (no samples needed)

// ========================================
// EFFECTS CHAINS
// ========================================

// KICK - Layered 909 + 808 (0.7 gain)
const kick909HPF = new Tone.Filter(50, 'highpass');
const kick909LPF = new Tone.Filter(120, 'lowpass');
const kick909Distortion = new Tone.Distortion(0.2);
const kick909Volume = new Tone.Volume(Tone.gainToDb(0.7));

kick909HPF.connect(kick909LPF);
kick909LPF.connect(kick909Distortion);
kick909Distortion.connect(kick909Volume);
kick909Volume.toDestination();
kick909.disconnect();
kick909.connect(kick909HPF);

// KICK 808 - Sub-bass layer (0.4 gain)
const kick808HPF = new Tone.Filter(35, 'highpass');
const kick808LPF = new Tone.Filter(80, 'lowpass');
const kick808Volume = new Tone.Volume(Tone.gainToDb(0.4));

kick808HPF.connect(kick808LPF);
kick808LPF.connect(kick808Volume);
kick808Volume.toDestination();
kick808.disconnect();
kick808.connect(kick808HPF);

// SNARE (0.7 gain)
const snareHPF = new Tone.Filter(200, 'highpass');
const snareLPF = new Tone.Filter(8000, 'lowpass');
const snareDistortion = new Tone.Distortion(0.15);
const snareDelay = new Tone.FeedbackDelay('8n', 0.1);
const snareReverb = new Tone.Reverb(0.1);
const snareVolume = new Tone.Volume(Tone.gainToDb(0.7));

snareHPF.connect(snareLPF);
snareLPF.connect(snareDistortion);
snareDistortion.connect(snareDelay);
snareDelay.connect(snareReverb);
snareReverb.connect(snareVolume);
snareVolume.toDestination();
snare.disconnect();
snare.connect(snareHPF);

// HI-HAT (0.35 gain)
const hihatHPF = new Tone.Filter(6000, 'highpass');
const hihatCrusher = new Tone.BitCrusher(8);
const hihatPanner = new Tone.Panner(0);
const hihatVolume = new Tone.Volume(Tone.gainToDb(0.35));

hihatHPF.connect(hihatCrusher);
hihatCrusher.connect(hihatPanner);
hihatPanner.connect(hihatVolume);
hihatVolume.toDestination();
hihat.disconnect();
hihat.connect(hihatHPF);

// BASS - Sawtooth synth (0.75 gain)
const bassHPF = new Tone.Filter(35, 'highpass');
const bassLPF = new Tone.Filter(400, 'lowpass', -24);
bassLPF.Q.value = 15;
const bassSaturation = new Tone.Distortion(0.5);
const bassCrusher = new Tone.BitCrusher(8);
const bassReverb = new Tone.Reverb(0.05);
const bassVolume = new Tone.Volume(Tone.gainToDb(0.75));

bassHPF.connect(bassLPF);
bassLPF.connect(bassSaturation);
bassSaturation.connect(bassCrusher);
bassCrusher.connect(bassReverb);
bassReverb.connect(bassVolume);
bassVolume.toDestination();

const bass = new Tone.MonoSynth({
  oscillator: { type: 'sawtooth' },
  envelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.3 },
  filterEnvelope: {
    attack: 0.01,
    decay: 0.3,
    sustain: 0.2,
    release: 0.5,
    baseFrequency: 400,
    octaves: 2
  }
}).connect(bassHPF);

// STABS - Supersaw synth (0.5 gain)
const stabsHPF = new Tone.Filter(400, 'highpass');
const stabsLPF = new Tone.Filter(3000, 'lowpass', -24);
stabsLPF.Q.value = 5;
const stabsDistortion = new Tone.Distortion(0.3);
const stabsDelay = new Tone.FeedbackDelay('8n', 0.25);
const stabsReverb = new Tone.Reverb(0.3);
const stabsPanner = new Tone.Panner(0);
const stabsVolume = new Tone.Volume(Tone.gainToDb(0.5));

stabsHPF.connect(stabsLPF);
stabsLPF.connect(stabsDistortion);
stabsDistortion.connect(stabsDelay);
stabsDelay.connect(stabsReverb);
stabsReverb.connect(stabsPanner);
stabsPanner.connect(stabsVolume);
stabsVolume.toDestination();

const stabs = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'sawtooth', count: 7, spread: 40 },
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }
}).connect(stabsHPF);

// ========================================
// MASTER EFFECTS
// ========================================
const masterHPF = new Tone.Filter(35, 'highpass');
const masterLPF = new Tone.Filter(15000, 'lowpass');
const masterDelay = new Tone.FeedbackDelay('8n', 0.25);
const masterReverb = new Tone.Reverb({ decay: 0.5, wet: 0.1 });
const masterVolume = new Tone.Volume(Tone.gainToDb(0.8));

masterHPF.connect(masterLPF);
masterLPF.connect(masterDelay);
masterDelay.connect(masterReverb);
masterReverb.connect(masterVolume);
masterVolume.toDestination();

// ========================================
// PATTERNS (Created in start() after samples load)
// ========================================
let kickPattern, snarePattern, hihatPattern;
let bassSequence, bassTransposeIndex = 0;
let stabsSequence, stabsChordIndex = 0;

// ========================================
// INTERACTIVE CONTROLS
// ========================================

export function setKickGain(value) {
  kick909Volume.volume.value = Tone.gainToDb(value);
}

export function setSnareGain(value) {
  snareVolume.volume.value = Tone.gainToDb(value);
}

export function setHihatGain(value) {
  hihatVolume.volume.value = Tone.gainToDb(value);
}

export function setBassGain(value) {
  bassVolume.volume.value = Tone.gainToDb(value);
}

export function setStabsGain(value) {
  stabsVolume.volume.value = Tone.gainToDb(value);
}

export function setMasterGain(value) {
  masterVolume.volume.value = Tone.gainToDb(value);
}

// ========================================
// PLAYBACK CONTROLS
// ========================================

export async function start() {
  // 1. Initialize audio context
  await Tone.start();
  console.log('Audio context started:', Tone.context.state);

  // 2. Wait for sample buffers to load
  console.log('Loading samples...');
  try {
    await Promise.all([
      Tone.loaded()
    ]);
    console.log('Samples loaded!');
  } catch (error) {
    console.error('Error loading samples:', error);
    throw error;
  }
  
  // 3. Create patterns
  // KICK PATTERN: "bd ~ bd ~" (layered 909 + 808)
  kickPattern = new Tone.Loop((time) => {
    kick909.start(time);
    kick808.start(time);
  }, '2n').start(0);

  // SNARE PATTERN: "~ cp ~ cp" (backbeat)
  snarePattern = new Tone.Pattern((time) => {
    snare.start(time);
  }, [null, 0, null, 0], 'upDown').start(0);
  snarePattern.interval = '4n';

  // HI-HAT PATTERN: "~ ~ hh ~" 
  hihatPattern = new Tone.Pattern((time, index) => {
    if (index !== null) {
      hihat.start(time);
      hihat.playbackRate = 1.5;
    }
  }, [null, null, 0, null], 'up').start(0);
  hihatPattern.interval = '4n';

  // BASS PATTERN
  const bassNotes = [
    'A1', 'A1', 'A2', 'A1', 'A2', 'A1', 'A1', 'E2', 
    'A1', 'G1', 'A1', 'A1', 'A2'
  ];
  const bassTranspose = [0, 0, 0, 5, 7];
  bassTransposeIndex = 0;

  bassSequence = new Tone.Sequence((time, note) => {
    const transpose = bassTranspose[bassTransposeIndex % bassTranspose.length];
    const transposedNote = Tone.Frequency(note).transpose(transpose);
    bass.triggerAttackRelease(transposedNote, '8n', time);
  }, bassNotes, '16n').start(0);

  new Tone.Loop(() => {
    bassTransposeIndex++;
  }, '4m').start(0);

  // STABS PATTERN: "<~ a3 ~ a3>" with chords "<m m7>"
  const stabsChords = [
    null,
    ['A3', 'C4', 'E4'], // A minor
    null,
    ['A3', 'C4', 'E4', 'G4'] // A minor 7
  ];
  stabsChordIndex = 0;

  stabsSequence = new Tone.Loop((time) => {
    const chord = stabsChords[stabsChordIndex % stabsChords.length];
    if (chord) {
      stabs.triggerAttackRelease(chord, '4n', time);
    }
    stabsChordIndex++;
  }, '4n').start(0);
  
  // 4. Start transport
  Tone.Transport.start();
  console.log('🔊 BERLIN TECHNO - Transport started!');
}

export function stop() {
  Tone.Transport.stop();
}

export function pause() {
  Tone.Transport.pause();
}

// ========================================
// CONSOLE OUTPUT
// ========================================
console.log(`
🔊 BERLIN TECHNO - 157 BPM (5 Instruments)

✨ INSTRUMENTS:
   ✓ Kick (layered 909 + 808)
   ✓ Snare
   ✓ Hi-hat
   ✓ Bass (sawtooth synth)
   ✓ Stabs (supersaw chords)

📊 Call await start() to begin playback!
`);
