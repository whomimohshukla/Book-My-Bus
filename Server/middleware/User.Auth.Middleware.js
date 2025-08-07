const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.Login.Signup/user.model");

const auth = (req, res, next) => {
  try {
    // Try to get the token from different sources
    const token =
      req.header('Authorization')?.split(' ')[1] || req.query.token || req.body.token;

    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user info to the request
    next(); // Move to the next middleware
  } catch (error) {
    res.status(400).json({ message: 'Invalid token', error: error.message });
  }
};


// admin routes middleware
const admin = async (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admin",
      });
    }
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking admin role",
    });
  }
};

// passenger routes middleware
const isPassenger = async (req, res, next) => {
  try {
    if (req.user.role !== "Passenger") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for passengers",
      });
    }
    next();
  } catch (error) {
    console.error("Passenger middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking passenger role",
    });
  }
};

module.exports = {
  auth,
  admin,
  isPassenger,
};
