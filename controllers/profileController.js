import Profile from "../models/Profile.js";
import User from "../models/User.js";

// GET logged in user's profile
export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE or UPDATE profile
export const upsertProfile = async (req, res) => {
  const { name, email, address, phone } = req.body;

  try {
    let profile = await Profile.findOne({ user: req.user._id });

    if (profile) {
      // update
      profile.name = name || profile.name;
      profile.email = email || profile.email;
      profile.address = address || profile.address;
      profile.phone = phone || profile.phone;
      await profile.save();
      return res.json(profile);
    }

    // create
    profile = new Profile({
      user: req.user._id,
      name,
      email,
      address,
      phone,
    });

    await profile.save();
    res.status(201).json(profile);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE user + profile
export const deleteProfile = async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user._id });
    await User.findByIdAndDelete(req.user._id);

    res.json({ message: "Profile and user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
