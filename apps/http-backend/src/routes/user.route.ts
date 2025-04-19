import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/getuser", authMiddleware, getUser);

export default router;
