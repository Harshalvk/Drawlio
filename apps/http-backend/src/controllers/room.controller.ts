import { Request, Response } from "express";
import { CreateRoomSchema } from "@repo/zod-schemas/validation";
import { prisma } from "@repo/prisma/prismaClient";

const createRoom = async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.userId;

  const validData = CreateRoomSchema.safeParse(data);

  if (validData.error) {
    res.status(402).send("Incorrect inputs");
    return;
  }

  try {
    const room = await prisma.room.create({
      data: {
        slug: validData.data.name,
        adminId: userId,
      },
    });

    res.json({
      roomId: room.id,
    });
  } catch (error) {
    res.status(411).json({
      err: "room already exists",
    });
    return;
  }
};

const getRoomChats = async (req: Request, res: Response) => {
  const roomId = req.params.roomId;

  const messages = await prisma.chat.findMany({
    where: {
      roomId: Number(roomId),
    },
    orderBy: {
      id: "desc",
    },
    take: 50,
  });

  res.json({
    messages,
  });
};

const getRoom = async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const room = await prisma.room.findUnique({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
};

export { createRoom, getRoomChats, getRoom };
