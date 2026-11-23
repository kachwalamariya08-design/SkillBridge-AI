
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Calendar.css";

const STORAGE_KEY = "skillBridgeDailyGoals";

function getAccountStorageKey(accountId) {
  if (!accountId) return null;

  return `${STORAGE_KEY}_${encodeURIComponent(accountId)}`;
}

/* =====================================
   ACCOUNT STORAGE
===================================== */

function getSavedData(accountId) {
  const storageKey = getAccountStorageKey(accountId);

  if (!storageKey) return {};

  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) || "{}"
    );

    return saved.dailyLogs &&
      typeof saved.dailyLogs === "object" &&
      !Array.isArray(saved.dailyLogs)
      ? saved.dailyLogs
      : {};
  } catch {
    return {};
  }
}

/* =====================================
   DATE HELPERS
===================================== */

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getActivityLevel(minutes) {
  if (minutes === 0) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

/* =====================================
   CALENDAR COMPONENT
===================================== */

function Calendar() {
  const { accountId, loading } = useAuth();

  const [dailyLogs, setDailyLogs] = useState({});
  const [loadedAccountId, setLoadedAccountId] = useState("");

  /* =====================================
     LOAD CURRENT ACCOUNT DATA
  ===================================== */

  useEffect(() => {
    if (loading) return;

    if (!accountId) {
      setDailyLogs({});
      setLoadedAccountId("");
      return;
    }

    setDailyLogs(getSavedData(accountId));
    setLoadedAccountId(accountId);
  }, [accountId, loading]);

  /* =====================================
     SYNC WITH DAILY GOALS AND STOPWATCH
  ===================================== */

  useEffect(() => {
    if (
      loading ||
      !accountId ||
      loadedAccountId !== accountId
    ) {
      return;
    }

    function updateCalendar() {
      setDailyLogs(getSavedData(accountId));
    }

    window.addEventListener("storage", updateCalendar);
    window.addEventListener("focus", updateCalendar);

    window.addEventListener(
      "skillBridgeDailyGoalsUpdated",
      updateCalendar
    );

    return () => {
      window.removeEventListener("storage", updateCalendar);
      window.removeEventListener("focus", updateCalendar);

      window.removeEventListener(
        "skillBridgeDailyGoalsUpdated",
        updateCalendar
      );
    };
  }, [accountId, loadedAccountId, loading]);

  /* =====================================
     WAIT FOR ACCOUNT DATA
  ===================================== */

  if (
    loading ||
    !accountId ||
    loadedAccountId !== accountId
  ) {
    return (
      <section className="calendar-card">
        <div className="calendar-header">
          <div>
            <p className="calendar-eyebrow">
              YOUR LEARNING JOURNEY
            </p>

            <h2>Learning Activity</h2>

            <p className="calendar-subtitle">
              Loading your learning activity...
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* =====================================
     CALENDAR DATA
  ===================================== */

  const today = new Date();

  const startDate = new Date(
    today.getFullYear(),
    today.getMonth() - 11,
    1
  );

  startDate.setDate(
    startDate.getDate() - startDate.getDay()
  );

  const calendarDays = [];
  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    const dateKey = getDateKey(currentDate);
    const minutes = Number(dailyLogs[dateKey]) || 0;

    calendarDays.push({
      date: new Date(currentDate),
      dateKey,
      minutes,
      level: getActivityLevel(minutes),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const calendarColumns = Math.ceil(calendarDays.length / 7);
  const calendarWidth = calendarColumns * 18 - 5;

  /* =====================================
     LEARNING STATISTICS
  ===================================== */

  const totalMinutes = calendarDays.reduce(
    (total, day) => total + day.minutes,
    0
  );

  const activeDays = calendarDays.filter(
    (day) => day.minutes > 0
  ).length;

  const currentMonthDays = calendarDays.filter(
    (day) =>
      day.date.getMonth() === today.getMonth() &&
      day.date.getFullYear() === today.getFullYear()
  );

  const monthlyMinutes = currentMonthDays.reduce(
    (total, day) => total + day.minutes,
    0
  );

  const monthlyActiveDays = currentMonthDays.filter(
    (day) => day.minutes > 0
  ).length;

  const bestLearningDay = currentMonthDays.reduce(
    (best, day) =>
      day.minutes > best.minutes ? day : best,
    { minutes: 0, date: null }
  );

  /* =====================================
     FORMAT LEARNING TIME
  ===================================== */

  function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes} min`;
    }

    if (remainingMinutes === 0) {
      return `${hours} hr`;
    }

    return `${hours} hr ${remainingMinutes} min`;
  }

  /* =====================================
     UI
  ===================================== */

  return (
    <section className="calendar-card">
      <div className="calendar-header">
        <div>
          <p className="calendar-eyebrow">
            YOUR LEARNING JOURNEY
          </p>

          <h2>Learning Activity</h2>

          <p className="calendar-subtitle">
            Every small step adds up. Keep learning!
          </p>
        </div>
      </div>

      <div className="calendar-stats">
        <div className="calendar-stat">
          <span>Total Learning Time</span>
          <h3>{formatTime(totalMinutes)}</h3>
        </div>

        <div className="calendar-stat">
          <span>Active Days</span>
          <h3>{activeDays}</h3>
        </div>
      </div>

      <div className="calendar-monthly-summary">
        <h3>This Month's Summary</h3>

        <div className="calendar-monthly-grid">
          <div className="calendar-monthly-item">
            <span>Learning Time</span>
            <h4>{formatTime(monthlyMinutes)}</h4>
          </div>

          <div className="calendar-monthly-item">
            <span>Active Days</span>
            <h4>{monthlyActiveDays}</h4>
          </div>

          <div className="calendar-monthly-item">
            <span>Best Learning Day</span>

            <h4>
              {bestLearningDay.date
                ? bestLearningDay.date.toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                    }
                  )
                : "Not yet"}
            </h4>

            {bestLearningDay.minutes > 0 && (
              <small>
                {formatTime(bestLearningDay.minutes)}
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="calendar-scroll">
        <div
          className="calendar-months"
          style={{ width: `${calendarWidth}px` }}
        >
          {Array.from({ length: 12 }, (_, index) => {
            const monthDate = new Date(
              today.getFullYear(),
              today.getMonth() - 11 + index,
              1
            );

            return (
              <span key={index}>
                {monthDate.toLocaleString("en", {
                  month: "short",
                })}
              </span>
            );
          })}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day) => (
            <div
              key={day.dateKey}
              className={`calendar-day level-${day.level}`}
              title={`${day.date.toDateString()}: ${formatTime(
                day.minutes
              )}`}
            />
          ))}
        </div>
      </div>

      <div className="calendar-legend">
        <span>Less</span>

        {[0, 1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`calendar-day level-${level}`}
          />
        ))}

        <span>More</span>
      </div>
    </section>
  );
}

export default Calendar;
