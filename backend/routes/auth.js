
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const Student = require("../models/Student");

const router = express.Router();

const COOKIE_NAME = "skillbridge_token";

// ========================================
// COOKIE CONFIGURATION
// ========================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

// ========================================
// AUTHENTICATION RATE LIMITERS
// ========================================

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many login attempts. Please try again after 15 minutes.",
  },
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many registration attempts. Please try again after an hour.",
  },
});

// ========================================
// EDUCATIONAL STREAMS
// ========================================

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

// ========================================
// GENERATE AUTHENTICATION TOKEN
// ========================================

function generateToken(studentId) {
  return jwt.sign(
    { studentId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
      algorithm: "HS256",
    }
  );
}

// ========================================
// COOKIE HELPERS
// ========================================

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, cookieOptions);
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
  });
}

// ========================================
// SAFE STUDENT RESPONSE
// ========================================

function getStudentData(student) {
  return {
    id: student._id,
    studentName: student.studentName,
    email: student.email,
    educationalStream: student.educationalStream,
    course: student.course,
    customCourse: student.customCourse,
    targetRole: student.targetRole,
    selectedSkills: student.selectedSkills,
  };
}

// ========================================
// REGISTRATION VALIDATION
// ========================================

function validateRegistration(data) {
  const {
    studentName,
    email,
    password,
    educationalStream,
    course,
    customCourse,
    targetRole,
    selectedSkills,
  } = data;

  if (
    typeof studentName !== "string" ||
    !studentName.trim()
  ) {
    return "Please enter your full name.";
  }

  if (studentName.trim().length > 80) {
    return "Name cannot exceed 80 characters.";
  }

  if (
    typeof email !== "string" ||
    !email.trim()
  ) {
    return "Please enter your email address.";
  }

  const normalizedEmail = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    normalizedEmail.length > 254 ||
    !emailRegex.test(normalizedEmail)
  ) {
    return "Please enter a valid email address.";
  }

  if (typeof password !== "string") {
    return "Please enter a password.";
  }

  if (
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return "Password must contain at least 8 characters and cannot exceed the supported password length.";
  }

  if (
    typeof educationalStream !== "string" ||
    !educationalStreams.includes(educationalStream)
  ) {
    return "Please select a valid educational stream.";
  }

  if (
    typeof course !== "string" ||
    !course.trim() ||
    course.trim().length > 120
  ) {
    return "Please select or enter a valid course.";
  }

  if (
    customCourse !== undefined &&
    (
      typeof customCourse !== "string" ||
      customCourse.trim().length > 120
    )
  ) {
    return "Please enter a valid custom course.";
  }

  if (
    typeof targetRole !== "string" ||
    !targetRole.trim() ||
    targetRole.trim().length > 120
  ) {
    return "Please select or enter a valid career goal.";
  }

  if (
    !Array.isArray(selectedSkills) ||
    selectedSkills.length === 0 ||
    selectedSkills.length > 50
  ) {
    return "Please select between 1 and 50 skills.";
  }

  const validSkills = selectedSkills.every(
    (skill) =>
      typeof skill === "string" &&
      skill.trim().length > 0 &&
      skill.trim().length <= 80
  );

  if (!validSkills) {
    return "Please provide valid skill names.";
  }

  return null;
}

// ========================================
// REGISTER
// POST /api/auth/register
// ========================================

router.post(
  "/register",
  registerLimiter,
  async (req, res) => {
    try {
      const data = req.body || {};

      const validationError =
        validateRegistration(data);

      if (validationError) {
        return res.status(400).json({
          success: false,
          message: validationError,
        });
      }

      const {
        studentName,
        email,
        password,
        educationalStream,
        course,
        customCourse,
        targetRole,
        selectedSkills,
      } = data;

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingStudent = await Student.findOne({
        email: normalizedEmail,
      });

      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists.",
        });
      }

      const hashedPassword = await bcrypt.hash(
        password,
        12
      );

      const normalizedSkills = [
        ...new Set(
          selectedSkills.map((skill) => skill.trim())
        ),
      ];

      const student = await Student.create({
        studentName: studentName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        educationalStream,
        course: course.trim(),
        customCourse:
          typeof customCourse === "string"
            ? customCourse.trim()
            : "",
        targetRole: targetRole.trim(),
        selectedSkills: normalizedSkills,
      });

      const token = generateToken(
        student._id.toString()
      );

      setAuthCookie(res, token);

      return res.status(201).json({
        success: true,
        message: "Account created successfully!",
        student: getStudentData(student),
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error.message
      );

      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists.",
        });
      }

      return res.status(500).json({
        success: false,
        message:
          "Unable to create account. Please try again.",
      });
    }
  }
);

// ========================================
// LOGIN
// POST /api/auth/login
// ========================================

router.post(
  "/login",
  loginLimiter,
  async (req, res) => {
    try {
      const { email, password } = req.body || {};

      if (
        typeof email !== "string" ||
        !email.trim() ||
        email.trim().length > 254 ||
        typeof password !== "string" ||
        !password ||
        Buffer.byteLength(password, "utf8") > 72
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid email and password.",
        });
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const student = await Student.findOne({
        email: normalizedEmail,
      }).select("+password");

      if (!student) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const passwordMatches = await bcrypt.compare(
        password,
        student.password
      );

      if (!passwordMatches) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password.",
        });
      }

      const token = generateToken(
        student._id.toString()
      );

      setAuthCookie(res, token);

      return res.json({
        success: true,
        message: "Login successful!",
        student: getStudentData(student),
      });
    } catch (error) {
      console.error(
        "Login error:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to log in. Please try again.",
      });
    }
  }
);

// ========================================
// VERIFY SESSION
// GET /api/auth/me
// ========================================

router.get("/me", async (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not logged in.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
      }
    );
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      clearAuthCookie(res);

      return res.status(401).json({
        success: false,
        message:
          "Your session is invalid or has expired.",
      });
    }

    console.error(
      "Token verification error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify your session.",
    });
  }

  if (
    !decoded ||
    typeof decoded.studentId !== "string" ||
    !/^[a-f\d]{24}$/i.test(decoded.studentId)
  ) {
    clearAuthCookie(res);

    return res.status(401).json({
      success: false,
      message: "Invalid authentication session.",
    });
  }

  try {
    const student = await Student.findById(
      decoded.studentId
    ).select("-password");

    if (!student) {
      clearAuthCookie(res);

      return res.status(401).json({
        success: false,
        message: "Student account not found.",
      });
    }

    return res.json({
      success: true,
      student: getStudentData(student),
    });
  } catch (error) {
    console.error(
      "Session lookup error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify your session.",
    });
  }
});

// ========================================
// LOGOUT
// POST /api/auth/logout
// ========================================

router.post("/logout", (req, res) => {
  clearAuthCookie(res);

  return res.json({
    success: true,
    message: "Logged out successfully.",
  });
});

module.exports = router;
