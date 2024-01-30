import { type DashboardAPI } from "types/dashboard";
import { WidgetTypeSchema, type WidgetAPI } from "types/widget";
import Card from "~/components/basic/Card";
import DataLoader from "~/components/basic/DataLoader";
import { useWidgetDataQuery } from "~/queries/widgetData";
import BarChartWidget from "./BarChartWidget";
import DialWidget from "./DialWidget";
import GraphWidget from "./GraphWidget";
import PieChartWidget from "./PiechartWidget";
import StatWidget from "./StatWidget";
import { type WidgetElementProps } from "./types";

type WidgetProps = {
    dashboard: DashboardAPI;
    widget: WidgetAPI;
};

export default function Widget({ widget, dashboard }: WidgetProps) {
    const query = useWidgetDataQuery(dashboard, widget);

    const WidgetEl = getWidgetElement(widget);

    return (
        <DataLoader query={query}>
            <Card title={widget.title}>
                {query.data && (
                    <WidgetEl
                        data={query.data}
                        axes={[widget.axis1, widget.axis2, widget.axis3].filter((a) => !!a) as string[]}
                    />
                )}
            </Card>
        </DataLoader>
    );
}

function getWidgetElement(widget: WidgetAPI) {
    switch (widget.type) {
        case WidgetTypeSchema.Values.LINE_GRAPH:
            return GraphWidget;
        case WidgetTypeSchema.Values.PIE_CHART:
            return PieChartWidget;
        case WidgetTypeSchema.Values.STAT:
            return StatWidget;
        case WidgetTypeSchema.Values.BAR_CHART:
            return BarChartWidget;
        case WidgetTypeSchema.Values.DIALS:
            return DialWidget;
        case WidgetTypeSchema.Values.TABLE:
        default:
            const NullWidget = (_props: WidgetElementProps) => <></>;
            return NullWidget; //TODO
    }
}
