
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import "./LearningResources.css";

import {
  careerGoalsByStream,
  resourcesByStream,
  resourceIdsByRole,
} from "../../data/learningResources";

/* =====================================
   SKILLBRIDGE AI - LEARNING RESOURCES
===================================== */

/* =====================================
   PROFILE HELPERS
===================================== */

function getProfile() {
  try {
    return JSON.parse(
      localStorage.getItem("skillBridgeProfile") || "{}"
    );
  } catch {
    return {};
  }
}

function getSavedStream(profile = getProfile()) {
  return resourcesByStream[profile.educationalStream]
    ? profile.educationalStream
    : "Engineering & Technology";
}

function getProfileRoleSelectionKey(accountId, stream) {
  return `skillBridgeSelectedResourceRole_${encodeURIComponent(
    accountId
  )}_${encodeURIComponent(stream)}`;
}

function getSavedRole(stream, accountId, profile = getProfile()) {
  const availableRoles =
    careerGoalsByStream[stream] || ["Other"];

  // Follow the target role saved in the active profile first.
  if (availableRoles.includes(profile.targetRole)) {
    return profile.targetRole;
  }

  try {
    const savedRole = localStorage.getItem(
      getProfileRoleSelectionKey(accountId, stream)
    );

    if (availableRoles.includes(savedRole)) {
      return savedRole;
    }
  } catch {
    // Use the default role.
  }

  return availableRoles.find((role) => role !== "Other") ||
    availableRoles[0];
}

function getProfileProgressKey(accountId, selectedRole) {
  return `skillBridgeResourceProgress_${encodeURIComponent(
    accountId
  )}_${encodeURIComponent(selectedRole || "default")}`;
}

function getCompletedResources(accountId, selectedRole) {
  if (!accountId) return [];

  try {
    const saved = JSON.parse(
      localStorage.getItem(
        getProfileProgressKey(accountId, selectedRole)
      ) || "[]"
    );

    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

/* =====================================
   LEARNING RESOURCES COMPONENT
===================================== */

function LearningResources() {
  const { accountId, loading } = useAuth();

  const [selectedStream, setSelectedStream] = useState(
    getSavedStream
  );

  const [selectedRole, setSelectedRole] = useState("");

  const [completedResources, setCompletedResources] = useState([]);

  const [loadedAccountId, setLoadedAccountId] = useState("");

  /* =====================================
     LOAD ACCOUNT-SPECIFIC RESOURCE DATA
  ===================================== */

  useEffect(() => {
    if (loading || !accountId) {
      setSelectedRole("");
      setCompletedResources([]);
      setLoadedAccountId("");
      return;
    }

    const profile = getProfile();
    const stream = getSavedStream(profile);
    const role = getSavedRole(stream, accountId, profile);

    setSelectedStream(stream);
    setSelectedRole(role);
    setCompletedResources(
      getCompletedResources(accountId, role)
    );

    setLoadedAccountId(accountId);
  }, [accountId, loading]);

  /* =====================================
     SYNC PROFILE CHANGES
  ===================================== */

  useEffect(() => {
    if (!accountId || loading) return;

    const syncProfile = () => {
      const profile = getProfile();
      const nextStream = getSavedStream(profile);
      const nextRole = getSavedRole(
        nextStream,
        accountId,
        profile
      );

      setSelectedStream(nextStream);
      setSelectedRole(nextRole);

      setCompletedResources(
        getCompletedResources(accountId, nextRole)
      );
    };

    window.addEventListener(
      "skillBridgeProfileUpdated",
      syncProfile
    );

    window.addEventListener("storage", syncProfile);

    return () => {
      window.removeEventListener(
        "skillBridgeProfileUpdated",
        syncProfile
      );

      window.removeEventListener("storage", syncProfile);
    };
  }, [accountId, loading]);

  /* =====================================
     CHANGE CAREER GOAL
  ===================================== */

  const handleRoleChange = (event) => {
    if (!accountId || loadedAccountId !== accountId) return;

    const nextRole = event.target.value;

    setSelectedRole(nextRole);

    setCompletedResources(
      getCompletedResources(accountId, nextRole)
    );

    try {
      localStorage.setItem(
        getProfileRoleSelectionKey(accountId, selectedStream),
        nextRole
      );
    } catch {
      // Selection remains available in component state.
    }
  };

  /* =====================================
     TOGGLE RESOURCE COMPLETION
  ===================================== */

  const toggleResourceCompletion = (resourceId) => {
    if (!accountId || loadedAccountId !== accountId) return;

    const updatedResources = completedResources.includes(resourceId)
      ? completedResources.filter((id) => id !== resourceId)
      : [...completedResources, resourceId];

    setCompletedResources(updatedResources);

    try {
      localStorage.setItem(
        getProfileProgressKey(accountId, selectedRole),
        JSON.stringify(updatedResources)
      );
    } catch {
      // Keep updated progress in component state.
    }
  };

  /* =====================================
     SELECT RESOURCES
  ===================================== */

  const streamResources =
    resourcesByStream[selectedStream] || resourcesByStream.Other;

  const selectedResourceIds =
    resourceIdsByRole[selectedStream]?.[selectedRole];

  const roleResources = selectedResourceIds
    ? selectedResourceIds
        .map((id) =>
          streamResources.find((resource) => resource.id === id)
        )
        .filter(Boolean)
    : streamResources;

  /* =====================================
     LEARNING PROGRESS CALCULATIONS
  ===================================== */

  const completedCount = roleResources.filter((resource) =>
    completedResources.includes(resource.id)
  ).length;

  const totalResources = roleResources.length;

  const progressPercentage = totalResources
    ? Math.round((completedCount / totalResources) * 100)
    : 0;

  const availableRoles =
    careerGoalsByStream[selectedStream] || ["Other"];

  /* =====================================
     WAIT FOR ACCOUNT DATA
  ===================================== */

  if (loading || !accountId || loadedAccountId !== accountId) {
    return (
      <section className="learning-resources-page">
        <div className="resources-header">
          <h2>Learning Resources</h2>
          <p>Loading your learning resources...</p>
        </div>
      </section>
    );
  }

  /* =====================================
     UI
  ===================================== */

  return (
    <section className="learning-resources-page">

      {/* Header */}

      <div className="resources-header">
        <p className="resources-eyebrow">
          KEEP GROWING
        </p>

        <h2>Learning Resources</h2>

        <p>
          Discover official learning material, courses and
          resources selected according to your educational
          stream and career goal.
        </p>
      </div>

      {/* Stream and Career Filters */}

      <div className="resources-role">

        <div className="resources-filter-field">
          <label htmlFor="resource-stream">
            Educational Stream
          </label>

          <select
            id="resource-stream"
            value={selectedStream}
            disabled
          >
            <option value={selectedStream}>
              {selectedStream}
            </option>
          </select>
        </div>

        <div className="resources-filter-field">
          <label htmlFor="resource-role">
            Target Career Role
          </label>

          <select
            id="resource-role"
            value={selectedRole}
            onChange={handleRoleChange}
          >
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Learning Progress */}

      <div className="resources-progress">

        <div className="resources-progress-header">
          <div>
            <h3>Your Learning Progress</h3>

            <p>
              {completedCount} of {totalResources} resources completed
            </p>
          </div>

          <span className="resources-progress-percentage">
            {progressPercentage}%
          </span>
        </div>

        <div className="resources-progress-track">
          <div
            className="resources-progress-fill"
            style={{
              width: `${progressPercentage}%`,
            }}
          />
        </div>

      </div>

      {/* Resource Cards */}

      <div className="resources-grid">

        {roleResources.map((resource) => {
          const isCompleted = completedResources.includes(
            resource.id
          );

          return (
            <article
              className="resource-card"
              key={resource.id}
            >

              <div className="resource-card-top">

                <span className="resource-skill">
                  {resource.skill}
                </span>

                <span className="resource-type">
                  {resource.type}
                </span>

                <span
                  className={`resource-difficulty difficulty-${resource.difficulty.toLowerCase()}`}
                >
                  {resource.difficulty}
                </span>

              </div>

              <h3>{resource.title}</h3>

              <p>{resource.description}</p>

              <span className="resource-platform">
                Official source: {resource.platform}
              </span>

              <div className="resource-actions">

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Resource ↗
                </a>

                <button
                  type="button"
                  className={
                    isCompleted
                      ? "resource-completed"
                      : "resource-mark-complete"
                  }
                  onClick={() =>
                    toggleResourceCompletion(resource.id)
                  }
                >
                  {isCompleted
                    ? "Completed"
                    : "Mark as Completed"}
                </button>

              </div>

            </article>
          );
        })}

      </div>

    </section>
  );
}

export default LearningResources;
