const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  console.log("Auth middleware triggered");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("No token found in Authorization header");
    return res.status(401).json({ message: "Access token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    console.log("Decoded user payload:", decodedUser);
    req.user = decodedUser; // should contain your userId
    next();
  });
}



module.exports = {
  authMiddleware,
};
