import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitmq } from "./config/rabbitmq.js";
dotenv.config();
const app = express();
app.use(express.json());
const port = process.env.PORT;
connectDb();
connectRabbitmq();
export const redisClient = createClient({
    url: process.env.REDIS_URL,
});
redisClient
    .connect()
    .then(() => {
    console.log("✅ Connected to Redis DATABASE");
})
    .catch(console.error);
app.listen(port, () => {
    console.log(`Server is Running at PORT : ${port}`);
});
app.use("/api/v1", userRoutes);
