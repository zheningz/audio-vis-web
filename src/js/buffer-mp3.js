let audioContext;
let audioBuffer;

function mousePressed() {
    playSound();
}

async function loadSound() {
    if (!audioContext) {
        audioContext = new AudioContext;
    }

    // re-use the audio buffer as a source
    if (!audioBuffer) {
        const resp = await fetch("audio/bonus.mp3");

        const buf = await resp.arrayBuffer();

        audioBuffer = await audioContext.decodeAudioData(buf);
    }
}

async function playSound() {
    await loadSound();

    await audioContext.resume();

    const source = audioContext.createBufferSource();

    source.connect(audioContext.destination);

    source.buffer = audioBuffer;

    source.start(0);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}