const express = require("express");
const Score = require("../models/Score");
const verifyToken = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

//Saving score
router.post("/", verifyToken, async (req, res) => {
  try {
    const { level, time } = req.body;

    const newScore = await Score.create({ userId: req.user.id, level, time });

    res.status(201).json({ message: "Score saved successfully!", newScore });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Leaderboard
router.get("/leaderboard", async (req, res) => {
  try {
    const { level, page = 1, limit = 10 } = req.query;

    if (!level || !["easy", "medium", "hard"].includes(level)) {
      return res.status(400).json({ message: "Invalid or missing level parameter" });
    }

    const offset = (page - 1) * limit;

    const { count, rows: scores } = await Score.findAndCountAll({
      where: { level },
      attributes: ["userId", "time"],
      include: { model: User, attributes: ["username"] },
      order: [["time", "ASC"]], // Sort by time (fastest first)
      limit: Number(limit),
      offset: Number(offset),
    });

    res.json({
      scores: scores.map((score) => ({
        username: score.User?.username || "Unknown",
        time: score.time,
      })),
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Myscore 
router.get("/myscore", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: scores } = await Score.findAndCountAll({
      where: { userId },
      attributes: ["level", "time"],
      order: [["time", "ASC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({
      scores,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Error fetching user scores:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
