import { init, stop } from './chip8.js';

const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');

startButton.addEventListener('click', (e) => {
    e.preventDefault();
    const romSelect = document.querySelector('#romSelect');
    const selectedRom = romSelect.options[romSelect.selectedIndex].value;

    init(selectedRom);
});

stopButton.addEventListener('click', (e) => {
    e.preventDefault();
    stop();
});
