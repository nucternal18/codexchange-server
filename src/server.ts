import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import userRouter from "./routes/userRoutes";
import tweetRouter from "./routes/tweetRoutes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Mount the userRouter on the /users path
app.use("/api/v1/users", userRouter);

// Mount the tweetRouter on the /tweets path
app.use("/api/v1/tweets", tweetRouter);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});