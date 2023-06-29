const jwt = require("jsonwebtoken");
const User = require("../models/User");

const whitelist = ["/api/auth/login"];

const checkWhitelist = (req, res, next) => {
  if (whitelist.includes(req.originalUrl)) {
    return true;
  }
  return false;
};

const authMiddleware = async (req, res, next) => {
  if (checkWhitelist(req, res, next)) {
    next();
  } else {
    try {
      // Check if token exists in the request header
      const token = req.header("Authorization").replace("Bearer ", "");
      if (!token) {
        throw new Error("Invalid token");
      }
      // Verify the token and extract the user ID
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decodedToken.userId;
      // Check if user exists in the database
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      // Set the user ID in the request object
      req.userId = userId;
      req.userRole = user.role;
      req.userName = user.name;
      req.userEmail = user.email;
      // Call the next middleware function
      next();
    } catch (error) {
      console.log(error, "err");
      res
        .status(401)
        .json({ message: "Authorization failed", error: error.message });
    }
  }
};

module.exports = authMiddleware;
