import { User } from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const userId = req.userId;

    const users = await User.find({ _id: { $ne: userId } })
      .select("name email avatar")
      .limit(50);
    res.status(200).json(users)
  } catch (error) {
    console.error(error);
    next(error);
  }
}