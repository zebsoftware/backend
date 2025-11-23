import bcrypt from "bcryptjs";
import User from "../models/User.js"; // make sure this path is correct

// Register controller
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, newsletter } = req.body;

    // 1️⃣ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2️⃣ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",          // optional phone
      newsletter: newsletter || false, // optional newsletter
    });

    // 4️⃣ Save user to DB
    await user.save();

    // 5️⃣ Send success response
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error(" Error in registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
