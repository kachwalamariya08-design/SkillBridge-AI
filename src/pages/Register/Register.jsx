
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Register.css";
import "../Profile/Profile.css";

/* =====================================
   STREAMS, COURSES AND CAREER OPTIONS
===================================== */

const coursesByStream = {
  "Engineering & Technology": [
    "Computer Engineering",
    "IT Engineering",
    "Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Other",
  ],
  Commerce: [
    "B.Com",
    "B.Com (Accounting & Finance)",
    "B.Com (Banking & Insurance)",
    "B.Com (Financial Markets)",
    "Other",
  ],
  "Arts & Humanities": [
    "BA Psychology",
    "BA English",
    "BA Economics",
    "BA Sociology",
    "BA Political Science",
    "Other",
  ],
  Management: ["BBA", "BMS", "MBA", "Other"],
  Science: [
    "B.Sc Computer Science",
    "B.Sc Physics",
    "B.Sc Chemistry",
    "B.Sc Mathematics",
    "Other",
  ],
  "Medical & Healthcare": [
    "MBBS",
    "BDS",
    "B.Pharm",
    "B.Sc Nursing",
    "Other",
  ],
  Law: ["LLB", "BA LLB", "BBA LLB", "Other"],
  "Design & Creative Arts": [
    "B.Des",
    "Graphic Design",
    "Animation",
    "Fine Arts",
    "Other",
  ],
  "Vocational Studies": [
    "ITI",
    "Diploma",
    "Skill Development Program",
    "Other",
  ],
  Other: ["Other"],
};

const careerGoalsByStream = {
  "Engineering & Technology": [
    "Software Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "React Developer",
    "Data Analyst",
    "Other",
  ],
  Commerce: [
    "Accountant",
    "Financial Analyst",
    "Tax Consultant",
    "Auditor",
    "Banking Professional",
    "Other",
  ],
  "Arts & Humanities": [
    "Content Writer",
    "Psychologist",
    "Human Resources Professional",
    "Journalist",
    "Social Worker",
    "Other",
  ],
  Management: [
    "Business Analyst",
    "Marketing Manager",
    "Human Resources Professional",
    "Project Manager",
    "Entrepreneur",
    "Other",
  ],
  Science: [
    "Research Scientist",
    "Data Analyst",
    "Lab Technician",
    "Research Assistant",
    "Other",
  ],
  "Medical & Healthcare": [
    "Doctor",
    "Pharmacist",
    "Nurse",
    "Healthcare Administrator",
    "Other",
  ],
  Law: [
    "Lawyer",
    "Legal Advisor",
    "Corporate Lawyer",
    "Legal Researcher",
    "Other",
  ],
  "Design & Creative Arts": [
    "UI/UX Designer",
    "Graphic Designer",
    "Animator",
    "Illustrator",
    "Other",
  ],
  "Vocational Studies": [
    "Technician",
    "Electrician",
    "Skilled Professional",
    "Entrepreneur",
    "Other",
  ],
  Other: ["Other"],
};

const skillsByRole = {
  "Software Engineer": [
    "Programming", "Data Structures", "Algorithms",
    "Problem Solving", "Git", "Database Management", "Testing",
  ],
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React",
    "Responsive Design", "Git", "REST APIs",
  ],
  "Backend Developer": [
    "JavaScript", "Node.js", "Express.js", "REST APIs",
    "Database Management", "Authentication", "Git",
  ],
  "Full Stack Developer": [
    "HTML", "CSS", "JavaScript", "React", "Node.js",
    "Express.js", "MongoDB", "Git", "REST APIs",
  ],
  "React Developer": [
    "HTML", "CSS", "JavaScript", "React", "Git",
    "REST APIs", "Testing", "Responsive Design",
  ],
  "Data Analyst": [
    "Excel", "SQL", "Python", "Data Analysis",
    "Data Visualization", "Statistics", "Problem Solving",
  ],
  Accountant: [
    "Accounting", "Financial Reporting", "Excel",
    "Bookkeeping", "Taxation", "Attention to Detail",
  ],
  "Financial Analyst": [
    "Financial Analysis", "Excel", "Accounting",
    "Financial Modeling", "Data Analysis", "Budgeting", "Communication",
  ],
  "Tax Consultant": [
    "Taxation", "Accounting", "Tax Planning",
    "Financial Reporting", "Excel", "Legal Compliance",
  ],
  Auditor: [
    "Auditing", "Accounting", "Financial Reporting",
    "Risk Assessment", "Excel", "Attention to Detail",
  ],
  "Banking Professional": [
    "Banking Operations", "Financial Analysis", "Customer Service",
    "Communication", "Excel", "Financial Literacy",
  ],
  "Content Writer": [
    "Content Writing", "Research", "Grammar",
    "SEO", "Storytelling", "Communication",
  ],
  Psychologist: [
    "Psychology", "Research", "Active Listening",
    "Communication", "Observation", "Empathy",
  ],
  "Human Resources Professional": [
    "Communication", "Recruitment", "HR Management",
    "Conflict Resolution", "Team Management", "Interviewing",
  ],
  Journalist: [
    "Writing", "Research", "Interviewing",
    "Fact Checking", "Communication", "News Reporting",
  ],
  "Social Worker": [
    "Communication", "Community Engagement", "Counselling",
    "Research", "Problem Solving", "Empathy",
  ],
  "Business Analyst": [
    "Business Analysis", "Excel", "SQL",
    "Data Analysis", "Communication", "Problem Solving",
  ],
  "Marketing Manager": [
    "Digital Marketing", "Market Research", "SEO",
    "Content Strategy", "Communication", "Leadership",
  ],
  "Project Manager": [
    "Project Planning", "Leadership", "Communication",
    "Risk Management", "Time Management", "Team Management",
  ],
  Entrepreneur: [
    "Business Planning", "Leadership", "Marketing",
    "Financial Management", "Communication", "Problem Solving",
  ],
  "Research Scientist": [
    "Research", "Data Analysis", "Statistics",
    "Scientific Writing", "Critical Thinking", "Laboratory Skills",
  ],
  "Lab Technician": [
    "Laboratory Skills", "Scientific Methods", "Equipment Handling",
    "Documentation", "Observation", "Safety Procedures",
  ],
  "Research Assistant": [
    "Research", "Data Collection", "Data Analysis",
    "Documentation", "Scientific Writing", "Critical Thinking",
  ],
  Doctor: [
    "Patient Care", "Medical Knowledge", "Clinical Skills",
    "Communication", "Diagnosis", "Medical Ethics",
  ],
  Pharmacist: [
    "Pharmaceutical Knowledge", "Medicine Management",
    "Patient Counselling", "Pharmacology",
    "Attention to Detail", "Medical Ethics",
  ],
  Nurse: [
    "Patient Care", "Clinical Skills", "First Aid",
    "Communication", "Patient Monitoring", "Medical Ethics",
  ],
  "Healthcare Administrator": [
    "Healthcare Management", "Communication", "Administration",
    "Data Management", "Leadership", "Problem Solving",
  ],
  Lawyer: [
    "Legal Research", "Legal Drafting", "Case Analysis",
    "Public Speaking", "Negotiation", "Critical Thinking",
  ],
  "Legal Advisor": [
    "Legal Research", "Legal Drafting", "Contract Review",
    "Legal Compliance", "Communication", "Negotiation",
  ],
  "Corporate Lawyer": [
    "Corporate Law", "Contract Drafting", "Legal Research",
    "Compliance", "Negotiation", "Business Communication",
  ],
  "Legal Researcher": [
    "Legal Research", "Case Analysis", "Legal Writing",
    "Documentation", "Critical Thinking", "Attention to Detail",
  ],
  "UI/UX Designer": [
    "Figma", "Wireframing", "Prototyping",
    "User Research", "Visual Design", "Usability Testing",
  ],
  "Graphic Designer": [
    "Graphic Design", "Typography", "Colour Theory",
    "Adobe Photoshop", "Adobe Illustrator", "Visual Communication",
  ],
  Animator: [
    "Animation", "Storyboarding", "Character Design",
    "Motion Graphics", "Visual Storytelling", "Drawing",
  ],
  Illustrator: [
    "Digital Illustration", "Drawing", "Colour Theory",
    "Composition", "Visual Storytelling", "Adobe Illustrator",
  ],
  Technician: [
    "Technical Troubleshooting", "Equipment Maintenance",
    "Safety Procedures", "Problem Solving",
    "Documentation", "Technical Knowledge",
  ],
  Electrician: [
    "Electrical Wiring", "Circuit Knowledge", "Electrical Safety",
    "Troubleshooting", "Equipment Maintenance", "Technical Knowledge",
  ],
  "Skilled Professional": [
    "Technical Skills", "Problem Solving", "Time Management",
    "Communication", "Safety Procedures", "Teamwork",
  ],
};

const generalSkills = [
  "Communication",
  "Problem Solving",
  "Research",
  "Teamwork",
  "Time Management",
  "Digital Literacy",
  "Critical Thinking",
];

const streams = Object.keys(coursesByStream);

/* =====================================
   REGISTER COMPONENT
===================================== */

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
    password: "",
    confirmPassword: "",
    educationalStream: "",
    course: "",
    customCourse: "",
    targetRole: "",
    selectedSkills: [],
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    studentName,
    email,
    password,
    confirmPassword,
    educationalStream,
    course,
    customCourse,
    targetRole,
    selectedSkills,
  } = formData;

  const courseOptions = coursesByStream[educationalStream] || [];
  const careerOptions = careerGoalsByStream[educationalStream] || [];

  const availableSkills =
    skillsByRole[targetRole] || generalSkills;

  const chosenSkills = availableSkills.filter((skill) =>
    selectedSkills.includes(skill)
  );

  const unselectedSkills = availableSkills.filter(
    (skill) => !selectedSkills.includes(skill)
  );

  const careerSelection = careerOptions.includes(targetRole)
    ? targetRole
    : targetRole
      ? "Other"
      : "";

  function updateField(name, value) {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  function handleStreamChange(value) {
    setFormData((previous) => ({
      ...previous,
      educationalStream: value,
      course: "",
      customCourse: "",
      targetRole: "",
      selectedSkills: [],
    }));

    setError("");
  }

  function handleRoleChange(value) {
    const updatedRole = value === "Other" ? "" : value;
    const updatedSkills = skillsByRole[updatedRole] || generalSkills;

    setFormData((previous) => ({
      ...previous,
      targetRole: updatedRole,
      selectedSkills: previous.selectedSkills.filter((skill) =>
        updatedSkills.includes(skill)
      ),
    }));

    setError("");
  }

  function toggleSkill(skill) {
    setFormData((previous) => ({
      ...previous,
      selectedSkills: previous.selectedSkills.includes(skill)
        ? previous.selectedSkills.filter((item) => item !== skill)
        : [...previous.selectedSkills, skill],
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!studentName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!educationalStream) {
      setError("Please select your educational stream.");
      return;
    }

    if (!course) {
      setError("Please select your course or specialization.");
      return;
    }

    if (course === "Other" && !customCourse.trim()) {
      setError("Please enter your course or specialization.");
      return;
    }

    if (!targetRole.trim()) {
      setError("Please select or enter your career goal.");
      return;
    }

    if (selectedSkills.length === 0) {
      setError("Please select at least one skill.");
      return;
    }

    try {
      setLoading(true);

      const studentData = {
        studentName: studentName.trim(),
        email: email.trim(),
        password,
        educationalStream,
        course,
        customCourse: course === "Other" ? customCourse.trim() : "",
        targetRole: targetRole.trim(),
        selectedSkills,
      };

      await register(studentData);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <p className="profile-eyebrow">
          YOUR CAREER JOURNEY STARTS HERE
        </p>

        <h1>Create Your SkillBridge Account</h1>

        <p>
          Set up your student profile to receive career guidance,
          personalized learning resources and a roadmap for your goals.
        </p>
      </section>

      <form className="profile-card" onSubmit={handleSubmit}>
        <h2>Account Details</h2>

        <label htmlFor="register-name">Full Name</label>
        <input
          id="register-name"
          type="text"
          value={studentName}
          onChange={(event) =>
            updateField("studentName", event.target.value)
          }
          placeholder="Enter your full name"
          autoComplete="name"
          required
        />

        <label htmlFor="register-email">Email Address</label>
        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(event) =>
            updateField("email", event.target.value)
          }
          placeholder="Enter your email address"
          autoComplete="email"
          required
        />

        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(event) =>
            updateField("password", event.target.value)
          }
          placeholder="Create a password (minimum 8 characters)"
          autoComplete="new-password"
          minLength={8}
          required
        />

        <label htmlFor="register-confirm-password">
          Confirm Password
        </label>
        <input
          id="register-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(event) =>
            updateField("confirmPassword", event.target.value)
          }
          placeholder="Re-enter your password"
          autoComplete="new-password"
          required
        />

        <div className="profile-skills-divider" />

        <h2>Educational Details</h2>

        <label htmlFor="register-stream">Educational Stream</label>
        <select
          id="register-stream"
          value={educationalStream}
          onChange={(event) =>
            handleStreamChange(event.target.value)
          }
          required
        >
          <option value="">Select your educational stream</option>
          {streams.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>

        <label htmlFor="register-course">Course / Specialization</label>
        <select
          id="register-course"
          value={course}
          onChange={(event) =>
            updateField("course", event.target.value)
          }
          disabled={!educationalStream}
          required
        >
          <option value="">Select your course</option>
          {courseOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        {course === "Other" && (
          <>
            <label htmlFor="register-custom-course">
              Enter Your Course / Specialization
            </label>
            <input
              id="register-custom-course"
              type="text"
              value={customCourse}
              onChange={(event) =>
                updateField("customCourse", event.target.value)
              }
              placeholder="Enter your course or specialization"
              required
            />
          </>
        )}

        <div className="profile-skills-divider" />

        <h2>Career Preferences</h2>

        <label htmlFor="register-role">Target Career / Role</label>
        <select
          id="register-role"
          value={careerSelection}
          onChange={(event) =>
            handleRoleChange(event.target.value)
          }
          disabled={!educationalStream}
          required
        >
          <option value="">Select your career goal</option>

          {careerOptions
            .filter((goal) => goal !== "Other")
            .map((goal) => (
              <option key={goal} value={goal}>
                {goal}
              </option>
            ))}

          <option value="Other">Other / Custom Career Goal</option>
        </select>

        {careerSelection === "Other" && (
          <>
            <label htmlFor="register-custom-role">
              Enter Your Career Goal
            </label>
            <input
              id="register-custom-role"
              type="text"
              value={targetRole}
              onChange={(event) =>
                updateField("targetRole", event.target.value)
              }
              placeholder="Enter your desired career goal"
              required
            />
          </>
        )}

        <div className="profile-skills-divider" />

        <h2>Current Skills</h2>

        <p className="profile-empty-skills">
          {targetRole
            ? "Select the skills you already know from the list below."
            : "Select a career goal to see its relevant skills."}
        </p>

        {targetRole && (
          <>
            <div className="profile-skill-section">
              <div className="profile-skill-section-heading">
                <h3>Selected Skills</h3>
                <span>{chosenSkills.length} selected</span>
              </div>

              {chosenSkills.length > 0 ? (
                <div className="profile-skills-grid">
                  {chosenSkills.map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      className="profile-skill selected"
                      onClick={() => toggleSkill(skill)}
                    >
                      ✓ {skill}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="profile-empty-skills">
                  No skills selected yet.
                </p>
              )}
            </div>

            <div className="profile-skills-divider" />

            <div className="profile-skill-section">
              <div className="profile-skill-section-heading">
                <h3>Available Skills</h3>
                <span>{unselectedSkills.length} available</span>
              </div>

              <div className="profile-skills-grid">
                {unselectedSkills.map((skill) => (
                  <button
                    type="button"
                    key={skill}
                    className="profile-skill"
                    onClick={() => toggleSkill(skill)}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <p className="profile-skill-count">
          {chosenSkills.length} skills selected
        </p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="profile-primary-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Create My Account"}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </main>
  );
}

export default Register;
