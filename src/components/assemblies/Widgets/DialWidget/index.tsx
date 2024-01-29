import { aggregateObj, getAggregateValue } from "~/lib/aggregate";
import { calculatePercentage, clamp } from "~/lib/number";
import { formatWidgetValue } from "~/lib/widget";
import { type WidgetElementProps } from "../types";
import styles from "./dialwidget.module.css";

export default function DialWidget({ data: { data, details }, axes }: WidgetElementProps) {
    const aggregate = aggregateObj(data);

    return (
        <div className={styles.dialContainer}>
            {axes.map((axis, index) => {
                const axisValues = aggregate[axis];
                const detail = details[axis];

                if (!axisValues || !detail) {
                    return null;
                }

                const value = getAggregateValue(axisValues, detail);

                if (typeof value !== "number") {
                    return null;
                }

                const percentage = calculatePercentage(value, axisValues.min, axisValues.max);
                return (
                    <div key={index} className={styles.dial}>
                        <div className={styles.dialPercentageWrapper}>
                            <div
                                className={styles.dialPercentage}
                                style={{ "--percentage": `${clamp(0, percentage * 100, 100)}%` }}
                            />
                            <div className={styles.dialText}>{formatWidgetValue(value, detail.format)}</div>
                        </div>
                        <div className={styles.dialLabel}>{detail?.name}</div>
                    </div>
                );
            })}
        </div>
    );
}
