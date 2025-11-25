// controllers/contactController.js
import Contact from "../models/contact.js";

export const sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    // Save message to database
    const newMessage = new Contact({ name, email, subject, message });
    await newMessage.save();

    console.log("Received contact message and saved:", newMessage);

    // Send confirmation to frontend
    res.json({ message: "Message sent and saved successfully!" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
};
