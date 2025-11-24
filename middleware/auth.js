import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and has a token
  if (!authHeader || !authHeader.split(" ")[1]) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store user info in request
    req.user = decoded;

    next(); // Token is valid, continue to route
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
