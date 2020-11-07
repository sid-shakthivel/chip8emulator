class Speaker {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
    }

    play(frequency) {
        if (this.audioCtx && !this.oscillator) {
            this.oscillator = this.audioCtx.createOscillator();

            this.oscillator.type = 'square';

            this.oscillator.frequency.setValueAtTime(
                frequency,
                this.audioCtx.currentTime
            );

            this.oscillator.connect(this.audioCtx.destination);
            this.oscillator.start();
        }
    }

    stop() {
        if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
        }
    }
}

export default Speaker;
