import "dotenv/config"; // gọi trước tiên, đảm bảo biến env có sẵn cho mọi import bên dưới
import express from "express";
import { createServer } from "http";
import path from "path";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import { connectDB } from "./config/database.js";
import { initializeSocket } from "./utils/socket.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use((req, res, next) => {
  console.log("🔥 REQUEST:", req.method, req.originalUrl);
  next();
});

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:8081",
  "http://localhost:5173", 
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.json({ message: "ChatApp API is running " });
});

app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(errorHandler);


const httpServer = createServer(app);
initializeSocket(httpServer);

connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(" Failed to start server:", error);
    process.exit(1);
  });