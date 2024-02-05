import { group, type InternMap } from "d3";

export function uniq<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

export function uniqBy<T>(arr: T[], identifier: keyof T | ((value: T, index: number, values: T[]) => unknown)): T[] {
    if (arr.length < 1) {
        return arr;
    }

    let groups: InternMap<unknown, T[]>;

    if (typeof identifier === "function") {
        groups = group(arr, identifier);
    } else {
        groups = group(arr, (val) => val[identifier]);
    }

    return [...groups.values()].filter((g) => g.length > 0).map((g) => g[0]!);
}
