import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import tweetRouter from "./routes/tweetRoutes";
import authRoutes from "./routes/authRoutes";
import { protect } from "./middleware/authMiddleware";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Mount the authRouter on the /auth path
app.use("/api/v1/auth", authRoutes);

// Mount the userRouter on the /users path
app.use("/api/v1/users", protect, userRouter);

// Mount the tweetRouter on the /tweets path
app.use("/api/v1/tweets", protect, tweetRouter);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
