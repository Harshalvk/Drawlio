import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@repo/prisma/prismaClient";
import dotenv from "dotenv";
dotenv.config();

const PORT = 3333;
const wss = new WebSocketServer({ port: PORT });

interface UserT {
  ws: WebSocket;
  rooms: number[];
  userId: number;
}
const users: UserT[] = [];

const checkUser = (token: string): null | number => {
  try {
    if (!process.env.JWT_SECRET) {
      return null;
    }

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || (decoded as JwtPayload).id) {
      return null;
    }

    return Number(decoded);
  } catch (error) {
    return null;
  }
};

wss.on("connection", async function (ws, req) {
  const url = req.url;

  if (!url) {
    ws.send("url not found");
    return;
  }

  const queryParam = new URLSearchParams(url.split("?")[1]);
  const token = queryParam.get("token") || "";
  const userId = checkUser(token);

  if (!userId) {
    ws.send("user not found");
    ws.close();
    return;
  }

  users.push({
    ws,
    rooms: [],
    userId,
  });

  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    try {
      const parsedData = JSON.parse(data as unknown as string);

      if (parsedData.type === "join_room") {
        //add check if the room exists or not: db call
        const user = users.find((x) => x.ws === ws);
        user?.rooms.push(parsedData.roomId);
        console.log(users);
      }

      if (parsedData.type === "leave_room") {
        const user = users.find((x) => x.ws === ws);
        if (!user) return;
        user.rooms = user?.rooms.filter((x) => x === parsedData.room);
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const message = parsedData.message; //checks for messages

        await prisma.chat.create({
          data: {
            roomId,
            message,
            userId,
          },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                message: message,
                roomId,
              })
            );
          }
        });
      }
    } catch (error) {
      console.log(error);
      ws.send("Error while parsing data");
    }
  });
});
