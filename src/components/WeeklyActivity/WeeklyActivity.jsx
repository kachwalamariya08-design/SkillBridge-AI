
import { useEffect, useState } from "react";
import "./WeeklyActivity.css";

const STORAGE_KEY = "skillBridgeDailyGoals";

function getDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLastSevenDays() {
  const today = new Date();
  const days = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    days.push({
      date: getDateString(date),
      label: date.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      dayNumber: date.getDate(),
    });
  }

  return days;
}

function getSavedLogs() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "{}"
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

function WeeklyActivity() {
  const [dailyLogs, setDailyLogs] = useState(getSavedLogs);

  useEffect(() => {
    function updateLogs() {
      setDailyLogs(getSavedLogs());
    }

    window.addEventListener("storage", updateLogs);
    window.addEventListener("focus", updateLogs);

    return () => {
      window.removeEventListener("storage", updateLogs);
      window.removeEventListener("focus", updateLogs);
    };
  }, []);

  const days = getLastSevenDays();

  const weeklyMinutes = days.reduce(
    (total, day) => total + (dailyLogs[day.date] || 0),
    0
  );

  const maxMinutes = Math.max(
    30,
    ...days.map((day) => dailyLogs[day.date] || 0)
  );

  return (
    <section className="weekly-activity-card">
      <div className="weekly-activity-heading">
        <div>
          <p className="weekly-activity-eyebrow">
            YOUR PROGRESS
          </p>

          <h2>My Week at a Glance</h2>

          <p>
            Look how much time you've spent learning this week!
          </p>
        </div>

        <span
          className="weekly-activity-icon"
          aria-hidden="true"
        >
          🎯
        </span>
      </div>

      <div className="weekly-activity-summary">
        <span>Time spent learning</span>

        <strong>
          {Math.floor(weeklyMinutes / 60)}h {weeklyMinutes % 60}m
        </strong>
      </div>

      <div className="weekly-activity-chart">
        {days.map((day) => {
          const minutes = dailyLogs[day.date] || 0;

          const height =
            minutes > 0
              ? Math.max((minutes / maxMinutes) * 100, 5)
              : 0;

          return (
            <div
              className="weekly-activity-day"
              key={day.date}
            >
              <span className="weekly-activity-minutes">
                {minutes > 0 ? `${minutes}m` : "—"}
              </span>

              <div className="weekly-activity-bar-track">
                <div
                  className="weekly-activity-bar"
                  style={{ height: `${height}%` }}
                  title={`${minutes} minutes`}
                />
              </div>

              <span className="weekly-activity-label">
                {day.label}
              </span>

              <span className="weekly-activity-date">
                {day.dayNumber}
              </span>
            </div>
          );
        })}
      </div>

      <p className="weekly-activity-note">
        Every minute counts! Add your learning time in the Daily
        Learning Goal section to see your progress here.
      </p>
    </section>
  );
}

export default WeeklyActivity;
