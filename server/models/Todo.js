import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // Premium features
    isRecurring: { type: Boolean, default: false },
    recurringInterval: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: null },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" }, // premium
  },
  { timestamps: true }
);

export default mongoose.models.Todo || mongoose.model("Todo", todoSchema);
