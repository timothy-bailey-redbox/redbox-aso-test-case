import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import Card from "~/components/basic/Card";
import styles from "./piechartwidget.module.css";
import { dataColors } from "~/util/colors";

type PieSlice = {
    name: string;
    value: number;
};

type PieChartWidgetProps = {
    data: PieSlice[];
    title: string;
};

export default function PieChartWidget({ data, title }: PieChartWidgetProps) {
    return (
        <Card title={title}>
            <ResponsiveContainer width={"100%"} height={"100%"} minHeight={350}>
                <PieChart>
                    <Pie
                        className={styles.piechartWidget}
                        data={data}
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
                        wrapperClassName={styles.piechartWidgetTooltip}
                        itemStyle={{ color: "var(--normal-text-color)", fontWeight: "700" }}
                    />
                    <Legend formatter={(value) => <span className={styles.piechartWidgetLegend}>{value}</span>} />
                </PieChart>
            </ResponsiveContainer>
        </Card>
    );
}
