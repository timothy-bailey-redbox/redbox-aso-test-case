import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "~/components/basic/Card";

interface GraphWidgetProps {
    data: { name: string; uv: number; pv: number; amt: number }[];
    title: string;
}

const GraphWidget = ({ data, title }: GraphWidgetProps) => {
    return (
        <Card title={title}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default GraphWidget;
