const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Please select a date"],
      trim: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lectures", lectureSchema);
