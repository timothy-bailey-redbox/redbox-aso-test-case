export function cssVar(varName: string, element: Element = document.documentElement): string {
    return getComputedStyle(element).getPropertyValue(varName);
}
