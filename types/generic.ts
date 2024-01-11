import { z } from "zod";

export const StatusSchema = z.enum(["ACTIVE", "DELETED"]);
export type Status = z.infer<typeof StatusSchema>;

export const IdSchema = z.string().uuid();
export type Id = z.infer<typeof IdSchema>;

export const TimestampSchema = z
    .number({
        description: "Timestamp value in ms",
    })
    .gte(new Date("2000-01-01T00:00:00.0Z").getTime(), {
        message: "Timestamps must be greater than 1st Jan 2000",
    });
export type Timestamp = z.infer<typeof TimestampSchema>;
