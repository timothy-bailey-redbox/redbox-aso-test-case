import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "~/components/basic/Card";

type DataType = {
    name: string;
    [key: string]: number | string | undefined;
};

type LineGraphWidgetProps = {
    data: DataType[];
    title: string;
    height?: number;
    dataKeys: string[];
};

export default function GraphWidget({ data, title, height, dataKeys }: LineGraphWidgetProps) {
    return (
        <Card title={title}>
            <ResponsiveContainer height={height ?? 350} width="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    {dataKeys?.map((dataKey) => (
                        <Line type="monotone" key={dataKey} dataKey={dataKey} stroke="black" activeDot={{ r: 8 }} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
