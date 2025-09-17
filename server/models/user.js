import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    plan: { type: String, enum: ["free", "premium"], default: "free" },
    premiumSince: { type: Date }, 
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },  // 👈 important
    toObject: { virtuals: true } // 👈 important
  }
);

// Virtual helper
userSchema.virtual("isPremium").get(function () {
  return this.plan === "premium";
});

export default mongoose.models.User || mongoose.model("User", userSchema);
