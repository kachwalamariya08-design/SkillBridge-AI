
import { useContext, useEffect, useState } from "react";
import {
  Moon,
  Sun,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function getSavedProfile() {
  try {
    return JSON.parse(
      localStorage.getItem("skillBridgeProfile") || "null"
    );
  } catch {
    return null;
  }
}

function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const {
    student,
    isAuthenticated,
    loading: authLoading,
    logout,
  } = useAuth();

  const [profile, setProfile] = useState(getSavedProfile);
  const [menuOpen, setMenuOpen] = useState(false);
  const [careerMenuOpen, setCareerMenuOpen] = useState(false);

  useEffect(() => {
    function updateProfile() {
      setProfile(getSavedProfile());
    }

    window.addEventListener(
      "skillBridgeProfileUpdated",
      updateProfile
    );

    window.addEventListener("storage", updateProfile);

    return () => {
      window.removeEventListener(
        "skillBridgeProfileUpdated",
        updateProfile
      );

      window.removeEventListener("storage", updateProfile);
    };
  }, []);

  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCareerMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function closeMenu() {
    setMenuOpen(false);
    setCareerMenuOpen(false);
  }

  async function handleLogout() {
    closeMenu();

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  const displayName =
    student?.studentName || profile?.studentName || "";

  const firstInitial = displayName
    ?.trim()
    ?.charAt(0)
    .toUpperCase();

  return (
    <nav className="navbar">
      <NavLink
        to="/"
        className="navbar-logo"
        onClick={closeMenu}
      >
        SkillBridge <span>AI</span>
      </NavLink>

      <div
        id="mobile-navigation"
        className={`navbar-links ${
          menuOpen ? "mobile-open" : ""
        }`}
      >
        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/dashboard" onClick={closeMenu}>
          Dashboard
        </NavLink>

        {/* Career Hub Dropdown */}
        <div className="career-hub">
          <button
            type="button"
            className="career-hub-toggle"
            onClick={() =>
              setCareerMenuOpen((previous) => !previous)
            }
            aria-expanded={careerMenuOpen}
            aria-haspopup="true"
          >
            Career Hub
            <ChevronDown
              size={16}
              className={`career-hub-arrow ${
                careerMenuOpen ? "arrow-open" : ""
              }`}
            />
          </button>

          <div
            className={`career-hub-dropdown ${
              careerMenuOpen ? "dropdown-open" : ""
            }`}
          >
            <NavLink to="/skill-gap" onClick={closeMenu}>
              Skill Gap Analysis
            </NavLink>

            <NavLink to="/roadmap" onClick={closeMenu}>
              Learning Roadmap
            </NavLink>

            <NavLink to="/resources" onClick={closeMenu}>
              Learning Resources
            </NavLink>
          </div>
        </div>

        <NavLink to="/opportunities" onClick={closeMenu}>
          Job Opportunities
        </NavLink>

        <NavLink to="/resume-checker" onClick={closeMenu}>
          Resume Checker
        </NavLink>

        <NavLink
          to="/professional-readiness"
          onClick={closeMenu}
        >
          Professional Readiness
        </NavLink>

        {/* Authentication Links for Logged-out Visitors */}
        {!authLoading && !isAuthenticated && (
          <div className="mobile-auth-links">
            <NavLink to="/login" onClick={closeMenu}>
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="mobile-register-link"
              onClick={closeMenu}
            >
              Register
            </NavLink>
          </div>
        )}
      </div>

      <div className="navbar-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${
            theme === "light" ? "dark" : "light"
          } mode`}
          title={`Switch to ${
            theme === "light" ? "dark" : "light"
          } mode`}
        >
          {theme === "light" ? (
            <Moon size={19} strokeWidth={2} />
          ) : (
            <Sun size={19} strokeWidth={2} />
          )}
        </button>

        {/* Logged-in Student */}
        {!authLoading && isAuthenticated && (
          <>
            <NavLink
              to="/profile?edit=true"
              className="navbar-profile"
              onClick={closeMenu}
              title={`Edit profile: ${displayName}`}
              aria-label="View or edit your profile"
            >
              <span className="navbar-avatar">
                {firstInitial || "S"}
              </span>

              <span className="navbar-profile-name">
                {displayName || "My Profile"}
              </span>
            </NavLink>

            <button
              type="button"
              className="navbar-logout"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </>
        )}

        {/* Logged-out Visitor */}
        {!authLoading && !isAuthenticated && (
          <div className="navbar-guest-actions">
            <NavLink
              to="/login"
              className="navbar-login"
              onClick={closeMenu}
            >
              Login
            </NavLink>

            <NavLink
              to="/register"
              className="navbar-button"
              onClick={closeMenu}
            >
              Register
            </NavLink>
          </div>
        )}

        <button
          type="button"
          className={`mobile-menu-toggle ${
            menuOpen ? "menu-active" : ""
          }`}
          onClick={() => setMenuOpen((previous) => !previous)}
          aria-label={
            menuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
