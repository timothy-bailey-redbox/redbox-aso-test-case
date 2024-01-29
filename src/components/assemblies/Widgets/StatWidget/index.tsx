import clsx from "clsx";
import Icons, { isIcon } from "~/components/basic/Icons";
import { aggregateObj, getAggregateValue } from "~/lib/aggregate";
import { formatWidgetValue } from "~/lib/widget";
import { type WidgetElementProps } from "../types";
import styles from "./statwidget.module.css";

export default function StatWidget({ data: { data, details }, axes }: WidgetElementProps) {
    const axis = axes[0];
    if (!axis) {
        return null;
    }

    const aggregate = aggregateObj(data);
    const axisValues = aggregate[axis];
    const detail = details[axis];

    if (!axisValues || !detail) {
        return null;
    }

    const value = getAggregateValue(axisValues, detail);

    if (typeof value !== "number") {
        return null;
    }

    const iconName = axes[1];

    const Icon = isIcon(iconName) ? Icons[iconName] : Icons.Click;
    return (
        <div className={styles.statWidget}>
            <div>
                <p className={styles.stat}>{formatWidgetValue(value, detail.format)}</p>
                <p className={styles.description}>{detail?.name}</p>
            </div>
            <div className={clsx(styles.iconContainer, "u-concave")}>
                <Icon width={32} height={32} className={styles.icon} />
            </div>
        </div>
    );
}
