import { z } from "zod";

export const WorkspaceCreate = z.object({
  title: z.string(),
  userId: z.number(),
  tasks: z.array(z.object({
    title: z.string(),
  })),
});