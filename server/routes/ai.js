import express from "express";
import dayjs from "dayjs";
import AiTodo from "../models/AiTodo.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

const today = () => dayjs().format("YYYY-MM-DD");

// 🧑‍💻 Generate todos with Gemini
router.post("/ai/todos", authMiddleware, async (req, res) => {
  try {
    const { prompt } = req.body;

    // 💡 LOGGING FOR DEBUGGING
    console.log("Received prompt for AI:", prompt);

    // ✅ SOLUTION: Initialize the client here to ensure process.env is ready
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(
      `You are a helpful assistant. Based on this request, generate a todo list (each task on a new line):\n${prompt}`
    );

    const aiMessage = result.response.text().trim();

    const todos = aiMessage
      .split("\n")
      .map((t) => t.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean);

    res.json({ message: aiMessage, todos });
  } catch (err) {
    console.error("❌ Gemini Generate Error:", err);
    res.status(500).json({ error: "Failed to generate todos" });
  }
});

// 💾 Save todos
router.post("/ai/save", authMiddleware, async (req, res) => {
  try {
    const { todos } = req.body;
    const userId = req.user.id;

    if (!todos || todos.length === 0) {
      return res.status(400).json({ error: "No todos provided" });
    }

    const result = await AiTodo.findOneAndUpdate(
      { userId, date: today() },
      { todos, date: today(), userId },
      { upsert: true, new: true }
    );

    res.json({ success: true, todos: result.todos });
  } catch (err) {
    console.error("❌ Gemini Save Error:", err);
    res.status(500).json({ error: "Failed to save todos" });
  }
});

// 📅 Fetch today's todos
router.get("/ai/today", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const existing = await AiTodo.findOne({ userId, date: today() });

    if (!existing) return res.json({ todos: [] });

    res.json({ todos: existing.todos });
  } catch (err) {
    console.error("❌ Gemini Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

export default router;