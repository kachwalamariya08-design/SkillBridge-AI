
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const API_URL = "http://localhost:5000/api/auth";
const ACCOUNT_ID_KEY = "skillBridgeAccountId";
const PROFILE_KEY = "skillBridgeProfile";

// Get a stable, unique identifier for the logged-in student.
function getStudentAccountId(student) {
  if (!student) return "";

  if (student._id) {
    return String(student._id);
  }

  if (student.id) {
    return String(student.id);
  }

  if (student.email) {
    return student.email.trim().toLowerCase();
  }

  return "";
}

// Synchronize MongoDB student details with the existing profile system.
function syncStudentProfile(student) {
  if (!student) return;

  const profile = {
    studentName: student.studentName || "",
    educationalStream: student.educationalStream || "",
    course: student.course || "",
    customCourse: student.customCourse || "",
    targetRole: student.targetRole || "",
    selectedSkills: student.selectedSkills || [],
  };

  const accountId = getStudentAccountId(student);

  if (accountId) {
    localStorage.setItem(ACCOUNT_ID_KEY, accountId);
  }

  localStorage.setItem(
    PROFILE_KEY,
    JSON.stringify(profile)
  );

  window.dispatchEvent(
    new Event("skillBridgeProfileUpdated")
  );
}

// Clear only the currently active student's profile.
function clearActiveStudentProfile() {
  localStorage.removeItem(ACCOUNT_ID_KEY);
  localStorage.removeItem(PROFILE_KEY);

  window.dispatchEvent(
    new Event("skillBridgeProfileUpdated")
  );
}

export function AuthProvider({ children }) {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore an existing login session.
  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      try {
        const response = await fetch(`${API_URL}/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (isMounted && response.ok && data.student) {
          setStudent(data.student);
          syncStudentProfile(data.student);
        } else if (isMounted) {
          setStudent(null);
          clearActiveStudentProfile();
        }
      } catch (error) {
        console.error("Session verification failed:", error);

        if (isMounted) {
          setStudent(null);
          clearActiveStudentProfile();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Register a new student.
  async function register(studentData) {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(studentData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed.");
    }

    setStudent(data.student);
    syncStudentProfile(data.student);

    return data;
  }

  // Log in an existing student.
  async function login(email, password) {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed.");
    }

    setStudent(data.student);
    syncStudentProfile(data.student);

    return data;
  }

  // Log out the current student.
  async function logout() {
    const response = await fetch(`${API_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Logout failed.");
    }

    setStudent(null);
    clearActiveStudentProfile();

    return data;
  }

  const accountId = getStudentAccountId(student);

  return (
    <AuthContext.Provider
      value={{
        student,
        accountId,
        loading,
        isAuthenticated: Boolean(student),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
