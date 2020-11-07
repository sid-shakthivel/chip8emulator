import Renderer from './renderer.js';
import Keyboard from './Keyboard.js';
import Speaker from './speaker.js';
import CPU from './cpu.js';

let renderer;
let keyboard;
let speaker;
let cpu;

let loop;

let fps = 1000,
    fpsInterval,
    startTime,
    now,
    then,
    elapsed;

function init(rom) {
    fpsInterval = 1000 / fps;
    startTime = then;
    then = Date.now();

    renderer = new Renderer(10);
    keyboard = new Keyboard();
    speaker = new Speaker();
    cpu = new CPU(renderer, keyboard, speaker);

    cpu.load(rom);

    window.requestAnimationFrame(step);
}

function step() {
    now = Date.now();
    elapsed = now - then;

    if (elapsed > fpsInterval) {
        cpu.step();
    }

    window.requestAnimationFrame(step);
}

function stop() {
    cpu.paused = true;
}

export { init, stop, cpu };
