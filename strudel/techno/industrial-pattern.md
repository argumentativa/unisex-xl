// Industrial Techno Pattern - Translated from Strudel to Tone.js
// Set BPM to 157 (equivalent to setcps(0.654))
// Adjust effects via UI sliders: Distortion ~0.4, BitCrusher ~3-8, Reverb low

// Set tempo to 157 BPM
Transport.bpm.value = 157;

// Bass line pattern (industrial bass with filtering)
const bassNotes = [
  'B1', 'E2', 'B1', 'D3', 'B1', 'B2', 'B1', 'B1',
  'B2', 'B1', 'B2', 'B1', 'B2', 'A2', 'B1', 'B2'
];

// Transpose pattern cycles through [0, 0, 0, 5, 7]
let transposeIndex = 0;
const transposeValues = [0, 0, 0, 5, 7];

const bassline = new Tone.Sequence((time, note) => {
  // Apply transposition
  const transpose = transposeValues[transposeIndex % transposeValues.length];
  const transposedNote = Tone.Frequency(note).transpose(transpose).toNote();

  bass.triggerAttackRelease(transposedNote, '4n', time);
}, bassNotes, '2n'); // .slow(2) means half speed = '2n' instead of '4n'

// Update transpose every 16 steps
bassline.events = bassNotes.map((note, i) => {
  if (i % 16 === 0) transposeIndex++;
  return note;
});

bassline.start(0);

// Aggressive kick pattern: "bd ~ bd ~" (on beats 1 and 3)
const kickPattern = new Tone.Loop((time) => {
  drums.triggerAttackRelease('C1', '8n', time);
}, '2n'); // every 2 beats (half note)

kickPattern.start(0);

// Snare pattern: "~ cp ~ cp" (on beats 2 and 4)
const snarePattern = new Tone.Loop((time) => {
  drums.triggerAttackRelease('G1', '16n', time);
}, '2n'); // every 2 beats

snarePattern.start('4n'); // offset by 1 beat to hit on 2 and 4

// Hi-hat/noise pattern: "~ ~ white ~" (on beat 3 of every 4)
const hatPattern = new Tone.Loop((time) => {
  drums.triggerAttackRelease('A1', '32n', time); // short decay
}, '1m'); // every measure

hatPattern.start('2n'); // offset to beat 3

console.log('Industrial pattern loaded - 157 BPM');
console.log('⚠️ Adjust UI sliders for best sound:');
console.log('  • Distortion: 0.4-0.5');
console.log('  • Bit Crusher: 3-8 bits');
console.log('  • Reverb: 0.1-0.2 (subtle)');
console.log('  • Delay: 0.2-0.3 (optional)');
