import { z } from "zod";

export const UserSignup = z.object({
  fullName: z.string().min(7),
  email: z.string().email(),
  password: z.string().min(8),
});

export const UserLogin = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const UpdateUser = z.object({
  fullName: z.string().min(7),
  token: z.string(),
});
