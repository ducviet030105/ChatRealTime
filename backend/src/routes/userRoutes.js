import { Router } from "express";
import { protectRoute } from "../middleware/auth.js";
import { getUsers } from "../controller/userController.js";

const router = Router();

router.get("/", protectRoute, getUsers);

export default router;