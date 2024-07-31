export class ClockSound {
    #ctx = new AudioContext();
    #lastSecond = null;
    playSeconds;

    constructor(playSeconds = false) {
        this.playSeconds = playSeconds;

        document.addEventListener('visibilitychange', () => {
            this.#lastSecond = null;
            this.playSeconds = false;
        });
    }

    #playSecondsSound(seconds) {
        if (!this.playSeconds) return;
        if (this.#lastSecond === null) {
            this.#lastSecond = seconds;
            return;
        }
        if (this.#lastSecond === seconds) return;

        // useful https://marcgg.com/blog/2016/11/01/javascript-audio/
        const o = this.#ctx.createOscillator();
        const g = this.#ctx.createGain();
        g.gain.value = 0.5; // volume
        o.frequency.value = 493.9;
        o.connect(g);
        g.connect(this.#ctx.destination);
        o.start(0);
        g.gain.exponentialRampToValueAtTime(0.00001, this.#ctx.currentTime + 0.07);
        this.#lastSecond = seconds;
    }

    toggleSound() {
        this.#lastSecond = null;
        this.playSeconds = !this.playSeconds;
    }

    update(metric) {
        this.#playSecondsSound(metric.seconds);
    }
}
