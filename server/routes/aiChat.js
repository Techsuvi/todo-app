import express from "express";
import Chat from "../models/Chat.js";
import authMiddleware from "../middleware/authMiddleware.js"; // ✅ ensure only logged-in users access

const router = express.Router();

// ✅ Get chat history for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user.id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (err) {
    console.error("Get chat history error:", err);
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// ✅ Save a chat message
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { role, content, time } = req.body;
    if (!role || !content || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newMessage = new Chat({
      userId: req.user.id,
      role,
      content,
      time,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error("Save chat error:", err);
    res.status(500).json({ error: "Failed to save chat message" });
  }
});

export default router;
