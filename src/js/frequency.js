let audioContext;
let audio;
let gainNode;
let analyserNode;
let frequencyData;

// streaming audio
function mousePressed() {
    if (!audioContext) {
        audioContext = new AudioContext();

        audio = document.createElement('audio');

        audio.loop = true;

        audio.src = 'audio/StandardJazzBars.mp3';

        audio.play();

        // create a media element source node
        const source = audioContext.createMediaElementSource(audio);

        analyserNode = audioContext.createAnalyser();

        analyserNode.fftSize = 2048 * 2;

        // defaults
        analyserNode.mixDecibels = -100;
        analyserNode.maxDecibels = -30;

        frequencyData = new Float32Array(analyserNode.fftSize);

        source.connect(analyserNode);

        source.connect(audioContext.destination);
    } else {
        // stop the audio
        audio.pause();
        audioContext.close();
        audioContext = audio = null;
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background('black');

    fill('white');
    noStroke();

    const dim = min(width, height);
    if (audioContext) {
        analyserNode.getFloatFrequencyData(frequencyData);
    
        const cx = width / 2;
        const cy = height / 2;
        const radius = dim * 0.75;
        strokeWeight(dim * 0.0075);
    
        noFill();
    
        // draw the frequency signals
        stroke("#E84420");
        const drum = audioSignal(analyserNode, frequencyData, 3000, 7000);
        circle(cx, cy, 1.5 * radius * drum);
    
        stroke("#F4CD00");
        const voice = audioSignal(analyserNode, frequencyData, 50, 350);
        circle(cx, cy, radius * voice);
    } else {
        polygon(width / 2, height / 2, dim * 0.1, 3);
    }
}

function polygon(x, y, radius, sides = 3, angle = 0) {
    beginShape();
    for (let i = 0; i < sides; i++) {
      const a = angle + TWO_PI * (i / sides);
      let sx = x + cos(a) * radius;
      let sy = y + sin(a) * radius;
      vertex(sx, sy);
    }
    endShape(CLOSE);
}

// Convert the frequency in Hz to an index in the array
function frequencyToIndex(frequencyHz, sampleRate, frequencyBinCount) {
    const nyquist = sampleRate / 2;
    const index = Math.round((frequencyHz / nyquist) * frequencyBinCount);
    return Math.min(frequencyBinCount, Math.max(0, index));
}
  
// Convert an index in a array to a frequency in Hz
function indexToFrequency(index, sampleRate, frequencyBinCount) {
    return (index * sampleRate) / (frequencyBinCount * 2);
}
  
// Get the normalized audio signal (0..1) between two frequencies
function audioSignal(analyser, frequencies, minHz, maxHz) {
    if (!analyser) return 0;
    const sampleRate = analyser.context.sampleRate;
    const binCount = analyser.frequencyBinCount;
    let start = frequencyToIndex(minHz, sampleRate, binCount);
    const end = frequencyToIndex(maxHz, sampleRate, binCount);
    const count = end - start;
    let sum = 0;
    for (; start < end; start++) {
        sum += frequencies[start];
    }

    const minDb = analyserNode.minDecibels;
    const maxDb = analyserNode.maxDecibels;
    const valueDb = count === 0 || !isFinite(sum) ? minDb : sum / count;
    return map(valueDb, minDb, maxDb, 0, 1, true);
}