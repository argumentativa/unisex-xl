// ========================================
// INDUSTRIAL TECHNO - 157 BPM
// Web App Compatible Version
// Uses unique variable names to avoid conflicts
// ========================================

// CLEANUP: Stop and dispose everything first
if (window.currentPattern) {
  Tone.Transport.stop();
  Tone.Transport.cancel(0);
  
  // Dispose all sequences and loops
  if (window.currentPattern.sequences) {
    window.currentPattern.sequences.forEach(seq => {
      if (seq && seq.dispose) seq.dispose();
    });
  }
  
  // Dispose all instruments
  if (window.currentPattern.instruments) {
    window.currentPattern.instruments.forEach(inst => {
      if (inst && inst.dispose) inst.dispose();
    });
  }
  
  // Dispose all effects
  if (window.currentPattern.effects) {
    window.currentPattern.effects.forEach(fx => {
      if (fx && fx.dispose) fx.dispose();
    });
  }
  
  console.log('🧹 Previous pattern cleaned up');
}

// Initialize storage
window.currentPattern = {
  instruments: [],
  effects: [],
  sequences: []
};

// ========================================
// TEMPO
// ========================================
Tone.Transport.bpm.value = 157;

// ========================================
// INSTRUMENTS - Using unique variable names
// ========================================

// KICK
const technoKick = new Tone.MembraneSynth({
  pitchDecay: 0.05,
  octaves: 10,
  oscillator: { type: "sine" },
  envelope: { attack: 0.001, decay: 0.4, sustain: 0.01, release: 1.4 }
});

// BASS
const technoBass = new Tone.FMSynth({
  harmonicity: 1,
  modulationIndex: 3,
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.3, release: 0.5 }
});

// SNARE
const technoSnare = new Tone.NoiseSynth({
  noise: { type: "white" },
  envelope: { attack: 0.001, decay: 0.2, sustain: 0 }
});

// CLOSED HI-HAT
const hatClosed = new Tone.MetalSynth({
  frequency: 200,
  envelope: { attack: 0.001, decay: 0.05, release: 0.01 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5
});

// OPEN HI-HAT
const hatOpen = new Tone.MetalSynth({
  frequency: 200,
  envelope: { attack: 0.001, decay: 0.3, release: 0.4 },
  harmonicity: 5.1,
  modulationIndex: 32,
  resonance: 4000,
  octaves: 1.5
});

// PERCUSSION
const technoPerc = new Tone.MetalSynth({
  frequency: 300,
  envelope: { attack: 0.001, decay: 0.2, release: 0.1 },
  harmonicity: 3.1,
  modulationIndex: 16,
  resonance: 5000,
  octaves: 1
});

// LEAD SYNTH
const technoLead = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "sawtooth" },
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.5 }
});

// PAD
const technoPad = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: "triangle" },
  envelope: { attack: 1.5, decay: 1, sustain: 0.7, release: 3 }
});

// STABS
const technoStabs = new Tone.FMSynth({
  harmonicity: 8,
  modulationIndex: 2,
  envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 }
});

window.currentPattern.instruments.push(technoKick, technoBass, technoSnare, hatClosed, hatOpen, technoPerc, technoLead, technoPad, technoStabs);

// ========================================
// EFFECTS CHAINS
// ========================================

// === KICK CHAIN ===
const kickLPF = new Tone.Filter(120, "lowpass", -12);
const kickAttack = new Tone.Filter(5000, "peaking");
kickAttack.Q.value = 1;
kickAttack.gain.value = 3;
const kickSat = new Tone.Distortion(0.2);
const kickComp = new Tone.Compressor(-20, 3);
const kickGain = new Tone.Gain(1.2);
technoKick.chain(kickLPF, kickAttack, kickSat, kickComp, kickGain, Tone.Destination);
window.currentPattern.effects.push(kickLPF, kickAttack, kickSat, kickComp, kickGain);

// === BASS CHAIN ===
const bassHPF = new Tone.Filter(40, "highpass");
const bassBody = new Tone.Filter(100, "peaking");
bassBody.Q.value = 1.5;
bassBody.gain.value = 3;
const bassPresence = new Tone.Filter(1000, "peaking");
bassPresence.Q.value = 2;
bassPresence.gain.value = 4;
const bassLPF = new Tone.AutoFilter({ frequency: "8n", baseFrequency: 400, octaves: 2 }).start();
bassLPF.filter.type = "lowpass";
bassLPF.filter.rolloff = -24;
bassLPF.filter.Q.value = 18;
const bassSat = new Tone.Distortion(0.65);
const bassCrush = new Tone.BitCrusher(8);
const bassComp = new Tone.Compressor(-24, 6);
const bassGain = new Tone.Gain(0.8);
technoBass.chain(bassHPF, bassBody, bassPresence, bassLPF, bassSat, bassCrush, bassComp, bassGain, Tone.Destination);
window.currentPattern.effects.push(bassHPF, bassBody, bassPresence, bassLPF, bassSat, bassCrush, bassComp, bassGain);

// === SNARE CHAIN ===
const snareHPF = new Tone.Filter(200, "highpass");
const snareCrack = new Tone.Filter(2500, "peaking");
snareCrack.Q.value = 2;
snareCrack.gain.value = 4;
const snareLPF = new Tone.Filter(8000, "lowpass");
const snareDist = new Tone.Distortion(0.6);
const snareComp = new Tone.Compressor(-18, 4);
const snareRev = new Tone.Reverb(0.8);
snareRev.wet.value = 0.15;
const snareGain = new Tone.Gain(0.65);
technoSnare.chain(snareHPF, snareCrack, snareLPF, snareDist, snareComp, snareRev, snareGain, Tone.Destination);
window.currentPattern.effects.push(snareHPF, snareCrack, snareLPF, snareDist, snareComp, snareRev, snareGain);

// === CLOSED HAT CHAIN ===
const hatClosedHPF = new Tone.Filter(8000, "highpass");
const hatClosedAir = new Tone.Filter(12000, "peaking");
hatClosedAir.Q.value = 1;
hatClosedAir.gain.value = 2;
const hatClosedCrush = new Tone.BitCrusher(8);
const hatClosedGain = new Tone.Gain(0.4);
hatClosed.chain(hatClosedHPF, hatClosedAir, hatClosedCrush, hatClosedGain, Tone.Destination);
window.currentPattern.effects.push(hatClosedHPF, hatClosedAir, hatClosedCrush, hatClosedGain);

// === OPEN HAT CHAIN ===
const hatOpenHPF = new Tone.Filter(6000, "highpass");
const hatOpenGain = new Tone.Gain(0.35);
hatOpen.chain(hatOpenHPF, hatOpenGain, Tone.Destination);
window.currentPattern.effects.push(hatOpenHPF, hatOpenGain);

// === PERCUSSION CHAIN ===
const percHPF = new Tone.Filter(1000, "highpass");
const percPan = new Tone.Panner(0.4);
const percGain = new Tone.Gain(0.3);
technoPerc.chain(percHPF, percPan, percGain, Tone.Destination);
window.currentPattern.effects.push(percHPF, percPan, percGain);

// === LEAD SYNTH CHAIN ===
const synthHPF = new Tone.Filter(400, "highpass");
const synthLPF = new Tone.Filter(4000, "lowpass");
synthLPF.Q.value = 5;
const synthPresence = new Tone.Filter(3000, "peaking");
synthPresence.Q.value = 2;
synthPresence.gain.value = 3;
const synthPhaser = new Tone.Phaser({ frequency: 0.5, octaves: 3, baseFrequency: 350 });
const synthDelay = new Tone.PingPongDelay("8n", 0.3);
synthDelay.wet.value = 0.4;
const synthRev = new Tone.Reverb(1.5);
synthRev.wet.value = 0.4;
const synthGain = new Tone.Gain(0.5);
technoLead.chain(synthHPF, synthLPF, synthPresence, synthPhaser, synthDelay, synthRev, synthGain, Tone.Destination);
window.currentPattern.effects.push(synthHPF, synthLPF, synthPresence, synthPhaser, synthDelay, synthRev, synthGain);

// === PAD CHAIN ===
const padHPF = new Tone.Filter(500, "highpass");
const padLPF = new Tone.Filter(10000, "lowpass");
const padChorus = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.7 }).start();
padChorus.wet.value = 0.5;
const padRev = new Tone.Reverb(4);
padRev.wet.value = 1.0;
const padPanLFO = new Tone.LFO("2n", -0.7, 0.7).start();
const padPanner = new Tone.Panner(0);
padPanLFO.connect(padPanner.pan);
const padGain = new Tone.Gain(0.2);
technoPad.chain(padHPF, padLPF, padChorus, padRev, padPanner, padGain, Tone.Destination);
window.currentPattern.effects.push(padHPF, padLPF, padChorus, padRev, padPanLFO, padPanner, padGain);

// === STABS CHAIN ===
const stabsHPF = new Tone.Filter(800, "highpass");
const stabsLPF = new Tone.Filter(6000, "lowpass");
const stabsDelay = new Tone.FeedbackDelay("16n", 0.5);
stabsDelay.wet.value = 0.6;
const stabsGain = new Tone.Gain(0.45);
technoStabs.chain(stabsHPF, stabsLPF, stabsDelay, stabsGain, Tone.Destination);
window.currentPattern.effects.push(stabsHPF, stabsLPF, stabsDelay, stabsGain);

// ========================================
// PATTERNS
// ========================================

// KICK - Four-on-floor
const kickPattern = new Tone.Loop(time => {
  technoKick.triggerAttackRelease('C1', '16n', time);
}, '2n').start(0);
window.currentPattern.sequences.push(kickPattern);

// BASS - Industrial progression
const bassNotes = ['B1', 'E2', 'B1', 'D3', 'B1', 'B2', 'B1', 'B1', 
                   'B2', 'B1', 'B2', 'B1', 'B2', 'A2', 'B1', 'B2'];
const transposePattern = [0, 0, 0, 5, 7];
let transposeIndex = 0;

const bassline = new Tone.Sequence((time, note) => {
  const transpose = transposePattern[Math.floor(transposeIndex / 16) % transposePattern.length];
  const transposedNote = Tone.Frequency(note).transpose(transpose).toNote();
  technoBass.triggerAttackRelease(transposedNote, '2n', time);
  transposeIndex++;
}, bassNotes, '2n').start(0);
window.currentPattern.sequences.push(bassline);

// SNARE - Backbeat
const snarePattern = new Tone.Loop(time => {
  technoSnare.triggerAttackRelease('16n', time);
}, '2n').start('4n');
window.currentPattern.sequences.push(snarePattern);

// CLOSED HAT - 16ths
const hatClosedPattern = new Tone.Loop(time => {
  hatClosed.triggerAttackRelease('32n', time);
}, '16n').start(0);
window.currentPattern.sequences.push(hatClosedPattern);

// OPEN HAT - Accents
const hatOpenPattern = new Tone.Loop(time => {
  hatOpen.triggerAttackRelease('16n', time);
}, '2m').start('1m');
window.currentPattern.sequences.push(hatOpenPattern);

// PERCUSSION - Ride rhythm
const percPattern = new Tone.Sequence((time, vel) => {
  if (vel > 0) {
    technoPerc.triggerAttackRelease('32n', time, vel);
  }
}, [0.4, 0, 0.3, 0, 0.5, 0, 0.3, 0], '8n').start('2m');
window.currentPattern.sequences.push(percPattern);

// LEAD MELODY - Dark stabs
const leadMelody = new Tone.Sequence((time, note) => {
  if (note !== null) {
    technoLead.triggerAttackRelease(note, '16n', time);
  }
}, [
  'B4', null, 'D5', null,
  'F#4', null, 'B4', null,
  'A4', null, 'F#4', null,
  'D5', null, 'B4', null
], '8n').start(0);
window.currentPattern.sequences.push(leadMelody);

// ARPEGGIO
const arp = new Tone.Pattern((time, note) => {
  technoLead.triggerAttackRelease(note, '32n', time, 0.3);
}, ['B5', 'D6', 'F#5', 'A5'], 'upDown').start('2m');
window.currentPattern.sequences.push(arp);

// PAD CHORD
const padChord = new Tone.Loop(time => {
  technoPad.triggerAttackRelease(['B3', 'D4', 'F#4'], '2m', time, 0.15);
}, '2m').start('4m');
window.currentPattern.sequences.push(padChord);

// STABS
const stabsPattern = new Tone.Sequence((time, note) => {
  if (note !== null) {
    technoStabs.triggerAttackRelease(note, '32n', time, 0.6);
  }
}, [
  null, null, 'B4', null,
  null, 'F#5', null, null,
  null, null, 'D5', null,
  'A4', null, null, null
], '8n').start('8m');
window.currentPattern.sequences.push(stabsPattern);

// ========================================
// AUTOMATION
// ========================================

Tone.Transport.schedule(time => {
  bassLPF.baseFrequency.rampTo(600, 4);
}, '8m');

Tone.Transport.schedule(time => {
  bassSat.distortion = 1.2;
}, '4m');

Tone.Transport.schedule(time => {
  hatClosedCrush.bits = 16;
}, '16m');

Tone.Transport.schedule(time => {
  padGain.gain.rampTo(0.3, 8);
}, '12m');

// Modulation
const phaserLFO = new Tone.LFO(0.1, 0.2, 2).start();
phaserLFO.connect(synthPhaser.frequency);
window.currentPattern.effects.push(phaserLFO);

// ========================================
// START TRANSPORT
// ========================================

Tone.Transport.start();

console.log('');
console.log('🔊 INDUSTRIAL TECHNO - 157 BPM (Advanced Mix)');
console.log('');
console.log('✨ INSTRUMENTS:');
console.log('   ✓ Kick (1.2 gain) - Foundation');
console.log('   ✓ Bass (0.8 gain) - Industrial progression');
console.log('   ✓ Snare (0.65 gain) - Backbeat');
console.log('   ✓ Closed Hat (0.4 gain) - 16th notes');
console.log('   ✓ Open Hat (0.35 gain) - Accents');
console.log('   ✓ Percussion (0.3 gain) - Ride rhythm');
console.log('   ✓ Lead Synth (0.5 gain) - Melody + Arp');
console.log('   ✓ Pad (0.2 gain) - Atmosphere');
console.log('   ✓ Stabs (0.45 gain) - Accents');
console.log('');
console.log('🎛️ MIXING APPLIED:');
console.log('   ✓ Attack Magazine gain staging');
console.log('   ✓ Steve Savage frequency management');
console.log('   ✓ HPF on all except kick/bass');
console.log('   ✓ Bass presence at 1 kHz');
console.log('   ✓ Snare crack at 2.5 kHz');
console.log('   ✓ Strategic compression (3:1-6:1)');
console.log('   ✓ Minimal drum reverb (0-0.2)');
console.log('   ✓ Stereo panning for width');
console.log('');
console.log('🎬 TIMELINE:');
console.log('   0:00 - Core pattern starts');
console.log('   0:08 - Arpeggio + Open hats');
console.log('   0:16 - Percussion + Pad + Distortion up');
console.log('   0:32 - Bass filter opens');
console.log('   0:48 - Pad increased');
console.log('   1:04 - Stabs enter');
console.log('   1:20 - Hats cleaned');
console.log('');
console.log('🎵 Transport started! Use Stop button to stop.');

