import { createRoot } from "react-dom/client";
import { type DashboardAPI } from "types/dashboard";
import { WidgetTypeSchema, type WidgetAPI } from "types/widget";
import { v4 as uuid } from "uuid";
import Card from "~/components/basic/Card";
import DataLoader from "~/components/basic/DataLoader";
import Icons from "~/components/basic/Icons";
import Button from "~/components/basic/inputs/Button";
import { saveDOMNodeImage } from "~/lib/saveImage";
import { delay } from "~/lib/time";
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
    const id = `widget-` + uuid();

    const takeScreenshot = async () => {
        const iconWrap = document.createElement("div");
        createRoot(iconWrap).render(<Icons.Redbox width={126} height={31} />);
        await delay(100);
        await saveDOMNodeImage(`${widget.title} - ${dashboard.name}`, [
            {
                element: iconWrap,
                padding: "32px",
                background: "rgb(235,235,235)",
            },
            {
                selector: `#${id}`,
                padding: "0 32px 16px",
                fixedSize: true,
                background: "rgb(235,235,235)",
            },
        ]);
    };

    return (
        <Card
            title={widget.title}
            actionButton={
                <Button onClick={takeScreenshot}>
                    <Icons.Screenshot width={18} height={18} />
                </Button>
            }
        >
            <DataLoader query={query}>
                {!!widget.description && <p style={{ marginBottom: 8 }}>{widget.description}</p>}
                {query.data && (
                    <div id={id}>
                        <WidgetEl
                            data={query.data}
                            axes={[widget.axis1, widget.axis2, widget.axis3].filter((a) => !!a) as string[]}
                        />
                    </div>
                )}
            </DataLoader>
        </Card>
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
