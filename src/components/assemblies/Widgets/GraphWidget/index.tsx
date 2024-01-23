import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "~/components/basic/Card";
import styles from "./graphwidget.module.css";
import { dataColors } from "~/util/colors";

type DataType = {
    name: string;
    [key: string]: number | string | undefined;
};

type GraphWidgetProps = {
    data: DataType[];
    title: string;
    dataKeys: string[];
};

export default function GraphWidget({ data, title, dataKeys }: GraphWidgetProps) {
    return (
        <Card title={title}>
            <ResponsiveContainer height="100%" width="100%" minHeight={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="rgba(121, 35, 210, 1)" stopOpacity={0.8} />
                            <stop offset="90%" stopColor="rgba(255, 121, 0, 1)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="name" stroke="#666" />
                    <YAxis stroke="#666" scale="log" domain={["auto", "auto"]} />
                    <Tooltip
                        wrapperClassName={styles.graphWidgetTooltip}
                        labelClassName={styles.graphWidgetTooltipLabel}
                    />
                    {dataKeys.map((dataKey, index) => (
                        <Area
                            type="monotone"
                            key={dataKey}
                            dataKey={dataKey}
                            stroke={dataColors[index]}
                            fillOpacity={1}
                            fill="url(#gradient)"
                            strokeWidth={4}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
}
