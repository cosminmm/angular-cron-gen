const QUARTZ_REGEX = /^\s*($|#|\w+\s*=|(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?(?:,(?:[0-5]?\d)(?:(?:-|\/|\,)(?:[0-5]?\d))?)*)\s+(\?|\*|(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?(?:,(?:[01]?\d|2[0-3])(?:(?:-|\/|\,)(?:[01]?\d|2[0-3]))?)*)\s+(\?|\*|(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?(?:,(?:0?[1-9]|[12]\d|3[01])(?:(?:-|\/|\,)(?:0?[1-9]|[12]\d|3[01]))?)*)\s+(\?|\*|(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?(?:,(?:[1-9]|1[012])(?:(?:-|\/|\,)(?:[1-9]|1[012]))?(?:L|W)?)*|\?|\*|(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?(?:,(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(?:(?:-)(?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))?)*)\s+(\?|\*|(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-|\/|\,|#)(?:[1-5]))?(?:L)?(?:,(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-|\/|\,|#)(?:[1-5]))?(?:L)?)*|\?|\*|(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?(?:,(?:MON|TUE|WED|THU|FRI|SAT|SUN)(?:(?:-)(?:MON|TUE|WED|THU|FRI|SAT|SUN))?)*)(|\s)+(\?|\*|(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?(?:,(?:|\d{4})(?:(?:-|\/|\,)(?:|\d{4}))?)*))$/;

export class CronGenService {
    constructor() {
    }

    isValid(cronFormat, expression) {
        const formattedExpression = expression.toUpperCase();
        switch (cronFormat) {
            case 'quartz':
                return !!formattedExpression.match(QUARTZ_REGEX);
            default:
                throw `Desired cron format (${cronFormat}) is not available`;
        }
    }

    appendInt(number) {
        const value = `${number}`;
        if (value.length > 1) {
            const secondToLastDigit = value.charAt(value.length - 2);
            if (secondToLastDigit === '1') {
                return "th";
            }
        }
        const lastDigit = value.charAt(value.length - 1);
        switch (lastDigit) {
            case '1':
                return "st";
            case '2':
                return "nd";
            case '3':
                return "rd";
            default:
                return "th";
        }
    }

    padNumber(number) {
        return `${number}`.length === 1 ? `0${number}` : `${number}`;
    }

    range(start, end){
        if(typeof end === 'undefined') {
            end = start;
            start = 0;
        }

        if (start < 0 || end < 0)
            throw 'Range values must be positive values';

        if (end > start){
            return [...new Array(end-start)].map(function (val, idx){return idx + start;});
        }
        else if (start < end)
        {
            return [...new Array(start-end)].map(function (val, idx){return end - idx;});
        }
        else
            return new Array();
    }

    selectOptions({stepMinutes}){
        let minutes = [], fullMinutes = [];;
        if (stepMinutes) minutes = this.range(5, 60).filter((val, ix) => ix%stepMinutes===0);
        else minutes = this.range(1, 60);

        if (stepMinutes) fullMinutes = this.range(60).filter((val, ix) => ix%stepMinutes===0);
        else fullMinutes = this.range(60);
        
        const result = {
            months: this.range(1, 13),
            monthWeeks: ['#1', '#2', '#3', '#4', '#5', 'L'],
            days: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            minutes,
            fullMinutes,
            seconds: this.range(60),
            hours: this.range(0, 24),
            monthDays: this.range(1, 32),
            monthDaysWithLasts: ['1W', ...[...new Array(31)].map((val, idx) => `${idx + 1}`), 'LW', 'L']
        };
        return result;
    }


}