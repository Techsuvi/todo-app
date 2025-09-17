// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// ✅ Import Routes
import authRoutes from "./routes/auth.js";
import todoRoutes from "./routes/todoRoutes.js";
import aiRoutes from "./routes/ai.js"; // 👈 Gemini AI routes
import adminRoutes from "./routes/admin.js"; // 👈 Admin routes

dotenv.config();
const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api", aiRoutes); // => /api/ai/todos , /api/ai/save , /api/ai/today
app.use("/api/admin", adminRoutes); // => /api/admin/login , /api/admin/users , etc.

// ✅ Default Route
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Server running on http://localhost:${PORT}`)
);

// ✅ Debug Gemini
console.log(
  "🔑 GEMINI KEY LOADED:",
  process.env.GEMINI_API_KEY ? "✅ Found" : "❌ Missing"
);

// ✅ Debug Admin Key
console.log(
  "🔑 ADMIN SECRET KEY LOADED:",
  process.env.ADMIN_SECRET_KEY ? "✅ Found" : "❌ Missing"
);
