
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import DailyGoals from "../../components/DailyGoals/DailyGoals";
import Achievements from "../../components/Achievements/Achievements";
import Calendar from "../../components/Calendar/Calendar";
import LearningStopwatch from "../../components/LearningStopwatch/LearningStopwatch";

import {
  roadmaps,
  generalRoadmap,
  rolePathway,
} from "../Roadmap/Roadmap";

import {
  skillsByRole,
  generalSkills,
} from "../SkillGap/SkillGap";

import "./Dashboard.css";

/* =====================================
   STORAGE KEYS
===================================== */

const PROFILE_KEY = "skillBridgeProfile";
const PROGRESS_KEY = "skillBridgeProgress";

/* =====================================
   STORAGE HELPERS
===================================== */

function getSavedProfile() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(PROFILE_KEY) || "{}"
    );

    return saved &&
      typeof saved === "object" &&
      !Array.isArray(saved)
      ? saved
      : {};
  } catch {
    return {};
  }
}

function getAccountStorageKey(baseKey, accountId) {
  if (!accountId) return null;

  return `${baseKey}_${encodeURIComponent(accountId)}`;
}

function getSavedProgress(accountId) {
  if (!accountId) return {};

  const progressKey = getAccountStorageKey(
    PROGRESS_KEY,
    accountId
  );

  try {
    const saved = JSON.parse(
      localStorage.getItem(progressKey) || "{}"
    );

    return saved &&
      typeof saved === "object" &&
      !Array.isArray(saved)
      ? saved
      : {};
  } catch {
    return {};
  }
}

/* =====================================
   DASHBOARD ICONS
===================================== */

function DashboardIcon({ type }) {
  const common = {
    width: 23,
    height: 23,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  switch (type) {
    case "target":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );

    case "skills":
      return (
        <svg {...common}>
          <path d="M12 3 14.8 8.7 21 9.6 16.5 14l1.1 6.2L12 17.3l-5.6 2.9L7.5 14 3 9.6l6.2-.9L12 3Z" />
        </svg>
      );

    case "progress":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <rect x="7" y="11" width="3" height="5" rx="1" />
          <rect x="12" y="7" width="3" height="9" rx="1" />
          <rect x="17" y="4" width="3" height="12" rx="1" />
        </svg>
      );

    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
        </svg>
      );

    case "skills-plan":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" />
          <path d="M4 5.5V21" />
          <path d="M8 7h8M8 11h8" />
        </svg>
      );

    case "roadmap":
      return (
        <svg {...common}>
          <circle cx="5" cy="5" r="2" />
          <circle cx="19" cy="19" r="2" />
          <path d="M7 5h5a3 3 0 0 1 3 3v8a3 3 0 0 0 3 3" />
        </svg>
      );

    default:
      return null;
  }
}

/* =====================================
   DASHBOARD COMPONENT
===================================== */

function Dashboard() {
  const { accountId, loading } = useAuth();

  const [profile, setProfile] = useState({});
  const [savedProgress, setSavedProgress] = useState({});
  const [loadedAccountId, setLoadedAccountId] = useState("");

  const accountReady =
    Boolean(accountId) &&
    !loading &&
    loadedAccountId === accountId;

  /* =====================================
     LOAD ACCOUNT DATA
  ===================================== */

  useEffect(() => {
    if (loading) return;

    if (!accountId) {
      setProfile({});
      setSavedProgress({});
      setLoadedAccountId("");
      return;
    }

    // Profile represents the currently authenticated student.
    const accountProfile = getSavedProfile();

    // Roadmap progress belongs to this account only.
    const accountProgress = getSavedProgress(accountId);

    setProfile(accountProfile);
    setSavedProgress(accountProgress);
    setLoadedAccountId(accountId);
  }, [accountId, loading]);

  /* =====================================
     LISTEN FOR DATA UPDATES
  ===================================== */

  useEffect(() => {
    if (!accountReady) return;

    function updateDashboard() {
      setProfile(getSavedProfile());
      setSavedProgress(getSavedProgress(accountId));
    }

    window.addEventListener(
      "skillBridgeProfileUpdated",
      updateDashboard
    );

    window.addEventListener(
      "skillBridgeProgressUpdated",
      updateDashboard
    );

    window.addEventListener(
      "skillBridgeRoadmapUpdated",
      updateDashboard
    );

    window.addEventListener("storage", updateDashboard);
    window.addEventListener("focus", updateDashboard);

    return () => {
      window.removeEventListener(
        "skillBridgeProfileUpdated",
        updateDashboard
      );

      window.removeEventListener(
        "skillBridgeProgressUpdated",
        updateDashboard
      );

      window.removeEventListener(
        "skillBridgeRoadmapUpdated",
        updateDashboard
      );

      window.removeEventListener("storage", updateDashboard);
      window.removeEventListener("focus", updateDashboard);
    };
  }, [accountId, accountReady]);

  /* =====================================
     PROFILE INFORMATION
  ===================================== */

  const studentName = profile.studentName || "Student";

  const targetRole =
    profile.targetRole || "Frontend Developer";

  const selectedSkills = Array.isArray(profile.selectedSkills)
    ? profile.selectedSkills
    : [];

  const educationalStream =
    profile.educationalStream || "your chosen field";

  /* =====================================
     ROADMAP PROGRESS
  ===================================== */

  const roadmapKey = rolePathway?.[targetRole] || targetRole;

  const selectedRoadmap =
    roadmaps?.[roadmapKey] ||
    generalRoadmap ||
    [];

  const completedSteps =
    accountReady &&
    Array.isArray(savedProgress?.[targetRole])
      ? savedProgress[targetRole]
      : [];

  const completedCount = selectedRoadmap.filter((step) =>
    completedSteps.includes(step.title)
  ).length;

  const progressPercentage = selectedRoadmap.length
    ? Math.round(
        (completedCount / selectedRoadmap.length) * 100
      )
    : 0;

  /* =====================================
     NEXT LEARNING STEP
  ===================================== */

  const nextStep = selectedRoadmap.find(
    (step) => !completedSteps.includes(step.title)
  );

  const recommendationTitle = nextStep
    ? nextStep.title
    : "Your roadmap is complete!";

  const recommendationDescription = nextStep
    ? nextStep.description
    : "You've completed all the steps in your current learning roadmap. Explore more skills to continue growing.";

  /* =====================================
     SKILL RECOMMENDATIONS
  ===================================== */

  const requiredSkills =
    skillsByRole?.[targetRole] || generalSkills;

  const knownSkills = requiredSkills.filter((skill) =>
    selectedSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !selectedSkills.includes(skill)
  );

  const skillMatchPercentage = requiredSkills.length
    ? Math.round(
        (knownSkills.length / requiredSkills.length) * 100
      )
    : 0;

  /* =====================================
     PROFILE COMPLETION
  ===================================== */

  const hasProfileDetails =
    Boolean(profile.educationalStream) &&
    Boolean(profile.targetRole) &&
    selectedSkills.length > 0;

  /* =====================================
     WAIT FOR ACCOUNT DATA
  ===================================== */

  if (loading || (accountId && !accountReady)) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-header">
          <p className="dashboard-eyebrow">
            YOUR LEARNING SPACE
          </p>

          <h1>Loading your dashboard...</h1>

          <p className="dashboard-welcome-text">
            Preparing your personal learning progress.
          </p>
        </div>
      </main>
    );
  }

  /* =====================================
     UI
  ===================================== */

  return (
    <main className="dashboard-page">

      {/* WELCOME HEADER */}

      <header className="dashboard-header dashboard-animate">
        <p className="dashboard-eyebrow">
          YOUR LEARNING SPACE
        </p>

        <h1>Welcome back, {studentName}!</h1>

        <p className="dashboard-welcome-text">
          Every small step counts. Keep learning, exploring and growing.
          Your next achievement is just one step away!
        </p>
      </header>

      {/* LEARNING OVERVIEW */}

      <section
        className="dashboard-stats"
        aria-label="Your learning overview"
      >
        <article className="dashboard-stat-card dashboard-animate dashboard-delay-1">
          <div className="dashboard-stat-icon">
            <DashboardIcon type="target" />
          </div>

          <h3>My Career Goal</h3>

          <p className="dashboard-stat-value">
            {targetRole}
          </p>

          <span className="dashboard-stat-caption">
            The career I'm working towards
          </span>
        </article>

        <article className="dashboard-stat-card dashboard-animate dashboard-delay-2">
          <div className="dashboard-stat-icon">
            <DashboardIcon type="skills" />
          </div>

          <h3>My Skills</h3>

          <p className="dashboard-stat-value">
            {selectedSkills.length}
          </p>

          <span className="dashboard-stat-caption">
            Skills added to my profile
          </span>
        </article>

        <article className="dashboard-stat-card dashboard-animate dashboard-delay-3">
          <div className="dashboard-stat-icon">
            <DashboardIcon type="progress" />
          </div>

          <h3>Learning Progress</h3>

          <p className="dashboard-stat-value">
            {progressPercentage}%
          </p>

          <div
            className="dashboard-progress-track"
            role="progressbar"
            aria-label="Learning roadmap progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressPercentage}
          >
            <div
              className="dashboard-progress-fill"
              style={{
                width: `${progressPercentage}%`,
              }}
            />
          </div>

          <span className="dashboard-stat-caption">
            {completedCount} of {selectedRoadmap.length} learning steps completed
          </span>
        </article>
      </section>

      {/* PERSONALIZED RECOMMENDATIONS */}

      <section className="dashboard-recommendations dashboard-panel dashboard-animate">

        <div className="dashboard-section-heading">
          <div className="dashboard-section-icon">
            <DashboardIcon type="target" />
          </div>

          <div>
            <h2>Recommended for You</h2>

            <p>
              Personalized suggestions based on your learning profile,
              career goal and progress.
            </p>
          </div>
        </div>

        <div className="dashboard-recommendation-grid">

          {/* NEXT LEARNING STEP */}

          <article className="dashboard-recommendation-card">
            <div className="dashboard-recommendation-icon">
              <DashboardIcon type="roadmap" />
            </div>

            <span className="dashboard-recommendation-label">
              YOUR NEXT LEARNING STEP
            </span>

            <h3>{recommendationTitle}</h3>

            <p>{recommendationDescription}</p>

            <Link
              to="/roadmap"
              className="dashboard-recommendation-link"
            >
              {nextStep ? "Continue roadmap" : "Explore roadmap"}
            </Link>
          </article>

          {/* PERSONALIZED SKILL DEVELOPMENT */}

          <article className="dashboard-recommendation-card">
            <div className="dashboard-recommendation-icon">
              <DashboardIcon type="skills" />
            </div>

            <span className="dashboard-recommendation-label">
              SKILL DEVELOPMENT
            </span>

            <h3>Your Career Skill Match</h3>

            <div className="dashboard-skill-match-summary">
              <strong>{skillMatchPercentage}%</strong>

              <span>
                {knownSkills.length} of {requiredSkills.length} required skills
                matched
              </span>
            </div>

            <div
              className="dashboard-progress-track"
              role="progressbar"
              aria-label="Career skill match"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={skillMatchPercentage}
            >
              <div
                className="dashboard-progress-fill"
                style={{
                  width: `${skillMatchPercentage}%`,
                }}
              />
            </div>

            <div className="dashboard-recommended-skill-group">
              <span className="dashboard-recommended-skill-heading">
                Skills you know
              </span>

              {knownSkills.length > 0 ? (
                <div className="dashboard-recommended-skill-list">
                  {knownSkills.map((skill) => (
                    <span
                      className="dashboard-recommended-skill known"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p>
                  No matching skills added to your profile yet.
                </p>
              )}
            </div>

            <div className="dashboard-recommended-skill-group">
              <span className="dashboard-recommended-skill-heading">
                Skills to develop
              </span>

              {missingSkills.length > 0 ? (
                <div className="dashboard-recommended-skill-list">
                  {missingSkills.map((skill) => (
                    <span
                      className="dashboard-recommended-skill missing"
                      key={skill}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p>
                  You've selected all the listed skills. Keep developing them!
                </p>
              )}
            </div>

            <Link
              to="/skill-gap"
              className="dashboard-recommendation-link"
            >
              View full skill analysis
            </Link>
          </article>

          {/* LEARNING RESOURCES */}

          <article className="dashboard-recommendation-card">
            <div className="dashboard-recommendation-icon">
              <DashboardIcon type="skills-plan" />
            </div>

            <span className="dashboard-recommendation-label">
              LEARNING RESOURCES
            </span>

            <h3>Explore relevant resources</h3>

            <p>
              Discover learning materials selected for your{" "}
              {educationalStream} background and your career goal of{" "}
              {targetRole}.
            </p>

            <Link
              to="/resources"
              className="dashboard-recommendation-link"
            >
              Explore resources
            </Link>
          </article>

        </div>

        {/* PROFILE COMPLETION NOTICE */}

        {!hasProfileDetails && (
          <div className="dashboard-recommendation-notice">
            <p>
              Complete your profile with your educational stream,
              career goal and skills to get more personalized suggestions.
            </p>

            <Link to="/profile?edit=true">
              Complete my profile
            </Link>
          </div>
        )}

      </section>

      {/* DAILY GOALS AND STOPWATCH */}

      <section className="dashboard-learning-row dashboard-animate">
        <div className="dashboard-learning-goals">
          <DailyGoals />
        </div>

        <div className="dashboard-learning-timer">
          <LearningStopwatch />
        </div>
      </section>

      {/* CALENDAR */}

      <div className="dashboard-animate dashboard-delay-1">
        <Calendar />
      </div>

      {/* ACHIEVEMENTS */}

      <div className="dashboard-animate dashboard-delay-2">
        <Achievements />
      </div>

      {/* STUDENT SKILLS */}

      <section className="dashboard-skills dashboard-panel dashboard-animate">

        <div className="dashboard-section-heading">
          <div className="dashboard-section-icon">
            <DashboardIcon type="skills-plan" />
          </div>

          <div>
            <h2>Skills I'm Building</h2>

            <p>
              Keep track of the skills you're developing.
            </p>
          </div>
        </div>

        {selectedSkills.length > 0 ? (
          <div className="dashboard-skills-list">
            {selectedSkills.map((skill) => (
              <span
                className="dashboard-skill-tag"
                key={skill}
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="dashboard-empty-message">
            Your skills will appear here once you add them to your profile.
          </p>
        )}

        <Link
          to="/profile?edit=true"
          className="dashboard-link"
        >
          <DashboardIcon type="profile" />
          <span>Update My Profile</span>
        </Link>

      </section>

      {/* WHAT'S NEXT */}

      <section className="dashboard-journey dashboard-panel dashboard-animate">

        <div className="dashboard-section-heading">
          <div className="dashboard-section-icon">
            <DashboardIcon type="roadmap" />
          </div>

          <div>
            <h2>What's Next?</h2>

            <p>
              Choose your next step and keep moving forward.
            </p>
          </div>
        </div>

        <div className="dashboard-journey-links">

          <Link to="/skill-gap" className="dashboard-link">
            <DashboardIcon type="skills" />

            <div className="dashboard-journey-content">
              <span className="dashboard-journey-title">
                Discover Skills to Improve.
              </span>

              <span className="dashboard-journey-action">
                Explore my skills →
              </span>
            </div>
          </Link>

          <Link to="/roadmap" className="dashboard-link">
            <DashboardIcon type="roadmap" />

            <div className="dashboard-journey-content">
              <span className="dashboard-journey-title">
                View My Learning Plan.
              </span>

              <span className="dashboard-journey-action">
                Continue learning →
              </span>
            </div>
          </Link>

        </div>

      </section>

    </main>
  );
}

export default Dashboard;
