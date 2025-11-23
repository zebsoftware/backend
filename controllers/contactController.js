export const sendContact = (req, res) => {
  const { name, email, subject, message } = req.body;

  console.log("Received contact message:", { name, email, subject, message });
  res.json({ message: "Message sent successfully!" });


};
