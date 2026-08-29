
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


app.get("/", (req, res) => {
  res.json({
    message: "ChatApp API is running 🚀",
  });
});

app.listen(PORT, () => {
  connectDB();
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


