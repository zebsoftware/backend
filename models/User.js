import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 2 },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  newsletter: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
