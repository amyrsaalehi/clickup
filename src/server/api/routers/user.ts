import { UpdateUser, UserLogin, UserSignup } from "~/schema/user";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { generateHashCode } from "~/utils/auth";

export const userRouter = createTRPCRouter({
  signup: publicProcedure.input(UserSignup).mutation(async ({ ctx, input }) => {
    const hash = generateHashCode(input);
    return ctx.db.user.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        password: input.password,
        token: hash,
      },
    });
  }),
  login: publicProcedure.input(UserLogin).mutation(({ ctx, input }) => {
    return ctx.db.user.findFirst({
      where: {
        email: input.email,
        password: input.password,
      },
    });
  }),
  updateUser: protectedProcedure
    .input(UpdateUser)
    .mutation(({ ctx, input }) => {
      return ctx.db.user.update({
        where: {
          token: input.token,
        },
        data: {
          fullName: input.fullName,
        },
      });
    }),
});
