import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
import Todo from "../models/Todo.js";
import { verifyAdmin } from "../middleware/adminAuth.js";

dotenv.config();
const router = express.Router();

// ================= Admin Login =================
router.post("/login", async (req, res) => {
  try {
    const { email, password, securityKey } = req.body;

    if (securityKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(401).json({ success: false, message: "Invalid security key" });
    }

    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ success: true, token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ================= Manage Users =================

// 👥 Get all users
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password"); // hide password
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
});

// 👥 Update user role (freemium <-> premium)
router.patch("/user/:id/role", verifyAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating user role" });
  }
});

// ================= Manage Todos =================

// 📝 Get all todos
router.get("/todos", verifyAdmin, async (req, res) => {
  try {
    const todos = await Todo.find().populate("user", "email role");
    res.json({ success: true, todos });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching todos" });
  }
});

// 📝 Delete any todo
router.delete("/todo/:id", verifyAdmin, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ success: false, message: "Todo not found" });

    res.json({ success: true, message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting todo" });
  }
});

// ================= Analytics =================
router.get("/stats", verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ role: "premium" });
    const totalTodos = await Todo.countDocuments();
    const completedTodos = await Todo.countDocuments({ completed: true });

    res.json({
      success: true,
      stats: {
        totalUsers,
        premiumUsers,
        totalTodos,
        completedTodos,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching stats" });
  }
});

export default router;
