const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// Ensure JWT_SECRET is set
if (!JWT_SECRET) {
  console.error("JWT_SECRET is not defined in environment variables");
  process.exit(1);
}

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide name, email, and password" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Create user (password hashing handled by schema middleware)
    const newUser = new User({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: email.toLowerCase().trim() === "dilmijayanetthi66@gmail.com" ? "admin" : "user"
    });

    // Save user
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    // Respond with token and user details
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login request:", { email, password }); // Debug log

  try {
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: "Please provide email and password" });
    }

    // Find user and select password explicitly
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    console.log("User found:", user ? { id: user._id, email: user.email, role: user.role } : null); // Debug log
    if (!user) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch); // Debug log
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Special admin role assignment for specific email
    let role = user.role;
    if (normalizedEmail === "dilmijayanetthi66@gmail.com" && user.role !== "admin") {
      role = "admin";
      await User.findByIdAndUpdate(user._id, { role: "admin" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role },
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRES_IN }
    );

    // Respond with token and user details
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;