// ============================================
// BOLD COLOR VERSION WITH AUDIO (Refactored)
// BlackHole audio input with full audio reactivity
// ============================================

let img, size;
let w = 100;  // Higher resolution
let h = 75;

// Audio setup (p5.sound)
let mic, fft, startButton, audioStarted = false;
let bass = 0, mid = 0, treble = 0, volume = 0;
let bassSmooth = 0, volumeSmooth = 0;

function preload() {
  img = loadImage("../../assets/dandy.jpg");
}

function setup() {
  img.resize(w, 0);
  h = img.height;

  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;
  createCanvas(canvasWidth, canvasHeight);

  size = width / img.width;

  console.log('🎨 p5.js setup complete');

  // Audio button
  startButton = createButton('🎤 START AUDIO (Select BlackHole)');
  startButton.position(20, 20);
  startButton.mousePressed(startAudio);
  startButton.style('padding', '15px 30px');
  startButton.style('font-size', '18px');
  startButton.style('background', '#00ff00');
  startButton.style('border', 'none');
  startButton.style('border-radius', '10px');
  startButton.style('cursor', 'pointer');
  startButton.style('font-weight', 'bold');
  startButton.style('box-shadow', '0 4px 15px rgba(0,255,0,0.4)');
  startButton.style('transition', 'all 0.3s');
  startButton.mouseOver(() => {
    startButton.style('background', '#00cc00');
    startButton.style('transform', 'scale(1.05)');
  });
  startButton.mouseOut(() => {
    startButton.style('background', '#00ff00');
    startButton.style('transform', 'scale(1)');
  });

  console.log('🎛️ Button created. Click to start audio analysis!');
}

function startAudio() {
  if (!audioStarted) {
    console.log('🎤 Starting audio input...');
    console.log('📢 SELECT BLACKHOLE 2CH when browser asks for microphone permission!');

    mic = new p5.AudioIn();
    mic.start();

    fft = new p5.FFT(0.8, 512);
    fft.setInput(mic);

    audioStarted = true;

    startButton.html('🔊 LISTENING TO SYSTEM AUDIO');
    startButton.style('background', '#ff00ff');
    startButton.style('box-shadow', '0 4px 15px rgba(255,0,255,0.6)');

    console.log('✅ Audio input started!');
    console.log('🎵 Play any audio on your Mac - it will be captured via BlackHole!');
  }
}

function draw() {
  background(0);

  // Audio analysis
  if (audioStarted && fft) {
    bass = fft.getEnergy("bass") * 3.0;
    mid = fft.getEnergy("mid") * 3.0;
    treble = fft.getEnergy("treble") * 3.0;

    // Calculate volume from FFT energy (since amp analyzer doesn't work with BlackHole)
    let totalEnergy = fft.getEnergy(20, 20000);
    volume = map(totalEnergy, 0, 255, 0, 1.0);

    bassSmooth = lerp(bassSmooth, bass, 0.7);
    volumeSmooth = lerp(volumeSmooth, volume, 0.6);

    if (frameCount % 30 === 0) {
      console.log(`🎵 Bass=${Math.floor(bassSmooth)} Mid=${Math.floor(mid)} Treble=${Math.floor(treble)} Vol=${volume.toFixed(3)}`);
      if (bassSmooth < 5 && mid < 5 && treble < 5) {
        console.warn('⚠️ NO AUDIO! Check BlackHole selection!');
      }
    }

    // Flash background on heavy bass
    if (bassSmooth > 200) {
      background(20, 0, 0);
    }
  }

  // Pre-calculate effects
  const effects = {
    volumeBoost: audioStarted ? map(volumeSmooth, 0, 0.3, 0, 150) : 0,
    trebleBoost: audioStarted ? map(treble, 0, 255, 0, 100) : 0,
    bassPulse: audioStarted ? map(bassSmooth, 0, 255, 0.5, 4.0) : 1.0,
    midEffect: audioStarted ? map(mid, 0, 255, 1.0, 2.0) : 1.0,
    bassBoost: audioStarted ? map(bassSmooth, 0, 255, 0, 200) : 0,
    midBoost: audioStarted ? map(mid, 0, 255, 0, 180) : 0,
    trebleColorBoost: audioStarted ? map(treble, 0, 255, 0, 190) : 0,
    colorShift: audioStarted ? sin(frameCount * 0.05 + bassSmooth * 0.01) * 50 : 0,
    brightnessFlash: (audioStarted && bassSmooth > 150) ? 1.3 : 1.0
  };

  // Brightness modifier
  const brightMod = (bright) => {
    if (!audioStarted) return bright;
    bright = bright + effects.volumeBoost;
    bright = map(bright, 0, 255, effects.trebleBoost, 255 - effects.trebleBoost);
    bright = bright * effects.brightnessFlash;
    return constrain(bright, 0, 255);
  };

  // Color modifier
  const colorMod = ({ r, g, b }) => {
    if (!audioStarted) return { r, g, b };

    r = r * 1.5 + effects.bassBoost;
    g = g * 1.5 + effects.midBoost;
    b = b * 1.5 + effects.trebleColorBoost;

    if (mid > 100) {
      r *= 0.7;
      b *= 0.7;
    }

    if (treble > 150) {
      r += (treble - 150);
      g += (treble - 150);
      b += (treble - 150);
    }

    r = r + effects.colorShift;
    g = g - effects.colorShift * 0.5;
    b = b + effects.colorShift * 0.8;

    return {
      r: constrain(r, 0, 255),
      g: constrain(g, 0, 255),
      b: constrain(b, 0, 255)
    };
  };

  // Size modifier
  const sizeMod = (i, j) => {
    let charSize = size * 1.1 * effects.bassPulse;

    if (audioStarted) {
      // Wave effect
      let wave = sin((i + j) * 0.1 + frameCount * 0.1) * 0.5 + 0.5;
      charSize *= (1 + (wave * (effects.midEffect - 1)));

      // Ripple from center
      let distFromCenter = dist(i, j, img.width / 2, img.height / 2);
      let ripple = sin(distFromCenter * 0.3 - frameCount * 0.15 - bassSmooth * 0.05) * 0.5 + 0.5;
      charSize *= (1 + ripple * 0.5);

      // Position variation
      let variation = sin(i * 0.5 + frameCount * 0.08) * cos(j * 0.5 + frameCount * 0.06);
      variation *= map(treble, 0, 255, 0, 0.6);
      charSize *= (1 + variation);

      // Volume jitter
      if (volume > 0.2) {
        let jitter = sin(i * j * 0.1 + frameCount * 0.2) * map(volume, 0.2, 1.0, 0, 0.4);
        charSize *= (1 + jitter);
      }
    }

    return charSize;
  };

  // Render
  renderAsciiGrid(img, img.width, img.height, size, ASCII_CONFIG.CHARS.BOLD, {
    useColor: true,
    useBold: true,
    brightMod: brightMod,
    colorMod: colorMod,
    sizeMod: sizeMod
  });

  // Audio debug
  if (audioStarted) {
    drawAudioDebug();
  }
}

function drawAudioDebug() {
  push();
  fill(0, 0, 0, 200);
  noStroke();
  rect(10, height - 150, 280, 140, 10);

  fill(255);
  textSize(14);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  text('🎵 AUDIO LEVELS (BlackHole)', 20, height - 140);

  textStyle(NORMAL);
  textSize(12);

  // Stroking effect based on frequencies
  let strokeMode = 0;
  if (bassSmooth > 80) strokeMode = 1;
  else if (mid > 80) strokeMode = 2;
  else if (treble > 50) strokeMode = 3;

  fill(255, 50, 50);
  let bassBarWidth = map(bassSmooth, 0, 255, 0, 230);
  rect(20, height - 115, bassBarWidth, 20, 3);
  fill(255);
  text(`BASS: ${Math.floor(bassSmooth)} (raw: ${Math.floor(bass)})`, 20, height - 93);

  fill(50, 255, 50);
  let midBarWidth = map(mid, 0, 255, 0, 230);
  rect(20, height - 75, midBarWidth, 20, 3);
  fill(255);
  text(`MID: ${Math.floor(mid)}`, 20, height - 53);

  fill(50, 50, 255);
  let trebleBarWidth = map(treble, 0, 255, 0, 230);
  rect(20, height - 35, trebleBarWidth, 20, 3);
  fill(255);
  text(`TREBLE: ${Math.floor(treble)}`, 20, height - 13);

  // Volume indicator
  fill(255, 255, 0);
  text(`VOL: ${volume.toFixed(3)}`, 20, height - 130);

  pop();
}

function windowResized() {
  let canvasWidth = windowWidth;
  let canvasHeight = (canvasWidth * h) / w;
  resizeCanvas(canvasWidth, canvasHeight);
  size = width / img.width;
}
