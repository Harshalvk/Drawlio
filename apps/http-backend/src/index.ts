import express, { Request, Response } from "express";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import roomRouter from "./routes/room.route";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 4444;

app.use(express.json());

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/room", roomRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Hello !!</h1>");
});

app.listen(PORT, () => {
  console.log("⚙️Server is listening!");
});
