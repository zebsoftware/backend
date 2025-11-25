import Contact from "../models/contact.js";

// Save contact message
export const sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const newMessage = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newMessage.save();

    console.log("Contact message saved:", newMessage);

    res.json({
      message: "Message sent and saved successfully!",
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ message: "Failed to save message" });
  }
};

// Fetch all contact messages
export const getAllContacts = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.json({
      message: "Messages fetched successfully!",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
