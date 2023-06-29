const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/instructors", async (req, res) => {
  try {
    // Find instructors with role "instructor"
    const instructors = await User.find({ role: "instructor" }).select('-password');
    res.status(200).json({ instructors });
  } catch (error) {
    console.error("Error retrieving instructors:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
