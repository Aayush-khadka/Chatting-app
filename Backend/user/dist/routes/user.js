import express from "express";
import { loginUser, myProfile, verifyUser } from "../controllers/user.js";
const router = express.Router();
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", myProfile);
export default router;
