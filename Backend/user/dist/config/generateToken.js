import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
export const generateToken = (user) => {
    return jwt.sign({ user }, JWT_SECRET, { expiresIn: "15d" });
};
