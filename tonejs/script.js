// ========================================
// BERLIN TECHNO - 157 BPM
// Simplified Version
// ========================================

let initialized = false;
let kickPattern, bassSequence;

async function initialize() {
    if (initialized) return;
    
    await Tone.start();
    initialized = true;
    
    // Set BPM
    Tone.Transport.bpm.value = 157;
    
    // Kick drum
    const kick = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: 'sine' },
        envelope: {
            attack: 0.001,
            decay: 0.4,
            sustain: 0.01,
            release: 1.4
        }
    }).toDestination();
    
    // Bass synth
    const bass = new Tone.MonoSynth({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.005, decay: 0.2, sustain: 0.4, release: 0.3 }
    }).toDestination();
    
    // Patterns
    kickPattern = new Tone.Loop((time) => {
        kick.triggerAttackRelease("C1", "8n", time);
    }, '2n').start(0);
    
    const bassNotes = ['A1', 'A1', 'A2', 'A1', 'A2', 'A1', 'E2', 'G1'];
    bassSequence = new Tone.Sequence((time, note) => {
        bass.triggerAttackRelease(note, '8n', time);
    }, bassNotes, '8n').start(0);
    
    console.log('🔊 BERLIN TECHNO initialized!');
}

// Button handlers
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const playButton = document.getElementById('playButton');
    const stopButton = document.getElementById('stopButton');
    
    if (startButton) {
        startButton.addEventListener('click', async () => {
            await initialize();
            console.log('Audio initialized!');
        });
    }
    
    if (playButton) {
        playButton.addEventListener('click', async () => {
            await initialize();
            Tone.Transport.start();
            console.log('Playing!');
        });
    }
    
    if (stopButton) {
        stopButton.addEventListener('click', () => {
            Tone.Transport.stop();
            console.log('Stopped!');
        });
    }
});
