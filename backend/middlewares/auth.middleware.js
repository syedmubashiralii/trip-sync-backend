const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "tripsync_secret_key"; 

module.exports = function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(decoded);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
