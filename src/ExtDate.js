export class ExtDate extends Date {
    #MSEC_IN_REGULAR_DAY = 86400000;

    /**
     * Convert regular time timestamp to metric time
     * @param timestamp
     * @returns {{milliseconds: number, hours: number, seconds: number, minutes: number, passed: number}}
     */
    convertTimestampToMetricTime(timestamp) {
        if (typeof timestamp !== 'number') throw new Error('Timestamp must be a number');
        const clone = new Date(timestamp);
        clone.setHours(0, 0, 0, 0);

        const midnight = clone.getTime();
        const msecPassed = timestamp - midnight;
        const metricMsecPassed = msecPassed * 100000000 / this.#MSEC_IN_REGULAR_DAY;

        return {
            passed: metricMsecPassed,
            hours: Math.floor(metricMsecPassed / (1000 * 100 * 100)),
            minutes: Math.floor(metricMsecPassed / (1000 * 100) % 100),
            seconds: Math.floor(metricMsecPassed / 1000 % 100),
            milliseconds: Math.floor(metricMsecPassed % 1000),
        };
    }

    /**
     * Return metric time
     * @returns {{milliseconds: number, hours: number, seconds: number, minutes: number, passed: number}}
     */
    getMetricTime() {
        const now = this.getTime();
        return this.convertTimestampToMetricTime(now);
    }
}
