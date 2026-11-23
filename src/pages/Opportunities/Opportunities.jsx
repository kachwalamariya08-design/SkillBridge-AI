
import { useEffect, useState } from "react";
import {
  MapPin,
  Wallet,
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  CalendarDays,
  X,
  ExternalLink,
} from "lucide-react";
import "./Opportunities.css";

const PROFILE_KEY = "skillBridgeProfile";
const SAVED_JOBS_KEY = "skillBridgeSavedJobs";
const SAVED_JOBS_DATA_KEY = "skillBridgeSavedJobsData";
const JOB_CACHE_KEY = "skillBridgeJobCache";
const API_URL = "http://localhost:5000/api/jobs";

// Skills are grouped across the educational streams supported by SkillBridge AI.
// The API response is still the source of job listings; these keywords only help
// identify skills in each listing's title and description.
const STREAM_SKILLS = {
  "Engineering & Technology": [
    "JavaScript", "TypeScript", "React", "Angular", "Vue", "HTML", "CSS",
    "Node.js", "Express.js", "MongoDB", "SQL", "Python", "Java", "C++",
    "Git", "REST APIs", "Data Structures", "Algorithms", "AWS", "Docker",
    "Testing", "Cybersecurity", "Networking", "Cloud Computing", "Machine Learning",
  ],
  Commerce: [
    "Accounting", "Bookkeeping", "GST", "Taxation", "Tally", "Excel",
    "Financial Analysis", "Auditing", "Payroll", "Invoicing", "Budgeting",
    "Accounts Payable", "Accounts Receivable", "Reconciliation", "SAP", "Financial Reporting",
  ],
  "Arts & Humanities": [
    "Content Writing", "Copywriting", "Editing", "Proofreading", "SEO",
    "Research", "Journalism", "Creative Writing", "Social Media", "Storytelling",
    "Translation", "Public Relations", "Communication", "Photography", "Teaching",
  ],
  Management: [
    "Project Management", "Leadership", "Operations Management", "Human Resources",
    "Recruitment", "Talent Acquisition", "Business Development", "Stakeholder Management",
    "Planning", "Coordination", "Marketing", "Sales", "Business Analysis", "Excel",
  ],
  Science: [
    "Research", "Data Analysis", "Statistics", "Python", "R Programming", "SQL",
    "Scientific Writing", "Quality Control", "Microbiology", "Chemistry", "Biology",
    "Physics", "MATLAB", "Laboratory Techniques", "Data Visualization",
  ],
  "Medical & Healthcare": [
    "Patient Care", "Nursing", "Clinical Care", "Healthcare Administration",
    "Medical Terminology", "Phlebotomy", "First Aid", "Infection Control",
    "Electronic Medical Records", "Medical Coding", "Laboratory Techniques",
    "Patient Monitoring", "Pharmacy", "Healthcare Compliance",
  ],
  Law: [
    "Legal Research", "Legal Drafting", "Litigation", "Compliance", "Contract Review",
    "Corporate Law", "Case Analysis", "Documentation", "Negotiation", "Legal Writing",
    "Due Diligence", "Client Counselling",
  ],
  "Design & Creative Arts": [
    "UI/UX Design", "Figma", "Wireframing", "Prototyping", "Graphic Design",
    "Adobe Photoshop", "Adobe Illustrator", "Typography", "Visual Design",
    "Video Editing", "Motion Graphics", "CAD", "Fashion Design", "3D Modelling",
  ],
  "Vocational Studies": [
    "Electrical Wiring", "Maintenance", "Troubleshooting", "HVAC", "Plumbing",
    "Welding", "Workplace Safety", "Hospitality", "Customer Service", "Food Service",
    "Equipment Operation", "Mechanical Repair", "Installation", "Inventory Management",
  ],
  Other: [
    "Communication", "Excel", "Customer Service", "Sales", "Data Entry",
    "Problem Solving", "Teamwork", "MS Office", "Administration", "Time Management",
  ],
};

const COMMON_SKILLS = [...new Set(Object.values(STREAM_SKILLS).flat())];

const SKILL_ALIASES = {
  "Accounting": ["accounting", "accounts"],
  "Bookkeeping": ["bookkeeping", "book keeping"],
  "GST": ["gst", "goods and services tax"],
  "Tally": ["tally erp", "tally prime", "tally"],
  "Financial Analysis": ["financial analysis", "financial analyst"],
  "Auditing": ["auditing", "audit"],
  "Content Writing": ["content writing", "content writer"],
  "Copywriting": ["copywriting", "copywriter"],
  "Editing": ["editing", "editor"],
  "SEO": ["seo", "search engine optimization"],
  "Research": ["research", "researcher"],
  "Project Management": ["project management", "project manager"],
  "Human Resources": ["human resources", "hr", "human resource"],
  "Recruitment": ["recruitment", "recruiter"],
  "Business Development": ["business development", "business developer"],
  "Data Analysis": ["data analysis", "data analytics", "data analyst"],
  "Scientific Writing": ["scientific writing", "scientific documentation"],
  "Patient Care": ["patient care", "patient support"],
  "Nursing": ["nursing", "nurse"],
  "Legal Research": ["legal research", "case law research"],
  "Legal Drafting": ["legal drafting", "drafting"],
  "UI/UX Design": ["ui/ux", "ui ux", "user experience", "user interface"],
  "Graphic Design": ["graphic design", "graphic designer"],
  "Video Editing": ["video editing", "video editor"],
  "Electrical Wiring": ["electrical wiring", "wiring"],
  "Maintenance": ["maintenance", "preventive maintenance"],
  "Customer Service": ["customer service", "customer support"],
};

const DEFAULT_SEARCH_BY_STREAM = {
  "Engineering & Technology": "engineering internship",
  Commerce: "accounting finance commerce internship",
  "Arts & Humanities": "content writing communications internship",
  Management: "management business operations internship",
  Science: "science research laboratory internship",
  "Medical & Healthcare": "healthcare medical internship",
  Law: "legal internship",
  "Design & Creative Arts": "design creative internship",
  "Vocational Studies": "technician skilled trades internship",
  Other: "internship entry level",
};

const ROLE_ALIASES = {
  "accountant": ["accountant", "accounts executive", "accounts assistant", "junior accountant"],
  "financial analyst": ["financial analyst", "finance analyst", "financial associate"],
  "marketing executive": ["marketing executive", "marketing associate", "digital marketing executive"],
  "business analyst": ["business analyst", "business analysis associate"],
  "content writer": ["content writer", "copywriter", "seo writer", "technical writer", "content editor"],
  "journalist": ["journalist", "reporter", "news writer"],
  "teacher": ["teacher", "educator", "teaching assistant"],
  "business manager": ["business manager", "business operations manager"],
  "project manager": ["project manager", "project coordinator", "project management"],
  "human resource manager": ["human resource manager", "hr manager", "hr executive", "human resources"],
  "operations manager": ["operations manager", "operations executive", "operations associate"],
  "data analyst": ["data analyst", "data analytics associate", "junior data analyst"],
  "research assistant": ["research assistant", "research associate", "research analyst"],
  "laboratory technician": ["laboratory technician", "lab technician", "lab assistant"],
  "nurse": ["nurse", "registered nurse", "staff nurse", "nursing assistant"],
  "healthcare administrator": ["healthcare administrator", "hospital administrator", "healthcare coordinator"],
  "medical laboratory technician": ["medical laboratory technician", "medical lab technician", "lab technician"],
  "lawyer": ["lawyer", "legal associate", "associate advocate", "advocate"],
  "legal advisor": ["legal advisor", "legal counsel", "legal consultant"],
  "paralegal": ["paralegal", "legal assistant"],
  "ui/ux designer": ["ui/ux designer", "ui ux designer", "ux designer", "ui designer", "product designer"],
  "fashion designer": ["fashion designer", "apparel designer"],
  "video editor": ["video editor", "video editing specialist"],
  "electrician": ["electrician", "electrical technician"],
  "technician": ["technician", "service technician", "maintenance technician"],
  "hospitality professional": ["hospitality", "hotel operations", "guest relations", "front office executive"],
  "react developer": ["react developer", "react.js developer", "frontend react developer"],
  "frontend developer": ["frontend developer", "front-end developer", "front end developer", "ui developer"],
  "full stack developer": ["full stack developer", "full-stack developer", "fullstack developer"],
  "software engineer": ["software engineer", "software developer", "application developer"],
};

const ROLE_STOP_WORDS = new Set([
  "and", "the", "for", "with", "entry", "level", "junior", "senior",
  "associate", "professional", "executive", "developer", "designer",
]);

function readArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function getSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
  } catch {
    return null;
  }
}

function getSavedJobs() {
  return readArray(SAVED_JOBS_KEY).map(String);
}

function getSavedJobDetails() {
  return readArray(SAVED_JOBS_DATA_KEY);
}

function getJobCache() {
  return readArray(JOB_CACHE_KEY);
}

function extractSkills(job) {
  const text = `${job.title || ""} ${job.description || ""}`.toLowerCase();

  return COMMON_SKILLS.filter((skill) => {
    const terms = SKILL_ALIASES[skill] || [skill.toLowerCase()];

    return terms.some((term) => {
      if (term.length <= 2) {
        return new RegExp(`\\b${term}\\b`, "i").test(text);
      }
      return text.includes(term.toLowerCase());
    });
  });
}

function getDefaultSearch(profile) {
  const stream = profile?.educationalStream || "Other";
  return DEFAULT_SEARCH_BY_STREAM[stream] || DEFAULT_SEARCH_BY_STREAM.Other;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isRoleRelevant(targetRole, jobTitle) {
  if (!targetRole || !jobTitle) return false;

  const role = normalizeText(targetRole);
  const title = normalizeText(jobTitle);
  if (!role || !title) return false;

  if (title.includes(role)) return true;

  const aliases = ROLE_ALIASES[role] || [];
  if (aliases.some((alias) => title.includes(normalizeText(alias)))) {
    return true;
  }

  // For roles without a predefined alias, require all meaningful role words
  // to appear in the job title. This avoids matches from one generic word.
  const meaningfulWords = role
    .split(" ")
    .filter((word) => word.length > 2 && !ROLE_STOP_WORDS.has(word));

  return meaningfulWords.length > 0 && meaningfulWords.every((word) => title.includes(word));
}

function formatSalary(min, max) {
  if (!min && !max) return "";

  const format = (amount) =>
    new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(amount);

  if (min && max) return `₹${format(min)} - ₹${format(max)}`;
  if (min) return `From ₹${format(min)}`;

  return `Up to ₹${format(max)}`;
}

function getJobType(job) {
  const title = (job.title || "").toLowerCase();
  const contractTime = (job.contractTime || "").toLowerCase();
  const contractType = (job.contractType || "").toLowerCase();

  if (title.includes("intern")) return "Internship";

  if (contractTime === "full_time") return "Full-time";
  if (contractTime === "part_time") return "Part-time";

  if (contractType === "permanent") return "Full-time";
  if (contractType === "contract") return "Full-time";

  return "Other";
}

function getPostedTimestamp(date) {
  if (!date) return null;

  const timestamp = new Date(date).getTime();

  return Number.isNaN(timestamp) ? null : timestamp;
}

function isWithinSixMonths(date) {
  const timestamp = getPostedTimestamp(date);

  if (!timestamp) return false;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  return (
    timestamp >= sixMonthsAgo.getTime() &&
    timestamp <= Date.now()
  );
}

function getPostedLabel(date) {
  const timestamp = getPostedTimestamp(date);

  if (!timestamp) return "Posting date unavailable";

  const daysAgo = Math.floor(
    (Date.now() - timestamp) / (1000 * 60 * 60 * 24)
  );

  if (daysAgo === 0) return "Posted today";
  if (daysAgo === 1) return "Posted 1 day ago";
  if (daysAgo === 2) return "Posted 2 days ago";
  if (daysAgo < 30) return `Posted ${daysAgo} days ago`;
  if (daysAgo < 60) return "Posted about 1 month ago";

  if (daysAgo < 180) {
    return `Posted about ${Math.floor(daysAgo / 30)} months ago`;
  }

  return "Posted within the last 6 months";
}

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function prepareJob(job) {
  return {
    ...job,
    id: String(job.id),
    title: job.title || "Untitled Position",
    company: job.company || "Not specified",
    location: job.location || "Not specified",
    description: job.description || "",
    applicationUrl: job.applicationUrl || "",
    postedDate: job.postedDate || "",
    salaryMin: job.salaryMin || null,
    salaryMax: job.salaryMax || null,
    contractType: job.contractType || "",
    contractTime: job.contractTime || "",
    type: job.type || getJobType(job),
    skills: Array.isArray(job.skills) && job.skills.length > 0
      ? job.skills
      : extractSkills(job),
    experience:
      job.experience ||
      ((job.title || "").toLowerCase().includes("intern")
        ? "Internship"
        : "See job details"),
  };
}

function mergeJobs(existingJobs, newJobs) {
  const merged = new Map();

  existingJobs.forEach((job) => {
    if (job?.id !== undefined) {
      merged.set(String(job.id), prepareJob(job));
    }
  });

  newJobs.forEach((job) => {
    if (job?.id !== undefined) {
      merged.set(String(job.id), prepareJob(job));
    }
  });

  return Array.from(merged.values());
}

function Opportunities() {
  const [profile, setProfile] = useState(getSavedProfile);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("India");
  const [viewMode, setViewMode] = useState("All");

  const [savedJobs, setSavedJobs] = useState(getSavedJobs);
  const [savedJobDetails, setSavedJobDetails] = useState(
    getSavedJobDetails
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const targetRole = profile?.targetRole || "";
  const searchQuery = targetRole.trim() || getDefaultSearch(profile);

  const selectedSkills = Array.isArray(profile?.selectedSkills)
    ? profile.selectedSkills
    : [];

  useEffect(() => {
    function updateProfile() {
      setProfile(getSavedProfile());
    }

    window.addEventListener("skillBridgeProfileUpdated", updateProfile);
    window.addEventListener("storage", updateProfile);

    return () => {
      window.removeEventListener("skillBridgeProfileUpdated", updateProfile);
      window.removeEventListener("storage", updateProfile);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchJobs() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          what: searchQuery,
          where: selectedLocation,
        });

        const response = await fetch(
          `${API_URL}?${params.toString()}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Unable to retrieve job listings.");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.message || "Unable to retrieve job listings."
          );
        }

        const formattedJobs = (data.jobs || [])
          .filter((job) => isWithinSixMonths(job.postedDate))
          .map(prepareJob)
          .sort(
            (a, b) =>
              getPostedTimestamp(b.postedDate) -
              getPostedTimestamp(a.postedDate)
          );

        setJobs(formattedJobs);

        const updatedCache = mergeJobs(
          getJobCache(),
          formattedJobs
        );

        localStorage.setItem(
          JOB_CACHE_KEY,
          JSON.stringify(updatedCache)
        );

        const currentSavedIds = getSavedJobs();

        const recoveredDetails = updatedCache.filter((job) =>
          currentSavedIds.includes(job.id)
        );

        const updatedSavedDetails = mergeJobs(
          getSavedJobDetails(),
          recoveredDetails
        ).filter((job) => currentSavedIds.includes(job.id));

        localStorage.setItem(
          SAVED_JOBS_DATA_KEY,
          JSON.stringify(updatedSavedDetails)
        );

        setSavedJobDetails(updatedSavedDetails);
        setSavedJobs(currentSavedIds);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            "We couldn't load jobs. Please check that your backend is running and try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchJobs();

    return () => controller.abort();
  }, [searchQuery, selectedLocation]);

  function getMatchingSkills(opportunity) {
    return (opportunity.skills || []).filter((skill) =>
      selectedSkills.some(
        (profileSkill) =>
          profileSkill.toLowerCase() === skill.toLowerCase()
      )
    );
  }

  function getRoleMatch(opportunity) {
    return isRoleRelevant(targetRole, opportunity.title);
  }

  function getJobMatchPercentage(opportunity) {
    const matchingSkills = getMatchingSkills(opportunity);
    const roleMatch = getRoleMatch(opportunity);

    // Role relevance contributes 40 points. Profile skill overlap contributes
    // up to 60 points, measured against the student's selected skills.
    const roleScore = roleMatch ? 40 : 0;
    const skillScore = selectedSkills.length > 0
      ? (matchingSkills.length / selectedSkills.length) * 60
      : roleMatch ? 60 : 0;

    return Math.min(100, Math.round(roleScore + skillScore));
  }

  function toggleSave(opportunity) {
    const id = String(opportunity.id);
    const alreadySaved = savedJobs.includes(id);

    const updatedSavedJobs = alreadySaved
      ? savedJobs.filter((jobId) => jobId !== id)
      : [...savedJobs, id];

    const updatedSavedDetails = alreadySaved
      ? savedJobDetails.filter((job) => String(job.id) !== id)
      : mergeJobs(savedJobDetails, [opportunity]);

    localStorage.setItem(
      SAVED_JOBS_KEY,
      JSON.stringify(updatedSavedJobs)
    );

    localStorage.setItem(
      SAVED_JOBS_DATA_KEY,
      JSON.stringify(updatedSavedDetails)
    );

    if (!alreadySaved) {
      const updatedCache = mergeJobs(getJobCache(), [opportunity]);

      localStorage.setItem(
        JOB_CACHE_KEY,
        JSON.stringify(updatedCache)
      );
    }

    setSavedJobs(updatedSavedJobs);
    setSavedJobDetails(updatedSavedDetails);
  }

  const sourceJobs =
    viewMode === "Saved"
      ? savedJobs.map((id) => {
          const foundJob = savedJobDetails.find(
            (job) => String(job.id) === id
          );

          if (foundJob) {
            return prepareJob(foundJob);
          }

          return {
            id,
            title: "Saved job details unavailable",
            company: "Original listing not recovered",
            location: "Unavailable",
            description:
              "This job was saved before complete job details were stored. Its original listing information is not available in your saved data.",
            applicationUrl: "",
            postedDate: "",
            type: "Previously saved",
            skills: [],
            matchingSkills: [],
            experience: "Details unavailable",
            unavailable: true,
          };
        })
      : jobs;

  const filteredOpportunities = sourceJobs
    .map((opportunity) => {
      const matchingSkills = getMatchingSkills(opportunity);

      const missingSkills = (opportunity.skills || []).filter(
        (skill) =>
          !matchingSkills.some(
            (matchedSkill) =>
              matchedSkill.toLowerCase() === skill.toLowerCase()
          )
      );

      return {
        ...opportunity,
        matchingSkills,
        missingSkills,
        roleMatch: getRoleMatch(opportunity),
        matchPercentage: getJobMatchPercentage(opportunity),
      };
    })
    .filter((opportunity) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        opportunity.title.toLowerCase().includes(searchText) ||
        opportunity.company.toLowerCase().includes(searchText) ||
        opportunity.location.toLowerCase().includes(searchText) ||
        opportunity.description.toLowerCase().includes(searchText) ||
        opportunity.skills.some((skill) =>
          skill.toLowerCase().includes(searchText)
        );

      const matchesType =
        selectedType === "All" ||
        opportunity.type === selectedType;

      return matchesSearch && matchesType;
    })
    .sort(
      (a, b) =>
        getPostedTimestamp(b.postedDate) -
        getPostedTimestamp(a.postedDate)
    )
    .filter((opportunity) => {
      if (viewMode === "Saved") return true;

      if (viewMode === "Recommended") {
        const minimumSkillMatches = Math.min(2, selectedSkills.length);
        const hasMeaningfulSkillMatch =
          selectedSkills.length > 0 &&
          opportunity.matchingSkills.length >= minimumSkillMatches;

        return opportunity.roleMatch || hasMeaningfulSkillMatch;
      }

      return true;
    });

  const openJobDetails = (opportunity) => {
    setSelectedJob(opportunity);
  };

  useEffect(() => {
    if (!selectedJob) return;

    function handleEscape(event) {
      if (event.key === "Escape") {
        setSelectedJob(null);
      }
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [selectedJob]);

  return (
    <div className="opportunities-page">
      <header className="opportunities-header">
        <span className="opportunities-label">
          CAREER OPPORTUNITIES
        </span>

        <h1>Find Your Next Opportunity</h1>

        <p>
          Explore recent job opportunities based on your career goals
          and selected skills.
        </p>

        {targetRole && (
          <div className="profile-match-banner">
            Recommendations based on your target role:{" "}
            <strong>{targetRole}</strong>
          </div>
        )}

        <p className="live-listings-note">
          Showing jobs posted within the last 6 months, newest first.
        </p>
      </header>

      <section className="opportunities-search">
        <input
          type="text"
          placeholder="Search by role, company or skill..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
        >
          <option value="All">All Opportunities</option>
          <option value="Internship">Internships</option>
          <option value="Full-time">Full-time Jobs</option>
          <option value="Part-time">Part-time Jobs</option>
        </select>

        <select
          value={selectedLocation}
          onChange={(event) =>
            setSelectedLocation(event.target.value)
          }
        >
          <option value="India">All India</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Pune">Pune</option>
          <option value="Bangalore">Bengaluru</option>
          <option value="Delhi">Delhi</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Kolkata">Kolkata</option>
        </select>
      </section>

      <section className="opportunities-results">
        <div className="opportunity-view-filters">
          <button
            type="button"
            className={viewMode === "All" ? "active" : ""}
            onClick={() => setViewMode("All")}
          >
            All Opportunities
          </button>

          <button
            type="button"
            className={viewMode === "Recommended" ? "active" : ""}
            onClick={() => setViewMode("Recommended")}
          >
            Recommended
          </button>

          <button
            type="button"
            className={viewMode === "Saved" ? "active" : ""}
            onClick={() => setViewMode("Saved")}
          >
            Saved Jobs ({savedJobs.length})
          </button>
        </div>

        <div className="opportunities-section-heading">
          <div>
            <h2>
              {viewMode === "Saved"
                ? "Your Saved Jobs"
                : viewMode === "Recommended"
                  ? "Recommended Opportunities"
                  : "Latest Opportunities"}
            </h2>

            <p>
              {loading && viewMode !== "Saved"
                ? "Fetching job listings..."
                : `${filteredOpportunities.length} opportunities found`}
            </p>
          </div>

          <span className="saved-count">
            <Bookmark size={15} />
            {savedJobs.length} Saved
          </span>
        </div>

        {loading && viewMode !== "Saved" ? (
          <div className="no-opportunities">
            <h3>Finding recent opportunities for you...</h3>
            <p>Please wait while we load real job listings.</p>
          </div>
        ) : error && viewMode !== "Saved" ? (
          <div className="no-opportunities">
            <h3>Unable to load opportunities</h3>
            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="opportunities-grid">
            {filteredOpportunities.map((opportunity) => {
              const isSaved = savedJobs.includes(opportunity.id);

              return (
                <article
                  className="opportunity-card opportunity-card-compact"
                  key={opportunity.id}
                >
                  <div className="opportunity-card-top">
                    <div className="company-icon">
                      {opportunity.company.charAt(0).toUpperCase()}
                    </div>

                    <button
                      type="button"
                      className={`save-job-button ${
                        isSaved ? "job-saved" : ""
                      }`}
                      onClick={() => toggleSave(opportunity)}
                      aria-label={
                        isSaved
                          ? "Remove saved opportunity"
                          : "Save opportunity"
                      }
                    >
                      {isSaved ? (
                        <BookmarkCheck size={19} />
                      ) : (
                        <Bookmark size={19} />
                      )}
                    </button>
                  </div>

                  <span className="opportunity-type">
                    {opportunity.type}
                  </span>

                  <h3>{opportunity.title}</h3>

                  <p className="opportunity-company">
                    {opportunity.company}
                  </p>

                  <div className="compact-job-info">
                    <span>
                      <MapPin size={15} />
                      {opportunity.location}
                    </span>

                    <span>
                      <Wallet size={15} />
                      {formatSalary(
                        opportunity.salaryMin,
                        opportunity.salaryMax
                      ) || "Salary not specified"}
                    </span>
                  </div>

                  <div className="compact-job-skills">
                    <strong>Skills</strong>

                    {opportunity.skills.length > 0 ? (
                      <div className="opportunity-skills">
                        {opportunity.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className={
                              opportunity.matchingSkills.includes(skill)
                                ? "matching-skill"
                                : ""
                            }
                          >
                            {skill}
                          </span>
                        ))}

                        {opportunity.skills.length > 5 && (
                          <span className="more-skills">
                            +{opportunity.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="compact-no-skills">
                        Skills not specified
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="view-job-details-button"
                    onClick={() => openJobDetails(opportunity)}
                  >
                    View Details
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="no-opportunities">
            <h3>
              {viewMode === "Saved"
                ? "No saved opportunities yet"
                : viewMode === "Recommended"
                  ? "No matching recent recommendations found"
                  : "No recent opportunities found"}
            </h3>

            <p>
              {viewMode === "Saved"
                ? "Save opportunities using the bookmark icon to find them here."
                : "Try changing your search, location or category."}
            </p>
          </div>
        )}

        <p className="live-listings-note">
          Job listings are retrieved from Adzuna. Posting dates are
          provided by the original listing source. Always confirm that
          the vacancy is still open before applying.
        </p>
      </section>

      {/* Full job details popup */}
      {selectedJob && (
        <div
          className="job-details-overlay"
          onClick={() => setSelectedJob(null)}
        >
          <div
            className="job-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-details-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close-job-details"
              onClick={() => setSelectedJob(null)}
              aria-label="Close job details"
            >
              <X size={21} />
            </button>

            <span className="opportunity-type">
              {selectedJob.type}
            </span>

            <h2 id="job-details-title">{selectedJob.title}</h2>

            <p className="opportunity-company">
              {selectedJob.company}
            </p>

            <div className="opportunity-details">
              <span>
                <MapPin size={16} />
                {selectedJob.location}
              </span>

              <span>
                <BriefcaseBusiness size={16} />
                {selectedJob.experience}
              </span>
            </div>

            {(selectedJob.salaryMin || selectedJob.salaryMax) && (
              <p className="job-salary">
                <Wallet size={17} />
                {formatSalary(
                  selectedJob.salaryMin,
                  selectedJob.salaryMax
                )}
              </p>
            )}

            <h3>Job Description</h3>

            <p className="job-details-description">
              {selectedJob.description ||
                "No additional description is available."}
            </p>

            {!selectedJob.unavailable && (
              <>
                <h3>Job Match Analysis</h3>

                <div className="popup-match-score">
                  <strong>
                    {selectedJob.matchPercentage}% Match
                  </strong>

                  <p>
                    {selectedJob.matchPercentage >= 70
                      ? "Your profile is a strong match for this opportunity!"
                      : selectedJob.matchPercentage >= 40
                        ? "You have some relevant skills. Improving the missing skills can strengthen your profile."
                        : "You may need to develop more skills to become a stronger candidate."}
                  </p>
                </div>

                <h4>Your Matching Skills</h4>

                {selectedJob.matchingSkills?.length > 0 ? (
                  <div className="job-skill-tags matched">
                    {selectedJob.matchingSkills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p>No matching skills identified in your profile.</p>
                )}

                <h4>Skills to Improve</h4>

                {selectedJob.missingSkills?.length > 0 ? (
                  <div className="job-skill-tags missing">
                    {selectedJob.missingSkills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p>Great! No missing skills identified.</p>
                )}

                <h3>Skills Identified</h3>

                {selectedJob.skills?.length > 0 ? (
                  <div className="opportunity-skills">
                    {selectedJob.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p>No specific skills identified.</p>
                )}
              </>
            )}

            {selectedJob.postedDate && (
              <p className="job-posted-date">
                <CalendarDays size={16} />
                <strong>
                  {getPostedLabel(selectedJob.postedDate)}
                </strong>
                {" · "}
                {formatDate(selectedJob.postedDate)}
              </p>
            )}

            {selectedJob.applicationUrl && (
              <a
                href={selectedJob.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-job-button"
              >
                Apply Now
                <ExternalLink size={16} />
              </a>
            )}

            {!selectedJob.applicationUrl && (
              <p className="live-listings-note">
                An application link is not available for this listing.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Opportunities;
