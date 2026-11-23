
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Profile.css";

function getSavedProfile() {
  try {
    return JSON.parse(
      localStorage.getItem("skillBridgeProfile") || "null"
    );
  } catch {
    return null;
  }
}

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
    "Programming",
    "Data Structures",
    "Algorithms",
    "Problem Solving",
    "Git",
    "Database Management",
    "Testing",
  ],
  "Frontend Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Responsive Design",
    "Git",
    "REST APIs",
  ],
  "Backend Developer": [
    "JavaScript",
    "Node.js",
    "Express.js",
    "REST APIs",
    "Database Management",
    "Authentication",
    "Git",
  ],
  "Full Stack Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Git",
    "REST APIs",
  ],
  "React Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Git",
    "REST APIs",
    "Testing",
    "Responsive Design",
  ],
  "Data Analyst": [
    "Excel",
    "SQL",
    "Python",
    "Data Analysis",
    "Data Visualization",
    "Statistics",
    "Problem Solving",
  ],
  Accountant: [
    "Accounting",
    "Financial Reporting",
    "Excel",
    "Bookkeeping",
    "Taxation",
    "Attention to Detail",
  ],
  "Financial Analyst": [
    "Financial Analysis",
    "Excel",
    "Accounting",
    "Financial Modeling",
    "Data Analysis",
    "Budgeting",
    "Communication",
  ],
  "Tax Consultant": [
    "Taxation",
    "Accounting",
    "Tax Planning",
    "Financial Reporting",
    "Excel",
    "Legal Compliance",
  ],
  Auditor: [
    "Auditing",
    "Accounting",
    "Financial Reporting",
    "Risk Assessment",
    "Excel",
    "Attention to Detail",
  ],
  "Banking Professional": [
    "Banking Operations",
    "Financial Analysis",
    "Customer Service",
    "Communication",
    "Excel",
    "Financial Literacy",
  ],
  "Content Writer": [
    "Content Writing",
    "Research",
    "Grammar",
    "SEO",
    "Storytelling",
    "Communication",
  ],
  Psychologist: [
    "Psychology",
    "Research",
    "Active Listening",
    "Communication",
    "Observation",
    "Empathy",
  ],
  "Human Resources Professional": [
    "Communication",
    "Recruitment",
    "HR Management",
    "Conflict Resolution",
    "Team Management",
    "Interviewing",
  ],
  Journalist: [
    "Writing",
    "Research",
    "Interviewing",
    "Fact Checking",
    "Communication",
    "News Reporting",
  ],
  "Social Worker": [
    "Communication",
    "Community Engagement",
    "Counselling",
    "Research",
    "Problem Solving",
    "Empathy",
  ],
  "Business Analyst": [
    "Business Analysis",
    "Excel",
    "SQL",
    "Data Analysis",
    "Communication",
    "Problem Solving",
  ],
  "Marketing Manager": [
    "Digital Marketing",
    "Market Research",
    "SEO",
    "Content Strategy",
    "Communication",
    "Leadership",
  ],
  "Project Manager": [
    "Project Planning",
    "Leadership",
    "Communication",
    "Risk Management",
    "Time Management",
    "Team Management",
  ],
  Entrepreneur: [
    "Business Planning",
    "Leadership",
    "Marketing",
    "Financial Management",
    "Communication",
    "Problem Solving",
  ],
  "Research Scientist": [
    "Research",
    "Data Analysis",
    "Statistics",
    "Scientific Writing",
    "Critical Thinking",
    "Laboratory Skills",
  ],
  "Lab Technician": [
    "Laboratory Skills",
    "Scientific Methods",
    "Equipment Handling",
    "Documentation",
    "Observation",
    "Safety Procedures",
  ],
  "Research Assistant": [
    "Research",
    "Data Collection",
    "Data Analysis",
    "Documentation",
    "Scientific Writing",
    "Critical Thinking",
  ],
  Doctor: [
    "Patient Care",
    "Medical Knowledge",
    "Clinical Skills",
    "Communication",
    "Diagnosis",
    "Medical Ethics",
  ],
  Pharmacist: [
    "Pharmaceutical Knowledge",
    "Medicine Management",
    "Patient Counselling",
    "Pharmacology",
    "Attention to Detail",
    "Medical Ethics",
  ],
  Nurse: [
    "Patient Care",
    "Clinical Skills",
    "First Aid",
    "Communication",
    "Patient Monitoring",
    "Medical Ethics",
  ],
  "Healthcare Administrator": [
    "Healthcare Management",
    "Communication",
    "Administration",
    "Data Management",
    "Leadership",
    "Problem Solving",
  ],
  Lawyer: [
    "Legal Research",
    "Legal Drafting",
    "Case Analysis",
    "Public Speaking",
    "Negotiation",
    "Critical Thinking",
  ],
  "Legal Advisor": [
    "Legal Research",
    "Legal Drafting",
    "Contract Review",
    "Legal Compliance",
    "Communication",
    "Negotiation",
  ],
  "Corporate Lawyer": [
    "Corporate Law",
    "Contract Drafting",
    "Legal Research",
    "Compliance",
    "Negotiation",
    "Business Communication",
  ],
  "Legal Researcher": [
    "Legal Research",
    "Case Analysis",
    "Legal Writing",
    "Documentation",
    "Critical Thinking",
    "Attention to Detail",
  ],
  "UI/UX Designer": [
    "Figma",
    "Wireframing",
    "Prototyping",
    "User Research",
    "Visual Design",
    "Usability Testing",
  ],
  "Graphic Designer": [
    "Graphic Design",
    "Typography",
    "Colour Theory",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Visual Communication",
  ],
  Animator: [
    "Animation",
    "Storyboarding",
    "Character Design",
    "Motion Graphics",
    "Visual Storytelling",
    "Drawing",
  ],
  Illustrator: [
    "Digital Illustration",
    "Drawing",
    "Colour Theory",
    "Composition",
    "Visual Storytelling",
    "Adobe Illustrator",
  ],
  Technician: [
    "Technical Troubleshooting",
    "Equipment Maintenance",
    "Safety Procedures",
    "Problem Solving",
    "Documentation",
    "Technical Knowledge",
  ],
  Electrician: [
    "Electrical Wiring",
    "Circuit Knowledge",
    "Electrical Safety",
    "Troubleshooting",
    "Equipment Maintenance",
    "Technical Knowledge",
  ],
  "Skilled Professional": [
    "Technical Skills",
    "Problem Solving",
    "Time Management",
    "Communication",
    "Safety Procedures",
    "Teamwork",
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

function Profile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const savedProfile = getSavedProfile();

  const isEditing =
    searchParams.get("edit") === "true" &&
    savedProfile !== null;

  const [studentName, setStudentName] = useState(
    savedProfile?.studentName || ""
  );

  const [educationalStream, setEducationalStream] = useState(
    savedProfile?.educationalStream || ""
  );

  const [course, setCourse] = useState(
    savedProfile?.course || ""
  );

  const [customCourse, setCustomCourse] = useState(
    savedProfile?.customCourse || ""
  );

  const [targetRole, setTargetRole] = useState(
    savedProfile?.targetRole || ""
  );

  const [selectedSkills, setSelectedSkills] = useState(
    savedProfile?.selectedSkills || []
  );

  useEffect(() => {
    if (isEditing && savedProfile) {
      setStudentName(savedProfile.studentName || "");
      setEducationalStream(savedProfile.educationalStream || "");
      setCourse(savedProfile.course || "");
      setCustomCourse(savedProfile.customCourse || "");
      setTargetRole(savedProfile.targetRole || "");
      setSelectedSkills(savedProfile.selectedSkills || []);
    } else {
      setStudentName("");
      setEducationalStream("");
      setCourse("");
      setCustomCourse("");
      setTargetRole("");
      setSelectedSkills([]);
    }
  }, [isEditing, searchParams]);

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

  function handleStreamChange(value) {
    setEducationalStream(value);
    setCourse("");
    setCustomCourse("");
    setTargetRole("");
    setSelectedSkills([]);
  }
function handleRoleChange(value) {
  setTargetRole(value);

  const updatedSkills = skillsByRole[value] || generalSkills;

  setSelectedSkills((previousSkills) =>
    previousSkills.filter((skill) =>
      updatedSkills.includes(skill)
    )
  );
}
  function toggleSkill(skill) {
    setSelectedSkills((previousSkills) =>
      previousSkills.includes(skill)
        ? previousSkills.filter((item) => item !== skill)
        : [...previousSkills, skill]
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!studentName.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!educationalStream) {
      alert("Please select your educational stream.");
      return;
    }

    if (!course) {
      alert("Please select your course or specialization.");
      return;
    }

    if (course === "Other" && !customCourse.trim()) {
      alert("Please enter your course or specialization.");
      return;
    }

    if (!targetRole.trim()) {
      alert("Please enter your career goal.");
      return;
    }

    if (chosenSkills.length === 0) {
      alert("Please select at least one skill for your career goal.");
      return;
    }

    const studentProfile = {
      ...(isEditing ? savedProfile : {}),
      studentName: studentName.trim(),
      educationalStream,
      course,
      customCourse: course === "Other" ? customCourse.trim() : "",
      targetRole: targetRole.trim(),
      selectedSkills: chosenSkills,
    };

    localStorage.setItem(
      "skillBridgeProfile",
      JSON.stringify(studentProfile)
    );

    window.dispatchEvent(
      new Event("skillBridgeProfileUpdated")
    );

    alert(`Profile saved successfully, ${studentName.trim()}!`);
    navigate("/dashboard");
  }

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <p className="profile-eyebrow">
          YOUR CAREER JOURNEY STARTS HERE
        </p>

        <h1>
          {isEditing
            ? "Update Your Student Profile"
            : "Build Your Student Profile"}
        </h1>

        <p>
          Tell us about your education, career goal and current
          skills to help us plan your learning journey.
        </p>
      </section>

      <form className="profile-card" onSubmit={handleSubmit}>
        <label htmlFor="studentName">Your name</label>

        <input
          id="studentName"
          type="text"
          value={studentName}
          onChange={(event) => setStudentName(event.target.value)}
          placeholder="Enter your name"
          required
        />

        <label htmlFor="educationalStream">Educational stream</label>

        <select
          id="educationalStream"
          value={educationalStream}
          onChange={(event) => handleStreamChange(event.target.value)}
          required
        >
          <option value="">Select your educational stream</option>
          {streams.map((stream) => (
            <option key={stream} value={stream}>
              {stream}
            </option>
          ))}
        </select>

        <label htmlFor="course">Course / Specialization</label>

        <select
          id="course"
          value={course}
          onChange={(event) => setCourse(event.target.value)}
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
          <input
            type="text"
            value={customCourse}
            onChange={(event) => setCustomCourse(event.target.value)}
            placeholder="Enter your course or specialization"
            required
          />
        )}

       <label htmlFor="targetRole">Your career goal</label>

<select
  id="targetRole"
  value={
    careerOptions.includes(targetRole) ? targetRole : "Other"
  }
  onChange={(event) => {
    const value = event.target.value;
    handleRoleChange(value === "Other" ? "" : value);
  }}
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

  <option value="Other">Other / Custom career goal</option>
</select>

{(!careerOptions.includes(targetRole) || targetRole === "") &&
  targetRole !== "" && (
    <input
      type="text"
      value={targetRole}
      onChange={(event) => handleRoleChange(event.target.value)}
      placeholder="Enter your custom career goal"
      required
    />
  )}

        <label>Skills required for your career goal</label>

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

        <button className="profile-primary-button" type="submit">
          {isEditing ? "Save Profile Changes" : "Create My Profile"}
        </button>
      </form>
    </main>
  );
}

export default Profile;
