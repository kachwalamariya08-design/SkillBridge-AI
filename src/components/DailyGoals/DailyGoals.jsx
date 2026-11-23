
import { useEffect, useState } from "react";
import {
  Target,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import "./DailyGoals.css";

const STORAGE_KEY = "skillBridgeDailyGoals";

const DEFAULT_DATA = {
  dailyTarget: 30,
  dailyLogs: {},
};

/* =====================================
   DATE HELPERS
===================================== */

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getPreviousDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() - 1);

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/* =====================================
   ACCOUNT STORAGE HELPERS
===================================== */

function getAccountStorageKey(accountId) {
  if (!accountId) return null;

  return `${STORAGE_KEY}_${encodeURIComponent(accountId)}`;
}

function normalizeData(saved) {
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) {
    return { ...DEFAULT_DATA };
  }

  return {
    dailyTarget:
      Number.isInteger(saved.dailyTarget) &&
      saved.dailyTarget >= 1 &&
      saved.dailyTarget <= 1440
        ? saved.dailyTarget
        : 30,

    dailyLogs:
      saved.dailyLogs &&
      typeof saved.dailyLogs === "object" &&
      !Array.isArray(saved.dailyLogs)
        ? saved.dailyLogs
        : {},
  };
}

function getSavedData(accountId) {
  if (!accountId) return { ...DEFAULT_DATA };

  try {
    const key = getAccountStorageKey(accountId);
    const saved = JSON.parse(localStorage.getItem(key) || "null");

    return normalizeData(saved);
  } catch {
    return { ...DEFAULT_DATA };
  }
}

/* =====================================
   STREAK CALCULATION
===================================== */

function calculateStreak(dailyLogs, dailyTarget, today) {
  let streak = 0;
  let date = today;

  if ((dailyLogs[today] || 0) < dailyTarget) {
    date = getPreviousDate(today);
  }

  while ((dailyLogs[date] || 0) >= dailyTarget) {
    streak++;
    date = getPreviousDate(date);
  }

  return streak;
}

/* =====================================
   DAILY GOALS COMPONENT
===================================== */

function DailyGoals() {
  const { accountId, loading } = useAuth();

  const [data, setData] = useState({ ...DEFAULT_DATA });
  const [minutesInput, setMinutesInput] = useState("");
  const [targetInput, setTargetInput] = useState("30");

  // Prevent old account data from being saved under a new account.
  const [loadedAccountId, setLoadedAccountId] = useState("");

  const today = getToday();

  /* =====================================
     LOAD DATA WHEN ACCOUNT CHANGES
  ===================================== */

  useEffect(() => {
    if (loading) return;

    if (!accountId) {
      setData({ ...DEFAULT_DATA });
      setTargetInput("30");
      setMinutesInput("");
      setLoadedAccountId("");
      return;
    }

    const savedData = getSavedData(accountId);

    setData(savedData);
    setTargetInput(String(savedData.dailyTarget));
    setMinutesInput("");
    setLoadedAccountId(accountId);
  }, [accountId, loading]);

  /* =====================================
     SAVE ACCOUNT-SPECIFIC DATA
  ===================================== */

  useEffect(() => {
    if (loading || !accountId || loadedAccountId !== accountId) {
      return;
    }

    const storageKey = getAccountStorageKey(accountId);

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));

      window.dispatchEvent(
        new Event("skillBridgeDailyGoalsUpdated")
      );
    } catch (error) {
      console.error("Unable to save Daily Goals:", error);
    }
  }, [data, accountId, loadedAccountId, loading]);

  /* =====================================
     SYNC WITH OTHER COMPONENTS
  ===================================== */

  useEffect(() => {
    if (loading || !accountId) return;

    function syncDailyGoals() {
      const savedData = getSavedData(accountId);

      setData((currentData) => {
        const isSame =
          currentData.dailyTarget === savedData.dailyTarget &&
          JSON.stringify(currentData.dailyLogs) ===
            JSON.stringify(savedData.dailyLogs);

        return isSame ? currentData : savedData;
      });

      setTargetInput(String(savedData.dailyTarget));
    }

    window.addEventListener(
      "skillBridgeDailyGoalsUpdated",
      syncDailyGoals
    );

    window.addEventListener("storage", syncDailyGoals);

    return () => {
      window.removeEventListener(
        "skillBridgeDailyGoalsUpdated",
        syncDailyGoals
      );

      window.removeEventListener("storage", syncDailyGoals);
    };
  }, [accountId, loading]);

  /* =====================================
     CALCULATE DAILY PROGRESS
  ===================================== */

  const todayMinutes = Number(data.dailyLogs[today] || 0);

  const progress = Math.min(
    100,
    Math.round((todayMinutes / data.dailyTarget) * 100)
  );

  const streak = calculateStreak(
    data.dailyLogs,
    data.dailyTarget,
    today
  );

  /* =====================================
     UPDATE DAILY TARGET
  ===================================== */

  function updateDailyTarget() {
    const value = Number(targetInput);

    if (
      targetInput.trim() === "" ||
      !Number.isInteger(value) ||
      value < 1 ||
      value > 1440
    ) {
      alert(
        "Choose a whole-number daily goal between 1 and 1440 minutes."
      );

      setTargetInput(String(data.dailyTarget));
      return;
    }

    if (loading || !accountId || loadedAccountId !== accountId) {
      return;
    }

    setData((previous) => ({
      ...previous,
      dailyTarget: value,
    }));
  }

  /* =====================================
     ADD LEARNING TIME
  ===================================== */

  function addLearningTime(event) {
    event.preventDefault();

    if (loading || !accountId || loadedAccountId !== accountId) {
      return;
    }

    const minutes = Number(minutesInput);

    if (
      !Number.isInteger(minutes) ||
      minutes < 1 ||
      minutes > 1440
    ) {
      alert(
        "Enter learning time between 1 and 1440 whole minutes."
      );
      return;
    }

    setData((previous) => ({
      ...previous,
      dailyLogs: {
        ...previous.dailyLogs,
        [today]: (previous.dailyLogs[today] || 0) + minutes,
      },
    }));

    setMinutesInput("");
  }

  /* =====================================
     WAIT FOR AUTHENTICATION
  ===================================== */

  if (loading || !accountId || loadedAccountId !== accountId) {
    return (
      <section className="daily-goals-card">
        <div className="daily-goals-heading">
          <div>
            <p className="daily-goals-eyebrow">
              BUILD YOUR HABIT
            </p>
            <h2>Daily Learning Goal</h2>
            <p>Loading your learning progress...</p>
          </div>
        </div>
      </section>
    );
  }

  /* =====================================
     UI
  ===================================== */

  return (
    <section className="daily-goals-card">
      <div className="daily-goals-heading">
        <div>
          <p className="daily-goals-eyebrow">
            BUILD YOUR HABIT
          </p>

          <h2>Daily Learning Goal</h2>

          <p>Small steps every day lead to big progress.</p>
        </div>

        <span className="daily-goals-flame" aria-hidden="true">
          <Target size={28} strokeWidth={1.8} />
        </span>
      </div>

      <div className="daily-goals-streak">
        <span
          className="daily-goals-streak-icon"
          aria-hidden="true"
        >
          <TrendingUp size={23} strokeWidth={1.8} />
        </span>

        <div>
          <strong>
            {streak} {streak === 1 ? "Day" : "Days"}
          </strong>

          <p>
            {streak > 0
              ? "Keep your learning streak alive!"
              : "Complete your daily goal to start your streak!"}
          </p>
        </div>
      </div>

      <div className="daily-goals-target">
        <label htmlFor="dailyTarget">
          Your daily target (minutes)
        </label>

        <input
          id="dailyTarget"
          type="number"
          min="1"
          max="1440"
          step="1"
          value={targetInput}
          onChange={(event) =>
            setTargetInput(event.target.value)
          }
          onBlur={updateDailyTarget}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              event.target.blur();
            }
          }}
          disabled={loading || !accountId || loadedAccountId !== accountId}
        />
      </div>

      <div className="daily-goals-progress-info">
        <span>Today's learning</span>

        <strong>
          {todayMinutes} / {data.dailyTarget} minutes
        </strong>
      </div>

      <div
        className="daily-goals-progress-track"
        role="progressbar"
        aria-label="Today's learning goal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="daily-goals-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="daily-goals-status">
        {progress >= 100 ? (
          <span className="daily-goals-success">
            <CheckCircle2
              size={17}
              strokeWidth={2}
              aria-hidden="true"
            />
            Daily goal achieved! Great work!
          </span>
        ) : (
          `${Math.max(
            data.dailyTarget - todayMinutes,
            0
          )} more minutes to reach your goal.`
        )}
      </p>

      <form
        className="daily-goals-form"
        onSubmit={addLearningTime}
      >
        <label htmlFor="learningMinutes">
          How many minutes did you learn today?
        </label>

        <div className="daily-goals-input-row">
          <input
            id="learningMinutes"
            type="number"
            min="1"
            max="1440"
            step="1"
            value={minutesInput}
            onChange={(event) =>
              setMinutesInput(event.target.value)
            }
            placeholder="e.g. 20"
            required
            disabled={loading || !accountId || loadedAccountId !== accountId}
          />

          <button
            type="submit"
            disabled={loading || !accountId || loadedAccountId !== accountId}
          >
            Count Me In
          </button>
        </div>
      </form>
    </section>
  );
}

export default DailyGoals;
