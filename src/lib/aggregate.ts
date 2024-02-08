import { group } from "d3";
import { type WidgetDataAxes } from "~/types/widgetData";

type AggregateResult = {
    min: number;
    max: number;
    sum: number;
    count: number;
    avg: number;
    counts: Record<string, number>;
};

type AggregateData<T extends Record<string, unknown>> = Record<keyof T, AggregateResult>;

export function aggregateObj<T extends Record<string, unknown>>(data: T[]): AggregateData<T> {
    if (data.length < 1) {
        return {} as AggregateData<T>;
    }

    // @ts-expect-error - I know I haven't filled it in yet, we'll get to it
    const aggregate: Record<keyof T, AggregateResult> = {};

    data.forEach((d) => {
        const keys = Object.keys(d) as (keyof T)[];
        for (const key of keys) {
            const value = d[key];

            if (typeof value === "number") {
                if (key in aggregate) {
                    aggregate[key].min = Math.min(aggregate[key].min, value);
                    aggregate[key].max = Math.max(aggregate[key].max, value);
                    aggregate[key].sum += value;
                    aggregate[key].count++;
                } else {
                    aggregate[key] = {
                        min: value,
                        max: value,
                        sum: value,
                        count: 1,
                        avg: 0,
                        counts: {},
                    };
                }
            }

            if (typeof value === "string") {
                if (key in aggregate) {
                    if (value in aggregate[key].counts) {
                        aggregate[key].counts[value]++;
                    } else {
                        aggregate[key].counts[value] = 1;
                    }
                    aggregate[key].count++;
                } else {
                    aggregate[key] = {
                        min: 0,
                        max: 0,
                        sum: 0,
                        count: 1,
                        avg: 0,
                        counts: {
                            [value]: 1,
                        },
                    };
                }
            }
        }
    });

    for (const key of Object.keys(aggregate)) {
        const aggData = aggregate[key];
        if (aggData) {
            aggData.avg = aggData.sum / aggData.count;
        }
    }

    return aggregate;
}

export function getAggregateValue(aggregate: AggregateResult, details: WidgetDataAxes) {
    if (details.aggregate === "avg") {
        return aggregate.avg;
    }
    if (details.aggregate === "count") {
        return aggregate.count;
    }
    if (details.aggregate === "min") {
        return aggregate.min;
    }
    if (details.aggregate === "max") {
        return aggregate.max;
    }
    if (details.aggregate === "sum") {
        return aggregate.sum;
    }
    if (details.aggregate === "counts") {
        return aggregate.counts;
    }
    return null;
}

export function bucketData<T extends Record<string, unknown>>(
    data: T[],
    key: keyof T,
    details: Record<keyof T, WidgetDataAxes>,
) {
    const groups = group(data, (d) => d[key]);

    const aggregated = [...groups.values()].map((objs) => {
        const aggregate = aggregateObj(objs);

        return Object.fromEntries(
            Object.entries(aggregate).map(([vKey, value]) => {
                if (vKey === key && objs[0]) {
                    return [vKey, objs[0][vKey]];
                }
                return [vKey, getAggregateValue(value, details[vKey]!)];
            }),
        );
    });

    return aggregated;
}
