import { z } from "zod";

export const SignupSchema = z.object({
  username: z.string({ message: "username is required" }),
  email: z.string({ message: "email is required" }),
  password: z.string({ message: "password is required" }),
});

export const SigninSchema = z.object({
  email: z.string({ message: "email is required" }),
  password: z.string({ message: "password is required" }),
});

export const CreateRoomSchema = z.object({
  name: z.string().min(3).max(20),
});

export type authSignInT = z.infer<typeof SigninSchema>;
export type authSignUpT = z.infer<typeof SignupSchema>;
export type createRoomT = z.infer<typeof CreateRoomSchema>;
