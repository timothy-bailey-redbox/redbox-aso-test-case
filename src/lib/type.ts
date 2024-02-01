export function isNotNil<T>(value: T | null | undefined): value is T {
    return value !== undefined && value !== null;
}
