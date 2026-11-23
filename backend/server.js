
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

const ADZUNA_BASE_URL =
  "https://api.adzuna.com/v1/api/jobs/in/search/1";

// =====================================
// MIDDLEWARE
// =====================================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// =====================================
// AUTHENTICATION ROUTES
// =====================================

app.use("/api/auth", authRoutes);

// =====================================
// HEALTH CHECK
// =====================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SkillBridge AI backend is running!",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// =====================================
// CLASSIFY JOB TYPES
// =====================================

function getJobType(job) {
  const title = (job.title || "").toLowerCase();
  const contractTime = (job.contract_time || "").toLowerCase();

  if (/\bintern(ship)?\b/.test(title)) {
    return "Internship";
  }

  if (
    contractTime === "part_time" ||
    /\bpart[- ]time\b/.test(title)
  ) {
    return "Part-time";
  }

  if (
    contractTime === "full_time" ||
    /\bfull[- ]time\b/.test(title)
  ) {
    return "Full-time";
  }

  return "Other";
}

// =====================================
// FETCH JOBS FROM ADZUNA
// =====================================

async function fetchAdzunaJobs(what, where, extraParams = {}) {
  const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;

  const params = new URLSearchParams({
    app_id: ADZUNA_APP_ID,
    app_key: ADZUNA_APP_KEY,
    results_per_page: "50",
    what,
    where,
    max_days_old: "180",
    sort_by: "date",
    "content-type": "application/json",
    ...extraParams,
  });

  const response = await fetch(
    `${ADZUNA_BASE_URL}?${params.toString()}`,
    {
      signal: AbortSignal.timeout(20000),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Adzuna returned HTTP ${response.status}.`
    );
  }

  return response.json();
}

// =====================================
// NORMALIZE JOB DATA
// =====================================

function prepareJob(job) {
  return {
    id: job.id,
    title: job.title || "Untitled Position",
    company: job.company?.display_name || "Not specified",
    location: job.location?.display_name || "Not specified",
    description: job.description || "",
    applicationUrl: job.redirect_url || "",
    postedDate: job.created || "",
    salaryMin: job.salary_min || null,
    salaryMax: job.salary_max || null,
    contractType: job.contract_type || "",
    contractTime: job.contract_time || "",
    type: getJobType(job),
  };
}

// =====================================
// VALIDATE JOB SEARCH PARAMETERS
// =====================================

function validateSearchParameter(value, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue.length > 100) {
    return null;
  }

  return trimmedValue;
}

// =====================================
// JOB SEARCH API
// =====================================

app.get("/api/jobs", async (req, res) => {
  try {
    const { ADZUNA_APP_ID, ADZUNA_APP_KEY } = process.env;

    if (!ADZUNA_APP_ID || !ADZUNA_APP_KEY) {
      return res.status(500).json({
        success: false,
        message: "Job search service is not configured.",
      });
    }

    const what = validateSearchParameter(
      req.query.what,
      "software developer"
    );

    const where = validateSearchParameter(
      req.query.where,
      "India"
    );

    if (!what || !where) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid job search parameters. Search terms and location must be between 1 and 100 characters.",
      });
    }

    const [
      generalResults,
      internshipResults,
      partTimeResults,
    ] = await Promise.all([
      fetchAdzunaJobs(what, where),

      fetchAdzunaJobs(
        `${what} internship`,
        where
      ),

      fetchAdzunaJobs(what, where, {
        part_time: "1",
      }),
    ]);

    const allResults = [
      ...(generalResults.results || []),
      ...(internshipResults.results || []),
      ...(partTimeResults.results || []),
    ];

    // Remove duplicate job listings.
    const uniqueJobs = Array.from(
      new Map(
        allResults.map((job) => [
          String(job.id),
          job,
        ])
      ).values()
    );

    // Prepare, filter and sort jobs.
    const jobs = uniqueJobs
      .map(prepareJob)
      .filter((job) => {
        if (!job.postedDate) return false;

        const postedTime = new Date(
          job.postedDate
        ).getTime();

        if (Number.isNaN(postedTime)) {
          return false;
        }

        const daysOld =
          (Date.now() - postedTime) /
          (1000 * 60 * 60 * 24);

        return daysOld >= 0 && daysOld <= 180;
      })
      .sort(
        (a, b) =>
          new Date(b.postedDate).getTime() -
          new Date(a.postedDate).getTime()
      );

    // Count jobs by type.
    const typeCounts = {
      Internship: 0,
      "Full-time": 0,
      "Part-time": 0,
      Other: 0,
    };

    jobs.forEach((job) => {
      typeCounts[job.type]++;
    });

    return res.json({
      success: true,
      totalResults: jobs.length,
      returnedJobs: jobs.length,
      typeCounts,

      searchCounts: {
        general: generalResults.count || 0,
        internship: internshipResults.count || 0,
        partTime: partTimeResults.count || 0,
      },

      jobs,
    });
  } catch (error) {
    console.error(
      "Job search error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while fetching jobs. Please try again later.",
    });
  }
});

// =====================================
// START SERVER
// =====================================

let server;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing from the .env file."
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing from the .env file."
      );
    }

    if (process.env.JWT_SECRET.length < 32) {
      throw new Error(
        "JWT_SECRET must contain at least 32 characters."
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");

    server = app.listen(PORT, () => {
      console.log(
        `Backend running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Backend startup failed:",
      error.message
    );

    process.exit(1);
  }
}

// =====================================
// GRACEFUL SERVER SHUTDOWN
// =====================================

async function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    }

    await mongoose.connection.close();

    console.log("Server and database connections closed.");

    process.exit(0);
  } catch (error) {
    console.error(
      "Error during shutdown:",
      error.message
    );

    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
