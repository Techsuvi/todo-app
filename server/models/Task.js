// models/Task.js
import mongoose from "mongoose";


const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  isRecurring: { type: Boolean, default: false }, // premium feature
  recurringInterval: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: null },
  dueDate: Date,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
