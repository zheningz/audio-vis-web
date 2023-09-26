let audioContext;
let audio;

// streaming audio
function mousePressed() {
    if (!audioContext) {
        audioContext = new AudioContext();

        audio = document.createElement('audio');

        audio.loop = true;

        audio.src = 'audio/StandardJazzBars.mp3';

        audio.play();

        const source = audioContext.createMediaElementSource(audio);

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