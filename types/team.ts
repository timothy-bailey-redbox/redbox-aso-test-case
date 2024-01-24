import { z } from "zod";
import { IdSchema, StatusSchema, TimestampSchema } from "./generic";

export const TeamSchema = z.object({
    id: IdSchema,
    name: z.string(),
    users: z.array(z.string().email()),
    status: StatusSchema,
    createdAt: TimestampSchema,
    updatedAt: TimestampSchema,
});
export type Team = z.infer<typeof TeamSchema>;

export const TeamCreationSchema = TeamSchema.omit({
    id: true,
    updatedAt: true,
    createdAt: true,
    status: true,
});
export type TeamCreation = z.infer<typeof TeamCreationSchema>;

export const TeamUpdateSchema = TeamSchema.partial();
export type TeamUpdate = z.infer<typeof TeamUpdateSchema>;
