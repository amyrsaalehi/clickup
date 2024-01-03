import Cookies from "js-cookie";
import { SearchUser, UserLogin, UserMe, UserSignup } from "~/schema/user";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc";
import { generateHashCode } from "~/utils/auth";

export const userRouter = createTRPCRouter({
  signup: publicProcedure.input(UserSignup).mutation(async ({ ctx, input }) => {
    const hash = generateHashCode(input);
    return await ctx.db.user.create({
      data: {
        fullName: input.fullName,
        email: input.email.toLowerCase(),
        password: input.password,
        token: hash,
      },
    });
  }),
  login: publicProcedure.input(UserLogin).mutation(async ({ ctx, input }) => {
    return await ctx.db.user.findFirst({
      where: {
        email: input.email.toLowerCase(),
        password: input.password,
      },
    });
  }),
  me: protectedProcedure.input(UserMe).query(async ({ctx, input}) => {
    return await ctx.db.user.findFirst({
      where: {
        token: input.token
      },
    });
  }),
  search: protectedProcedure.input(SearchUser).query(async ({ctx, input}) => {
    return await ctx.db.user.findMany({
      where: {
        email: input.email.toLowerCase(),
      }
    });
  })
});
