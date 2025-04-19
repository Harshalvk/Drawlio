import { Router } from "express";
import { createRoom, getRoomChats } from "../controllers/room.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/create", authMiddleware, createRoom);
router.get("/chats/:roomId", authMiddleware, getRoomChats);

export default router;
