import { Request, Response } from "express";
import { prisma } from "@repo/prisma/prismaClient";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SigninSchema, SignupSchema } from "@repo/zod-schemas/validation";

const signup = async (req: Request, res: Response) => {
  const body = req.body;

  const validBody = SignupSchema.safeParse(body);

  if (validBody.error) {
    res.status(401).send("Error while parsing body");
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      username: validBody.data.username,
    },
  });

  if (!user) {
    const hashedPassword = bcrypt.hashSync(validBody.data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: validBody.data.username,
        email: validBody.data.email,
        password: hashedPassword,
      },
    });

    res.send(user);
  }

  res.send("user already exists");
  return;
};

const signin = async (req: Request, res: Response) => {
  if (!process.env.JWT_SECRET) {
    console.log("ENV variable not provided");
    return;
  }

  const body = req.body;

  const validBody = SigninSchema.safeParse(body);

  if (validBody.error) {
    res.status(401).send("Error while parsing body");
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: validBody.data.email,
    },
  });

  if (!user) {
    res.status(402).send("User not found");
    return;
  }

  const userPass = bcrypt.compareSync(validBody.data.password, user.password);

  if (!userPass) {
    res.status(403).send("User credentials does not match");
    return;
  }

  const token = jwt.sign(JSON.stringify(user.id), process.env.JWT_SECRET);

  res.json({ token });
  return;
};

export { signup, signin };
