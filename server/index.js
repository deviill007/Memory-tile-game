const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { sequelize } = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const scoresRoutes = require("./routes/scoreRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Secure session key
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// CORS Configuration to allow cross-origin requests
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // Allows cookies in requests
  })
);

// Sync database and log status
sequelize
  .sync({ alter: true })
  .then(() => console.log("✅ Database synced successfully!"))
  .catch((err) => console.error("❌ Database sync error:", err));

// Health Check Route
app.get("/", (req, res) => {
  res.send("🚀 Memory Tile Game API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/scores", scoresRoutes);

// Start the Express server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
