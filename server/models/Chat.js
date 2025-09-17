import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    time: {
      type: String, // storing formatted string e.g. "10:45 AM"
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
