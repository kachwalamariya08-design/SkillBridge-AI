import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { createWorker } from "tesseract.js";
import { jsPDF } from "jspdf";

import { useAuth } from "../../context/AuthContext";

import {
  FileSearch,
  Star,
  Lightbulb,
  Target,
  FileText,
  Upload,
  LoaderCircle,
  ChevronDown,
  ChevronUp,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  BriefcaseBusiness,
  GraduationCap,
  Sparkles,
} from "lucide-react";

import "./ResumeChecker.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PROFILE_KEY = "skillBridgeProfile";

const getResumeStorageKey = (accountId) =>
  `skillBridgeResumeAnalysis_${encodeURIComponent(accountId)}`;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

// RESTORE SAVED RESUME DATA FOR THE CURRENT ACCOUNT

const getSavedResumeData = (accountId) => {
  if (!accountId) {
    return { extractedText: "", analysis: null };
  }

  try {
    const savedData = sessionStorage.getItem(
      getResumeStorageKey(accountId)
    );

    return savedData
      ? JSON.parse(savedData)
      : { extractedText: "", analysis: null };
  } catch (error) {
    console.error("Unable to restore resume data:", error);
    return { extractedText: "", analysis: null };
  }
};

// SKILLS RELEVANT TO DIFFERENT CAREER ROLES

const roleSkills = {
  // ENGINEERING & TECHNOLOGY

  "React Developer": [
    "React",
    "JavaScript",
    "HTML",
    "CSS",
    "Git",
    "REST APIs",
    "Components",
    "Hooks",
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

  "Full Stack Developer": [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Databases",
    "APIs",
    "Git",
  ],

  "Software Engineer": [
    "Programming",
    "Data Structures",
    "Algorithms",
    "OOP",
    "Problem Solving",
    "Git",
    "Software Development",
  ],

  // COMMERCE

  Accountant: [
    "Accounting",
    "Bookkeeping",
    "Financial Reporting",
    "GST",
    "Tally",
    "Excel",
  ],

  "Financial Analyst": [
    "Financial Analysis",
    "Excel",
    "Financial Modelling",
    "Budgeting",
    "Data Analysis",
    "Forecasting",
  ],

  "Marketing Executive": [
    "Digital Marketing",
    "Market Research",
    "SEO",
    "Social Media Marketing",
    "Content Marketing",
    "Communication",
  ],

  "Business Analyst": [
    "Business Analysis",
    "Data Analysis",
    "Excel",
    "Market Research",
    "Reporting",
    "Problem Solving",
  ],

  // ARTS & HUMANITIES

  "Content Writer": [
    "Content Writing",
    "Research",
    "Editing",
    "Proofreading",
    "Communication",
    "SEO",
  ],

  Journalist: [
    "Journalism",
    "News Writing",
    "Research",
    "Reporting",
    "Editing",
    "Communication",
  ],

  "Graphic Designer": [
    "Graphic Design",
    "Typography",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Visual Design",
    "Creativity",
  ],

  Teacher: [
    "Teaching",
    "Lesson Planning",
    "Classroom Management",
    "Communication",
    "Research",
  ],

  // MANAGEMENT

  "Business Manager": [
    "Business Management",
    "Leadership",
    "Strategic Planning",
    "Decision Making",
    "Team Management",
  ],

  "Project Manager": [
    "Project Management",
    "Planning",
    "Leadership",
    "Risk Management",
    "Communication",
    "Coordination",
  ],

  "Human Resource Manager": [
    "Recruitment",
    "Human Resources",
    "Employee Relations",
    "Performance Management",
    "Communication",
  ],

  "Operations Manager": [
    "Operations Management",
    "Process Improvement",
    "Planning",
    "Team Management",
    "Problem Solving",
  ],

  // SCIENCE

  "Data Analyst": [
    "Data Analysis",
    "Excel",
    "Statistics",
    "SQL",
    "Data Visualization",
    "Python",
  ],

  "Research Assistant": [
    "Research",
    "Data Collection",
    "Data Analysis",
    "Documentation",
    "Scientific Writing",
  ],

  "Laboratory Technician": [
    "Laboratory Techniques",
    "Sample Preparation",
    "Testing",
    "Documentation",
    "Laboratory Safety",
  ],

  // MEDICAL & HEALTHCARE

  Nurse: [
    "Patient Care",
    "Clinical Documentation",
    "Patient Monitoring",
    "First Aid",
    "Communication",
  ],

  "Healthcare Administrator": [
    "Healthcare Administration",
    "Medical Records",
    "Hospital Management",
    "Coordination",
    "Communication",
  ],

  "Medical Laboratory Technician": [
    "Laboratory Testing",
    "Sample Collection",
    "Clinical Laboratory",
    "Quality Control",
    "Documentation",
  ],

  // LAW

  Lawyer: [
    "Legal Research",
    "Legal Drafting",
    "Case Analysis",
    "Client Communication",
    "Negotiation",
  ],

  "Legal Advisor": [
    "Legal Research",
    "Contract Review",
    "Legal Documentation",
    "Compliance",
    "Communication",
  ],

  Paralegal: [
    "Legal Research",
    "Case Management",
    "Documentation",
    "Legal Drafting",
    "Organization",
  ],

  // DESIGN & CREATIVE ARTS

  "UI/UX Designer": [
    "UI Design",
    "UX Research",
    "Wireframing",
    "Prototyping",
    "Figma",
    "User Testing",
  ],

  "Fashion Designer": [
    "Fashion Design",
    "Illustration",
    "Pattern Making",
    "Textile Knowledge",
    "Creativity",
  ],

  "Video Editor": [
    "Video Editing",
    "Adobe Premiere Pro",
    "Adobe After Effects",
    "Storytelling",
    "Visual Communication",
  ],

  // VOCATIONAL STUDIES

  Electrician: [
    "Electrical Installation",
    "Troubleshooting",
    "Electrical Safety",
    "Maintenance",
  ],

  Technician: [
    "Technical Maintenance",
    "Troubleshooting",
    "Equipment Handling",
    "Safety Procedures",
  ],

  "Hospitality Professional": [
    "Customer Service",
    "Guest Relations",
    "Hospitality Management",
    "Communication",
  ],
};

// GENERAL SKILLS FOR EACH EDUCATIONAL STREAM

const streamSkills = {
  "Engineering & Technology": [
    "Problem Solving",
    "Programming",
    "Technical Skills",
    "Project Development",
    "Testing",
    "Documentation",
  ],

  Commerce: [
    "Accounting",
    "Financial Analysis",
    "Excel",
    "Business Communication",
    "Bookkeeping",
    "Market Research",
  ],

  "Arts & Humanities": [
    "Communication",
    "Writing",
    "Research",
    "Critical Thinking",
    "Editing",
    "Presentation",
  ],

  Management: [
    "Leadership",
    "Team Management",
    "Planning",
    "Decision Making",
    "Communication",
    "Coordination",
  ],

  Science: [
    "Research",
    "Data Analysis",
    "Scientific Documentation",
    "Laboratory Skills",
    "Critical Thinking",
  ],

  "Medical & Healthcare": [
    "Patient Care",
    "Healthcare Knowledge",
    "Clinical Documentation",
    "Communication",
    "Patient Safety",
  ],

  Law: [
    "Legal Research",
    "Case Analysis",
    "Legal Writing",
    "Documentation",
    "Critical Thinking",
  ],

  "Design & Creative Arts": [
    "Creativity",
    "Visual Design",
    "Design Research",
    "Presentation",
    "Portfolio Development",
  ],

  "Vocational Studies": [
    "Practical Skills",
    "Technical Skills",
    "Safety Procedures",
    "Equipment Handling",
    "Problem Solving",
  ],

  Other: [
    "Communication",
    "Research",
    "Problem Solving",
    "Teamwork",
    "Organization",
  ],
};

// BASIC + PERSONALIZED RESUME ANALYSIS

const analyzeResumeText = (text, profile) => {
  const lowerText = text.toLowerCase();

  const checks = [
    {
      name: "Contact Information",
      found:
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text) &&
        /\b\d[\d\s()+-]{8,}\d\b/.test(text),
      detail: "Email address and phone number",
    },
    {
      name: "Professional Summary",
      found:
        /\b(summary|objective|profile|about me|career objective|professional profile)\b/i.test(
          text
        ),
      detail: "A short introduction about your professional profile",
    },
    {
      name: "Education",
      found:
        /\b(education|academic background|academic qualifications|university|college|degree|bachelor|master|diploma|undergraduate|postgraduate|b\.?tech|b\.?e\.?|b\.?sc|b\.?com|b\.?a\.?|bba|mba|llb|mbbs|phd)\b/i.test(
          text
        ),
      detail: "Your qualifications and educational background",
    },
    {
      name: "Skills & Competencies",
      found:
        /\b(skills|technical skills|professional skills|core competencies|competencies|key skills|expertise|soft skills)\b/i.test(
          text
        ),
      detail:
        "Relevant technical, academic and professional skills",
    },
    {
      name: "Projects / Practical Work",
      found:
        /\b(projects|personal projects|academic projects|case studies|portfolio|practical work|assignments)\b/i.test(
          text
        ),
      detail:
        "Projects, practical work or portfolio examples demonstrating your abilities",
    },
    {
      name: "Experience / Internships",
      found:
        /\b(experience|work experience|internship|internships|employment|professional experience|volunteer experience|training)\b/i.test(
          text
        ),
      detail:
        "Your work experience, internships, training or volunteering",
    },
    {
      name: "Certifications",
      found:
        /\b(certifications|certificates|certification|courses completed|professional courses|training certificates)\b/i.test(
          text
        ),
      detail: "Relevant certifications and completed courses",
    },
    {
      name: "Achievements",
      found:
        /\b(achievements|awards|accomplishments|honors|recognition|competitions)\b/i.test(
          text
        ),
      detail: "Awards, accomplishments and recognitions",
    },
  ];

  const email = text.match(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  );

  const phone = text.match(/\b(?:\+?\d[\d\s()-]{8,}\d)\b/);

  const linkedin = /linkedin\.com/i.test(lowerText);
  const github = /github\.com/i.test(lowerText);

  const portfolio =
    /portfolio|personal website|behance\.net|dribbble\.com/i.test(
      lowerText
    );

  const wordCount = text
    .split(/\s+/)
    .filter((word) => word.trim().length > 0).length;

  const strengths = [];
  const improvements = [];

  // CONTACT DETAILS

  if (email) {
    strengths.push("An email address is present.");
  } else {
    improvements.push("Add a professional email address.");
  }

  if (phone) {
    strengths.push("A phone number is present.");
  } else {
    improvements.push("Add a reachable phone number.");
  }

  // PROFESSIONAL LINKS

  if (linkedin) {
    strengths.push("Your resume includes a LinkedIn profile.");
  } else {
    improvements.push("Consider adding your LinkedIn profile link.");
  }

  if (github) {
    strengths.push("Your resume includes a GitHub profile.");
  } else {
    improvements.push(
      "Consider adding a relevant GitHub profile or another platform where you showcase your work."
    );
  }

  if (portfolio) {
    strengths.push("A portfolio or personal website is mentioned.");
  } else {
    improvements.push(
      "Consider adding a portfolio, personal website or work samples relevant to your career."
    );
  }

  // SECTION CHECKS

  const foundSections = checks.filter((item) => item.found);
  const missingSections = checks.filter((item) => !item.found);

  if (checks.find((item) => item.name === "Education").found) {
    strengths.push("An education section appears to be present.");
  }

  if (
    checks.find((item) => item.name === "Skills & Competencies").found
  ) {
    strengths.push(
      "A skills or competencies section appears to be present."
    );
  }

  if (
    checks.find((item) => item.name === "Projects / Practical Work").found
  ) {
    strengths.push(
      "A projects or practical work section appears to be present."
    );
  }

  if (
    checks.find((item) => item.name === "Experience / Internships").found
  ) {
    strengths.push(
      "Experience, internship or training details appear to be included."
    );
  }

  // RESUME LENGTH

  if (wordCount < 100) {
    improvements.push(
      "Very little text was extracted. Check whether the PDF was scanned clearly and whether all pages were read."
    );
  } else if (wordCount > 1000) {
    improvements.push(
      "Your resume contains a lot of text. Review it for repetition and unnecessary details."
    );
  }

  // ACTION VERBS

  const actionVerbs =
    /\b(developed|designed|created|built|managed|implemented|improved|led|organized|analyzed|achieved|delivered|optimized|coordinated|researched|prepared|assisted|conducted|evaluated|presented|produced|maintained|supported)\b/i.test(
      text
    );

  if (actionVerbs) {
    strengths.push(
      "Action-oriented language appears in your resume."
    );
  } else {
    improvements.push(
      "Start bullet points with strong action verbs such as Developed, Designed, Researched, Managed or Coordinated."
    );
  }

  // MEASURABLE RESULTS

  const hasNumbers =
    /\b\d+%|\b\d+\+|\b\d+\s*(users|projects|clients|hours|months|years|students|events|reports|cases|patients)\b/i.test(
      text
    );

  if (hasNumbers) {
    strengths.push(
      "Your resume includes some measurable numbers or results."
    );
  } else {
    improvements.push(
      "Where possible, include measurable results such as percentages, project counts, clients served or time saved."
    );
  }

  // PERSONALIZED ANALYSIS USING THE SAVED PROFILE

  const targetRole = profile?.targetRole || "";
  const educationalStream = profile?.educationalStream || "";

  const course =
    profile?.customCourse || profile?.course || "";

  const selectedSkills = Array.isArray(profile?.selectedSkills)
    ? profile.selectedSkills
    : [];

  const roleKey = Object.keys(roleSkills).find(
    (role) => role.toLowerCase() === targetRole.toLowerCase()
  );

  const relevantSkills = roleKey
    ? roleSkills[roleKey]
    : streamSkills[educationalStream] || [];

  const containsSkill = (skill) => {
    const normalizedSkill = String(skill).toLowerCase().trim();

    return (
      normalizedSkill.length > 0 &&
      lowerText.includes(normalizedSkill)
    );
  };

  const profileSkillsFound = selectedSkills.filter(containsSkill);

  const profileSkillsMissing = selectedSkills.filter(
    (skill) => !containsSkill(skill)
  );

  const roleSkillsFound = relevantSkills.filter(containsSkill);

  const roleSkillsMissing = relevantSkills.filter(
    (skill) => !containsSkill(skill)
  );

  const hasProjects = checks.find(
    (item) => item.name === "Projects / Practical Work"
  ).found;

  const projectSuggestion = hasProjects
    ? "Your resume includes a projects or practical work section. Explain your contribution, the skills you applied and the outcome of each example."
    : `Consider adding projects, practical assignments, case studies or portfolio work relevant to ${
        targetRole || educationalStream || "your career goal"
      }.`;

  return {
    wordCount,
    checks,
    foundSections,
    missingSections,
    strengths,
    improvements,
    targetRole,
    educationalStream,
    course,
    hasProfile: Boolean(profile),
    profileSkillsFound,
    profileSkillsMissing,
    roleSkillsFound,
    roleSkillsMissing,
    projectSuggestion,
  };
};

// CHECK WHETHER THE UPLOADED DOCUMENT LOOKS LIKE A RESUME

const isLikelyResume = (text) => {
  const contactInformation =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text) ||
    /\b\d[\d\s()+-]{8,}\d\b/.test(text);

  const coreSections = [
    /\b(summary|professional summary|career objective|objective|profile)\b/i,
    /\b(education|academic background|academic qualifications|university|degree)\b/i,
    /\b(skills|technical skills|professional skills|core competencies|competencies|expertise)\b/i,
    /\b(projects|personal projects|academic projects|case studies|portfolio|practical work)\b/i,
    /\b(experience|work experience|employment|professional experience|volunteer experience)\b/i,
    /\b(internship|internships|training)\b/i,
    /\b(certifications|certificates|achievements|awards)\b/i,
  ];

  const detectedSections = coreSections.filter((pattern) =>
    pattern.test(text)
  ).length;

  return (
    detectedSections >= 2 &&
    (contactInformation || detectedSections >= 3)
  );
};

function ResumeChecker() {
  const fileInputRef = useRef(null);

  // AUTHENTICATED ACCOUNT

  const { accountId, loading: authLoading } = useAuth();

  // RESUME CHECKER STATE

  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [readingStatus, setReadingStatus] = useState("");
  const [readingProgress, setReadingProgress] = useState(0);
  const [analysis, setAnalysis] = useState(null);

  // TRACK WHICH ACCOUNT'S DATA HAS BEEN LOADED

  const [loadedAccountId, setLoadedAccountId] = useState("");

  // LOAD THE CURRENT ACCOUNT'S SAVED RESUME DATA

  useEffect(() => {
    if (authLoading) return;

    if (!accountId) {
      setResume(null);
      setExtractedText("");
      setAnalysis(null);
      setLoadedAccountId("");
      setError("");
      setMessage("");
      setReadingProgress(0);
      setReadingStatus("");
      setShowExtractedText(false);

      return;
    }

    const savedData = getSavedResumeData(accountId);

    setResume(null);
    setExtractedText(savedData.extractedText || "");
    setAnalysis(savedData.analysis || null);

    setError("");
    setMessage("");
    setReadingProgress(0);
    setReadingStatus("");
    setShowExtractedText(false);

    setLoadedAccountId(accountId);
  }, [accountId, authLoading]);

  // SAVE RESUME DATA UNDER THE CURRENT ACCOUNT

  useEffect(() => {
    if (
      authLoading ||
      !accountId ||
      loadedAccountId !== accountId
    ) {
      return;
    }

    const storageKey = getResumeStorageKey(accountId);

    try {
      if (!extractedText && !analysis) {
        sessionStorage.removeItem(storageKey);
        return;
      }

      sessionStorage.setItem(
        storageKey,
        JSON.stringify({
          extractedText,
          analysis,
        })
      );
    } catch (error) {
      console.error("Unable to save resume analysis:", error);
    }
  }, [
    extractedText,
    analysis,
    accountId,
    authLoading,
    loadedAccountId,
  ]);

  // RESET THE RESUME CHECKER

  const resetResumeChecker = () => {
    setResume(null);
    setError("");
    setMessage("");
    setExtractedText("");
    setAnalysis(null);
    setReadingProgress(0);
    setReadingStatus("");
    setIsDragging(false);
    setShowExtractedText(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (accountId) {
      sessionStorage.removeItem(getResumeStorageKey(accountId));
    }
  };

  // VALIDATE UPLOADED FILE

  const validateFile = (file) => {
    setError("");
    setMessage("");
    setExtractedText("");
    setAnalysis(null);
    setReadingProgress(0);
    setReadingStatus("");
    setShowExtractedText(false);

    if (!file) return;

    const isPDF =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setResume(null);
      setError("Please upload a PDF file only.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setResume(null);
      setError("File size must be less than 5 MB.");
      return;
    }

    if (file.size === 0) {
      setResume(null);
      setError("The selected file is empty.");
      return;
    }

    setResume(file);
  };

  const handleFileChange = (event) => {
    validateFile(event.target.files[0]);
    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    validateFile(event.dataTransfer.files[0]);
  };

  const removeResume = () => {
    resetResumeChecker();
  };

  const formatFileSize = (size) => {
    return size < 1024 * 1024
      ? `${(size / 1024).toFixed(1)} KB`
      : `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  // EXTRACT TEXT FROM THE UPLOADED PDF

  const extractPDFText = async () => {
    if (!accountId || loadedAccountId !== accountId) {
      setError("Please wait until your account data has loaded.");
      return;
    }

    if (!resume) {
      setError("Please upload your resume first.");
      return;
    }

    setIsReading(true);
    setShowExtractedText(false);
    setError("");
    setMessage("");
    setExtractedText("");
    setAnalysis(null);
    setReadingProgress(0);
    setReadingStatus("Opening your PDF...");

    let ocrWorker = null;
    let pdf = null;

    try {
      const arrayBuffer = await resume.arrayBuffer();

      pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
      }).promise;

      // FIRST PASS: EXTRACT EMBEDDED PDF TEXT

      const pages = [];
      let totalEmbeddedTextLength = 0;

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        setReadingStatus(
          `Reading page ${pageNumber} of ${pdf.numPages}...`
        );

        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => ("str" in item ? item.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();

        pages.push({ pageNumber, page, pageText });

        totalEmbeddedTextLength += pageText.length;

        setReadingProgress(
          Math.round((pageNumber / pdf.numPages) * 45)
        );
      }

      // USE OCR ONLY WHEN THE PDF CONTAINS VERY LITTLE EMBEDDED TEXT

      const needsOCR =
        totalEmbeddedTextLength < Math.max(80, pdf.numPages * 60);

      if (needsOCR) {
        setReadingStatus(
          "This looks like a scanned PDF. Preparing text recognition..."
        );

        ocrWorker = await createWorker("eng", undefined, {
          logger: (info) => {
            if (
              info.status === "recognizing text" &&
              typeof info.progress === "number"
            ) {
              setReadingProgress(
                Math.min(99, Math.round(45 + info.progress * 50))
              );
            }
          },
        });
      }

      let completeText = "";

      for (let index = 0; index < pages.length; index++) {
        const { pageNumber, page, pageText } = pages[index];

        let finalPageText = pageText;

        // OCR ONLY SPARSE PAGES

        if (needsOCR && pageText.length < 30) {
          setReadingStatus(
            `Recognizing text on page ${pageNumber} of ${pdf.numPages}...`
          );

          const viewport = page.getViewport({ scale: 1.35 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (!context) {
            throw new Error("Unable to create canvas for OCR.");
          }

          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);

          try {
            await page.render({
              canvas,
              canvasContext: context,
              viewport,
            }).promise;

            const result = await ocrWorker.recognize(canvas);

            finalPageText = result.data.text.trim();
          } finally {
            canvas.width = 0;
            canvas.height = 0;
          }
        }

        completeText += `\n\nPage ${pageNumber}\n${finalPageText}`;

        setReadingProgress(
          Math.min(
            99,
            Math.round(45 + ((index + 1) / pages.length) * 50)
          )
        );

        page.cleanup();
      }

      const cleanedText = completeText.trim();

      if (
        !cleanedText ||
        !cleanedText.replace(/Page \d+/g, "").trim()
      ) {
        setError(
          "We couldn't recognize readable text in this PDF. Please try a clearer resume."
        );

        setReadingStatus("");
        setReadingProgress(0);
        return;
      }

      if (!isLikelyResume(cleanedText)) {
        setError(
          "This document doesn't appear to be a resume. Please upload a valid resume PDF containing your contact information, education, skills, projects or experience."
        );

        setReadingStatus("");
        setReadingProgress(0);
        return;
      }

      // UPDATE THE UI AND ACCOUNT-SPECIFIC SESSION STORAGE

      setExtractedText(cleanedText);
      setShowExtractedText(false);
      setReadingProgress(100);
      setReadingStatus("Reading completed!");
      setMessage("Your resume was read successfully!");

      try {
        if (accountId && loadedAccountId === accountId) {
          sessionStorage.setItem(
            getResumeStorageKey(accountId),
            JSON.stringify({
              extractedText: cleanedText,
              analysis: null,
            })
          );
        }
      } catch (storageError) {
        console.error(
          "Unable to save extracted resume text:",
          storageError
        );
      }
    } catch (err) {
      console.error("Resume reading error:", err);

      setError(
        "Unable to read this PDF. Please try another valid, non-password-protected PDF."
      );

      setReadingStatus("");
      setReadingProgress(0);
    } finally {
      setIsReading(false);

      if (ocrWorker) {
        try {
          await ocrWorker.terminate();
        } catch (cleanupError) {
          console.error(
            "Unable to stop the OCR worker:",
            cleanupError
          );
        }
      }

      if (pdf) {
        try {
          await pdf.destroy();
        } catch (cleanupError) {
          console.error(
            "Unable to close the PDF:",
            cleanupError
          );
        }
      }
    }
  };

  // ANALYZE THE EXTRACTED RESUME

  const handleAnalyzeResume = () => {
    if (!extractedText) return;

    let savedProfile = null;

    try {
      const storedProfile = localStorage.getItem(PROFILE_KEY);

      if (storedProfile) {
        savedProfile = JSON.parse(storedProfile);
      }
    } catch (err) {
      console.error("Unable to read saved profile:", err);
    }

    const result = analyzeResumeText(extractedText, savedProfile);

    setAnalysis(result);
    setMessage("Your personalized resume analysis is ready!");
  };

  // CREATE A DOWNLOADABLE PDF OF THE CURRENT ANALYSIS

  const downloadAnalysisPDF = () => {
    if (!analysis) return;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const margin = 15;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    const addPageIfNeeded = (requiredHeight = 10) => {
      if (y + requiredHeight > pageHeight - margin) {
        doc.addPage();
        y = 20;
      }
    };

    const addHeading = (heading) => {
      addPageIfNeeded(14);

      y += 4;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(heading, margin, y);

      y += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
    };

    const addParagraph = (value) => {
      if (!value) return;

      const lines = doc.splitTextToSize(
        String(value),
        contentWidth
      );

      const lineHeight = 5;

      addPageIfNeeded(lines.length * lineHeight + 2);

      for (const line of lines) {
        addPageIfNeeded(lineHeight);
        doc.text(line, margin, y);
        y += lineHeight;
      }

      y += 1;
    };

    const addList = (items, emptyMessage) => {
      if (!items || items.length === 0) {
        addParagraph(emptyMessage);
        return;
      }

      items.forEach((item) => {
        const lines = doc.splitTextToSize(
          `- ${String(item)}`,
          contentWidth - 2
        );

        const lineHeight = 5;

        addPageIfNeeded(lines.length * lineHeight + 1);

        lines.forEach((line) => {
          addPageIfNeeded(lineHeight);
          doc.text(line, margin + 2, y);
          y += lineHeight;
        });
      });

      y += 1;
    };

    // REPORT HEADER

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("SkillBridge AI", margin, y);

    y += 9;

    doc.setFontSize(16);
    doc.text("Resume Analysis Report", margin, y);

    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);

    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      margin,
      y
    );

    y += 7;

    // STUDENT PROFILE DETAILS

    addParagraph(
      `Target career role: ${analysis.targetRole || "Not specified"}`
    );

    addParagraph(
      `Educational stream: ${
        analysis.educationalStream || "Not specified"
      }`
    );

    addParagraph(
      `Course: ${analysis.course || "Not specified"}`
    );

    addParagraph(
      `Words detected in resume: ${analysis.wordCount}`
    );

    addParagraph(
      `Sections detected: ${analysis.foundSections.length} of ${analysis.checks.length}`
    );

    // SECTION CHECKLIST

    addHeading("Section Checklist");

    analysis.checks.forEach((item) => {
      addParagraph(
        `${item.found ? "[Detected]" : "[Not detected]"} ${
          item.name
        } - ${item.found ? "Section detected" : item.detail}`
      );
    });

    // PERSONALIZED SKILLS

    if (analysis.hasProfile) {
      addHeading("Profile Skills Found in Resume");

      addList(
        analysis.profileSkillsFound,
        "No selected profile skills were clearly detected."
      );

      addHeading("Profile Skills Not Detected");

      addList(
        analysis.profileSkillsMissing,
        "All selected profile skills were detected in the extracted text."
      );

      if (analysis.targetRole || analysis.educationalStream) {
        addHeading(
          `Skills Relevant to ${
            analysis.targetRole || analysis.educationalStream
          }`
        );

        addParagraph("Skills detected:");

        addList(
          analysis.roleSkillsFound,
          "No relevant skills from the current checklist were detected."
        );

        addParagraph("Skills not detected:");

        addList(
          analysis.roleSkillsMissing,
          "All skills in the current checklist were detected."
        );
      }

      addHeading("Project / Practical Work Suggestion");
      addParagraph(analysis.projectSuggestion);
    } else {
      addHeading("Personalized Career Suggestions");

      addParagraph(
        "No saved SkillBridge profile was found when this analysis was created. Create a profile and select an educational stream and career goal to receive personalized suggestions."
      );
    }

    // STRENGTHS

    addHeading("Resume Strengths");

    addList(
      analysis.strengths,
      "No clear strengths could be identified yet."
    );

    // IMPROVEMENTS

    addHeading("Improvement Suggestions");

    addList(
      analysis.improvements,
      "No basic improvement suggestions were triggered. A deeper review may still identify opportunities."
    );

    // DISCLAIMER

    addHeading("Important Note");

    addParagraph(
      "This is an initial automated checklist, not a professional assessment or an ATS compatibility score. It checks for keywords and common resume sections; it does not verify the accuracy or quality of every detail."
    );

    // DOWNLOAD WITHOUT CLEARING THE CURRENT ANALYSIS

    doc.save("SkillBridge-Resume-Analysis.pdf");
  };

  return (
    <main className="resume-checker-page">
      {/* HERO SECTION */}

      <section className="resume-checker-hero">
        <p className="resume-eyebrow">
          CAREER DEVELOPMENT TOOL
        </p>

        <h1>
          Resume Checker
          <FileText
            size={36}
            strokeWidth={1.8}
            className="resume-heading-icon"
          />
        </h1>

        <p>
          Make your resume stronger and take the next step towards
          your career goals. Upload your resume to get started.
        </p>
      </section>

      {/* UPLOAD SECTION */}

      <section className="resume-upload-card">
        <div className="resume-upload-heading">
          <h2>Upload Your Resume</h2>
          <p>Choose your resume in PDF format.</p>
        </div>

        <div
          className={`resume-drop-area ${
            isDragging ? "dragging" : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="resume-upload-icon">
            <Upload size={36} strokeWidth={1.8} />
          </div>

          <h3>Drag and drop your resume here</h3>
          <p>or</p>

          <button
            type="button"
            className="resume-browse-button"
            onClick={() => fileInputRef.current?.click()}
          >
            Browse Files
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            hidden
          />

          <span className="resume-file-note">
            PDF format only · Maximum file size: 5 MB
          </span>
        </div>

        {/* ERROR MESSAGE */}

        {error && (
          <p className="resume-error" role="alert">
            <AlertCircle size={17} />
            {error}
          </p>
        )}

        {/* SELECTED FILE */}

        {resume && (
          <div className="resume-selected-file">
            <div className="resume-file-info">
              <span className="resume-file-icon">
                <File size={25} />
              </span>

              <div>
                <h4>{resume.name}</h4>
                <p>{formatFileSize(resume.size)}</p>
              </div>
            </div>

            <button
              type="button"
              className="resume-remove-button"
              onClick={removeResume}
              aria-label="Remove uploaded resume"
              disabled={isReading}
            >
              <X size={19} />
            </button>
          </div>
        )}

        {/* READ RESUME BUTTON */}

        <button
          type="button"
          className="resume-analyze-button"
          onClick={extractPDFText}
          disabled={
            !resume ||
            isReading ||
            authLoading ||
            !accountId ||
            loadedAccountId !== accountId
          }
        >
          {isReading ? "Reading Resume..." : "Read Resume →"}
        </button>

        {/* READING PROGRESS */}

        {isReading && (
          <div className="resume-reading-progress">
            <div className="resume-progress-heading">
              <span>{readingStatus}</span>
              <span>{readingProgress}%</span>
            </div>

            <div className="resume-progress-track">
              <div
                className="resume-progress-fill"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* SUCCESS MESSAGE */}

        {message && (
          <p className="resume-success" role="status">
            <CheckCircle2 size={17} />
            {message}
          </p>
        )}
      </section>

      {/* COMPACT EXTRACTION LOADING INDICATOR */}

      {isReading && (
        <section className="resume-extraction-compact">
          <LoaderCircle
            size={22}
            className="resume-loading-icon"
          />

          <div>
            <h3>Extracting Resume Content</h3>
            <p>Please wait while we read your resume.</p>
          </div>
        </section>
      )}

      {/* COLLAPSIBLE EXTRACTED RESUME */}

      {extractedText && !isReading && (
        <section className="resume-text-preview">
          <div className="resume-preview-compact">
            <div className="resume-preview-info">
              <FileText size={23} />

              <div>
                <h3>Resume Text Extracted Successfully</h3>
                <p>Your resume is ready for review.</p>
              </div>
            </div>

            <button
              type="button"
              className="resume-view-text-button"
              onClick={() =>
                setShowExtractedText((previous) => !previous)
              }
              aria-expanded={showExtractedText}
            >
              {showExtractedText ? (
                <>
                  Hide Extracted Resume
                  <ChevronUp size={17} />
                </>
              ) : (
                <>
                  View Extracted Resume
                  <ChevronDown size={17} />
                </>
              )}
            </button>
          </div>

          {showExtractedText && (
            <div className="resume-extracted-content">
              <pre>{extractedText}</pre>
            </div>
          )}

          <button
            type="button"
            className="resume-analyze-button"
            onClick={handleAnalyzeResume}
            disabled={!extractedText || isReading}
          >
            Analyze My Resume
          </button>
        </section>
      )}

      {/* ANALYSIS REPORT */}

      {analysis && (
        <section className="resume-analysis-section">
          <div className="resume-analysis-header">
            <p className="resume-eyebrow">
              YOUR RESUME REPORT
            </p>

            <h2>Resume Analysis</h2>

            <p>
              Here's a basic review of the information found in
              your resume.
            </p>
          </div>

          {/* ANALYSIS OVERVIEW */}

          <div className="resume-analysis-overview">
            <div className="resume-overview-card">
              <FileText size={25} />
              <h3>{analysis.wordCount}</h3>
              <p>Words detected</p>
            </div>

            <div className="resume-overview-card">
              <CheckCircle2 size={25} />
              <h3>{analysis.foundSections.length}</h3>
              <p>Sections detected</p>
            </div>

            <div className="resume-overview-card">
              <AlertCircle size={25} />
              <h3>{analysis.missingSections.length}</h3>
              <p>Sections not detected</p>
            </div>
          </div>

          {/* DOWNLOAD REPORT */}

          <button
            type="button"
            className="resume-analyze-button"
            onClick={downloadAnalysisPDF}
          >
            <FileText size={18} />
            Download Analysis Report
          </button>

          {/* PERSONALIZED CAREER ANALYSIS */}

          <div className="resume-report-card resume-personalized-card">
            <p className="resume-eyebrow">
              PERSONALIZED REVIEW
            </p>

            <h3>
              <Target size={21} />
              Career-Based Resume Suggestions
            </h3>

            {analysis.hasProfile ? (
              <>
                <div className="resume-profile-details">
                  <p className="resume-personalized-role">
                    <GraduationCap size={17} />
                    Educational stream:{" "}
                    <strong>
                      {analysis.educationalStream ||
                        "Not specified"}
                    </strong>
                  </p>

                  <p className="resume-personalized-role">
                    <FileText size={17} />
                    Course:{" "}
                    <strong>
                      {analysis.course || "Not specified"}
                    </strong>
                  </p>

                  <p className="resume-personalized-role">
                    <BriefcaseBusiness size={17} />
                    Your saved career goal:{" "}
                    <strong>
                      {analysis.targetRole || "Not selected"}
                    </strong>
                  </p>
                </div>

                {/* PROFILE SKILLS */}

                <div className="resume-personalized-grid">
                  <div className="resume-personalized-box">
                    <h4>
                      <CheckCircle2 size={17} />
                      Skills Found in Your Resume
                    </h4>

                    {analysis.profileSkillsFound.length > 0 ? (
                      <ul>
                        {analysis.profileSkillsFound.map(
                          (skill) => (
                            <li key={skill}>{skill}</li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        No selected profile skills were clearly
                        detected.
                      </p>
                    )}
                  </div>

                  <div className="resume-personalized-box">
                    <h4>
                      <AlertCircle size={17} />
                      Profile Skills Not Detected
                    </h4>

                    {analysis.profileSkillsMissing.length > 0 ? (
                      <>
                        <ul>
                          {analysis.profileSkillsMissing.map(
                            (skill) => (
                              <li key={skill}>{skill}</li>
                            )
                          )}
                        </ul>

                        <p className="resume-personalized-hint">
                          If you genuinely have these skills,
                          consider adding them to your resume
                          with examples.
                        </p>
                      </>
                    ) : (
                      <p>
                        All your selected profile skills were
                        detected in the extracted resume text.
                      </p>
                    )}
                  </div>
                </div>

                {/* ROLE OR STREAM SKILLS */}

                {(analysis.targetRole ||
                  analysis.educationalStream) && (
                  <div className="resume-role-skills">
                    <h4>
                      Skills Relevant to{" "}
                      {analysis.targetRole ||
                        analysis.educationalStream}
                    </h4>

                    <p>
                      These are common skills associated with
                      your selected career goal or educational
                      stream. The check only looks for their
                      keywords in your resume.
                    </p>

                    <div className="resume-skill-tags">
                      {analysis.roleSkillsFound.map((skill) => (
                        <span
                          className="resume-skill-found"
                          key={skill}
                        >
                          <CheckCircle2 size={14} />
                          {skill}
                        </span>
                      ))}

                      {analysis.roleSkillsMissing.map((skill) => (
                        <span
                          className="resume-skill-missing"
                          key={skill}
                        >
                          <AlertCircle size={14} />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* PROJECT SUGGESTION */}

                <div className="resume-project-suggestion">
                  <h4>
                    <Lightbulb size={18} />
                    Project / Practical Work Suggestion
                  </h4>

                  <p>{analysis.projectSuggestion}</p>
                </div>
              </>
            ) : (
              <p>
                No saved SkillBridge profile was found. Create
                your profile and select an educational stream
                and career goal to receive personalized resume
                suggestions.
              </p>
            )}
          </div>

          {/* SECTION CHECKLIST */}

          <div className="resume-report-card">
            <h3>Section Checklist</h3>

            <div className="resume-check-list">
              {analysis.checks.map((item) => (
                <div
                  className="resume-check-item"
                  key={item.name}
                >
                  <span
                    className={
                      item.found
                        ? "check-found"
                        : "check-missing"
                    }
                  >
                    {item.found ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <AlertCircle size={20} />
                    )}
                  </span>

                  <div>
                    <h4>{item.name}</h4>
                    <p>
                      {item.found
                        ? "Section detected"
                        : item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* STRENGTHS AND IMPROVEMENTS */}

          <div className="resume-report-grid">
            <div className="resume-report-card">
              <h3>
                <Star size={20} />
                Resume Strengths
              </h3>

              {analysis.strengths.length > 0 ? (
                <ul>
                  {analysis.strengths.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  No clear strengths could be identified yet.
                </p>
              )}
            </div>

            <div className="resume-report-card">
              <h3>
                <Lightbulb size={20} />
                Improvement Suggestions
              </h3>

              {analysis.improvements.length > 0 ? (
                <ul>
                  {analysis.improvements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p>
                  No basic improvement suggestions were
                  triggered. A deeper review may still identify
                  opportunities.
                </p>
              )}
            </div>
          </div>

          {/* DISCLAIMER */}

          <p className="resume-analysis-note">
            This is an initial automated checklist, not a
            professional assessment or an ATS compatibility
            score. It checks for keywords and common resume
            sections; it does not verify the accuracy or quality
            of every detail.
          </p>
        </section>
      )}

      {/* FEATURE SECTION */}

      <section className="resume-features">
        <h2>What Will Your Resume Check Include?</h2>

        <div className="resume-feature-grid">
          <div className="resume-feature-card">
            <span className="resume-feature-icon">
              <FileSearch size={26} strokeWidth={1.8} />
            </span>

            <h3>Resume Review</h3>

            <p>
              Identify common mistakes and missing information.
            </p>
          </div>

          <div className="resume-feature-card">
            <span className="resume-feature-icon">
              <Star size={26} strokeWidth={1.8} />
            </span>

            <h3>Strengths</h3>

            <p>
              Discover what makes your resume stand out.
            </p>
          </div>

          <div className="resume-feature-card">
            <span className="resume-feature-icon">
              <Lightbulb size={26} strokeWidth={1.8} />
            </span>

            <h3>Improvement Tips</h3>

            <p>
              Get suggestions to make your resume stronger.
            </p>
          </div>

          <div className="resume-feature-card">
            <span className="resume-feature-icon">
              <Sparkles size={26} strokeWidth={1.8} />
            </span>

            <h3>Career Suggestions</h3>

            <p>
              Explore relevant skills and practical work for
              your target role.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default ResumeChecker;