const express = require("express");
const Level = require("../models/Level");

const router = express.Router();

//Get all the levels
router.get("/", async (req, res) => {
  try {
    const levels = await Level.findAll();
    res.json(levels);
  } catch (error) {
    console.error("Error fetching levels:", error);
    res.status(500).json({ message: "Error fetching levels" });
  }
});

module.exports = router;
