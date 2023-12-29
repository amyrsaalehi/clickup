/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import { db } from "~/server/db";

interface CreateContextOptions {
  user: any;
}

const createInnerTRPCContext = (_opts: CreateContextOptions) => {
  return {
    db,
    user: _opts.user,
  };
};

export const createTRPCContext = async (_opts: CreateNextContextOptions) => {
  const token = _opts.req.cookies.TOKEN;
  const user = await db.user.findFirst({
    where: {
      token,
    },
  });
  return createInnerTRPCContext({
    user: user ?? null,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user?.token) {
    window.location.href = "/login";
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
