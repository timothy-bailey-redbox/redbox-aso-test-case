export function calculatePercentage(value: number, min: number, max: number): number {
    return safeDivide(value - min, max - min);
}

export function calculateClampedPercentage(value: number, min: number, max: number) {
    const percent = calculatePercentage(value, min, max);
    return clamp(0, percent, 1);
}

export function clamp(min: number, value: number, max: number) {
    return Math.min(Math.max(min, value), max);
}

const getFormat = ({ useGrouping, decimalPlaces }: { useGrouping: boolean; decimalPlaces: number }) =>
    new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimalPlaces,
        useGrouping,
    });

export function numberFormatter(useGrouping = true, decimalPlaces = 0) {
    const formatter = getFormat({ useGrouping, decimalPlaces });
    return (value = 0) => formatter.format(value).replace(/-/, "\u2212");
}

export function formatNumber(value = 0, useGrouping = true, decimalPlaces = 0) {
    return numberFormatter(useGrouping, decimalPlaces)(value);
}

export function percentFormatter(decimalPlaces = 2) {
    const formatter = getFormat({ useGrouping: false, decimalPlaces });
    return (value = 0) => formatter.format(value * 100) + "%";
}

export function formatPercent(value = 0, decimalPlaces = 2) {
    return percentFormatter(decimalPlaces)(value);
}

export function safeNumber(num: unknown): number {
    if (typeof num !== "number" || isNaN(num)) {
        return 0;
    }
    return num;
}

export function safeDivide(a: number, b: number): number {
    a = safeNumber(a);
    b = safeNumber(b);
    if (a === 0 && b === 0) {
        return 0;
    }
    return a / b;
}

export function safeSum(a: number, b: number): number {
    a = safeNumber(a);
    b = safeNumber(b);
    return a + b;
}

export function safeSub(a: number, b: number): number {
    a = safeNumber(a);
    b = safeNumber(b);
    return a - b;
}
