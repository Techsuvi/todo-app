// models/AiTodo.js

import mongoose from "mongoose";

const aiTodoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    todos: [{ type: String, required: true }],
    date: { type: String, required: true }, // e.g., "2025-09-02"
  },
  { timestamps: true }
);

export default mongoose.model("AiTodo", aiTodoSchema);
