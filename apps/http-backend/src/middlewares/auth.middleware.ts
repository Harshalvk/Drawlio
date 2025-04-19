import { prisma } from "@repo/prisma/prismaClient";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: number;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!process.env.JWT_SECRET) {
    console.log("ENV variable not provided");
    return;
  }

  const header = req.headers.authorization;

  if (!header) {
    res.send("no auth header found");
    return;
  }

  const decoded = jwt.verify(header, process.env.JWT_SECRET);

  const user = await prisma.user.findUnique({
    where: {
      id: Number(decoded),
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    res.status(403).send("invalid auth token");
    return;
  }

  req.userId = user.id;

  next();
};

export default authMiddleware;
