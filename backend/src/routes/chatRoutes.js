import { Router } from "express";
import { protectRoute } from "../middleware/auth.js";
import { getChats, getOrCreateChat } from "../controller/chatController.js";

const router = Router();

router.get("/", protectRoute, getChats);
router.post("/with/:participantId",protectRoute,  getOrCreateChat);

export default router;