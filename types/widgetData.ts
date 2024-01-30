export type WidgetDataAxes = {
    name: string;
    aggregate: "avg" | "sum" | "count" | "counts" | "min" | "max" | "none";
    format: "number" | "date" | "string" | "currency" | "countryCode" | "appId" | "percent";
};
