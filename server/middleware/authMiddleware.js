const jwt = require("jsonwebtoken");

/**
 * Middleware to verify JWT authentication.
 * Ensures the user is logged in before accessing protected routes.
 */
const verifyToken = (req, res, next) => {
  const token = req.cookies.authToken; // Extract JWT from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

module.exports = verifyToken;
