/**
 * Example code snippets for live coding
 */

export const examples = {
  basic: `// Basic Pattern - Play a simple melody
// Use the synth instrument to play notes

const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '8n', time);
}, ['C4', 'E4', 'G4', 'B4', 'A4', 'F4', 'D4', 'C4'], '4n');

melody.start(0);

console.log('Basic melody pattern started!');`,

  drums: `// Drum Pattern - Create a basic beat
// Use the drums instrument for kick and snare

const kick = new Tone.Loop((time) => {
  drums.triggerAttackRelease('C1', '8n', time);
}, '4n');

const snare = new Tone.Loop((time) => {
  drums.triggerAttackRelease('E1', '8n', time);
}, '2n');

// Offset snare by one quarter note
snare.start('4n');
kick.start(0);

console.log('Drum pattern started!');`,

  bassline: `// Bass Pattern - Deep bassline
// Use the bass instrument for low-end

const bassPattern = new Tone.Pattern((time, note) => {
  bass.triggerAttackRelease(note, '8n', time);
}, ['C2', 'C2', 'G2', 'F2'], 'upDown');

bassPattern.start(0);

console.log('Bass pattern started!');`,

  complex: `// Complex Pattern - Synth + Bass + Drums
// Combine all instruments for a full composition

// Synth melody
const melody = new Tone.Sequence((time, note) => {
  synth.triggerAttackRelease(note, '16n', time);
}, ['C4', 'E4', 'G4', 'E4', 'A4', 'G4', 'F4', 'E4'], '8n');

// Bass pattern
const bassline = new Tone.Pattern((time, note) => {
  bass.triggerAttackRelease(note, '4n', time);
}, ['C2', 'G2', 'F2', 'G2'], 'up');

// Kick drum
const kick = new Tone.Loop((time) => {
  drums.triggerAttackRelease('C1', '16n', time);
}, '4n');

// Start all patterns
melody.start(0);
bassline.start(0);
kick.start(0);

console.log('Full composition started!');`,

  generative: `// Generative Music - Random note generation
// Create evolving patterns with randomness

const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
const durations = ['16n', '8n', '4n'];

const generative = new Tone.Loop((time) => {
  const note = notes[Math.floor(Math.random() * notes.length)];
  const duration = durations[Math.floor(Math.random() * durations.length)];
  synth.triggerAttackRelease(note, duration, time);
}, '8n');

generative.start(0);

console.log('Generative pattern started!');`,

  arpeggio: `// Arpeggio Pattern - Ascending and descending
// Create an arpeggiator effect

const arp = new Tone.Pattern((time, note) => {
  synth.triggerAttackRelease(note, '16n', time);
  bass.triggerAttackRelease(
    Tone.Frequency(note).transpose(-24),
    '8n',
    time
  );
}, ['C3', 'E3', 'G3', 'C4', 'E4', 'G4', 'C5'], 'upDown');

arp.start(0);

console.log('Arpeggio pattern started!');`,

  // Strudel Examples
  strudel_basic: `// Strudel Basic - Simple note pattern
// Play notes in a sequence

note("c a f e").s("sawtooth")`,

  strudel_drums: `// Strudel Drums - Four-on-the-floor beat
// Create a basic techno beat

stack(
  s("bd bd bd bd"),
  s("~ cp ~ cp"),
  s("hh hh hh hh").gain(0.4)
)`,

  strudel_bassline: `// Strudel Bassline - Deep bass pattern
// Create a moving bassline

note("c2 c2 g2 f2")
  .s("sawtooth")
  .lpf(300)
  .gain(0.8)`,

  strudel_industrial: `// Strudel Industrial - The pattern you provided!
// Industrial techno at 157 BPM

setcps(0.654) // 157 BPM

stack(
  // Industrial bass
  note("b1 e2 b1 d3 b1 b2 b1 b1 b2 b1 b2 b1 b2 a2 b1 b2")
    .slow(2)
    .transpose("<0 0 0 5 7>")
    .s("supersaw")
    .lpf(300)
    .shape(0.4)
    .gain(0.8)
    .crush("<16 3>"),

  // Kick
  s("bd ~ bd ~")
    .gain(1.2)
    .lpf(800)
    .shape(0.5),

  // Snare
  s("~ cp ~ cp")
    .gain(0.65)
    .shape(0.3)
    .lpf(2000),

  // Hi-hats
  s("~ ~ hh ~")
    .hpf(8000)
    .gain(0.2)
)`,

  strudel_generative: `// Strudel Generative - Random patterns
// Create evolving algorithmic music

note("c a f e".shuffle())
  .every(4, x => x.rev())
  .s("triangle")
  .lpf(rand.range(200, 2000))`,

  strudel_complex: `// Strudel Complex - Multi-layered pattern
// Combine multiple elements

stack(
  // Melody
  note("c4 e4 g4 b4".fast(2))
    .s("triangle")
    .gain(0.6),

  // Bass
  note("c2 g2 f2 g2")
    .s("sawtooth")
    .lpf(400)
    .gain(0.8),

  // Drums
  s("bd ~ ~ ~, ~ cp ~ cp, [hh hh]*4")
    .gain(0.7)
)
.slow(1.5)`
};

export type ExampleName = keyof typeof examples;

export function getExample(name: ExampleName): string {
  return examples[name] || examples.basic;
}

export function getToneJSExamples(): ExampleName[] {
  return Object.keys(examples).filter(key => !key.startsWith('strudel_')) as ExampleName[];
}

export function getStrudelExamples(): ExampleName[] {
  return Object.keys(examples).filter(key => key.startsWith('strudel_')) as ExampleName[];
}
