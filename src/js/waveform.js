let audioContext;
let audioBuffer;
let gainNode;
let analyserNode;
let analyserData;

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

    if (!gainNode) {
        gainNode = audioContext.createGain();

        // create analyser node
        analyserNode = audioContext.createAnalyser();

        // create float32 array
        analyserData = new Float32Array(analyserNode.fftSize);

        gainNode.connect(analyserNode);

        gainNode.connect(audioContext.destination);
    }
}

async function playSound() {
    await loadSound();

    await audioContext.resume();

    const source = audioContext.createBufferSource();

    source.connect(gainNode);

    source.buffer = audioBuffer;

    source.start(0);
}

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0, 0, 0);

    if (analyserNode) {
        noFill();
        stroke('white');

        analyserNode.getFloatTimeDomainData(analyserData);

        beginShape();

        for (let i = 0; i < analyserData.length; i++) {
            const amplitude = analyserData[i];
            
            const y = map(
                amplitude,
                -1, 1, 
                height / 2 - height /4, height / 2 + height /4,
            );

            const x = map(
                i,
                0, analyserData.length - 1,
                0, width,
            );

            vertex(x, y);
        }

        endShape();
    } else {
        fill('white');
        noStroke();
        const dim = min(width, height);
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