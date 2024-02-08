import { type WidgetDataAxes } from "~/types/widgetData";
import { formatDate } from "./date";
import { formatNumber, formatPercent } from "./number";

export function formatWidgetValue<TVal>(value: TVal, format: WidgetDataAxes["format"]) {
    switch (format) {
        case "number":
            return formatNumber(Number(value));
        case "currency":
            return formatNumber(Number(value), true, 2);
        case "date":
            return formatDate(Number(value));
        case "percent":
            return formatPercent(Number(value));
        case "string":
            return String(value);
        case "countryCode":
            return String(value); // TODO - get the country name
        case "appId":
            return String(value); // TODO - get the app name
    }
}
