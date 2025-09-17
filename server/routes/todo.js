// routes/todo.js
import express from "express";
import Todo from "../models/Todo.js";
import authMiddleware from "../middleware/authMiddleware.js";
import checkPremium from "../middleware/checkPremium.js";

const router = express.Router();

/* ---------------- GET all todos ---------------- */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.json(todos);
  } catch (err) {
    console.error("GET /todo error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- POST new todo ---------------- */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { text, priority } = req.body;
    const todo = new Todo({
      text,
      userId: req.userId,
      completed: false,
      priority: priority || "Medium", // basic users get default priority
    });
    await todo.save();
    return res.status(201).json(todo);
  } catch (err) {
    console.error("POST /todo error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

/* ---------------- POST recurring todo (premium-only) ---------------- */
router.post("/recurring", authMiddleware, checkPremium, async (req, res) => {
  try {
    const { text, recurringInterval, priority } = req.body;
    const todo = new Todo({
      text,
      userId: req.userId,
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

/* ---------------- PUT update todo ---------------- */
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

/* ---------------- DELETE todo ---------------- */
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
