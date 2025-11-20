// ========================================
// BERLIN TECHNO - 157 BPM
// Tone.js Version - Simplified Standalone
// Attack Magazine Layered Kick Technique
// ========================================

let initialized = false;

// Variables
let kick909, kick808, clap, closedHat, openHat, technoBass, stabs;
let kick909HPF, kick909LPF, kick909Distortion, kick909Volume;
let kick808HPF, kick808LPF, kick808Volume;
let clapHPF, clapLPF, clapDistortion, clapDelay, clapReverb, clapVolume;
let closedHatHPF, closedHatCrusher, closedHatPanner, closedHatVolume;
let openHatHPF, openHatDelay, openHatPanner, openHatVolume;
let bassHPF, bassLPF, bassSaturation, bassCrusher, bassReverb, bassVolume;
let stabsHPF, stabsLPF, stabsDistortion, stabsDelay, stabsReverb, stabsPanner, stabsVolume;
let masterHPF, masterLPF, masterDelay, masterReverb, masterVolume;
let kickPattern, clapPattern, closedHatPattern, openHatPattern, bassSequence, stabsSequence;
let bassTransposeIndex = 0;
let stabsChordIndex = 0;

async function start() {
    if (initialized) {
        Tone.Transport.start();
        console.log('Transport restarted');
        return;
    }
    
    console.log('Starting audio context...');
    await Tone.start();
    console.log('Audio context started:', Tone.context.state);
    initialized = true;
    
    // Set BPM
    Tone.Transport.bpm.value = 157;
    
    // Create synths (using synthesized sounds, no samples needed)
    kick909 = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 10,
        oscillator: { type: 'sine' },
        envelope: {
            attack: 0.001,
            decay: 0.4,
            sustain: 0.01,
            release: 1.4,
            attackCurve: 'exponential'
        }
    });
    
    kick808 = new Tone.MembraneSynth({
        pitchDecay: 0.05,
        octaves: 8,
        oscillator: { type: 'sine' },
        envelope: {
            attack: 0.001,
            decay: 0.6,
            sustain: 0.01,
            release: 1.8,
            attackCurve: 'exponential'
        }
    });
    
    clap = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
            attack: 0.001,
            decay: 0.1,
            sustain: 0,
            release: 0.1
        }
    });
    
    closedHat = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
            attack: 0.001,
            decay: 0.05,
            sustain: 0,
            release: 0.05
        }
    });
    
    openHat = new Tone.NoiseSynth({
        noise: { type: 'white' },
        envelope: {
            attack: 0.001,
            decay: 0.2,
            sustain: 0,
            release: 0.2
        }
    });
    
    // Effects chains
    kick909HPF = new Tone.Filter(50, 'highpass');
    kick909LPF = new Tone.Filter(120, 'lowpass');
    kick909Distortion = new Tone.Distortion(0.2);
    kick909Volume = new Tone.Volume(Tone.gainToDb(0.7));
    
    kick909HPF.connect(kick909LPF);
    kick909LPF.connect(kick909Distortion);
    kick909Distortion.connect(kick909Volume);
    kick909Volume.toDestination();
    kick909.connect(kick909HPF);
    
    kick808HPF = new Tone.Filter(35, 'highpass');
    kick808LPF = new Tone.Filter(80, 'lowpass');
    kick808Volume = new Tone.Volume(Tone.gainToDb(0.4));
    
    kick808HPF.connect(kick808LPF);
    kick808LPF.connect(kick808Volume);
    kick808Volume.toDestination();
    kick808.connect(kick808HPF);
    
    clapHPF = new Tone.Filter(200, 'highpass');
    clapLPF = new Tone.Filter(8000, 'lowpass');
    clapDistortion = new Tone.Distortion(0.15);
    clapDelay = new Tone.FeedbackDelay('8n', 0.1);
    clapReverb = new Tone.Reverb(0.1);
    clapVolume = new Tone.Volume(Tone.gainToDb(0.7));
    
    clapHPF.connect(clapLPF);
    clapLPF.connect(clapDistortion);
    clapDistortion.connect(clapDelay);
    clapDelay.connect(clapReverb);
    clapReverb.connect(clapVolume);
    clapVolume.toDestination();
    clap.connect(clapHPF);
    
    closedHatHPF = new Tone.Filter(8000, 'highpass');
    closedHatCrusher = new Tone.BitCrusher(8);
    closedHatPanner = new Tone.Panner(0.3);
    closedHatVolume = new Tone.Volume(Tone.gainToDb(0.3));
    
    closedHatHPF.connect(closedHatCrusher);
    closedHatCrusher.connect(closedHatPanner);
    closedHatPanner.connect(closedHatVolume);
    closedHatVolume.toDestination();
    closedHat.connect(closedHatHPF);
    
    openHatHPF = new Tone.Filter(4000, 'highpass');
    openHatDelay = new Tone.FeedbackDelay('8n', 0.15);
    openHatPanner = new Tone.Panner(-0.3);
    openHatVolume = new Tone.Volume(Tone.gainToDb(0.4));
    
    openHatHPF.connect(openHatDelay);
    openHatDelay.connect(openHatPanner);
    openHatPanner.connect(openHatVolume);
    openHatVolume.toDestination();
    openHat.connect(openHatHPF);
    
    bassHPF = new Tone.Filter(35, 'highpass');
    bassLPF = new Tone.Filter(400, 'lowpass', 15);
    bassSaturation = new Tone.Distortion(0.5);
    bassCrusher = new Tone.BitCrusher(8);
    bassReverb = new Tone.Reverb(0.05);
    bassVolume = new Tone.Volume(Tone.gainToDb(0.75));
    
    bassHPF.connect(bassLPF);
    bassLPF.connect(bassSaturation);
    bassSaturation.connect(bassCrusher);
    bassCrusher.connect(bassReverb);
    bassReverb.connect(bassVolume);
    bassVolume.toDestination();
    
    technoBass = new Tone.MonoSynth({
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
    
    stabsHPF = new Tone.Filter(400, 'highpass');
    stabsLPF = new Tone.Filter(3000, 'lowpass', 5);
    stabsDistortion = new Tone.Distortion(0.3);
    stabsDelay = new Tone.FeedbackDelay('8n', 0.25);
    stabsReverb = new Tone.Reverb(0.3);
    stabsPanner = new Tone.Panner(0);
    stabsVolume = new Tone.Volume(Tone.gainToDb(0.5));
    
    stabsHPF.connect(stabsLPF);
    stabsLPF.connect(stabsDistortion);
    stabsDistortion.connect(stabsDelay);
    stabsDelay.connect(stabsReverb);
    stabsReverb.connect(stabsPanner);
    stabsPanner.connect(stabsVolume);
    stabsVolume.toDestination();
    
    stabs = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: 'sawtooth', count: 7, spread: 40 },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.2 }
    }).connect(stabsHPF);
    
    masterHPF = new Tone.Filter(35, 'highpass');
    masterLPF = new Tone.Filter(15000, 'lowpass');
    masterDelay = new Tone.FeedbackDelay('8n', 0.25);
    masterReverb = new Tone.Reverb({ decay: 0.5, wet: 0.1 });
    masterVolume = new Tone.Volume(Tone.gainToDb(0.8));
    
    masterHPF.connect(masterLPF);
    masterLPF.connect(masterDelay);
    masterDelay.connect(masterReverb);
    masterReverb.connect(masterVolume);
    masterVolume.toDestination();
    
    // Patterns
    kickPattern = new Tone.Loop((time) => {
        kick909.triggerAttackRelease("C1", "8n", time);
        kick808.triggerAttackRelease("C1", "8n", time);
    }, '2n').start(0);
    
    clapPattern = new Tone.Pattern((time) => {
        clap.triggerAttackRelease("8n", time);
    }, [null, 0, null, 0], 'upDown').start(0);
    clapPattern.interval = '4n';
    
    closedHatPattern = new Tone.Pattern((time, index) => {
        if (index !== null) {
            closedHat.triggerAttackRelease("8n", time);
        }
    }, [null, null, 0, null], 'up').start(0);
    closedHatPattern.interval = '4n';
    
    openHatPattern = new Tone.Pattern((time, index) => {
        if (index !== null) {
            openHat.triggerAttackRelease("8n", time);
        }
    }, [null, 0, null, null], 'up').start(0);
    openHatPattern.interval = '4n';
    
    const bassNotes = [
        'A1', 'A1', 'A2', 'A1', 'A2', 'A1', 'A1', 'E2', 
        'A1', 'G1', 'A1', 'A1', 'A2'
    ];
    const bassTranspose = [0, 0, 0, 5, 7];
    bassTransposeIndex = 0;
    
    bassSequence = new Tone.Sequence((time, note) => {
        const transpose = bassTranspose[bassTransposeIndex % bassTranspose.length];
        const transposedNote = Tone.Frequency(note).transpose(transpose);
        technoBass.triggerAttackRelease(transposedNote, '8n', time);
    }, bassNotes, '16n').start(0);
    
    new Tone.Loop(() => {
        bassTransposeIndex++;
    }, '4m').start(0);
    
    const stabsChords = [
        null,
        ['A3', 'C4', 'E4'],
        null,
        ['A3', 'C4', 'E4', 'G4']
    ];
    stabsChordIndex = 0;
    
    stabsSequence = new Tone.Loop((time) => {
        const chord = stabsChords[stabsChordIndex % stabsChords.length];
        if (chord) {
            stabs.triggerAttackRelease(chord, '4n', time);
        }
        stabsChordIndex++;
    }, '4n').start(0);
    
    // Start transport
    Tone.Transport.start();
    
    console.log('🔊 BERLIN TECHNO - 157 BPM playing!');
    console.log('Transport state:', Tone.Transport.state);
    console.log('BPM:', Tone.Transport.bpm.value);
    console.log('Patterns started:', {
        kick: kickPattern.state,
        clap: clapPattern.state,
        bass: bassSequence.state,
        stabs: stabsSequence.state
    });
}

// Button handler
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, setting up button...');
    const playBTN = document.getElementById('playBTN');
    if (playBTN) {
        console.log('Button found, adding listener');
        playBTN.addEventListener('click', async (e) => {
            e.preventDefault();
            console.log('Button clicked!');
            try {
                await start();
            } catch (error) {
                console.error('Error starting:', error);
            }
        });
    } else {
        console.error('Button not found!');
    }
});
