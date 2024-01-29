import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dataColors } from "~/lib/color";
import { formatWidgetValue } from "~/lib/widget";
import tooltipStyles from "../Tooltip/tooltip.module.css";
import { type WidgetElementProps } from "../types";

export default function GraphWidget({ data: { data, details }, axes }: WidgetElementProps) {
    const [xAxis, ...areas] = axes;

    return (
        <ResponsiveContainer height="100%" width="100%" minHeight={300}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="graphWidgetGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="rgba(121, 35, 210, 1)" stopOpacity={0.8} />
                        <stop offset="90%" stopColor="rgba(255, 121, 0, 1)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                <XAxis
                    dataKey={xAxis}
                    stroke="#666"
                    tickFormatter={(value) => formatWidgetValue(value, details[xAxis!]?.format ?? "number")}
                    interval={"equidistantPreserveStart"}
                />
                {areas.map((dataKey, index) => (
                    <YAxis
                        key={dataKey}
                        stroke="#666"
                        scale="linear"
                        yAxisId={dataKey}
                        tickFormatter={(value) => formatWidgetValue(value, details[dataKey]?.format ?? "number")}
                        orientation={index % 2 === 0 ? "left" : "right"}
                        interval={"equidistantPreserveStart"}
                    />
                ))}
                <Tooltip
                    wrapperClassName={tooltipStyles.tooltip}
                    labelClassName={tooltipStyles.label}
                    formatter={(value, name, item) =>
                        formatWidgetValue(value, details[item.dataKey as string]?.format ?? "number")
                    }
                    labelFormatter={(value) => formatWidgetValue(value, details[xAxis!]?.format ?? "number")}
                />
                {areas.map((dataKey, index) => (
                    <Area
                        type="monotone"
                        key={dataKey}
                        dataKey={dataKey}
                        stroke={dataColors[index]}
                        fillOpacity={1}
                        fill="url(#graphWidgetGradient)"
                        strokeWidth={2}
                        name={details[dataKey]?.name}
                        yAxisId={dataKey}
                    />
                ))}
            </AreaChart>
        </ResponsiveContainer>
    );
}
