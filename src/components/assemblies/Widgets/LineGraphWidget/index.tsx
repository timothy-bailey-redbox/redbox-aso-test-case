import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "~/components/basic/Card";

type DataType = {
    name: string;
    value: number;
};

type LineGraphWidgetProps = {
    data: DataType[];
    title: string;
    height?: number;
};

export default function GraphWidget({ data, title, height }: LineGraphWidgetProps) {
    return (
        <Card title={title}>
            <ResponsiveContainer height={height ?? 350} width="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
}
