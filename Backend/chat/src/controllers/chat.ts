import Trycatch from "../config/trycatch.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { Chat } from "../models/chat.js";

export const createNewChat = Trycatch(
  async (req: AuthenticatedRequest, res) => {
    const userId = req.user?._id;

    const { otherUserId } = req.body;

    if (!otherUserId) {
      res.status(400).json({
        message: "Othetr user Id is Required",
      });
      return;
    }

    const existingChat = await Chat.findOne({
      users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
      res.json({
        message: "chat already Exists",
        chatid: existingChat._id,
      });
      return;
    }

    const newChat = await Chat.create({
      users: [userId, otherUserId],
    });

    res.status(201).json({
      message: "New Chat Created",
      chatId: newChat._id,
    });
  }
);
