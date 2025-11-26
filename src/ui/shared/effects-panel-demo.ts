/**
 * Effects Panel Demo
 * Standalone demo for testing the EffectsPanel component
 */

import * as Tone from 'tone';
import { EffectsPanel } from './EffectsPanel';
import { CHARACTERS, createCharacterSynth } from '../character-orchestra/Character';

// Demo characters (using first 4 from CHARACTERS)
const DEMO_CHARACTERS = CHARACTERS.slice(0, 4);

// DOM Elements
const panelsContainer = document.getElementById('effectsPanelsContainer') as HTMLElement;
const playBtn = document.getElementById('playBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;

// Store panels and synths
const panels: EffectsPanel[] = [];
const synths: Tone.ToneAudioNode[] = [];
let testSequence: Tone.Sequence | null = null;

// Initialize demo
function initDemo(): void {
  DEMO_CHARACTERS.forEach((charData) => {
    // Create synth
    const synth = createCharacterSynth(charData);
    synths.push(synth);

    // Create effects panel
    const panel = new EffectsPanel(synth, {
      characterName: charData.name,
      characterIcon: charData.emoji
    });

    panels.push(panel);
    panelsContainer.appendChild(panel.getElement());
  });

  console.log(`Created ${panels.length} effects panels`);
}

// Play test tone
async function playTestTone(): Promise<void> {
  await Tone.start();

  // Stop any existing sequence
  if (testSequence) {
    testSequence.stop();
    testSequence.dispose();
  }

  // Create a simple test pattern
  const testNotes = ['C4', 'E4', 'G4', 'C5'];
  let noteIndex = 0;

  testSequence = new Tone.Sequence(
    (time) => {
      synths.forEach((synth) => {
        try {
          if (synth instanceof Tone.MembraneSynth || synth instanceof Tone.NoiseSynth) {
            // Drums
            (synth as any).triggerAttackRelease('C1', '8n', time);
          } else {
            // Melodic instruments
            (synth as any).triggerAttackRelease(testNotes[noteIndex % testNotes.length], '8n', time);
          }
        } catch (error) {
          console.error('Error triggering synth:', error);
        }
      });
      noteIndex++;
    },
    [0, 1, 2, 3],
    '4n'
  );

  testSequence.start(0);
  Tone.Transport.start();
}

function stopTestTone(): void {
  if (testSequence) {
    testSequence.stop();
    testSequence.dispose();
    testSequence = null;
  }
  Tone.Transport.stop();
}

// Event listeners
playBtn.addEventListener('click', async () => {
  await playTestTone();
  playBtn.textContent = '▶ Playing...';
  playBtn.disabled = true;
  stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
  stopTestTone();
  playBtn.textContent = '▶ Play Test Tone';
  playBtn.disabled = false;
  stopBtn.disabled = true;
});

stopBtn.disabled = true;

// Initialize
initDemo();

