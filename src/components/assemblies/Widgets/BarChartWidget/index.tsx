import { type CSSProperties } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { smoothPath } from "svg-smoother";
import { bucketData } from "~/lib/aggregate";
import { dataColors } from "~/lib/color";
import { formatWidgetValue } from "~/lib/widget";
import tooltipStyles from "../Tooltip/tooltip.module.css";
import { type WidgetElementProps } from "../types";

const barColors = [...dataColors];
barColors.splice(0, 0, barColors.splice(1, 1)[0]!);

export default function BarChartWidget({ data: { data, details }, axes }: WidgetElementProps) {
    const [xAxis, ...areas] = axes;

    const groupedData = bucketData(data, xAxis!, details);

    return (
        <ResponsiveContainer height="100%" width="100%" minHeight={300}>
            <BarChart data={groupedData}>
                <defs>
                    <filter id="bar-inner-shadow">
                        <feFlood floodColor="rgba(0,0,0,0.5)" result="fill" />
                        <feOffset dx="6" dy="6" in="SourceGraphic" result="offset" />
                        <feComposite operator="out" in="fill" in2="offset" />
                        <feGaussianBlur stdDeviation="3" />
                        <feComposite operator="atop" in2="SourceGraphic" />
                    </filter>
                    <filter id="bar-emboss">
                        <feFlood floodColor="rgba(255,255,255,0.3)" result="fill" />
                        <feOffset dx="6" dy="6" in="SourceGraphic" result="offset" />
                        <feComposite operator="out" in="fill" in2="offset" />
                        <feGaussianBlur stdDeviation="3" />
                        <feComposite operator="atop" in2="SourceGraphic" />
                    </filter>
                </defs>
                <XAxis
                    dataKey={xAxis}
                    stroke="#666"
                    tickFormatter={(value) => formatWidgetValue(value, details[xAxis!]?.format ?? "number")}
                    interval={"equidistantPreserveStart"}
                    tickLine={false}
                    axisLine={false}
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
                        hide
                    />
                ))}
                <Tooltip
                    wrapperClassName={tooltipStyles.tooltip}
                    labelClassName={tooltipStyles.label}
                    formatter={(value, name, item) =>
                        formatWidgetValue(value, details[item.dataKey as string]?.format ?? "number")
                    }
                    labelFormatter={(value) => formatWidgetValue(value, details[xAxis!]?.format ?? "number")}
                    cursor={false}
                />
                {areas.map((dataKey, index) => (
                    <Bar
                        key={dataKey}
                        dataKey={dataKey}
                        fill={barColors[index]}
                        fillOpacity={1}
                        name={details[dataKey]?.name}
                        yAxisId={dataKey}
                        // @ts-expect-error - Recharts will populate the props here, but TS doesn't know what they should be
                        shape={<CustomBar />}
                        activeBar={false}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}

function CustomBar(props: {
    background: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    x: number;
    y: number;
    width: number;
    height: number;
    fill: CSSProperties["fill"];
    // There is other stuff here, but I'm not using it, so not writing it all out
}) {
    const {
        background: { x: bX, y: bY, width: bWidth, height: bHeight },
        y: fY,
        height: fHeight,
        fill,
    } = props;

    const width = Math.min(bWidth, 32);
    const x = bX + (bWidth - width) * 0.5;

    return (
        <>
            <path
                filter="url(#bar-inner-shadow)"
                d={smoothPath(`M ${x} ${bY} h ${width} v ${bHeight} h ${width * -1} Z`, {
                    radius: 999,
                    allowEllipse: false,
                })}
                fill="white"
            />
            <path
                filter="url(#bar-emboss)"
                d={smoothPath(`M ${x} ${fY} h ${width} v ${fHeight} h ${width * -1} Z`, {
                    radius: 999,
                    allowEllipse: false,
                })}
                fill={fill}
            />
        </>
    );
}
