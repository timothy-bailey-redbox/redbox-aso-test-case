export function calculatePercentage(value: number, min: number, max: number): number {
    return Math.round(((value - min) / (max - min)) * 100);
}
