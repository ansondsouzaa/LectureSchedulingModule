const express = require("express");
const router = express.Router();
const Lecture = require("../models/Lecture");
const auth = require("../middleware/authMiddleware");
const moment = require("moment");

// create new lecture
router.post("/new", auth, async (req, res) => {
  try {
    console.log(req.body);
    const { courseId, lectures = [] } = req.body;
    console.log(lectures.length);
    if (lectures.length !== 0) {
      for (const lecture of lectures) {
        // Check if the instructor is already assigned to a lecture on the same date
        const { date, instructorId } = lecture;
        const adjustedDate = moment(date).tz("Asia/Kolkata").toDate();
        const existingLecture = await Lecture.findOne({
          date: adjustedDate,
          instructorId,
        });
        console.log(existingLecture);
        if (existingLecture) {
          return res.status(400).json({
            error: "Instructor already assigned to a lecture on the same date.",
          });
        }
        // Create a new lecture
        const newLecture = new Lecture({
          date: adjustedDate,
          instructorId,
          courseId,
        });
        await newLecture.save();
      }
      return res.status(200).send({
        message: "Lecture(s) added successfully",
      });
    } else {
      res.status(400).send({ error: "Empty array" });
    }
  } catch (error) {
    console.log(error, "some error");
    res.status(400).send({ error: error.message });
  }
});

// checking if lectures and instructor collide with dates
router.get("/check", async (req, res) => {
  try {
    const { instructorId, date } = req.query;
    // console.log("Instructor ID:", instructorId);
    // console.log("Date:", date);

    const existingLecture = await Lecture.findOne({ instructorId, date });
    // console.log("Existing Lecture:", existingLecture);

    const hasLecture = !!existingLecture;
    // console.log("Has Lecture:", hasLecture);

    res.status(200).json({ hasLecture });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
