// Import required modules and packages
const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const auth = require("../middleware/authMiddleware");
const Lecture = require("../models/Lecture");
const moment = require("moment-timezone");

// create new course
router.post("/create", auth, async (req, res) => {
  try {
    const { name, level, description, image, lectures = [] } = req.body;
    const course = new Course({
      name,
      level,
      description,
      image, // Store the Cloudinary URL in the image field
    });
    await course.save();
    const courseId = course._id;
    if (lectures.length !== 0) {
      for (const lecture of lectures) {
        // Check if the instructor is already assigned to a lecture on the same date
        const { date, instructorId } = lecture;
        const adjustedDate = moment(date).tz("Asia/Kolkata").toDate();
        const existingLecture = await Lecture.findOne({
          date: adjustedDate,
          instructorId,
        });
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
    }
    console.log();
    res.status(200).send({ course });
  } catch (error) {
    console.log(error, "some error");
    res.status(400).send({ error: error.message });
  }
});

// get all courses with respective lecture dates and their instrcutors alloted on those dates
router.get("/getAll", async (req, res) => {
  try {
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "lectures",
          let: { courseId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$courseId", "$$courseId"] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "instructorId",
                foreignField: "_id",
                as: "instructor",
              },
            },
            {
              $project: {
                date: 1,
                instructor: {
                  $let: {
                    vars: { instructor: { $arrayElemAt: ["$instructor", 0] } },
                    in: {
                      _id: "$$instructor._id",
                      name: "$$instructor.name",
                      email: "$$instructor.email",
                      role: "$$instructor.role",
                    },
                  },
                },
              },
            },
          ],
          as: "lectures",
        },
      },
    ]);

    res.status(200).json({ courses });
  } catch (error) {
    console.error("Error retrieving courses:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Find courses and their respective lectures by instructorId
router.get("/findByInstructorId/:instructorId", async (req, res) => {
  try {
    const instructorId = req.params.instructorId;

    // Find lectures by instructorId
    const lectures = await Lecture.find({ instructorId });

    if (lectures.length === 0) {
      return res
        .status(404)
        .json({ message: "No lectures found for the specified instructor" });
    }

    const courseIds = lectures.map((lecture) => lecture.courseId);

    // Find courses by courseIds
    const courses = await Course.find({ _id: { $in: courseIds } });

    if (courses.length === 0) {
      return res
        .status(404)
        .json({ message: "No courses found for the specified lectures" });
    }

    const responseData = courses.map((course) => {
      const courseLectures = lectures.filter(
        (lecture) => lecture.courseId.toString() === course._id.toString()
      );
      return {
        _id: course._id,
        name: course.name,
        level: course.level,
        description: course.description,
        image: course.image,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        lectures: courseLectures.map((lecture) => lecture.date),
      };
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get a course by id
router.get("/:id", async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }
    const lectures = await Lecture.find({ courseId }).populate(
      "instructorId",
      "name"
    );
    const courseWithLectures = {
      _id: course._id,
      name: course.name,
      level: course.level,
      description: course.description,
      image: course.image,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      lectures: lectures,
    };
    res.status(200).json(courseWithLectures);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Export the router
module.exports = router;
