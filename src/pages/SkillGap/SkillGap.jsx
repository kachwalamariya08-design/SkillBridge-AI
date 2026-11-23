
import { useEffect, useState } from "react";
import "./SkillGap.css";

const careerGoalsByStream = {
  "Engineering & Technology": [
    "Software Engineer", "Frontend Developer", "Backend Developer",
    "Full Stack Developer", "React Developer", "Data Analyst", "Other",
  ],
  Commerce: [
    "Accountant", "Financial Analyst", "Tax Consultant", "Auditor",
    "Banking Professional", "Other",
  ],
  "Arts & Humanities": [
    "Content Writer", "Psychologist", "Human Resources Professional",
    "Journalist", "Social Worker", "Other",
  ],
  Management: [
    "Business Analyst", "Marketing Manager", "Human Resources Professional",
    "Project Manager", "Entrepreneur", "Other",
  ],
  Science: [
    "Research Scientist", "Data Analyst", "Lab Technician",
    "Research Assistant", "Other",
  ],
  "Medical & Healthcare": [
    "Doctor", "Pharmacist", "Nurse", "Healthcare Administrator", "Other",
  ],
  Law: [
    "Lawyer", "Legal Advisor", "Corporate Lawyer", "Legal Researcher", "Other",
  ],
  "Design & Creative Arts": [
    "UI/UX Designer", "Graphic Designer", "Animator", "Illustrator", "Other",
  ],
  "Vocational Studies": [
    "Technician", "Electrician", "Skilled Professional", "Entrepreneur", "Other",
  ],
  Other: ["Other"],
};

export const skillsByRole = {
  "Software Engineer": [
    "Programming", "Data Structures", "Algorithms", "Problem Solving",
    "Git", "Database Management", "Testing",
  ],
  "Frontend Developer": [
    "HTML", "CSS", "JavaScript", "React", "Responsive Design", "Git", "REST APIs",
  ],
  "Backend Developer": [
    "JavaScript", "Node.js", "Express.js", "REST APIs",
    "Database Management", "Authentication", "Git",
  ],
  "Full Stack Developer": [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "Express.js",
    "MongoDB", "Git", "REST APIs",
  ],
  "React Developer": [
    "HTML", "CSS", "JavaScript", "React", "Git", "REST APIs",
    "Testing", "Responsive Design",
  ],
  "Data Analyst": [
    "Excel", "SQL", "Python", "Data Analysis", "Data Visualization",
    "Statistics", "Problem Solving",
  ],
  Accountant: [
    "Accounting", "Financial Reporting", "Excel", "Bookkeeping",
    "Taxation", "Attention to Detail",
  ],
  "Financial Analyst": [
    "Financial Analysis", "Excel", "Accounting", "Financial Modeling",
    "Data Analysis", "Budgeting", "Communication",
  ],
  "Tax Consultant": [
    "Taxation", "Accounting", "Tax Planning", "Financial Reporting",
    "Excel", "Legal Compliance",
  ],
  Auditor: [
    "Auditing", "Accounting", "Financial Reporting", "Risk Assessment",
    "Excel", "Attention to Detail",
  ],
  "Banking Professional": [
    "Banking Operations", "Financial Analysis", "Customer Service",
    "Communication", "Excel", "Financial Literacy",
  ],
  "Content Writer": [
    "Content Writing", "Research", "Grammar", "SEO", "Storytelling", "Communication",
  ],
  Psychologist: [
    "Psychology", "Research", "Active Listening", "Communication",
    "Observation", "Empathy",
  ],
  "Human Resources Professional": [
    "Communication", "Recruitment", "HR Management", "Conflict Resolution",
    "Team Management", "Interviewing",
  ],
  Journalist: [
    "Writing", "Research", "Interviewing", "Fact Checking",
    "Communication", "News Reporting",
  ],
  "Social Worker": [
    "Communication", "Community Engagement", "Counselling",
    "Research", "Problem Solving", "Empathy",
  ],
  "Business Analyst": [
    "Business Analysis", "Excel", "SQL", "Data Analysis",
    "Communication", "Problem Solving",
  ],
  "Marketing Manager": [
    "Digital Marketing", "Market Research", "SEO", "Content Strategy",
    "Communication", "Leadership",
  ],
  "Project Manager": [
    "Project Planning", "Leadership", "Communication", "Risk Management",
    "Time Management", "Team Management",
  ],
  Entrepreneur: [
    "Business Planning", "Leadership", "Marketing", "Financial Management",
    "Communication", "Problem Solving",
  ],
  "Research Scientist": [
    "Research", "Data Analysis", "Statistics", "Scientific Writing",
    "Critical Thinking", "Laboratory Skills",
  ],
  "Lab Technician": [
    "Laboratory Skills", "Scientific Methods", "Equipment Handling",
    "Documentation", "Observation", "Safety Procedures",
  ],
  "Research Assistant": [
    "Research", "Data Collection", "Data Analysis", "Documentation",
    "Scientific Writing", "Critical Thinking",
  ],
  Doctor: [
    "Patient Care", "Medical Knowledge", "Clinical Skills",
    "Communication", "Diagnosis", "Medical Ethics",
  ],
  Pharmacist: [
    "Pharmaceutical Knowledge", "Medicine Management", "Patient Counselling",
    "Pharmacology", "Attention to Detail", "Medical Ethics",
  ],
  Nurse: [
    "Patient Care", "Clinical Skills", "First Aid", "Communication",
    "Patient Monitoring", "Medical Ethics",
  ],
  "Healthcare Administrator": [
    "Healthcare Management", "Communication", "Administration",
    "Data Management", "Leadership", "Problem Solving",
  ],
  Lawyer: [
    "Legal Research", "Legal Drafting", "Case Analysis", "Public Speaking",
    "Negotiation", "Critical Thinking",
  ],
  "Legal Advisor": [
    "Legal Research", "Legal Drafting", "Contract Review", "Legal Compliance",
    "Communication", "Negotiation",
  ],
  "Corporate Lawyer": [
    "Corporate Law", "Contract Drafting", "Legal Research", "Compliance",
    "Negotiation", "Business Communication",
  ],
  "Legal Researcher": [
    "Legal Research", "Case Analysis", "Legal Writing", "Documentation",
    "Critical Thinking", "Attention to Detail",
  ],
  "UI/UX Designer": [
    "Figma", "Wireframing", "Prototyping", "User Research",
    "Visual Design", "Usability Testing",
  ],
  "Graphic Designer": [
    "Graphic Design", "Typography", "Colour Theory", "Adobe Photoshop",
    "Adobe Illustrator", "Visual Communication",
  ],
  Animator: [
    "Animation", "Storyboarding", "Character Design", "Motion Graphics",
    "Visual Storytelling", "Drawing",
  ],
  Illustrator: [
    "Digital Illustration", "Drawing", "Colour Theory", "Composition",
    "Visual Storytelling", "Adobe Illustrator",
  ],
  Technician: [
    "Technical Troubleshooting", "Equipment Maintenance", "Safety Procedures",
    "Problem Solving", "Documentation", "Technical Knowledge",
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

export const generalSkills = [
  "Communication", "Problem Solving", "Research", "Teamwork",
  "Time Management", "Digital Literacy", "Critical Thinking",
];

function getSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem("skillBridgeProfile") || "null");
  } catch {
    return null;
  }
}

function getDefaultRole(profile) {
  const stream = profile?.educationalStream || "Engineering & Technology";
  const options = careerGoalsByStream[stream] || careerGoalsByStream["Engineering & Technology"];

  if (profile?.targetRole && profile.targetRole !== "Other") {
    return profile.targetRole;
  }

  return options.find((role) => role !== "Other") || "Frontend Developer";
}

function SkillGap() {
  const [profile, setProfile] = useState(getSavedProfile);
  const [targetRole, setTargetRole] = useState(() => getDefaultRole(getSavedProfile()));

  useEffect(() => {
    const updateProfile = () => {
      const updatedProfile = getSavedProfile();
      setProfile(updatedProfile);
      setTargetRole(getDefaultRole(updatedProfile));
    };

    window.addEventListener("skillBridgeProfileUpdated", updateProfile);
    window.addEventListener("storage", updateProfile);

    return () => {
      window.removeEventListener("skillBridgeProfileUpdated", updateProfile);
      window.removeEventListener("storage", updateProfile);
    };
  }, []);

  const educationalStream =
    profile?.educationalStream || "Engineering & Technology";

  const careerOptions =
    careerGoalsByStream[educationalStream] ||
    careerGoalsByStream["Engineering & Technology"];

  const selectedSkills = Array.isArray(profile?.selectedSkills)
    ? profile.selectedSkills
    : [];

  const requiredSkills = skillsByRole[targetRole] || generalSkills;

  const knownSkills = requiredSkills.filter((skill) =>
    selectedSkills.includes(skill)
  );

  const missingSkills = requiredSkills.filter(
    (skill) => !selectedSkills.includes(skill)
  );

  const matchPercentage = Math.round(
    (knownSkills.length / requiredSkills.length) * 100
  );

  const availableCareerOptions = careerOptions.filter(
    (role) => role !== "Other"
  );

  return (
    <div className="skill-gap-page">
      <div className="skill-gap-header">
        <h1>Skill Gap Analysis</h1>
        <p>
          Compare your current skills with the skills needed
          for your target career.
        </p>
      </div>

      <div className="skill-gap-card">
        <label htmlFor="educationalStream">Your educational stream</label>

        <select id="educationalStream" value={educationalStream} disabled>
          <option value={educationalStream}>{educationalStream}</option>
        </select>

        <label htmlFor="targetRole">Choose your target role</label>

        <select
          id="targetRole"
          value={targetRole}
          onChange={(event) => setTargetRole(event.target.value)}
        >
          {availableCareerOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}

          {targetRole &&
            !availableCareerOptions.includes(targetRole) &&
            targetRole !== "Other" && (
              <option value={targetRole}>{targetRole}</option>
            )}

          <option value="Other">Other / General Skills</option>
        </select>

        <div className="skill-match">
          <h2>Your Skill Match</h2>
          <p className="match-percentage">{matchPercentage}%</p>
          <p>
            You currently match {knownSkills.length} out of{" "}
            {requiredSkills.length} required skills.
          </p>
        </div>

        <h2>Skills You Already Know</h2>

        <div className="required-skills">
          {knownSkills.length > 0 ? (
            knownSkills.map((skill) => (
              <span className="skill-tag known-tag" key={skill}>
                ✓ {skill}
              </span>
            ))
          ) : (
            <p>No matching skills found. Update your profile.</p>
          )}
        </div>

        <h2 className="missing-heading">Skills You Need to Learn</h2>

        <div className="required-skills">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill) => (
              <span className="skill-tag missing-tag" key={skill}>
                + {skill}
              </span>
            ))
          ) : (
            <p>Great job! You have selected all the listed skills.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillGap;
