import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, default: "" },
  phone: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
