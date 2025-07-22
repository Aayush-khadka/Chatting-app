import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import chatRoutes from "./routes/chat.js";
dotenv.config();
const app = express();

connectDb();

app.use("/api/v1", chatRoutes);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
