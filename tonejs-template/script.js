// ================================================
// TONE.JS TEMPLATE
// A simple techno pattern to get you started
// ================================================

// Set BPM
Tone.Transport.bpm.value = 128;

// ================================================
// INSTRUMENTS
// ================================================

// Kick Drum - Deep and punchy
const kick = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 10,
    oscillator: { type: "sine" },
    envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0.01,
        release: 1.4,
        attackCurve: "exponential"
    }
}).toDestination();

// Snare Drum - Snappy with noise
const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.2
    }
}).toDestination();

// Hi-Hat - Crispy highs
const hihat = new Tone.MetalSynth({
    frequency: 200,
    envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0.01
    },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5
}).toDestination();

// Bass Synth - Deep and driving
const bass = new Tone.MonoSynth({
    oscillator: { type: "sawtooth" },
    filter: {
        Q: 2,
        type: "lowpass",
        rolloff: -24
    },
    envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.4,
        release: 0.8
    },
    filterEnvelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.6,
        release: 0.8,
        baseFrequency: 200,
        octaves: 2.5
    }
}).toDestination();

// Add some compression to glue it all together
const compressor = new Tone.Compressor(-20, 3);
kick.connect(compressor);
snare.connect(compressor);
hihat.connect(compressor);
bass.connect(compressor);
compressor.toDestination();

// ================================================
// PATTERNS
// ================================================

// Kick pattern: Four on the floor
const kickPattern = new Tone.Sequence(
    (time, note) => {
        kick.triggerAttackRelease("C1", "8n", time);
    },
    ["C1", null, "C1", null, "C1", null, "C1", null],
    "8n"
);

// Snare pattern: On the 2 and 4
const snarePattern = new Tone.Sequence(
    (time) => {
        snare.triggerAttackRelease("4n", time);
    },
    [null, "C1", null, "C1"],
    "4n"
);

// Hi-hat pattern: Steady eighth notes with variation
const hihatPattern = new Tone.Sequence(
    (time, velocity) => {
        hihat.triggerAttackRelease("32n", time, velocity);
    },
    [0.6, 0.3, 0.6, 0.3, 0.6, 0.3, 0.8, 0.3],
    "8n"
);

// Bass pattern: Simple riff
const bassPattern = new Tone.Sequence(
    (time, note) => {
        if (note) {
            bass.triggerAttackRelease(note, "8n", time);
        }
    },
    ["A1", null, "A1", null, "F1", null, "A1", "G1"],
    "8n"
);

// ================================================
// CONTROLS
// ================================================

let isPlaying = false;

const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const status = document.getElementById("status");

// Play button
playBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (!isPlaying) {
        // Start Tone.js audio context (required by browsers)
        await Tone.start();
        console.log("Audio context started");

        // Start all patterns
        kickPattern.start(0);
        snarePattern.start(0);
        hihatPattern.start(0);
        bassPattern.start(0);

        // Start transport
        Tone.Transport.start();

        isPlaying = true;
        status.textContent = "Status: Playing";
        status.className = "status playing";

        console.log("Playing at " + Tone.Transport.bpm.value + " BPM");
    }
});

// Stop button
stopBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (isPlaying) {
        // Stop transport
        Tone.Transport.stop();

        // Stop all patterns
        kickPattern.stop();
        snarePattern.stop();
        hihatPattern.stop();
        bassPattern.stop();

        isPlaying = false;
        status.textContent = "Status: Stopped";
        status.className = "status stopped";

        console.log("Stopped");
    }
});

// ================================================
// INFO
// ================================================

console.log("=================================");
console.log("TONE.JS TEMPLATE");
console.log("=================================");
console.log("BPM:", Tone.Transport.bpm.value);
console.log("Time Signature:", Tone.Transport.timeSignature);
console.log("");
console.log("Click play to start!");
console.log("Edit this file to create your own patterns.");
console.log("=================================");
