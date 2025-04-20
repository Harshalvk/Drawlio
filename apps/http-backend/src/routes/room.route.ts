import { Router } from "express";
import {
  createRoom,
  getRoomChats,
  getRoom,
} from "../controllers/room.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/create", authMiddleware, createRoom);
router.get("/chats/:roomId", authMiddleware, getRoomChats);
router.get("/chats/:slug", authMiddleware, getRoom);

export default router;
