// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve static images

// API Routes
app.use("/api/auth", authRoutes);             // Login/Register
app.use("/api/products", productRoutes);      // Products CRUD
app.use("/api/categories", categoryRoutes);   // Categories CRUD

// Root test route (optional)
app.get("/", (req, res) => {
  res.send("Welcome to the Barakat API backend.");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB connected");
  app.listen(5000, () => console.log("🚀 Server running on port 5000"));
})
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
});
