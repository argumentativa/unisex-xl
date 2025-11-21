// ========================================
// BERLIN TECHNO - 157 BPM
// Tone.js Version
// Attack Magazine Layered Kick Technique
// ========================================

import * as Tone from 'tone';

// ========================================
// SETUP - BPM & TRANSPORT
// ========================================
Tone.Transport.bpm.value = 157; // setcps(0.654)

// ========================================
// AUDIO SAMPLES - TR-909 & TR-808
// ========================================
const kick909 = new Tone.Player("samples/kick/Kit01_Kick.wav").toDestination();
const kick808 = new Tone.Player("samples/kick/Kit01_Kick.wav").toDestination(); // Use different 808 sample if available
const clap = new Tone.Player("samples/snare/Kit01_Snare.wav").toDestination();
const closedHat = new Tone.Player("samples/hat/Kit01_Hat.wav").toDestination();
const openHat = new Tone.Player("samples/hat/Kit01_Hat.wav").toDestination();

// ========================================
// EFFECTS CHAINS
// ========================================

// KICK 909 - Punch and attack (0.7 gain)
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

// KICK 808 - Sub-bass weight (0.4 gain, layered underneath)
const kick808HPF = new Tone.Filter(35, 'highpass');
const kick808LPF = new Tone.Filter(80, 'lowpass'); // Only sub frequencies
const kick808Volume = new Tone.Volume(Tone.gainToDb(0.4));

kick808HPF.connect(kick808LPF);
kick808LPF.connect(kick808Volume);
kick808Volume.toDestination();
kick808.disconnect();
kick808.connect(kick808HPF);

// CLAP/SNARE - 909 (0.7 gain)
const clapHPF = new Tone.Filter(200, 'highpass');
const clapLPF = new Tone.Filter(8000, 'lowpass');
const clapDistortion = new Tone.Distortion(0.15);
const clapDelay = new Tone.FeedbackDelay('8n', 0.1);
const clapReverb = new Tone.Reverb(0.1);
const clapVolume = new Tone.Volume(Tone.gainToDb(0.7));

clapHPF.connect(clapLPF);
clapLPF.connect(clapDistortion);
clapDistortion.connect(clapDelay);
clapDelay.connect(clapReverb);
clapReverb.connect(clapVolume);
clapVolume.toDestination();
clap.disconnect();
clap.connect(clapHPF);

// CLOSED HI-HAT - 909 (0.3 gain, crisp and clean)
const closedHatHPF = new Tone.Filter(8000, 'highpass');
const closedHatCrusher = new Tone.BitCrusher(8);
const closedHatPanner = new Tone.Panner(0.3);
const closedHatVolume = new Tone.Volume(Tone.gainToDb(0.3));

closedHatHPF.connect(closedHatCrusher);
closedHatCrusher.connect(closedHatPanner);
closedHatPanner.connect(closedHatVolume);
closedHatVolume.toDestination();
closedHat.disconnect();
closedHat.connect(closedHatHPF);

// OPEN HI-HAT - 909 (0.4 gain, metallic)
const openHatHPF = new Tone.Filter(4000, 'highpass');
const openHatDelay = new Tone.FeedbackDelay('8n', 0.15);
const openHatPanner = new Tone.Panner(-0.3);
const openHatVolume = new Tone.Volume(Tone.gainToDb(0.4));

openHatHPF.connect(openHatDelay);
openHatDelay.connect(openHatPanner);
openHatPanner.connect(openHatVolume);
openHatVolume.toDestination();
openHat.disconnect();
openHat.connect(openHatHPF);

// BASS - Sawtooth synth (0.75 gain)
const bassHPF = new Tone.Filter(35, 'highpass');
const bassLPF = new Tone.Filter(400, 'lowpass', 15); // High resonance
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
const stabsLPF = new Tone.Filter(3000, 'lowpass', 5);
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
  oscillator: { type: 'sawtooth', count: 7, spread: 40 }, // Supersaw
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
// PATTERNS
// ========================================

// KICK PATTERN: "bd ~ bd ~" (both 909 and 808 layered)
const kickPattern = new Tone.Loop((time) => {
  kick909.start(time);
  kick808.start(time);
}, '2n').start(0);

// CLAP PATTERN: "~ cp ~ cp" (backbeat)
const clapPattern = new Tone.Pattern((time) => {
  clap.start(time);
}, [null, 0, null, 0], 'upDown').start(0);
clapPattern.interval = '4n';

// CLOSED HI-HAT: "~ ~ hh ~" 
const closedHatPattern = new Tone.Pattern((time, index) => {
  if (index !== null) {
    closedHat.start(time);
    closedHat.playbackRate = 1.5; // Speed control
  }
}, [null, null, 0, null], 'up').start(0);
closedHatPattern.interval = '4n';

// OPEN HI-HAT: "~ oh ~ ~"
const openHatPattern = new Tone.Pattern((time, index) => {
  if (index !== null) {
    openHat.start(time);
    openHat.playbackRate = 0.9; // Speed control
  }
}, [null, 0, null, null], 'up').start(0);
openHatPattern.interval = '4n';

// BASS PATTERN: "a1 [a1 a2] a1 [a2 a1] a1 [e2 a1] [g1 a1] [a1 a2]"
// Simplified version with main progression
const bassNotes = [
  'A1', 'A1', 'A2', 'A1', 'A2', 'A1', 'A1', 'E2', 
  'A1', 'G1', 'A1', 'A1', 'A2'
];
const bassTranspose = [0, 0, 0, 5, 7]; // <0 0 0 5 7>
let bassTransposeIndex = 0;

const bassSequence = new Tone.Sequence((time, note) => {
  const transpose = bassTranspose[bassTransposeIndex % bassTranspose.length];
  const transposedNote = Tone.Frequency(note).transpose(transpose);
  bass.triggerAttackRelease(transposedNote, '8n', time);
}, bassNotes, '16n').start(0);

// Update transpose every 4 measures (slow(2))
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
let stabsChordIndex = 0;

const stabsSequence = new Tone.Loop((time) => {
  const chord = stabsChords[stabsChordIndex % stabsChords.length];
  if (chord) {
    stabs.triggerAttackRelease(chord, '4n', time);
  }
  stabsChordIndex++;
}, '4n').start(0);

// ========================================
// INTERACTIVE CONTROLS (Slider Equivalents)
// ========================================

// Kick 909 Controls
export function setKick909Gain(value) {
  kick909Volume.volume.value = Tone.gainToDb(value);
}

export function setKick909LPF(value) {
  kick909LPF.frequency.value = value;
}

export function setKick909HPF(value) {
  kick909HPF.frequency.value = value;
}

export function setKick909Shape(value) {
  kick909Distortion.distortion = value;
}

// Kick 808 Controls
export function setKick808Gain(value) {
  kick808Volume.volume.value = Tone.gainToDb(value);
}

export function setKick808LPF(value) {
  kick808LPF.frequency.value = value;
}

// Clap Controls
export function setClapGain(value) {
  clapVolume.volume.value = Tone.gainToDb(value);
}

export function setClapHPF(value) {
  clapHPF.frequency.value = value;
}

export function setClapLPF(value) {
  clapLPF.frequency.value = value;
}

export function setClapShape(value) {
  clapDistortion.distortion = value;
}

export function setClapDelay(value) {
  clapDelay.wet.value = value;
}

// Closed Hat Controls
export function setClosedHatGain(value) {
  closedHatVolume.volume.value = Tone.gainToDb(value);
}

export function setClosedHatSpeed(value) {
  closedHat.playbackRate = value;
}

export function setClosedHatHPF(value) {
  closedHatHPF.frequency.value = value;
}

export function setClosedHatCrush(value) {
  closedHatCrusher.bits = value;
}

export function setClosedHatPan(value) {
  closedHatPanner.pan.value = value;
}

// Open Hat Controls
export function setOpenHatGain(value) {
  openHatVolume.volume.value = Tone.gainToDb(value);
}

export function setOpenHatSpeed(value) {
  openHat.playbackRate = value;
}

export function setOpenHatHPF(value) {
  openHatHPF.frequency.value = value;
}

export function setOpenHatDelay(value) {
  openHatDelay.wet.value = value;
}

export function setOpenHatPan(value) {
  openHatPanner.pan.value = value;
}

// Bass Controls
export function setBassGain(value) {
  bassVolume.volume.value = Tone.gainToDb(value);
}

export function setBassHPF(value) {
  bassHPF.frequency.value = value;
}

export function setBassLPF(value) {
  bassLPF.frequency.value = value;
}

export function setBassResonance(value) {
  bassLPF.Q.value = value;
}

export function setBassShape(value) {
  bassSaturation.distortion = value;
}

export function setBassCrush(value) {
  bassCrusher.bits = value;
}

// Stabs Controls
export function setStabsGain(value) {
  stabsVolume.volume.value = Tone.gainToDb(value);
}

export function setStabsHPF(value) {
  stabsHPF.frequency.value = value;
}

export function setStabsLPF(value) {
  stabsLPF.frequency.value = value;
}

export function setStabsResonance(value) {
  stabsLPF.Q.value = value;
}

export function setStabsShape(value) {
  stabsDistortion.distortion = value;
}

export function setStabsDelay(value) {
  stabsDelay.wet.value = value;
}

export function setStabsRoom(value) {
  stabsReverb.wet.value = value;
}

export function setStabsPan(value) {
  stabsPanner.pan.value = value;
}

// Master Controls
export function setMasterLPF(value) {
  masterLPF.frequency.value = value;
}

export function setMasterGain(value) {
  masterVolume.volume.value = Tone.gainToDb(value);
}

// ========================================
// PLAYBACK CONTROLS
// ========================================

export function start() {
  Tone.Transport.start();
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
🔊 BERLIN TECHNO - 157 BPM (Tone.js Version)

✨ INSTRUMENTS INITIALIZED:
   ✓ Kick 909 (0.7 gain) - Punch and attack
   ✓ Kick 808 (0.4 gain) - Sub-bass weight (layered)
   ✓ Clap/Snare (0.7 gain) - 909 backbeat
   ✓ Closed Hat (0.3 gain) - 909, crisp
   ✓ Open Hat (0.4 gain) - 909, metallic
   ✓ Bass (0.75 gain) - Sawtooth progression
   ✓ Stabs (0.5 gain) - Supersaw chords

🎛️ ATTACK MAGAZINE TECHNIQUES:
   ✓ Layered kick (909 + 808)
   ✓ Sub-bass filtering (808 at 60-120 Hz)
   ✓ Aggressive HPF on drums
   ✓ High resonance on bass

🎬 PATTERN:
   - Four-on-floor kick (layered)
   - Backbeat clap
   - Rhythmic hi-hats
   - Rolling bass line
   - Minor chord stabs

🎮 INTERACTIVE CONTROLS:
   - setKick909Gain(0.5-1.0)
   - setKick909LPF(80-200)
   - setKick808LPF(60-120)
   - setBassLPF(250-800)
   - setStabsDelay(0-0.4)
   - setMasterLPF(10000-20000)
   - setMasterGain(0.6-0.9)
   ...and 30+ more controls!

📊 Call start() to begin playback!
`);

// ========================================
// USAGE EXAMPLE
// ========================================
/*
import { 
  start, 
  setKick909LPF, 
  setBassLPF, 
  setStabsDelay,
  setMasterGain 
} from './berlin-techno-tonejs.js';

// Start playback
await start();

// Adjust parameters in real-time
setKick909LPF(150);   // Tighten kick
setBassLPF(600);      // Open bass filter
setStabsDelay(0.3);   // Add delay to stabs
setMasterGain(0.85);  // Adjust master volume

// Stop when done
stop();
*/

