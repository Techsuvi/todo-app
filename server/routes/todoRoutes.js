// backend/routes/todoRoutes.js
import express from "express";
import Todo from "../models/Todo.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /        -> get all todos for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json(todos);
  } catch (err) {
    console.error("GET /todo error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /       -> add a todo
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, priority, recurringInterval } = req.body;
    const todo = new Todo({
      userId: req.userId,
      text,
      completed: false,
      priority: priority || "Medium",
      isRecurring: !!recurringInterval,
      recurringInterval: recurringInterval || null,
    });
    await todo.save();
    return res.status(201).json(todo);
  } catch (err) {
    console.error("POST /todo error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST /recurring -> premium route (same as above but explicit)
router.post("/recurring", authMiddleware, async (req, res) => {
  try {
    const { text, recurringInterval, priority } = req.body;
    const todo = new Todo({
      userId: req.userId,
      text,
      completed: false,
      isRecurring: true,
      recurringInterval,
      priority: priority || "Medium",
    });
    await todo.save();
    return res.status(201).json(todo);
  } catch (err) {
    console.error("POST /todo/recurring error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// PUT /:id     -> update todo (only owner)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Todo not found" });
    return res.json(updated);
  } catch (err) {
    console.error("PUT /todo/:id error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// DELETE /:id  -> delete todo (only owner)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deleted) return res.status(404).json({ message: "Todo not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /todo/:id error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
