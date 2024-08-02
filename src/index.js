import {AnalogClock} from './AnalogClock.js';
import {ClockSound} from './ClockSound.js';
import {ExtDate} from './ExtDate.js';


window.addEventListener('DOMContentLoaded', () => {
    const nodes = {
        digitalMetric: document.getElementById('digitalMetric'),
        canvasParentContainer: document.getElementById('analogContainer'),
        toggleSound: document.getElementById('toggleSound'),
    };

    const analogMetricClock = new AnalogClock(nodes.canvasParentContainer, 400);
    const clockSound = new ClockSound();

    const render = () => {
        const date = new ExtDate();
        const metric = date.getMetricTime();
        nodes.digitalMetric.innerHTML = (Math.floor(metric.passed / 1000) / 10000).toFixed(4);
        analogMetricClock.draw(metric);
        clockSound.update(metric);
        requestAnimationFrame(render);
    };

    nodes.toggleSound.addEventListener('click', (e) => {
        e.preventDefault();
        clockSound.toggleSound();
    });

    render();
});
