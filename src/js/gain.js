let audioContext;
let audio;
let gainNode;

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

        // create a gain node
        gainNode = audioContext.createGain();

        source.connect(gainNode);

        // wire the gain to speaker
        gainNode.connect(audioContext.destination);
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
        const volume = abs(mouseY - height / 2) / (height / 2);
        
        // gainNode.gain.value = volume;
        // schedule a gradual shift in value with a small time constant
        gainNode.gain.setTargetAtTime(volume, audioContext.currentTime, 0.01);

        // draw a volume meter
        rectMode(CENTER);
        rect(width / 2, height / 2, dim * 0.05, dim * volume);
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