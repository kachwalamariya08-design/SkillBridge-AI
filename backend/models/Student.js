
const mongoose = require("mongoose");

const educationalStreams = [
  "Engineering & Technology",
  "Commerce",
  "Arts & Humanities",
  "Management",
  "Science",
  "Medical & Healthcare",
  "Law",
  "Design & Creative Arts",
  "Vocational Studies",
  "Other",
];

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required."],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters."],
    },

    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address.",
      ],
    },

    password: {
  type: String,
  required: [true, "Password is required."],
  select: false,
},
    educationalStream: {
      type: String,
      required: [true, "Educational stream is required."],
      enum: {
        values: educationalStreams,
        message: "Please select a valid educational stream.",
      },
      trim: true,
    },

    course: {
      type: String,
      required: [true, "Course is required."],
      trim: true,
      maxlength: [120, "Course cannot exceed 120 characters."],
    },

    customCourse: {
      type: String,
      default: "",
      trim: true,
      maxlength: [120, "Custom course cannot exceed 120 characters."],
    },

    targetRole: {
      type: String,
      required: [true, "Career goal is required."],
      trim: true,
      maxlength: [120, "Career goal cannot exceed 120 characters."],
    },

    selectedSkills: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [80, "A skill cannot exceed 80 characters."],
        },
      ],
      default: [],
      validate: {
        validator: function (skills) {
          return (
            skills.length <= 50 &&
            skills.every((skill) => skill.trim().length > 0)
          );
        },
        message: "Please provide a valid list of skills.",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Student", studentSchema);
