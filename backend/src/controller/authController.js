import { User } from "../models/User.js";
import { clerkClient, getAuth } from "@clerk/express";

export const getMe = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
export const authCallback = async (req, res, next) => {
  try {
    const { userId: clerkId } = getAuth(req);

    if (!clerkId) {
      return res.status(401).json({
        message: "Không được phép"
      });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkId);

      user = await User.create({
        clerkId,
        name: clerkUser.firstName
          ? `${clerkUser.firstName} ${clerkUser.lastName || ""}`.trim()
          : clerkUser.emailAddresses[0]?.emailAddress?.split("@")[0],
        email: clerkUser.emailAddresses[0]?.emailAddress,
        avatar: clerkUser.imageUrl
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    next(error);
  }
};