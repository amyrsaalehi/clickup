import { WorkspaceCreate } from "~/schema/workspace";
import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";

export const workspaceRouter = createTRPCRouter({
    create: protectedProcedure.input(WorkspaceCreate).mutation(async ({ ctx, input }) => {
        return await ctx.db.workspace.create({
            data: {
                title: input.title,
                userId: input.userId,
                tasks: {
                    create: input.tasks.map((task) => ({
                        title: task.title,
                    }))
                }
            },
        });
    }),
    getAll: protectedProcedure.query(async ({ ctx }) => {
        return await ctx.db.workspace.findMany({
            include: {
                user: true,
                tasks: {
                    select: {
                        title: true,
                        progress: true,
                        id: true,
                        updatedAt: true,
                        assignee: true,
                    }
                }
            }
        });
    }),
});
