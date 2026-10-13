import { Chat } from "../models/Chat.js";
import { Types } from "mongoose";
export const getChats = async (req, res, next) => {
  try {
    const userId = req.userId;

    const chats = await Chat.find({ participants: userId })
      .populate("participants", "name email avatar")
      .populate("lastMessage")
      .sort({ lastMessageAt: -1 });

    const formattedChats = chats.map((chat) => {
      const otherParticipant = chat.participants.find((p) => p._id.toString() !== userId)
      return {
        _id: chat._id,
        participant: otherParticipant ?? null,
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        createdAt: chat.createdAt,
      };
    });
    res.status(200).json(formattedChats)

  } catch (error) {
    console.log(error);
    next(error)
  }
}
export const getOrCreateChat = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { participantId } = req.params;

    if (!participantId) {
      res.status(400).json({ message: "Yêu cầu cung cấp ID người tham gia." });
      return;
    }

    if (!Types.ObjectId.isValid(participantId)) {
      res.status(400).json({
        message: "ID người tham gia không hợp lệ"
      })
      return;
    }
    if (userId === participantId) {
      res.status(400).json({
        message: "Không thể tạo cuộc trò chuyện với chính mình."
      })
      return;
    }
    let chat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    })
      .populate("participants", "name email avatar")
      .populate("lastMessage");
    if (!chat) {
      const newChat = new Chat({ participants: [userId, participantId] });
      await newChat.save();
      chat = await newChat.populate("participants", "name email avatar")
    }
    const otherParticipant = chat.participants.find((p) => p._id.toString() !== userId);

    res.json({
      _id: chat._id,
      participant: otherParticipant ?? null,
      lastMessage: chat.lastMessage,
      lastMessageAt: chat.lastMessageAt,
      createdAt: chat.createdAt,
    });

  } catch (error) {
    console.log(error);
    next(error)
  }
}