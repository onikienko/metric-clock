export class AnalogClock {
    #canvasParentContainer;
    #canvas;
    #ctx;
    #center;
    #radius;
    #canvasSize;

    constructor(canvasParentContainer, canvasSize) {
        this.#canvasParentContainer = canvasParentContainer;
        this.#canvas = canvasParentContainer.querySelector('canvas');
        this.#ctx = this.#canvas.getContext('2d');
        this.#canvasSize = canvasSize;
        this.#setSizes();
        this.#setListeners();
    }

    static base100ToRadians(base100Number) {
        return 2 * Math.PI * base100Number / 100;
    }

    #drawFaceLines(n, size, ctxStyle, baseMultiplayer = 1) {
        Object.assign(this.#ctx, ctxStyle);
        for (let i = 0; i < n; i++) {
            const radians = AnalogClock.base100ToRadians(i * baseMultiplayer);
            const x1 = this.#center + size * Math.sin(radians);
            const y1 = this.#center + size * -1 * Math.cos(radians);
            const x2 = this.#center + this.#radius * Math.sin(radians);
            const y2 = this.#center + this.#radius * -1 * Math.cos(radians);
            this.#ctx.beginPath();
            this.#ctx.moveTo(x1, y1);
            this.#ctx.lineTo(x2, y2);
            this.#ctx.stroke();
        }
    }

    #drawFace() {
        this.#ctx.beginPath();
        this.#ctx.arc(this.#center, this.#center, this.#radius, 0, 2 * Math.PI);
        this.#ctx.fillStyle = '#333';
        this.#ctx.fill();

        this.#drawFaceLines(20, this.#radius * 0.865, {
            strokeStyle: '#515658',
            lineWidth: 1,
            lineCap: 'round',
        }, 5);

        this.#drawFaceLines(10, this.#radius * 0.86, {
            strokeStyle: '#515658',
            lineWidth: 2,
            lineCap: 'round',
        }, 10);

        this.#drawFaceLines(100, this.#radius * 0.9, {
            strokeStyle: '#515658',
            lineWidth: 1,
            lineCap: 'round',
        });

        // draw numbers
        Object.assign(this.#ctx, {
            font: Math.floor(this.#radius * 0.2) + 'px monospace',
            textBaseline: 'middle',
            textAlign: 'center',
            fillStyle: '#6a8759',
        });
        for (let i = 1; i <= 10; i++) {
            const radians = AnalogClock.base100ToRadians(i * 10);
            const x = this.#center + this.#radius * 0.74 * Math.sin(radians);
            const y = this.#center + this.#radius * 0.74 * -1 * Math.cos(radians);
            this.#ctx.fillText(i.toString(), x, y);
        }

        // draw border
        this.#ctx.beginPath();
        this.#ctx.arc(this.#center, this.#center, this.#radius, 0, 2 * Math.PI);
        this.#ctx.strokeStyle = '#bababa';
        this.#ctx.lineWidth = 4;
        this.#ctx.stroke();
    }

    #drawHand(base100Number, handSize, ctxStyle) {
        const radians = AnalogClock.base100ToRadians(base100Number);
        const x = this.#center + handSize * Math.sin(radians);
        const y = this.#center + handSize * -1 * Math.cos(radians);
        Object.assign(this.#ctx, ctxStyle);
        this.#ctx.beginPath();
        this.#ctx.moveTo(this.#center, this.#center);
        this.#ctx.lineTo(x, y);
        this.#ctx.stroke();
    }

    #drawHourHand(hours) {
        this.#drawHand(hours, this.#radius * 0.5, {
            strokeStyle: '#ffc66d',
            lineWidth: 10,
            lineCap: 'round',
        });
    }

    #drawMinuteHand(minutes) {
        this.#drawHand(minutes, this.#radius * 0.7, {
            strokeStyle: '#cc7832',
            lineWidth: 6,
            lineCap: 'round',
        });
    }

    #drawSecondHand(seconds) {
        this.#drawHand(seconds, this.#radius * 0.85, {
            strokeStyle: '#9876aa',
            lineWidth: 2,
            lineCap: 'round',
        });
    }

    #setSizes() {
        let size = this.#canvasSize;
        if (window.visualViewport.width < this.#canvasSize) {
            size = window.visualViewport.width - 24;
        }
        const scale = window.devicePixelRatio;
        this.#canvas.style.width = `${size}px`;
        this.#canvas.style.height = `${size}px`;
        this.#canvas.width = size * scale;
        this.#canvas.height = size * scale;
        this.#ctx.scale(scale, scale);

        let radius = size / 2;
        this.#center = radius;
        this.#radius = radius * 0.9;
    }

    #setListeners() {
        const resizeObserver = new ResizeObserver(() => this.#setSizes());
        resizeObserver.observe(this.#canvasParentContainer);
    }

    draw(metricTime) {
        this.#ctx.clearRect(0, 0, this.#canvasSize, this.#canvasSize);

        this.#drawFace();
        this.#drawHourHand(metricTime.hours * 10);
        this.#drawMinuteHand(metricTime.minutes);
        this.#drawSecondHand(metricTime.seconds);
    }
}
