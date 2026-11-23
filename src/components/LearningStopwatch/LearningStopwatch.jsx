
import { useEffect, useRef, useState } from "react";
import {
  Timer,
  Play,
  Pause,
  Square,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./LearningStopwatch.css";

const STORAGE_KEY = "skillBridgeDailyGoals";
const ACTIVE_SESSION_KEY = "skillBridgeActiveLearningSession";
const PROMPT_KEY = "skillBridgeLearningPrompt";

function getAccountStorageKey(baseKey, accountId) {
  if (!accountId) return null;

  return `${baseKey}_${encodeURIComponent(accountId)}`;
}

function getToday() {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getSavedData(accountId) {
  const storageKey = getAccountStorageKey(
    STORAGE_KEY,
    accountId
  );

  if (!storageKey) {
    return { dailyTarget: 30, dailyLogs: {} };
  }

  try {
    const saved = JSON.parse(
      localStorage.getItem(storageKey) || "null"
    );

    return {
      dailyTarget:
        Number.isInteger(saved?.dailyTarget) &&
        saved.dailyTarget >= 1 &&
        saved.dailyTarget <= 1440
          ? saved.dailyTarget
          : 30,
      dailyLogs:
        saved?.dailyLogs &&
        typeof saved.dailyLogs === "object" &&
        !Array.isArray(saved.dailyLogs)
          ? saved.dailyLogs
          : {},
    };
  } catch {
    return { dailyTarget: 30, dailyLogs: {} };
  }
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function getElapsedTime(session, currentTime) {
  if (!session) return 0;

  const runningTime = session.startedAt
    ? Math.max(0, currentTime - session.startedAt)
    : 0;

  return (session.elapsedMs || 0) + runningTime;
}

function saveLearningMinutes(accountId, date, minutes) {
  if (!accountId || minutes < 1) return;

  const storageKey = getAccountStorageKey(
    STORAGE_KEY,
    accountId
  );

  if (!storageKey) return;

  const latestData = getSavedData(accountId);

  const updatedData = {
    ...latestData,
    dailyLogs: {
      ...latestData.dailyLogs,
      [date]: (latestData.dailyLogs[date] || 0) + minutes,
    },
  };

  localStorage.setItem(
    storageKey,
    JSON.stringify(updatedData)
  );

  window.dispatchEvent(
    new Event("skillBridgeDailyGoalsUpdated")
  );
}

function LearningStopwatch() {
  const { accountId, loading } = useAuth();

  const [activeSession, setActiveSession] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [showStartPrompt, setShowStartPrompt] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [loadedAccountId, setLoadedAccountId] = useState("");

  const activeSessionRef = useRef(null);
  const lastHeartbeatRef = useRef(0);
  const finishSessionRef = useRef(null);

  const activeSessionStorageKey = getAccountStorageKey(
    ACTIVE_SESSION_KEY,
    accountId
  );

  const promptStorageKey = getAccountStorageKey(
    PROMPT_KEY,
    accountId
  );

  function updateSession(session) {
    activeSessionRef.current = session;
    setActiveSession(session);

    if (session && activeSessionStorageKey) {
      localStorage.setItem(
        activeSessionStorageKey,
        JSON.stringify(session)
      );
    } else if (activeSessionStorageKey) {
      localStorage.removeItem(activeSessionStorageKey);
    }
  }

  function finishSession(automatic = false, endTime = Date.now()) {
    const session = activeSessionRef.current;

    if (!session || !accountId) return false;

    const elapsedMs = getElapsedTime(session, endTime);
    const completedMinutes = Math.floor(elapsedMs / 60000);

    updateSession(null);

    if (completedMinutes > 0) {
      saveLearningMinutes(
        accountId,
        session.date,
        completedMinutes
      );
    }

    if (automatic) {
      if (promptStorageKey) {
        localStorage.setItem(promptStorageKey, "1");
      }
    } else {
      setSavedMessage(
        completedMinutes > 0
          ? `${completedMinutes} minute${
              completedMinutes === 1 ? "" : "s"
            } added to your learning time.`
          : "Session ended. No complete minutes to add."
      );
    }

    return true;
  }

  finishSessionRef.current = finishSession;

  // Load only this account's session after authentication.
  useEffect(() => {
    if (loading) return;

    activeSessionRef.current = null;
    setActiveSession(null);
    setShowStartPrompt(false);
    setSavedMessage("");

    if (!accountId) {
      setLoadedAccountId("");
      return;
    }

    const sessionKey = getAccountStorageKey(
      ACTIVE_SESSION_KEY,
      accountId
    );

    const promptKey = getAccountStorageKey(
      PROMPT_KEY,
      accountId
    );

    try {
      const savedSession = JSON.parse(
        localStorage.getItem(sessionKey) || "null"
      );

      const navigationEntry =
        performance.getEntriesByType("navigation")[0];

      const isPageRefresh =
        navigationEntry?.type === "reload";

      if (savedSession && isPageRefresh) {
        activeSessionRef.current = savedSession;
        setActiveSession(savedSession);
        lastHeartbeatRef.current = Date.now();
      } else if (savedSession) {
        const lastActiveTime =
          savedSession.lastActiveAt ||
          savedSession.startedAt ||
          Date.now();

        const recoveredElapsed =
          (savedSession.elapsedMs || 0) +
          (savedSession.startedAt
            ? Math.max(
                0,
                lastActiveTime - savedSession.startedAt
              )
            : 0);

        localStorage.removeItem(sessionKey);

        const minutes = Math.floor(
          recoveredElapsed / 60000
        );

        if (minutes > 0 && savedSession.date) {
          saveLearningMinutes(
            accountId,
            savedSession.date,
            minutes
          );
        }

        localStorage.setItem(promptKey, "1");
      }
    } catch (error) {
      console.error(
        "Unable to recover learning session:",
        error
      );

      localStorage.removeItem(sessionKey);
    }

    if (localStorage.getItem(promptKey) === "1") {
      setShowStartPrompt(true);
      localStorage.removeItem(promptKey);
    }

    setLoadedAccountId(accountId);
  }, [accountId, loading]);

  function startSession() {
    if (!accountId || loadedAccountId !== accountId) return;

    const now = Date.now();

    updateSession({
      accountId,
      date: getToday(),
      startedAt: now,
      elapsedMs: 0,
      lastActiveAt: now,
    });

    lastHeartbeatRef.current = now;
    setShowStartPrompt(false);
    setSavedMessage("");

    if (promptStorageKey) {
      localStorage.removeItem(promptStorageKey);
    }
  }

  function pauseSession() {
    const session = activeSessionRef.current;

    if (
      !session?.startedAt ||
      session.accountId !== accountId
    ) return;

    const now = Date.now();

    updateSession({
      ...session,
      elapsedMs: getElapsedTime(session, now),
      startedAt: null,
      lastActiveAt: now,
    });
  }

  function resumeSession() {
    const session = activeSessionRef.current;

    if (
      !session ||
      session.startedAt ||
      session.accountId !== accountId
    ) return;

    const now = Date.now();

    updateSession({
      ...session,
      startedAt: now,
      lastActiveAt: now,
    });

    lastHeartbeatRef.current = now;
  }

  function stopSession() {
    finishSessionRef.current?.(false);
  }

  // Update the timer and save recovery checkpoints.
  useEffect(() => {
    if (!accountId || loadedAccountId !== accountId) return;

    const timer = window.setInterval(() => {
      const now = Date.now();

      setCurrentTime(now);

      const session = activeSessionRef.current;

      if (
        session?.startedAt &&
        session.accountId === accountId &&
        now - lastHeartbeatRef.current >= 5000
      ) {
        lastHeartbeatRef.current = now;

        const updatedSession = {
          ...session,
          lastActiveAt: now,
        };

        activeSessionRef.current = updatedSession;

        if (activeSessionStorageKey) {
          localStorage.setItem(
            activeSessionStorageKey,
            JSON.stringify(updatedSession)
          );
        }
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [
    accountId,
    loadedAccountId,
    activeSessionStorageKey,
  ]);

  // Preserve the current account's session on refresh or close.
  useEffect(() => {
    if (!accountId || loadedAccountId !== accountId) return;

    const saveSessionCheckpoint = () => {
      const session = activeSessionRef.current;

      if (!session || session.accountId !== accountId) return;

      const updatedSession = {
        ...session,
        lastActiveAt: Date.now(),
      };

      activeSessionRef.current = updatedSession;

      if (activeSessionStorageKey) {
        localStorage.setItem(
          activeSessionStorageKey,
          JSON.stringify(updatedSession)
        );
      }
    };

    window.addEventListener("pagehide", saveSessionCheckpoint);
    window.addEventListener(
      "beforeunload",
      saveSessionCheckpoint
    );

    return () => {
      window.removeEventListener(
        "pagehide",
        saveSessionCheckpoint
      );

      window.removeEventListener(
        "beforeunload",
        saveSessionCheckpoint
      );
    };
  }, [
    accountId,
    loadedAccountId,
    activeSessionStorageKey,
  ]);

  const sessionBelongsToAccount =
    activeSession?.accountId === accountId;

  const visibleSession = sessionBelongsToAccount
    ? activeSession
    : null;

  const elapsedTime = getElapsedTime(
    visibleSession,
    currentTime
  );

  const isRunning = Boolean(visibleSession?.startedAt);

  if (loading || !accountId || loadedAccountId !== accountId) {
    return (
      <section className="learning-stopwatch-card">
        <div className="learning-stopwatch-heading">
          <div className="learning-stopwatch-icon">
            <Timer size={22} strokeWidth={1.8} />
          </div>

          <div>
            <p className="learning-stopwatch-eyebrow">
              TRACK YOUR TIME
            </p>
            <h2>Learning Stopwatch</h2>
          </div>
        </div>

        <p className="learning-stopwatch-description">
          Your learning timer will be available once your account is ready.
        </p>
      </section>
    );
  }

  return (
    <section className="learning-stopwatch-card">
      <div className="learning-stopwatch-heading">
        <div className="learning-stopwatch-icon">
          <Timer size={22} strokeWidth={1.8} />
        </div>

        <div>
          <p className="learning-stopwatch-eyebrow">
            TRACK YOUR TIME
          </p>
          <h2>Learning Stopwatch</h2>
        </div>
      </div>

      <p className="learning-stopwatch-description">
        Start the timer when you begin learning and save your
        session when you're done.
      </p>

      <div
        className="learning-stopwatch-display"
        role="timer"
        aria-live="off"
      >
        {formatTime(elapsedTime)}
      </div>

      <p className="learning-stopwatch-status">
        {isRunning
          ? "Your learning session is in progress"
          : visibleSession
          ? "Your session is paused"
          : "Ready when you are"}
      </p>

      <div className="learning-stopwatch-actions">
        {!visibleSession ? (
          <button
            type="button"
            className="learning-stopwatch-start"
            onClick={startSession}
          >
            <Play size={17} />
            Start Learning
          </button>
        ) : (
          <>
            {isRunning ? (
              <button
                type="button"
                className="learning-stopwatch-pause"
                onClick={pauseSession}
              >
                <Pause size={17} />
                Pause
              </button>
            ) : (
              <button
                type="button"
                className="learning-stopwatch-start"
                onClick={resumeSession}
              >
                <Play size={17} />
                Resume
              </button>
            )}

            <button
              type="button"
              className="learning-stopwatch-stop"
              onClick={stopSession}
            >
              <Square size={15} />
              Stop & Save
            </button>
          </>
        )}
      </div>

      {savedMessage && (
        <p
          className="learning-stopwatch-saved"
          role="status"
        >
          <CheckCircle2 size={16} />
          {savedMessage}
        </p>
      )}

      {showStartPrompt && !visibleSession && (
        <div
          className="learning-stopwatch-prompt"
          role="status"
        >
          <p>
            Your previous learning session has been saved.
            Would you like to start a new session?
          </p>

          <div>
            <button type="button" onClick={startSession}>
              Start Learning
            </button>

            <button
              type="button"
              onClick={() => setShowStartPrompt(false)}
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default LearningStopwatch;
