
import { useState, useEffect } from "react";
import {
  Sprout,
  BookOpen,
  Target,
  Trophy,
  Award,
  Lock,
  CheckCircle2,
  Star,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

import {
  roadmaps,
  generalRoadmap,
  rolePathway,
} from "../../pages/Roadmap/Roadmap";

import "./Achievements.css";

/* =====================================
   STORAGE KEYS
===================================== */

const PROGRESS_KEY = "skillBridgeProgress";
const DAILY_GOALS_KEY = "skillBridgeDailyGoals";
const REWARDS_KEY = "skillBridgeAchievementRewards";
const PROFILE_KEY = "skillBridgeProfile";

const REWARD_PER_ACHIEVEMENT = 50;

const EMPTY_REWARDS = {
  points: 0,
  unlockedIds: [],
};

/* =====================================
   ACHIEVEMENTS
===================================== */

const achievementsList = [
  {
    id: "first-step",
    title: "First Step",
    description: "Complete your first roadmap step.",
    Icon: Sprout,
    requirement: "Complete 1 learning step",
  },
  {
    id: "dedicated-learner",
    title: "Dedicated Learner",
    description: "Complete two roadmap steps.",
    Icon: BookOpen,
    requirement: "Complete 2 learning steps",
  },
  {
    id: "learning-streak",
    title: "Learning Streak",
    description: "Learn for three days in a row.",
    Icon: Target,
    requirement: "Reach a 3-day learning streak",
  },
  {
    id: "roadmap-champion",
    title: "Roadmap Champion",
    description: "Complete every step in your selected roadmap.",
    Icon: Trophy,
    requirement: "Finish your entire roadmap",
  },
];

/* =====================================
   STORAGE HELPERS
===================================== */

function getStoredData(key, fallback) {
  if (!key) return fallback;

  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getAccountStorageKey(baseKey, accountId) {
  if (!accountId) return null;

  return `${baseKey}_${encodeURIComponent(accountId)}`;
}

/* =====================================
   PROFILE AND ROADMAP
===================================== */

function getCurrentProfile() {
  return getStoredData(PROFILE_KEY, {});
}

function getSelectedRoadmapRole() {
  const profile = getCurrentProfile();

  return profile?.targetRole || "Frontend Developer";
}

function getSelectedRoadmap() {
  const targetRole = getSelectedRoadmapRole();
  const roadmapKey = rolePathway?.[targetRole] || targetRole;

  return roadmaps?.[roadmapKey] || generalRoadmap || [];
}

/* =====================================
   ACCOUNT-SPECIFIC ROADMAP PROGRESS
===================================== */

function getCompletedSteps(accountId) {
  if (!accountId) return [];

  const progressKey = getAccountStorageKey(
    PROGRESS_KEY,
    accountId
  );

  const progress = getStoredData(progressKey, {});
  const targetRole = getSelectedRoadmapRole();

  return Array.isArray(progress?.[targetRole])
    ? progress[targetRole]
    : [];
}

/* =====================================
   LEARNING STREAK
===================================== */

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentStreak(accountId) {
  if (!accountId) return 0;

  const dailyGoalsKey = getAccountStorageKey(
    DAILY_GOALS_KEY,
    accountId
  );

  const savedData = getStoredData(dailyGoalsKey, {});

  const logs =
    savedData?.dailyLogs &&
    typeof savedData.dailyLogs === "object" &&
    !Array.isArray(savedData.dailyLogs)
      ? savedData.dailyLogs
      : {};

  const hasLearningOn = (date) =>
    Number(logs[date] || 0) > 0;

  const date = new Date();
  date.setHours(0, 0, 0, 0);

  // If there was no learning today, check yesterday.
  if (!hasLearningOn(getDateKey(date))) {
    date.setDate(date.getDate() - 1);
  }

  let streak = 0;

  while (hasLearningOn(getDateKey(date))) {
    streak++;
    date.setDate(date.getDate() - 1);
  }

  return streak;
}

/* =====================================
   ACCOUNT-SPECIFIC REWARDS
===================================== */

function getSavedRewards(storageKey) {
  if (!storageKey) {
    return { ...EMPTY_REWARDS };
  }

  const saved = getStoredData(storageKey, null);

  if (!saved || !Array.isArray(saved.unlockedIds)) {
    return { ...EMPTY_REWARDS };
  }

  const unlockedIds = [
    ...new Set(
      saved.unlockedIds.filter((id) =>
        achievementsList.some(
          (achievement) => achievement.id === id
        )
      )
    ),
  ];

  return {
    points: unlockedIds.length * REWARD_PER_ACHIEVEMENT,
    unlockedIds,
  };
}

/* =====================================
   ACHIEVEMENTS COMPONENT
===================================== */

function Achievements() {
  const { accountId, loading } = useAuth();

  const [refreshKey, setRefreshKey] = useState(0);

  const [rewardState, setRewardState] = useState({
    storageKey: "",
    data: { ...EMPTY_REWARDS },
  });

  const [notification, setNotification] = useState("");
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState([]);

  const accountReady = Boolean(accountId) && !loading;

  const rewardsStorageKey = getAccountStorageKey(
    REWARDS_KEY,
    accountId
  );

  /* =====================================
     REFRESH WHEN DATA CHANGES
  ===================================== */

  useEffect(() => {
    function refreshAchievements() {
      setRefreshKey((previous) => previous + 1);
    }

    window.addEventListener(
      "skillBridgeProgressUpdated",
      refreshAchievements
    );

    window.addEventListener(
      "skillBridgeProfileUpdated",
      refreshAchievements
    );

    window.addEventListener(
      "skillBridgeDailyGoalsUpdated",
      refreshAchievements
    );

    window.addEventListener(
      "skillBridgeRoadmapUpdated",
      refreshAchievements
    );

    window.addEventListener("storage", refreshAchievements);
    window.addEventListener("focus", refreshAchievements);

    return () => {
      window.removeEventListener(
        "skillBridgeProgressUpdated",
        refreshAchievements
      );

      window.removeEventListener(
        "skillBridgeProfileUpdated",
        refreshAchievements
      );

      window.removeEventListener(
        "skillBridgeDailyGoalsUpdated",
        refreshAchievements
      );

      window.removeEventListener(
        "skillBridgeRoadmapUpdated",
        refreshAchievements
      );

      window.removeEventListener("storage", refreshAchievements);
      window.removeEventListener("focus", refreshAchievements);
    };
  }, []);

  /* =====================================
     LOAD CURRENT ACCOUNT REWARDS
  ===================================== */

  useEffect(() => {
    if (!accountReady || !rewardsStorageKey) {
      setRewardState({
        storageKey: "",
        data: { ...EMPTY_REWARDS },
      });

      setNotification("");
      setNewlyUnlockedIds([]);

      return;
    }

    const savedRewards = getSavedRewards(rewardsStorageKey);

    setRewardState({
      storageKey: rewardsStorageKey,
      data: savedRewards,
    });

    setNotification("");
    setNewlyUnlockedIds([]);
  }, [accountId, accountReady, rewardsStorageKey]);

  /* =====================================
     READ CURRENT ACCOUNT PROGRESS
  ===================================== */

  const targetRole = getSelectedRoadmapRole();
  const selectedRoadmap = getSelectedRoadmap();

  const completedSteps = accountReady
    ? getCompletedSteps(accountId)
    : [];

  const completedCount = selectedRoadmap.filter((step) =>
    completedSteps.includes(step.title)
  ).length;

  const currentStreak = accountReady
    ? getCurrentStreak(accountId)
    : 0;

  const totalRoadmapSteps = selectedRoadmap.length;

  const roadmapComplete =
    totalRoadmapSteps > 0 &&
    completedCount === totalRoadmapSteps;

  /* =====================================
     BUILD ACHIEVEMENT DATA
  ===================================== */

  const achievements = achievementsList.map((achievement) => {
    let progress = 0;
    let total = 1;
    let unlocked = false;

    if (achievement.id === "first-step") {
      progress = Math.min(completedCount, 1);
      total = 1;
      unlocked = completedCount >= 1;
    }

    if (achievement.id === "dedicated-learner") {
      progress = Math.min(completedCount, 2);
      total = 2;
      unlocked = completedCount >= 2;
    }

    if (achievement.id === "learning-streak") {
      progress = Math.min(currentStreak, 3);
      total = 3;
      unlocked = currentStreak >= 3;
    }

    if (achievement.id === "roadmap-champion") {
      progress = completedCount;
      total = totalRoadmapSteps;
      unlocked = roadmapComplete;
    }

    const progressPercentage = total
      ? Math.round((progress / total) * 100)
      : 0;

    return {
      ...achievement,
      unlocked,
      progress,
      total,
      progressPercentage,
    };
  });

  /* =====================================
     AWARD REWARD POINTS
  ===================================== */

  useEffect(() => {
    if (!accountReady || !rewardsStorageKey) return;

    const savedRewards = getSavedRewards(rewardsStorageKey);

    const newlyUnlocked = achievements.filter(
      (achievement) =>
        achievement.unlocked &&
        !savedRewards.unlockedIds.includes(achievement.id)
    );

    if (newlyUnlocked.length === 0) {
      setRewardState({
        storageKey: rewardsStorageKey,
        data: savedRewards,
      });

      return;
    }

    const earnedPoints =
      newlyUnlocked.length * REWARD_PER_ACHIEVEMENT;

    const updatedUnlockedIds = [
      ...savedRewards.unlockedIds,
      ...newlyUnlocked.map((achievement) => achievement.id),
    ];

    const updatedRewards = {
      points: updatedUnlockedIds.length * REWARD_PER_ACHIEVEMENT,
      unlockedIds: updatedUnlockedIds,
    };

    try {
      localStorage.setItem(
        rewardsStorageKey,
        JSON.stringify(updatedRewards)
      );
    } catch (error) {
      console.error(
        "Unable to save achievement rewards:",
        error
      );
      return;
    }

    setRewardState({
      storageKey: rewardsStorageKey,
      data: updatedRewards,
    });

    setNewlyUnlockedIds(
      newlyUnlocked.map((achievement) => achievement.id)
    );

    const names = newlyUnlocked
      .map((achievement) => achievement.title)
      .join(", ");

    setNotification(
      `${names} unlocked! You earned ${earnedPoints} reward points.`
    );
  }, [
    accountId,
    accountReady,
    refreshKey,
    rewardsStorageKey,
    completedCount,
    currentStreak,
    roadmapComplete,
  ]);

  /* =====================================
     NOTIFICATION TIMER
  ===================================== */

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
      setNewlyUnlockedIds([]);
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification]);

  /* =====================================
     SUMMARY
  ===================================== */

  const rewardData =
    accountReady &&
    rewardState.storageKey === rewardsStorageKey
      ? rewardState.data
      : { ...EMPTY_REWARDS };

  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlocked
  ).length;

  /* =====================================
     UI
  ===================================== */

  return (
    <section className="achievements-section">
      <div className="achievements-header">
        <p className="achievements-eyebrow">
          YOUR MILESTONES
        </p>

        <h2>Achievements & Badges</h2>

        <p>
          Celebrate every step you take towards your learning goals.
        </p>
      </div>

      <div className="achievements-summary">
        <span className="achievements-summary-icon">
          <Award size={27} strokeWidth={1.8} />
        </span>

        <div>
          <strong>
            {unlockedCount} of {achievements.length} achievements unlocked
          </strong>

          <p>
            {unlockedCount === achievements.length
              ? "Congratulations! You have unlocked every achievement."
              : "Keep learning and track your progress towards the next badge."}
          </p>
        </div>
      </div>

      <div className="achievement-rewards-total">
        <span className="achievement-rewards-icon">
          <Star size={21} strokeWidth={2} />
        </span>

        <div>
          <span>Total Reward Points</span>
          <strong>{rewardData.points} Points</strong>
        </div>
      </div>

      {notification && (
        <div
          className="achievement-notification"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 size={21} strokeWidth={2} />
          <span>{notification}</span>
        </div>
      )}

      <div className="achievements-grid">
        {achievements.map((achievement) => {
          const Icon = achievement.Icon;

          return (
            <article
              className={`achievement-card ${
                achievement.unlocked
                  ? "achievement-unlocked"
                  : "achievement-locked"
              } ${
                newlyUnlockedIds.includes(achievement.id)
                  ? "achievement-newly-unlocked"
                  : ""
              }`}
              key={achievement.id}
            >
              <div className="achievement-icon">
                {achievement.unlocked ? (
                  <Icon size={30} strokeWidth={1.8} />
                ) : (
                  <Lock size={27} strokeWidth={1.8} />
                )}
              </div>

              <h3>{achievement.title}</h3>

              <p>{achievement.description}</p>

              <span className="achievement-requirement">
                {achievement.unlocked ? (
                  <span className="achievement-status">
                    <CheckCircle2 size={15} />
                    Unlocked
                  </span>
                ) : (
                  achievement.requirement
                )}
              </span>

              {achievement.unlocked && (
                <span className="achievement-reward">
                  <Star size={14} />
                  +{REWARD_PER_ACHIEVEMENT} Points
                </span>
              )}

              <div className="achievement-progress">
                <div className="achievement-progress-info">
                  <span>
                    {achievement.unlocked
                      ? "Completed"
                      : "Your progress"}
                  </span>

                  <strong>
                    {achievement.progress}/{achievement.total}
                  </strong>
                </div>

                <div
                  className="achievement-progress-track"
                  role="progressbar"
                  aria-label={`${achievement.title} progress`}
                  aria-valuemin={0}
                  aria-valuemax={achievement.total}
                  aria-valuenow={achievement.progress}
                >
                  <div
                    className="achievement-progress-fill"
                    style={{
                      width: `${achievement.progressPercentage}%`,
                    }}
                  />
                </div>

                <span className="achievement-progress-percentage">
                  {achievement.progressPercentage}% complete
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Achievements;
