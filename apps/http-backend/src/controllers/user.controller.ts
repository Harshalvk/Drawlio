import { prisma } from "@repo/prisma/prismaClient";
import { Request, Response } from "express";

const getUser = async (req: Request, res: Response) => {
  const userId = req.userId;

  const dbUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  res.send(dbUser);
};

export { getUser };
