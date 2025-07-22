import express from "express";

const router = express.Router();

import { createNewChat } from "../controllers/chat.js";
import isAuth from "../middlewares/isAuth.js";

router.post("/chat/new", isAuth, createNewChat);
export default router;
