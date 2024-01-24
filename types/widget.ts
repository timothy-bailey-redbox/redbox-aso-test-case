import { z } from "zod";
import { IdSchema } from "./generic";

const MAX_GRID_SIZE = 12;

export const WidgetTypeSchema = z.enum(["TABLE", "LINE_GRAPH", "PIE_CHART", "BAR_CHART", "STAT", "DIALS"]);
export type WidgetType = z.infer<typeof WidgetTypeSchema>;

export const DataSourceSchema = z.enum([
    // These match up with APIs
    "GOOGLE_PERFORMANCE_COUNTRY",
    "GOOGLE_PERFORMANCE_TRAFFIC",
]);
export type DataSource = z.infer<typeof DataSourceSchema>;

const WidgetSchema = z.object({
    id: IdSchema,
    type: WidgetTypeSchema,
    dataSource: DataSourceSchema,
    dataFilter: z.array(z.string()),
    axis1: z.string(),
    axis2: z.string().optional(),
    axis3: z.string().optional(),
    title: z.string().min(1),
    description: z.string().nullish(),
    width: z.number().gte(1).lte(MAX_GRID_SIZE),
    height: z.number().gte(1),
    x: z.number().gte(0).lte(MAX_GRID_SIZE),
    y: z.number().gte(0),
});

export const WidgetDBSchema = WidgetSchema.extend({
    dashboardId: IdSchema,
});
export const WidgetAPISchema = WidgetSchema.extend({});

export type WidgetDB = z.infer<typeof WidgetDBSchema>;
export type WidgetAPI = z.infer<typeof WidgetSchema>;
