import express from "express";
import dotenv from "dotenv";
import { startSendOTPConsumer } from "./consumer.js";
dotenv.config();
startSendOTPConsumer();
const app = express();
app.listen(process.env.PORT, () => {
    console.log(`The server is running on ${process.env.PORT} `);
});
