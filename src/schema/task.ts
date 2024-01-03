import { z } from "zod"

export const UpdateTask = z.object({
    id: z.number(),
    assigneeId: z.number(),
});

export const UpdateProgress = z.object({
    id: z.number(),
    progress: z.number().max(100).min(0),
})