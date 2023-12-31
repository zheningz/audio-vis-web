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

function draw() {
    background('black');

    fill('white');
    noStroke();

    const dim = min(width, height);
    if (audioContext) {
        polygon(width / 2, height / 2, dim * 0.1, 4, PI / 4);
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