import { Chat } from "../models/Chat.js";
import { Message } from "../models/Message.js"
export const getMessages = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;
    const chat = Chat.find({
      _id: chatId,
      participants: userId,
    })
    if (!chat) {
      res.status(404).json({
        message: "Không tìm thấy cuộc trò chuyện"
      })
    }
    const messages = await Message.find({
      chat: chatId
    })
      .populate("sender", "name email avatar")
      .sort({ createdAt: 1 });
    res.status(200).json(messages)
  } catch (error) {
    console.log(error);
    next(error)
  }
}