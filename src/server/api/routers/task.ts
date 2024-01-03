import { UpdateProgress, UpdateTask } from "~/schema/task";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  updateTask: protectedProcedure
    .input(UpdateTask)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          assignee: {
            connect: {
              id: input.assigneeId,
            },
          },
        },
      });
    }),
  updateProgress: protectedProcedure
    .input(UpdateProgress)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.update({
        where: {
          id: input.id,
        },
        data: {
          progress: input.progress,
        },
      });
    }),
});
