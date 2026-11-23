
/* =========================================
   SKILLBRIDGE AI - SHARED LEARNING DATABASE
   Used by LearningResources.jsx and Roadmap.jsx
========================================= */

/* =========================================
   1. CAREER GOALS BY EDUCATIONAL STREAM
========================================= */

export const careerGoalsByStream = {
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

/* =========================================
   2. CANONICAL RESOURCE CATALOGUE

   Each resource is defined once.
   Both pages use these same objects.
========================================= */

const RESOURCE_CATALOG = {
  /* ENGINEERING & TECHNOLOGY */

  "frontend-html": {
    id: "frontend-html",
    skill: "HTML, CSS and JavaScript",
    title: "MDN Web Development Learning",
    description:
      "Learn web development fundamentals, HTML, CSS, JavaScript and responsive web design.",
    platform: "MDN Web Docs - Mozilla",
    type: "Official Learning Guide",
    difficulty: "Beginner",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
  },

  "frontend-react": {
    id: "frontend-react",
    skill: "React",
    title: "Learn React",
    description:
      "Understand components, JSX, props, state, hooks and building React applications.",
    platform: "React Official",
    type: "Official Tutorial",
    difficulty: "Intermediate",
    url: "https://react.dev/learn",
  },

  "fullstack-node": {
    id: "fullstack-node",
    skill: "Node.js",
    title: "Node.js Learning Resources",
    description:
      "Learn server-side JavaScript, asynchronous programming and backend development.",
    platform: "Node.js Official",
    type: "Documentation",
    difficulty: "Intermediate",
    url: "https://nodejs.org/en/learn",
  },

  "software-git": {
    id: "software-git",
    skill: "Git",
    title: "Git and GitHub Documentation",
    description:
      "Learn version control, repositories, commits, branches and collaboration.",
    platform: "GitHub Official",
    type: "Official Guide",
    difficulty: "Beginner",
    url: "https://docs.github.com/en/get-started/using-git",
  },

  "fullstack-mongodb": {
    id: "fullstack-mongodb",
    skill: "Databases",
    title: "MongoDB Learning Resources",
    description:
      "Explore database concepts, queries, data modelling and MongoDB development.",
    platform: "MongoDB Official",
    type: "Official Learning Portal",
    difficulty: "Intermediate",
    url: "https://learn.mongodb.com/",
  },

  "engineering-swayam": {
    id: "engineering-swayam",
    skill: "Engineering Fundamentals",
    title: "Engineering Courses",
    description:
      "Explore university-level courses in engineering, technology and computer science.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "engineering-projects": {
    id: "engineering-projects",
    skill: "Project Development",
    title: "GitHub Projects Guide",
    description:
      "Explore repositories and discover how developers organize and contribute to projects.",
    platform: "GitHub Official",
    type: "Official Guide",
    difficulty: "Beginner",
    url: "https://docs.github.com/en/get-started/exploring-projects-on-github/discovering-projects-on-github",
  },

  "engineering-programming": {
    id: "engineering-programming",
    skill: "Programming Fundamentals",
    title: "NPTEL Programming Courses",
    description:
      "Explore structured academic courses in programming and computer science.",
    platform: "NPTEL",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://nptel.ac.in/",
  },

  "engineering-dsa": {
    id: "engineering-dsa",
    skill: "Data Structures and Algorithms",
    title: "NPTEL Computer Science Courses",
    description:
      "Explore university-level computer science courses covering algorithms and programming concepts.",
    platform: "NPTEL",
    type: "Online Courses",
    difficulty: "Intermediate",
    url: "https://nptel.ac.in/",
  },

  "engineering-data": {
    id: "engineering-data",
    skill: "Data Analytics",
    title: "Kaggle Learn",
    description:
      "Practise data analysis, Python, data visualization and machine learning through guided lessons.",
    platform: "Kaggle Official",
    type: "Interactive Learning",
    difficulty: "Beginner",
    url: "https://www.kaggle.com/learn",
  },

  /* COMMERCE */

  "commerce-icai": {
    id: "commerce-icai",
    skill: "Accounting and Auditing",
    title: "ICAI Digital Learning Hub",
    description:
      "Explore accounting, auditing, taxation, finance and professional learning material.",
    platform: "Institute of Chartered Accountants of India",
    type: "Official Learning Portal",
    difficulty: "Intermediate",
    url: "https://learning.icai.org/elearning",
  },

  "commerce-icsi": {
    id: "commerce-icsi",
    skill: "Corporate and Business Laws",
    title: "ICSI Knowledge on Demand",
    description:
      "Learn about corporate governance, company law, taxation, compliance and business regulations.",
    platform: "Institute of Company Secretaries of India",
    type: "Official Learning Resources",
    difficulty: "Intermediate",
    url: "https://www.icsi.edu/knowledge-on-demand/",
  },

  "commerce-rbi": {
    id: "commerce-rbi",
    skill: "Banking and Finance",
    title: "RBI Financial Education",
    description:
      "Explore financial awareness, banking concepts and financial literacy resources.",
    platform: "Reserve Bank of India",
    type: "Official Resources",
    difficulty: "Beginner",
    url: "https://www.rbi.org.in/",
  },

  "commerce-sebi": {
    id: "commerce-sebi",
    skill: "Financial Markets",
    title: "SEBI Investor Education",
    description:
      "Understand securities markets, investments, investor awareness and financial regulations.",
    platform: "Securities and Exchange Board of India",
    type: "Official Education Resources",
    difficulty: "Beginner",
    url: "https://www.sebi.gov.in/",
  },

  "commerce-swayam": {
    id: "commerce-swayam",
    skill: "Commerce and Economics",
    title: "Commerce and Management Courses",
    description:
      "Find academic courses in commerce, economics, accounting and business studies.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "commerce-excel": {
    id: "commerce-excel",
    skill: "Spreadsheet Skills",
    title: "Microsoft Excel Learning",
    description:
      "Learn spreadsheet fundamentals, formulas, functions and data organization.",
    platform: "Microsoft Official",
    type: "Official Learning Resources",
    difficulty: "Beginner",
    url: "https://support.microsoft.com/en-us/excel",
  },

  /* ARTS & HUMANITIES */

  "arts-swayam": {
    id: "arts-swayam",
    skill: "Humanities and Social Sciences",
    title: "Humanities and Arts Courses",
    description:
      "Explore literature, history, sociology, political science and other humanities subjects.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "arts-ignou": {
    id: "arts-ignou",
    skill: "Academic Learning",
    title: "IGNOU Learning Resources",
    description:
      "Explore university-level programmes and academic resources across humanities and social sciences.",
    platform: "Indira Gandhi National Open University",
    type: "University Resources",
    difficulty: "Beginner",
    url: "https://www.ignou.ac.in/",
  },

  "arts-ndli": {
    id: "arts-ndli",
    skill: "Research and Reading",
    title: "National Digital Library of India",
    description:
      "Discover digital learning material, books and academic resources across multiple subjects.",
    platform: "National Digital Library of India",
    type: "Digital Library",
    difficulty: "Beginner",
    url: "https://ndl.iitkgp.ac.in/",
  },

  "arts-sahitya": {
    id: "arts-sahitya",
    skill: "Literature and Languages",
    title: "Sahitya Akademi",
    description:
      "Explore Indian literature, literary publications, language-related activities and resources.",
    platform: "Sahitya Akademi",
    type: "Official Institutional Resources",
    difficulty: "Intermediate",
    url: "https://sahitya-akademi.gov.in/",
  },

  "arts-writing": {
    id: "arts-writing",
    skill: "Writing and Communication",
    title: "Purdue Online Writing Lab",
    description:
      "Explore writing, grammar, research writing and academic communication guidance.",
    platform: "Purdue University",
    type: "University Learning Resources",
    difficulty: "Beginner",
    url: "https://owl.purdue.edu/",
  },

  "arts-psychology": {
    id: "arts-psychology",
    skill: "Psychology",
    title: "OpenStax Psychology Resources",
    description:
      "Explore educational material and textbooks covering psychology and social sciences.",
    platform: "OpenStax",
    type: "Open Educational Resources",
    difficulty: "Beginner",
    url: "https://openstax.org/subjects/social-sciences",
  },

  /* MANAGEMENT */

  "management-swayam": {
    id: "management-swayam",
    skill: "Management Fundamentals",
    title: "Management and Business Courses",
    description:
      "Explore courses in business administration, marketing, finance and management.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "management-iimb": {
    id: "management-iimb",
    skill: "Business Management",
    title: "IIM Bangalore Learning",
    description:
      "Explore management education, business programmes and learning opportunities.",
    platform: "Indian Institute of Management Bangalore",
    type: "Official Institution",
    difficulty: "Intermediate",
    url: "https://www.iimb.ac.in/",
  },

  "management-startup": {
    id: "management-startup",
    skill: "Entrepreneurship",
    title: "Startup India Learning",
    description:
      "Discover government-supported entrepreneurship initiatives and startup learning resources.",
    platform: "Startup India - Government of India",
    type: "Government Resources",
    difficulty: "Beginner",
    url: "https://www.startupindia.gov.in/",
  },

  "management-msme": {
    id: "management-msme",
    skill: "Business Development",
    title: "MSME Learning and Support",
    description:
      "Explore government initiatives, enterprise development and support for small businesses.",
    platform: "Ministry of MSME",
    type: "Government Resources",
    difficulty: "Intermediate",
    url: "https://msme.gov.in/",
  },

  "management-ndli": {
    id: "management-ndli",
    skill: "Business Research",
    title: "National Digital Library",
    description:
      "Access academic learning material and research resources in commerce and management.",
    platform: "National Digital Library of India",
    type: "Digital Library",
    difficulty: "Beginner",
    url: "https://ndl.iitkgp.ac.in/",
  },

  "management-marketing": {
    id: "management-marketing",
    skill: "Digital Marketing",
    title: "Google Skillshop",
    description:
      "Explore official Google training for digital marketing and Google products.",
    platform: "Google Official",
    type: "Official Learning Platform",
    difficulty: "Beginner",
    url: "https://skillshop.withgoogle.com/",
  },

  "management-project": {
    id: "management-project",
    skill: "Project Management",
    title: "Atlassian University",
    description:
      "Learn project collaboration, planning and work management using Atlassian tools.",
    platform: "Atlassian Official",
    type: "Official Learning Portal",
    difficulty: "Beginner",
    url: "https://university.atlassian.com/",
  },

  /* SCIENCE */

  "science-swayam": {
    id: "science-swayam",
    skill: "Science Fundamentals",
    title: "Mathematics and Science Courses",
    description:
      "Explore courses in mathematics, physics, chemistry and other scientific disciplines.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "science-nptel": {
    id: "science-nptel",
    skill: "Scientific Concepts",
    title: "NPTEL Courses",
    description:
      "Learn from academic courses developed by faculty from IITs and other participating institutions.",
    platform: "NPTEL",
    type: "Online Courses",
    difficulty: "Intermediate",
    url: "https://nptel.ac.in/",
  },

  "science-ignou": {
    id: "science-ignou",
    skill: "Scientific Research",
    title: "IGNOU School of Sciences",
    description:
      "Explore academic programmes and learning opportunities in physics, chemistry, biology and mathematics.",
    platform: "IGNOU",
    type: "University Resources",
    difficulty: "Intermediate",
    url: "https://www.ignou.ac.in/",
  },

  "science-ndli": {
    id: "science-ndli",
    skill: "Research and Reference",
    title: "National Digital Library of India",
    description:
      "Find academic publications, digital books and research material across scientific subjects.",
    platform: "National Digital Library of India",
    type: "Digital Library",
    difficulty: "Beginner",
    url: "https://ndl.iitkgp.ac.in/",
  },

  /* MEDICAL & HEALTHCARE */

  "medical-swayam": {
    id: "medical-swayam",
    skill: "Health Sciences",
    title: "Health Sciences Courses",
    description:
      "Explore academic courses related to health sciences and healthcare education.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "medical-icmr": {
    id: "medical-icmr",
    skill: "Medical Research",
    title: "ICMR Research Resources",
    description:
      "Explore official medical research information, publications and research guidelines.",
    platform: "Indian Council of Medical Research",
    type: "Official Research Resources",
    difficulty: "Advanced",
    url: "https://www.icmr.gov.in/",
  },

  "medical-nmc": {
    id: "medical-nmc",
    skill: "Medical Education",
    title: "National Medical Commission",
    description:
      "Access official information about medical education, regulations and professional standards in India.",
    platform: "National Medical Commission",
    type: "Official Information",
    difficulty: "Intermediate",
    url: "https://www.nmc.org.in/",
  },

  "medical-who": {
    id: "medical-who",
    skill: "Public Health",
    title: "WHO Health Resources",
    description:
      "Explore public health information, health topics and educational publications from the World Health Organization.",
    platform: "World Health Organization",
    type: "Official Health Resources",
    difficulty: "Intermediate",
    url: "https://www.who.int/",
  },

  "medical-pharmacy": {
    id: "medical-pharmacy",
    skill: "Pharmacy Education",
    title: "Pharmacy Council of India",
    description:
      "Access official information about pharmacy education, institutions and professional standards in India.",
    platform: "Pharmacy Council of India",
    type: "Official Institutional Resources",
    difficulty: "Intermediate",
    url: "https://pci.nic.in/",
  },

  /* LAW */

  "law-indiacode": {
    id: "law-indiacode",
    skill: "Indian Legislation",
    title: "India Code",
    description:
      "Search official central acts, legislation, rules and other legal documents of India.",
    platform: "Government of India",
    type: "Official Legal Database",
    difficulty: "Beginner",
    url: "https://www.indiacode.nic.in/",
  },

  "law-supreme": {
    id: "law-supreme",
    skill: "Judgments and Case Law",
    title: "Supreme Court of India",
    description:
      "Access official Supreme Court information, judgments, orders and legal updates.",
    platform: "Supreme Court of India",
    type: "Official Legal Resources",
    difficulty: "Intermediate",
    url: "https://www.sci.gov.in/",
  },

  "law-bci": {
    id: "law-bci",
    skill: "Legal Profession",
    title: "Bar Council of India",
    description:
      "Explore official information about legal education, professional standards and the legal profession.",
    platform: "Bar Council of India",
    type: "Official Institutional Resources",
    difficulty: "Intermediate",
    url: "https://www.barcouncilofindia.org/",
  },

  "law-swayam": {
    id: "law-swayam",
    skill: "Legal Studies",
    title: "Law Courses",
    description:
      "Discover academic courses in law and related subjects offered through the national learning platform.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  /* DESIGN & CREATIVE ARTS */

  "design-nid": {
    id: "design-nid",
    skill: "Design Fundamentals",
    title: "National Institute of Design",
    description:
      "Explore design education, programmes and information from India's leading design institute.",
    platform: "National Institute of Design",
    type: "Official Institution",
    difficulty: "Beginner",
    url: "https://www.nid.edu/",
  },

  "design-adobe": {
    id: "design-adobe",
    skill: "Graphic Design",
    title: "Adobe Creative Learning",
    description:
      "Learn creative workflows and use Adobe tools for graphic design, illustration and visual communication.",
    platform: "Adobe Official",
    type: "Official Tutorials",
    difficulty: "Beginner",
    url: "https://creativecloud.adobe.com/learn",
  },

  "design-autodesk": {
    id: "design-autodesk",
    skill: "3D Design and Animation",
    title: "Autodesk Learning",
    description:
      "Explore official learning material for 3D design, modelling, animation and creative software.",
    platform: "Autodesk Official",
    type: "Official Learning Portal",
    difficulty: "Intermediate",
    url: "https://www.autodesk.com/learn",
  },

  "design-figma": {
    id: "design-figma",
    skill: "UI/UX Design",
    title: "Figma Learning Resources",
    description:
      "Learn interface design, design systems, prototyping and collaborative design workflows.",
    platform: "Figma Official",
    type: "Official Learning Resources",
    difficulty: "Beginner",
    url: "https://help.figma.com/",
  },

  "design-swayam": {
    id: "design-swayam",
    skill: "Design Education",
    title: "Design Courses",
    description:
      "Explore academic courses in design and related creative disciplines.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "design-animation": {
    id: "design-animation",
    skill: "Animation",
    title: "Blender Tutorials",
    description:
      "Explore official tutorials and learning resources for 3D modelling and animation.",
    platform: "Blender Official",
    type: "Official Tutorials",
    difficulty: "Beginner",
    url: "https://www.blender.org/support/tutorials/",
  },

  /* VOCATIONAL STUDIES */

  "vocational-bharatskills": {
    id: "vocational-bharatskills",
    skill: "Technical and Trade Skills",
    title: "Bharat Skills",
    description:
      "Access official ITI learning material, trade theory, practical resources and question banks.",
    platform: "Directorate General of Training",
    type: "Government Learning Portal",
    difficulty: "Beginner",
    url: "https://bharatskills.gov.in/",
  },

  "vocational-nsdc": {
    id: "vocational-nsdc",
    skill: "Vocational Training",
    title: "NSDC Learning Resources",
    description:
      "Explore model curricula, participant handbooks, facilitator guides and skill-development material.",
    platform: "National Skill Development Corporation",
    type: "Official Learning Resources",
    difficulty: "Beginner",
    url: "https://www.nsdcindia.org/learning-resources",
  },

  "vocational-swayam": {
    id: "vocational-swayam",
    skill: "Professional Development",
    title: "Vocational and Professional Courses",
    description:
      "Discover courses for skill development, professional learning and career advancement.",
    platform: "SWAYAM - Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "vocational-ndli": {
    id: "vocational-ndli",
    skill: "Technical Knowledge",
    title: "National Digital Library of India",
    description:
      "Explore technical books, academic material and vocational learning resources.",
    platform: "National Digital Library of India",
    type: "Digital Library",
    difficulty: "Beginner",
    url: "https://ndl.iitkgp.ac.in/",
  },

  /* OTHER */

  "other-swayam": {
    id: "other-swayam",
    skill: "General Learning",
    title: "SWAYAM Learning Platform",
    description:
      "Explore courses across engineering, commerce, arts, management, science, law and other disciplines.",
    platform: "Government of India",
    type: "Online Courses",
    difficulty: "Beginner",
    url: "https://swayam.gov.in/",
  },

  "other-ndli": {
    id: "other-ndli",
    skill: "Research and Knowledge",
    title: "National Digital Library of India",
    description:
      "Discover digital books, academic resources and learning material across multiple subjects.",
    platform: "National Digital Library of India",
    type: "Digital Library",
    difficulty: "Beginner",
    url: "https://ndl.iitkgp.ac.in/",
  },

  "other-diksha": {
    id: "other-diksha",
    skill: "Learning and Education",
    title: "DIKSHA",
    description:
      "Explore educational content and learning resources through India's national digital education platform.",
    platform: "Government of India",
    type: "Official Learning Platform",
    difficulty: "Beginner",
    url: "https://diksha.gov.in/",
  },

  /* CAREER DEVELOPMENT */

  "career-ncs": {
    id: "career-ncs",
    skill: "Career Development",
    title: "National Career Service",
    description:
      "Explore career guidance, employment services and professional development information.",
    platform: "Government of India",
    type: "Government Career Portal",
    difficulty: "Beginner",
    url: "https://www.ncs.gov.in/",
  },
};

/* =========================================
   3. RESOURCES BY EDUCATIONAL STREAM

   These arrays reuse the catalogue objects.
========================================= */

export const resourcesByStream = {
  "Engineering & Technology": [
    RESOURCE_CATALOG["frontend-html"],
    RESOURCE_CATALOG["frontend-react"],
    RESOURCE_CATALOG["fullstack-node"],
    RESOURCE_CATALOG["software-git"],
    RESOURCE_CATALOG["fullstack-mongodb"],
    RESOURCE_CATALOG["engineering-swayam"],
    RESOURCE_CATALOG["engineering-projects"],
    RESOURCE_CATALOG["engineering-programming"],
    RESOURCE_CATALOG["engineering-dsa"],
    RESOURCE_CATALOG["engineering-data"],
  ],

  Commerce: [
    RESOURCE_CATALOG["commerce-icai"],
    RESOURCE_CATALOG["commerce-icsi"],
    RESOURCE_CATALOG["commerce-rbi"],
    RESOURCE_CATALOG["commerce-sebi"],
    RESOURCE_CATALOG["commerce-swayam"],
    RESOURCE_CATALOG["commerce-excel"],
  ],

  "Arts & Humanities": [
    RESOURCE_CATALOG["arts-swayam"],
    RESOURCE_CATALOG["arts-ignou"],
    RESOURCE_CATALOG["arts-ndli"],
    RESOURCE_CATALOG["arts-sahitya"],
    RESOURCE_CATALOG["arts-writing"],
    RESOURCE_CATALOG["arts-psychology"],
  ],

  Management: [
    RESOURCE_CATALOG["management-swayam"],
    RESOURCE_CATALOG["management-iimb"],
    RESOURCE_CATALOG["management-startup"],
    RESOURCE_CATALOG["management-msme"],
    RESOURCE_CATALOG["management-ndli"],
    RESOURCE_CATALOG["management-marketing"],
    RESOURCE_CATALOG["management-project"],
  ],

  Science: [
    RESOURCE_CATALOG["science-swayam"],
    RESOURCE_CATALOG["science-nptel"],
    RESOURCE_CATALOG["science-ignou"],
    RESOURCE_CATALOG["science-ndli"],
  ],

  "Medical & Healthcare": [
    RESOURCE_CATALOG["medical-swayam"],
    RESOURCE_CATALOG["medical-icmr"],
    RESOURCE_CATALOG["medical-nmc"],
    RESOURCE_CATALOG["medical-who"],
    RESOURCE_CATALOG["medical-pharmacy"],
  ],

  Law: [
    RESOURCE_CATALOG["law-indiacode"],
    RESOURCE_CATALOG["law-supreme"],
    RESOURCE_CATALOG["law-bci"],
    RESOURCE_CATALOG["law-swayam"],
  ],

  "Design & Creative Arts": [
    RESOURCE_CATALOG["design-nid"],
    RESOURCE_CATALOG["design-adobe"],
    RESOURCE_CATALOG["design-autodesk"],
    RESOURCE_CATALOG["design-figma"],
    RESOURCE_CATALOG["design-swayam"],
    RESOURCE_CATALOG["design-animation"],
  ],

  "Vocational Studies": [
    RESOURCE_CATALOG["vocational-bharatskills"],
    RESOURCE_CATALOG["vocational-nsdc"],
    RESOURCE_CATALOG["vocational-swayam"],
    RESOURCE_CATALOG["vocational-ndli"],
  ],

  Other: [
    RESOURCE_CATALOG["other-swayam"],
    RESOURCE_CATALOG["other-ndli"],
    RESOURCE_CATALOG["other-diksha"],
    RESOURCE_CATALOG["career-ncs"],
  ],
};

/* =========================================
   4. CAREER-SPECIFIC RESOURCE MAPPING

   Existing resource IDs are preserved.
========================================= */

export const resourceIdsByRole = {
  "Engineering & Technology": {
    "Software Engineer": [
      "frontend-html",
      "fullstack-node",
      "software-git",
      "fullstack-mongodb",
      "engineering-swayam",
    ],

    "Frontend Developer": [
      "frontend-html",
      "frontend-react",
      "software-git",
    ],

    "Backend Developer": [
      "fullstack-node",
      "fullstack-mongodb",
      "software-git",
    ],

    "Full Stack Developer": [
      "frontend-html",
      "frontend-react",
      "fullstack-node",
      "fullstack-mongodb",
      "software-git",
    ],

    "React Developer": [
      "frontend-react",
      "frontend-html",
      "software-git",
    ],

    "Data Analyst": [
      "engineering-swayam",
      "fullstack-mongodb",
      "software-git",
    ],
  },

  Commerce: {
    Accountant: [
      "commerce-icai",
      "commerce-swayam",
    ],

    "Financial Analyst": [
      "commerce-rbi",
      "commerce-sebi",
      "commerce-swayam",
    ],

    "Tax Consultant": [
      "commerce-icai",
      "commerce-icsi",
    ],

    Auditor: [
      "commerce-icai",
      "commerce-icsi",
    ],

    "Banking Professional": [
      "commerce-rbi",
      "commerce-sebi",
    ],
  },

  "Arts & Humanities": {
    "Content Writer": [
      "arts-sahitya",
      "arts-ndli",
      "arts-swayam",
    ],

    Psychologist: [
      "arts-swayam",
      "arts-ignou",
      "arts-ndli",
    ],

    "Human Resources Professional": [
      "arts-swayam",
      "arts-ignou",
    ],

    Journalist: [
      "arts-sahitya",
      "arts-swayam",
      "arts-ndli",
    ],

    "Social Worker": [
      "arts-ignou",
      "arts-swayam",
      "arts-ndli",
    ],
  },

  Management: {
    "Business Analyst": [
      "management-swayam",
      "management-iimb",
      "management-ndli",
    ],

    "Marketing Manager": [
      "management-swayam",
      "management-iimb",
    ],

    "Human Resources Professional": [
      "management-iimb",
      "management-swayam",
    ],

    "Project Manager": [
      "management-iimb",
      "management-swayam",
      "management-msme",
    ],

    Entrepreneur: [
      "management-startup",
      "management-msme",
      "management-iimb",
    ],
  },

  Science: {
    "Research Scientist": [
      "science-nptel",
      "science-ignou",
      "science-ndli",
    ],

    "Data Analyst": [
      "science-nptel",
      "science-ndli",
      "science-swayam",
    ],

    "Lab Technician": [
      "science-ignou",
      "science-swayam",
    ],

    "Research Assistant": [
      "science-nptel",
      "science-ndli",
      "science-ignou",
    ],
  },

  "Medical & Healthcare": {
    Doctor: [
      "medical-nmc",
      "medical-icmr",
      "medical-who",
      "medical-swayam",
    ],

    Pharmacist: [
      "medical-swayam",
      "medical-who",
      "medical-nmc",
    ],

    Nurse: [
      "medical-swayam",
      "medical-who",
      "medical-nmc",
    ],

    "Healthcare Administrator": [
      "medical-who",
      "medical-swayam",
    ],
  },

  Law: {
    Lawyer: [
      "law-indiacode",
      "law-supreme",
      "law-bci",
    ],

    "Legal Advisor": [
      "law-indiacode",
      "law-bci",
      "law-swayam",
    ],

    "Corporate Lawyer": [
      "law-indiacode",
      "law-bci",
      "law-swayam",
    ],

    "Legal Researcher": [
      "law-supreme",
      "law-indiacode",
      "law-swayam",
    ],
  },

  "Design & Creative Arts": {
    "UI/UX Designer": [
      "design-figma",
      "design-nid",
      "design-swayam",
    ],

    "Graphic Designer": [
      "design-adobe",
      "design-nid",
      "design-swayam",
    ],

    Animator: [
      "design-autodesk",
      "design-adobe",
      "design-nid",
    ],

    Illustrator: [
      "design-adobe",
      "design-nid",
    ],
  },

  "Vocational Studies": {
    Technician: [
      "vocational-bharatskills",
      "vocational-nsdc",
      "vocational-ndli",
    ],

    Electrician: [
      "vocational-bharatskills",
      "vocational-nsdc",
    ],

    "Skilled Professional": [
      "vocational-nsdc",
      "vocational-bharatskills",
    ],

    Entrepreneur: [
      "vocational-nsdc",
      "vocational-swayam",
    ],
  },
};

/* =========================================
   5. ROADMAP RESOURCE ALIASES

   Roadmap.jsx can continue using its old keys.
   Each alias points to a canonical resource
   from the same shared catalogue.
========================================= */

export const learningResources = {
  html: RESOURCE_CATALOG["frontend-html"],
  css: RESOURCE_CATALOG["frontend-html"],
  javascript: RESOURCE_CATALOG["frontend-html"],

  react: RESOURCE_CATALOG["frontend-react"],
  git: RESOURCE_CATALOG["software-git"],
  projects: RESOURCE_CATALOG["engineering-projects"],
  node: RESOURCE_CATALOG["fullstack-node"],
  mongodb: RESOURCE_CATALOG["fullstack-mongodb"],

  programming: RESOURCE_CATALOG["engineering-programming"],
  dsa: RESOURCE_CATALOG["engineering-dsa"],

  excel: RESOURCE_CATALOG["commerce-excel"],
  accounting: RESOURCE_CATALOG["commerce-icai"],
  finance: RESOURCE_CATALOG["commerce-rbi"],
  data: RESOURCE_CATALOG["engineering-data"],

  marketing: RESOURCE_CATALOG["management-marketing"],
  writing: RESOURCE_CATALOG["arts-writing"],
  psychology: RESOURCE_CATALOG["arts-psychology"],
  research: RESOURCE_CATALOG["arts-ndli"],

  science: RESOURCE_CATALOG["science-nptel"],
  medical: RESOURCE_CATALOG["medical-who"],
  pharmacy: RESOURCE_CATALOG["medical-pharmacy"],

  law: RESOURCE_CATALOG["law-indiacode"],

  design: RESOURCE_CATALOG["design-figma"],
  graphic: RESOURCE_CATALOG["design-adobe"],
  animation: RESOURCE_CATALOG["design-animation"],

  project: RESOURCE_CATALOG["management-project"],
  business: RESOURCE_CATALOG["management-startup"],
  career: RESOURCE_CATALOG["career-ncs"],
};
