import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { aggregateObj } from "~/lib/aggregate";
import { dataColors } from "~/lib/color";
import { formatWidgetValue } from "~/lib/widget";
import tooltipStyles from "../Tooltip/tooltip.module.css";
import { type WidgetElementProps } from "../types";
import styles from "./piechartwidget.module.css";

export default function PieChartWidget({ data: { data, details }, axes }: WidgetElementProps) {
    const aggregate = aggregateObj(data);
    const [axis] = axes;
    if (!axis) {
        return null;
    }
    const value = aggregate[axis];
    const detail = details[axis];
    if (!value || !detail) {
        return null;
    }

    const pieData = Object.entries(value.counts).map(([key, value]) => ({
        name: key,
        value,
    }));

    return (
        <ResponsiveContainer width={"100%"} height={"100%"} minHeight={350}>
            <PieChart>
                <Pie
                    className={styles.piechartWidget}
                    data={pieData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    stroke="none"
                    isAnimationActive={false}
                    legendType="circle"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={dataColors[index]} />
                    ))}
                </Pie>
                <Tooltip
                    wrapperClassName={tooltipStyles.tooltip}
                    labelClassName={tooltipStyles.label}
                    itemStyle={{ color: "var(--normal-text-color)", fontWeight: "700" }}
                    formatter={(value) => formatWidgetValue(value, detail.format)}
                />
                <Legend formatter={(value) => <span className={styles.piechartWidgetLegend}>{value}</span>} />
            </PieChart>
        </ResponsiveContainer>
    );
}
