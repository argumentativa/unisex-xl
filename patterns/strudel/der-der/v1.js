// Add this AFTER your existing bass/drums code:

// Atmospheric Lead Synth - Dark melodic stabs
// Using B minor scale with industrial flavor
const synthMelody = new Tone.Sequence((time, note) => {
  if (note !== null) {
    synth.triggerAttackRelease(note, '16n', time);
  }
}, [
  'B4', null, 'D5', null,
  'F#4', null, 'B4', null,
  'A4', null, 'F#4', null,
  'D5', null, 'B4', null
], '8n'); // Plays every 8th note

synthMelody.start(0);

// Industrial Arpeggio - Higher frequency texture
// Creates tension with fast arpeggios
const arp = new Tone.Pattern((time, note) => {
  synth.triggerAttackRelease(note, '32n', time, 0.3); // Quieter (30% velocity)
}, ['B5', 'D6', 'F#5', 'A5'], 'upDown');

arp.start('2m'); // Start after 2 measures for buildup

// Atmospheric Pad Chord - Sustained background
// Adds depth without cluttering
const padChord = new Tone.Loop((time) => {
  // Trigger a dark minor chord every 2 bars
  synth.triggerAttackRelease(['B3', 'D4', 'F#4'], '2m', time, 0.2);
}, '2m');

padChord.start('4m'); // Start after 4 measures

console.log('🎹 Synth layers added:');
console.log('   • Melodic stabs (immediate)');
console.log('   • Arpeggio (after 2 measures)');
console.log('   • Pad chord (after 4 measures)');