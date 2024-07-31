import {AnalogClock} from './AnalogClock.js';
import {ExtDate} from './ExtDate.js';


window.addEventListener('DOMContentLoaded', () => {
    const nodes = {
        digitalMetric: document.getElementById('digitalMetric'),
        canvasParentContainer: document.getElementById('analogContainer'),
    };

    const analogMetricClock = new AnalogClock(nodes.canvasParentContainer, 400);

    const render = () => {
        const date = new ExtDate();
        const metric = date.getMetricTime();
        nodes.digitalMetric.innerHTML = (Math.floor(metric.passed / 1000) / 10000).toFixed(4);
        analogMetricClock.draw(metric);
        requestAnimationFrame(render);
    };

    render();
});
