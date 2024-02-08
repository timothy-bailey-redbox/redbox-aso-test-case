import { z } from "zod";
import { AppTypeSchema, IdSchema, StatusSchema, TimestampSchema } from "./generic";
import { WidgetAPISchema } from "./widget";

const DashboardSchema = z.object({
    id: IdSchema,
    name: z.string().min(1),
    description: z.string().nullish(),
    teamId: IdSchema,
    appId: z.string().min(1),
    comparisonAppIds: z.array(z.string().min(1)),
    keywords: z.array(z.string().min(1).toLowerCase()),
    appType: AppTypeSchema,
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
    status: StatusSchema,
});

export const DashboardDBSchema = DashboardSchema.extend({});
export const DashboardAPISchema = DashboardSchema.extend({
    widgets: z.array(WidgetAPISchema),
});

export type DashboardDB = z.infer<typeof DashboardDBSchema>;
export type DashboardAPI = z.infer<typeof DashboardAPISchema>;

export const DashboardAPICreationSchema = DashboardAPISchema.omit({
    id: true,
    updatedAt: true,
    createdAt: true,
    status: true,
    widgets: true,
}).extend({
    widgets: z.array(
        WidgetAPISchema.omit({
            id: true,
        }),
    ),
});
export type DashboardAPICreation = z.infer<typeof DashboardAPICreationSchema>;

export const DashboardAPIUpdateSchema = DashboardAPISchema.partial()
    .omit({ widgets: true })
    .extend({
        widgets: z
            .array(
                WidgetAPISchema.partial()
                    .required({ id: true })
                    .or(
                        WidgetAPISchema.omit({
                            id: true,
                        }).extend({
                            id: z.undefined().optional(),
                        }),
                    ),
            )
            .optional(),
    });
export type DashboardAPIUpdate = z.infer<typeof DashboardAPIUpdateSchema>;
