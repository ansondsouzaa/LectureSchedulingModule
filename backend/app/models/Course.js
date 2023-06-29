const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a course name"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    level: {
      type: String,
      required: [true, "Please enter the level"],
      trim: true,
      maxlength: [5000, "Level cannot "],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
      trim: true,
      maxlength: [5000, "Description cannot be more than 5000 characters"],
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);