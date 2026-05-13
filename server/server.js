require("dotenv").config();
const express = require("express");
const cors = require("cors");

const generateRoutes = require("./routes/generate");
const authRoutes = require("./routes/auth");
const linkedinRoutes = require("./routes/linkedin");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api", generateRoutes);
app.use("/auth", authRoutes);
app.use("/api", linkedinRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 LinkedIn AI Agent server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   LinkedIn OAuth: http://localhost:${PORT}/auth/linkedin\n`);
});
