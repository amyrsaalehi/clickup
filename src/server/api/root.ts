import { taskRouter } from './routers/task';
import { userRouter } from "~/server/api/routers/user";
import { createTRPCRouter } from "~/server/api/trpc";
import { workspaceRouter } from "./routers/workspace";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  workspace: workspaceRouter,
  task: taskRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
