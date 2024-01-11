import { z } from "zod";
import { AppTypeSchema, IdSchema, StatusSchema, TimestampSchema } from "./generic";

const MAX_GRID_SIZE = 12;

export const WidgetTypeSchema = z.enum(["TABLE", "LINE_GRAPH", "PIE_CHART", "BAR_CHART", "Stat", "Dials"]);
export type WidgetType = z.infer<typeof WidgetTypeSchema>;

export const DataSourceSchema = z.enum(["APPTWEAK", "APP_STORE_CONNECT", "GOOGLE_PLAY"]);
export type DataSource = z.infer<typeof DataSourceSchema>;

export const DataTypeSchema = z.enum([
    //TODO
    "METRICS",
]);
export type DataType = z.infer<typeof DataTypeSchema>;

export const WidgetSchema = z.object({
    type: WidgetTypeSchema,
    data: z.object({
        dataSource: DataSourceSchema,
        dataType: DataTypeSchema,
        axis1: z.string(),
        axis2: z.string().optional(),
        axis3: z.string().optional(),
    }),
    title: z.string().min(1),
    description: z.string().nullish(),
    width: z.number().gte(1).lte(MAX_GRID_SIZE),
    height: z.number().gte(1),
    x: z.number().gte(0).lte(MAX_GRID_SIZE),
    y: z.number().gte(0),
});
export type Widget = z.infer<typeof WidgetSchema>;

export const DashboardSchema = z.object({
    id: IdSchema,
    name: z.string().min(1),
    description: z.string().nullish(),
    teamId: IdSchema,
    appId: z.string().min(1),
    comparisonAppIds: z.array(z.string().min(1)),
    appType: AppTypeSchema,
    widgets: z.array(WidgetSchema).nonempty(),
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    status: StatusSchema,
});
export type Dashboard = z.infer<typeof DashboardSchema>;
