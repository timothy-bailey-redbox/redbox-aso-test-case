import { type WidgetDataAxes } from "~/types/widgetData";

export type WidgetElementProps<R = Record<string, unknown>> = {
    data: {
        data: R[];
        details: Record<keyof R, WidgetDataAxes>;
    };
    axes: string[];
};
