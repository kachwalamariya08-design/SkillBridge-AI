
import { useState, useEffect } from "react";
import "./Roadmap.css";

import {
  careerGoalsByStream,
  learningResources,
} from "../../data/learningResources";

import { useAuth } from "../../context/AuthContext";

const PROFILE_KEY = "skillBridgeProfile";
const PROGRESS_KEY = "skillBridgeProgress";

function getSavedProfile() {
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
  } catch {
    return null;
  }
}

function getSavedProgress(accountId) {
  if (!accountId) return {};

  try {
    const saved = localStorage.getItem(
      `${PROGRESS_KEY}_${encodeURIComponent(accountId)}`
    );

    const parsed = saved ? JSON.parse(saved) : {};

    return parsed &&
      typeof parsed === "object" &&
      !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

const makeSteps = (steps) =>
  steps.map((step, index) => ({
    title: `Step ${index + 1}: ${step.title}`,
    description: step.description,
    duration: step.duration,
    resources: step.resources
      .map((key) => learningResources[key])
      .filter(Boolean),
  }));

const roadmaps = {
  "Frontend Developer": makeSteps([
    {
      title: "Master HTML and CSS",
      description: "Learn page structure, forms, Flexbox, Grid and responsive design.",
      duration: "2 weeks",
      resources: ["html", "css"],
    },
    {
      title: "Learn JavaScript",
      description: "Understand functions, arrays, objects, DOM and asynchronous JavaScript.",
      duration: "3 weeks",
      resources: ["javascript"],
    },
    {
      title: "Learn React",
      description: "Practise components, props, state, hooks and React Router.",
      duration: "3 weeks",
      resources: ["react"],
    },
    {
      title: "Build Projects",
      description: "Build and deploy projects, use GitHub and practise API integration.",
      duration: "2 weeks",
      resources: ["projects", "git"],
    },
  ]),

  "Full Stack Developer": makeSteps([
    {
      title: "Learn HTML, CSS and JavaScript",
      description: "Build a strong foundation in frontend development.",
      duration: "3 weeks",
      resources: ["html", "css", "javascript"],
    },
    {
      title: "Learn React",
      description: "Create interactive user interfaces using components and hooks.",
      duration: "3 weeks",
      resources: ["react"],
    },
    {
      title: "Learn Backend Development",
      description: "Understand server-side programming and build backend APIs.",
      duration: "3 weeks",
      resources: ["node"],
    },
    {
      title: "Learn Databases and Build a Project",
      description: "Practise MongoDB, connect frontend and backend, and deploy an application.",
      duration: "3 weeks",
      resources: ["mongodb", "projects"],
    },
  ]),

  "Software Engineer": makeSteps([
    {
      title: "Strengthen Programming",
      description: "Practise a programming language and understand programming fundamentals.",
      duration: "2 weeks",
      resources: ["programming"],
    },
    {
      title: "Learn Data Structures",
      description: "Study arrays, linked lists, stacks, queues, trees and graphs.",
      duration: "4 weeks",
      resources: ["dsa"],
    },
    {
      title: "Practise Problem Solving",
      description: "Solve problems involving searching, sorting, recursion and complexity.",
      duration: "3 weeks",
      resources: ["dsa"],
    },
    {
      title: "Build Projects and Practise Interviews",
      description: "Use Git, develop projects and practise coding interview questions.",
      duration: "3 weeks",
      resources: ["git", "projects"],
    },
  ]),

  "Backend Developer": makeSteps([
    {
      title: "Strengthen Programming Fundamentals",
      description: "Learn programming concepts, functions, objects and problem solving.",
      duration: "2 weeks",
      resources: ["programming"],
    },
    {
      title: "Learn JavaScript and Node.js",
      description: "Understand JavaScript and server-side development.",
      duration: "3 weeks",
      resources: ["javascript", "node"],
    },
    {
      title: "Build APIs and Learn Databases",
      description: "Practise REST APIs, database operations and backend architecture.",
      duration: "3 weeks",
      resources: ["node", "mongodb"],
    },
    {
      title: "Build and Deploy Backend Projects",
      description: "Create backend applications, use Git and practise deployment.",
      duration: "3 weeks",
      resources: ["projects", "git"],
    },
  ]),

  "React Developer": makeSteps([
    {
      title: "Learn HTML, CSS and JavaScript",
      description: "Understand the fundamentals required to build web interfaces.",
      duration: "3 weeks",
      resources: ["html", "css", "javascript"],
    },
    {
      title: "Learn React Fundamentals",
      description: "Practise JSX, components, props, state and hooks.",
      duration: "3 weeks",
      resources: ["react"],
    },
    {
      title: "Learn Application Development",
      description: "Work with routing, APIs, forms and state management.",
      duration: "3 weeks",
      resources: ["react", "javascript"],
    },
    {
      title: "Build a React Portfolio",
      description: "Create practical projects and publish your work on GitHub.",
      duration: "2 weeks",
      resources: ["projects", "git"],
    },
  ]),

  "Data Analyst": makeSteps([
    {
      title: "Learn Data and Spreadsheet Fundamentals",
      description: "Understand data types, tables, formulas and spreadsheet operations.",
      duration: "2 weeks",
      resources: ["excel"],
    },
    {
      title: "Learn Statistics and Data Analysis",
      description: "Practise descriptive statistics, data interpretation and analysis.",
      duration: "3 weeks",
      resources: ["data", "finance"],
    },
    {
      title: "Practise Data Visualisation",
      description: "Learn how to organise, interpret and present data insights.",
      duration: "3 weeks",
      resources: ["data", "excel"],
    },
    {
      title: "Build Data Analysis Projects",
      description: "Analyse real datasets and create a portfolio of projects.",
      duration: "3 weeks",
      resources: ["data", "projects"],
    },
  ]),

  "Accountant": makeSteps([
    {
      title: "Learn Accounting Fundamentals",
      description: "Understand journal entries, ledgers, trial balances and financial statements.",
      duration: "3 weeks",
      resources: ["accounting"],
    },
    {
      title: "Develop Spreadsheet Skills",
      description: "Practise Excel formulas, tables and financial calculations.",
      duration: "2 weeks",
      resources: ["excel"],
    },
    {
      title: "Understand Financial Reporting",
      description: "Learn how to prepare and interpret basic financial statements.",
      duration: "3 weeks",
      resources: ["accounting", "finance"],
    },
    {
      title: "Practise Accounting Tasks",
      description: "Work on sample accounting exercises and build practical experience.",
      duration: "3 weeks",
      resources: ["accounting", "career"],
    },
  ]),

  "Financial Analyst": makeSteps([
    {
      title: "Understand Financial Fundamentals",
      description: "Learn financial statements, financial concepts and business terminology.",
      duration: "2 weeks",
      resources: ["finance"],
    },
    {
      title: "Develop Excel Skills",
      description: "Practise formulas, data organisation and financial spreadsheets.",
      duration: "3 weeks",
      resources: ["excel"],
    },
    {
      title: "Learn Financial Analysis",
      description: "Understand budgeting, financial ratios and basic forecasting.",
      duration: "3 weeks",
      resources: ["finance", "accounting"],
    },
    {
      title: "Build Financial Analysis Projects",
      description: "Analyse sample financial information and present your findings.",
      duration: "3 weeks",
      resources: ["excel", "projects"],
    },
  ]),

  "Tax Consultant": makeSteps([
    {
      title: "Learn Tax Fundamentals",
      description: "Understand basic taxation concepts and tax terminology.",
      duration: "3 weeks",
      resources: ["accounting"],
    },
    {
      title: "Understand Indian Taxation",
      description: "Study applicable income tax and GST concepts using official resources.",
      duration: "3 weeks",
      resources: ["career"],
    },
    {
      title: "Practise Financial Calculations",
      description: "Use spreadsheets to practise calculations and organise financial records.",
      duration: "2 weeks",
      resources: ["excel", "finance"],
    },
    {
      title: "Practise Tax Documentation",
      description: "Work through sample tax calculations and documentation exercises.",
      duration: "3 weeks",
      resources: ["accounting", "projects"],
    },
  ]),

  "Auditor": makeSteps([
    {
      title: "Learn Accounting Principles",
      description: "Understand financial records, statements and accounting standards.",
      duration: "3 weeks",
      resources: ["accounting"],
    },
    {
      title: "Understand Auditing Fundamentals",
      description: "Learn audit objectives, evidence, documentation and procedures.",
      duration: "3 weeks",
      resources: ["accounting", "career"],
    },
    {
      title: "Develop Analytical Skills",
      description: "Practise spreadsheet analysis and financial record verification.",
      duration: "2 weeks",
      resources: ["excel", "finance"],
    },
    {
      title: "Practise Audit Case Studies",
      description: "Work through sample audit situations and prepare reports.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Banking Professional": makeSteps([
    {
      title: "Understand Banking Fundamentals",
      description: "Learn banking operations, financial products and basic terminology.",
      duration: "2 weeks",
      resources: ["finance"],
    },
    {
      title: "Strengthen Quantitative Aptitude",
      description: "Practise numerical reasoning, percentages and data interpretation.",
      duration: "3 weeks",
      resources: ["excel"],
    },
    {
      title: "Learn Financial Services",
      description: "Understand banking services, customer support and financial processes.",
      duration: "3 weeks",
      resources: ["finance", "career"],
    },
    {
      title: "Prepare for Banking Roles",
      description: "Practise communication, reasoning and role-related interview questions.",
      duration: "3 weeks",
      resources: ["career", "projects"],
    },
  ]),

  "Content Writer": makeSteps([
    {
      title: "Develop Writing Fundamentals",
      description: "Practise grammar, sentence structure, clarity and effective writing.",
      duration: "2 weeks",
      resources: ["writing"],
    },
    {
      title: "Learn Content Research",
      description: "Practise research, fact checking and organising information.",
      duration: "2 weeks",
      resources: ["research", "writing"],
    },
    {
      title: "Understand Digital Content",
      description: "Learn audience-focused writing, content formats and basic SEO concepts.",
      duration: "3 weeks",
      resources: ["marketing", "writing"],
    },
    {
      title: "Build a Writing Portfolio",
      description: "Create articles, blogs and sample writing projects.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Psychologist": makeSteps([
    {
      title: "Study Psychology Fundamentals",
      description: "Understand major areas of psychology and basic human behaviour.",
      duration: "3 weeks",
      resources: ["psychology"],
    },
    {
      title: "Learn Research Methods",
      description: "Understand research design, observation and basic data collection.",
      duration: "3 weeks",
      resources: ["research", "psychology"],
    },
    {
      title: "Develop Communication and Ethics",
      description: "Study active listening, professional communication and ethical practice.",
      duration: "2 weeks",
      resources: ["career", "psychology"],
    },
    {
      title: "Explore Practical Experience",
      description: "Review case studies and explore supervised academic or professional opportunities.",
      duration: "3 weeks",
      resources: ["research", "career"],
    },
  ]),

  "Human Resources Professional": makeSteps([
    {
      title: "Understand HR Fundamentals",
      description: "Learn recruitment, onboarding, employee relations and HR responsibilities.",
      duration: "2 weeks",
      resources: ["career"],
    },
    {
      title: "Develop Communication Skills",
      description: "Practise professional writing, listening and workplace communication.",
      duration: "2 weeks",
      resources: ["writing", "career"],
    },
    {
      title: "Learn Recruitment and HR Operations",
      description: "Understand job descriptions, candidate screening and employee documentation.",
      duration: "3 weeks",
      resources: ["career", "project"],
    },
    {
      title: "Practise HR Case Studies",
      description: "Work through sample recruitment and employee-management situations.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Journalist": makeSteps([
    {
      title: "Learn Journalism Fundamentals",
      description: "Understand news writing, reporting and journalistic principles.",
      duration: "3 weeks",
      resources: ["writing"],
    },
    {
      title: "Develop Research and Fact Checking",
      description: "Practise source verification, interviews and information gathering.",
      duration: "2 weeks",
      resources: ["research", "writing"],
    },
    {
      title: "Learn Digital Media",
      description: "Explore online publishing and digital content formats.",
      duration: "3 weeks",
      resources: ["marketing", "writing"],
    },
    {
      title: "Build a Reporting Portfolio",
      description: "Prepare sample articles, reports and interview-based stories.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Social Worker": makeSteps([
    {
      title: "Understand Social Work Fundamentals",
      description: "Learn social development, community needs and social welfare concepts.",
      duration: "3 weeks",
      resources: ["psychology"],
    },
    {
      title: "Develop Communication Skills",
      description: "Practise listening, interviewing and professional communication.",
      duration: "2 weeks",
      resources: ["writing", "career"],
    },
    {
      title: "Learn Community Research",
      description: "Understand needs assessment, research and community engagement.",
      duration: "3 weeks",
      resources: ["research"],
    },
    {
      title: "Explore Field Experience",
      description: "Research supervised volunteering, internships and community projects.",
      duration: "3 weeks",
      resources: ["career", "projects"],
    },
  ]),

  "Business Analyst": makeSteps([
    {
      title: "Understand Business Fundamentals",
      description: "Learn business processes, organisational structures and basic analysis.",
      duration: "2 weeks",
      resources: ["business"],
    },
    {
      title: "Develop Data and Excel Skills",
      description: "Practise spreadsheets, data interpretation and reporting.",
      duration: "3 weeks",
      resources: ["excel", "data"],
    },
    {
      title: "Learn Business Analysis",
      description: "Understand requirements gathering, process mapping and documentation.",
      duration: "3 weeks",
      resources: ["project", "business"],
    },
    {
      title: "Build Business Case Studies",
      description: "Analyse business problems and present practical recommendations.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Marketing Manager": makeSteps([
    {
      title: "Learn Marketing Fundamentals",
      description: "Understand customers, branding, market research and marketing strategy.",
      duration: "2 weeks",
      resources: ["marketing"],
    },
    {
      title: "Learn Digital Marketing",
      description: "Explore search marketing, social media and digital campaigns.",
      duration: "3 weeks",
      resources: ["marketing"],
    },
    {
      title: "Develop Analytical Skills",
      description: "Practise campaign analysis, reporting and spreadsheet skills.",
      duration: "2 weeks",
      resources: ["excel", "data"],
    },
    {
      title: "Create a Marketing Portfolio",
      description: "Prepare sample campaigns, marketing plans and case studies.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Project Manager": makeSteps([
    {
      title: "Understand Project Management",
      description: "Learn project scope, objectives, timelines and responsibilities.",
      duration: "2 weeks",
      resources: ["project"],
    },
    {
      title: "Learn Planning and Coordination",
      description: "Practise task planning, scheduling and resource coordination.",
      duration: "3 weeks",
      resources: ["project"],
    },
    {
      title: "Develop Team Communication",
      description: "Practise collaboration, reporting and problem resolution.",
      duration: "2 weeks",
      resources: ["career", "writing"],
    },
    {
      title: "Manage a Practice Project",
      description: "Plan and document a sample project from beginning to completion.",
      duration: "3 weeks",
      resources: ["projects", "project"],
    },
  ]),

  "Entrepreneur": makeSteps([
    {
      title: "Understand Business Fundamentals",
      description: "Explore business models, customers and value propositions.",
      duration: "2 weeks",
      resources: ["business"],
    },
    {
      title: "Learn Market Research",
      description: "Study customer needs, competitors and market opportunities.",
      duration: "2 weeks",
      resources: ["research", "business"],
    },
    {
      title: "Develop Business Planning Skills",
      description: "Practise budgeting, business planning and basic financial management.",
      duration: "3 weeks",
      resources: ["finance", "business"],
    },
    {
      title: "Create a Business Plan",
      description: "Prepare a business concept, target audience and launch plan.",
      duration: "3 weeks",
      resources: ["projects", "business"],
    },
  ]),

  "Research Scientist": makeSteps([
    {
      title: "Strengthen Scientific Fundamentals",
      description: "Build a strong understanding of the core concepts in your science subject.",
      duration: "3 weeks",
      resources: ["science"],
    },
    {
      title: "Learn Research Methodology",
      description: "Understand research questions, hypotheses and experimental design.",
      duration: "3 weeks",
      resources: ["research"],
    },
    {
      title: "Develop Data Analysis Skills",
      description: "Practise organising, interpreting and presenting research data.",
      duration: "3 weeks",
      resources: ["data", "excel"],
    },
    {
      title: "Prepare a Research Project",
      description: "Review published research and develop a structured academic project.",
      duration: "4 weeks",
      resources: ["research", "projects"],
    },
  ]),

  "Lab Technician": makeSteps([
    {
      title: "Learn Laboratory Fundamentals",
      description: "Understand laboratory equipment, safety and basic procedures.",
      duration: "3 weeks",
      resources: ["science"],
    },
    {
      title: "Study Practical Techniques",
      description: "Explore measurement, observation and sample-handling fundamentals.",
      duration: "3 weeks",
      resources: ["science"],
    },
    {
      title: "Develop Documentation Skills",
      description: "Practise recording observations, organising results and preparing reports.",
      duration: "2 weeks",
      resources: ["excel", "writing"],
    },
    {
      title: "Practise Laboratory Case Studies",
      description: "Review supervised practical exercises and laboratory scenarios.",
      duration: "3 weeks",
      resources: ["research", "career"],
    },
  ]),

  "Research Assistant": makeSteps([
    {
      title: "Learn Research Fundamentals",
      description: "Understand research questions, literature reviews and academic sources.",
      duration: "3 weeks",
      resources: ["research"],
    },
    {
      title: "Develop Data Collection Skills",
      description: "Learn how to organise observations, surveys and research information.",
      duration: "2 weeks",
      resources: ["research", "excel"],
    },
    {
      title: "Practise Data Analysis",
      description: "Develop basic data organisation and interpretation skills.",
      duration: "3 weeks",
      resources: ["data", "excel"],
    },
    {
      title: "Prepare a Research Portfolio",
      description: "Create a sample literature review, research summary or project report.",
      duration: "3 weeks",
      resources: ["writing", "projects"],
    },
  ]),

  "Doctor": makeSteps([
    {
      title: "Strengthen Medical Science Fundamentals",
      description: "Review foundational biology, anatomy and human physiology.",
      duration: "4 weeks",
      resources: ["science", "medical"],
    },
    {
      title: "Study Clinical Knowledge",
      description: "Explore foundational medical concepts and evidence-based learning resources.",
      duration: "4 weeks",
      resources: ["medical"],
    },
    {
      title: "Develop Clinical Communication",
      description: "Understand patient communication, professional conduct and medical ethics.",
      duration: "3 weeks",
      resources: ["medical", "career"],
    },
    {
      title: "Explore Supervised Clinical Learning",
      description: "Follow your institution's curriculum and approved supervised practical training.",
      duration: "Ongoing",
      resources: ["medical", "career"],
    },
  ]),

  "Pharmacist": makeSteps([
    {
      title: "Learn Pharmaceutical Fundamentals",
      description: "Study basic pharmacology and pharmaceutical science concepts.",
      duration: "3 weeks",
      resources: ["pharmacy"],
    },
    {
      title: "Understand Medicines and Safety",
      description: "Learn medicine classifications, safe handling and medication information.",
      duration: "3 weeks",
      resources: ["pharmacy", "medical"],
    },
    {
      title: "Develop Professional Skills",
      description: "Understand patient communication and professional responsibilities.",
      duration: "2 weeks",
      resources: ["medical", "career"],
    },
    {
      title: "Explore Practical Pharmacy Learning",
      description: "Follow approved academic and supervised practical training.",
      duration: "Ongoing",
      resources: ["pharmacy", "career"],
    },
  ]),

  "Nurse": makeSteps([
    {
      title: "Study Nursing Fundamentals",
      description: "Understand basic nursing concepts, anatomy and patient care principles.",
      duration: "3 weeks",
      resources: ["medical", "science"],
    },
    {
      title: "Learn Patient Care and Safety",
      description: "Explore patient safety, hygiene and fundamental care concepts.",
      duration: "3 weeks",
      resources: ["medical"],
    },
    {
      title: "Develop Communication Skills",
      description: "Practise patient communication, teamwork and professional conduct.",
      duration: "2 weeks",
      resources: ["career", "medical"],
    },
    {
      title: "Explore Supervised Practical Learning",
      description: "Follow your institution's curriculum and approved clinical training.",
      duration: "Ongoing",
      resources: ["medical", "career"],
    },
  ]),

  "Healthcare Administrator": makeSteps([
    {
      title: "Understand Healthcare Systems",
      description: "Learn healthcare organisations, services and administrative responsibilities.",
      duration: "2 weeks",
      resources: ["medical"],
    },
    {
      title: "Develop Management Skills",
      description: "Understand planning, coordination and resource management.",
      duration: "3 weeks",
      resources: ["project", "business"],
    },
    {
      title: "Learn Healthcare Documentation",
      description: "Practise professional documentation, reporting and spreadsheet organisation.",
      duration: "2 weeks",
      resources: ["excel", "writing"],
    },
    {
      title: "Explore Healthcare Administration",
      description: "Review healthcare management case studies and administrative workflows.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Lawyer": makeSteps([
    {
      title: "Understand Legal Fundamentals",
      description: "Study foundational legal concepts and the structure of the Indian legal system.",
      duration: "3 weeks",
      resources: ["law"],
    },
    {
      title: "Develop Legal Research Skills",
      description: "Practise locating judgments, statutes and relevant legal materials.",
      duration: "3 weeks",
      resources: ["law", "research"],
    },
    {
      title: "Practise Legal Writing",
      description: "Learn legal drafting, case summaries and structured arguments.",
      duration: "3 weeks",
      resources: ["writing", "law"],
    },
    {
      title: "Build Practical Legal Experience",
      description: "Explore case studies, internships and supervised legal experience.",
      duration: "Ongoing",
      resources: ["law", "career"],
    },
  ]),

  "Legal Advisor": makeSteps([
    {
      title: "Strengthen Legal Knowledge",
      description: "Study relevant legal principles and legal frameworks.",
      duration: "3 weeks",
      resources: ["law"],
    },
    {
      title: "Learn Legal Research",
      description: "Practise finding and analysing relevant judgments and legal materials.",
      duration: "3 weeks",
      resources: ["law", "research"],
    },
    {
      title: "Develop Legal Drafting",
      description: "Practise preparing structured legal documents and written advice.",
      duration: "3 weeks",
      resources: ["writing", "law"],
    },
    {
      title: "Practise Legal Case Analysis",
      description: "Review sample legal situations and prepare structured legal analysis.",
      duration: "3 weeks",
      resources: ["law", "projects"],
    },
  ]),

  "Corporate Lawyer": makeSteps([
    {
      title: "Learn Corporate Law Fundamentals",
      description: "Understand company structures and foundational corporate law concepts.",
      duration: "3 weeks",
      resources: ["law"],
    },
    {
      title: "Develop Legal Research Skills",
      description: "Research company law, contracts and relevant legal decisions.",
      duration: "3 weeks",
      resources: ["law", "research"],
    },
    {
      title: "Practise Contract Drafting",
      description: "Understand contract structures and practise reviewing sample agreements.",
      duration: "3 weeks",
      resources: ["writing", "law"],
    },
    {
      title: "Explore Corporate Legal Practice",
      description: "Review case studies and explore supervised corporate legal experience.",
      duration: "Ongoing",
      resources: ["law", "career"],
    },
  ]),

  "Legal Researcher": makeSteps([
    {
      title: "Understand Legal Research Fundamentals",
      description: "Learn legal sources, research questions and legal terminology.",
      duration: "2 weeks",
      resources: ["law", "research"],
    },
    {
      title: "Practise Case Law Research",
      description: "Find and review relevant judgments and legal decisions.",
      duration: "3 weeks",
      resources: ["law"],
    },
    {
      title: "Develop Legal Writing",
      description: "Prepare case briefs, legal summaries and research notes.",
      duration: "3 weeks",
      resources: ["writing", "law"],
    },
    {
      title: "Create a Research Portfolio",
      description: "Prepare structured legal research reports and case analyses.",
      duration: "3 weeks",
      resources: ["research", "projects"],
    },
  ]),

  "UI/UX Designer": makeSteps([
    {
      title: "Understand Design Fundamentals",
      description: "Learn layout, colour, typography, spacing and visual hierarchy.",
      duration: "2 weeks",
      resources: ["design"],
    },
    {
      title: "Learn User Research",
      description: "Understand user needs, personas and basic usability research.",
      duration: "2 weeks",
      resources: ["research", "design"],
    },
    {
      title: "Practise Wireframing and Prototyping",
      description: "Create wireframes, prototypes and interactive user flows.",
      duration: "3 weeks",
      resources: ["design"],
    },
    {
      title: "Build a UI/UX Portfolio",
      description: "Complete design case studies and present your design decisions.",
      duration: "3 weeks",
      resources: ["projects", "design"],
    },
  ]),

  "Graphic Designer": makeSteps([
    {
      title: "Learn Visual Design Fundamentals",
      description: "Understand colour theory, typography, composition and visual hierarchy.",
      duration: "2 weeks",
      resources: ["graphic"],
    },
    {
      title: "Practise Design Tools",
      description: "Explore graphic design tools and practise creating visual assets.",
      duration: "3 weeks",
      resources: ["graphic"],
    },
    {
      title: "Develop Branding Skills",
      description: "Learn logo design, brand identity and visual consistency.",
      duration: "3 weeks",
      resources: ["graphic", "design"],
    },
    {
      title: "Create a Design Portfolio",
      description: "Build a collection of posters, branding work and creative projects.",
      duration: "3 weeks",
      resources: ["projects", "graphic"],
    },
  ]),

  "Animator": makeSteps([
    {
      title: "Learn Animation Fundamentals",
      description: "Understand timing, movement, keyframes and animation principles.",
      duration: "3 weeks",
      resources: ["animation"],
    },
    {
      title: "Learn Animation Software",
      description: "Explore animation tools and practise basic workflows.",
      duration: "3 weeks",
      resources: ["animation"],
    },
    {
      title: "Practise Animation Projects",
      description: "Create short animations and experiment with movement and storytelling.",
      duration: "3 weeks",
      resources: ["animation", "projects"],
    },
    {
      title: "Build an Animation Portfolio",
      description: "Prepare a showreel and organise your completed creative work.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Illustrator": makeSteps([
    {
      title: "Learn Drawing Fundamentals",
      description: "Practise shapes, proportions, composition and visual storytelling.",
      duration: "3 weeks",
      resources: ["graphic"],
    },
    {
      title: "Explore Digital Illustration",
      description: "Learn digital illustration workflows and creative tools.",
      duration: "3 weeks",
      resources: ["graphic", "design"],
    },
    {
      title: "Develop a Consistent Style",
      description: "Practise character, editorial and concept illustration.",
      duration: "3 weeks",
      resources: ["projects", "graphic"],
    },
    {
      title: "Build an Illustration Portfolio",
      description: "Organise your strongest work into a professional portfolio.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),

  "Technician": makeSteps([
    {
      title: "Understand Technical Fundamentals",
      description: "Study the foundational concepts related to your technical specialisation.",
      duration: "3 weeks",
      resources: ["science"],
    },
    {
      title: "Learn Tools and Equipment",
      description: "Understand the tools, equipment and safety procedures relevant to your field.",
      duration: "3 weeks",
      resources: ["career"],
    },
    {
      title: "Develop Troubleshooting Skills",
      description: "Practise identifying problems and following structured troubleshooting steps.",
      duration: "3 weeks",
      resources: ["projects"],
    },
    {
      title: "Build Practical Experience",
      description: "Explore supervised practical work and create a record of completed tasks.",
      duration: "Ongoing",
      resources: ["career", "projects"],
    },
  ]),

  "Electrician": makeSteps([
    {
      title: "Learn Electrical Fundamentals",
      description: "Understand basic electrical concepts, circuits and electrical safety.",
      duration: "3 weeks",
      resources: ["science"],
    },
    {
      title: "Understand Tools and Components",
      description: "Study common electrical components, tools and their safe use.",
      duration: "3 weeks",
      resources: ["career"],
    },
    {
      title: "Practise Technical Troubleshooting",
      description: "Learn systematic fault identification and basic electrical diagnostics.",
      duration: "3 weeks",
      resources: ["projects"],
    },
    {
      title: "Complete Supervised Practical Training",
      description: "Follow recognised training and safety requirements under qualified supervision.",
      duration: "Ongoing",
      resources: ["career"],
    },
  ]),

  "Skilled Professional": makeSteps([
    {
      title: "Identify Your Specialisation",
      description: "Understand the technical knowledge and practical skills required in your trade.",
      duration: "2 weeks",
      resources: ["career"],
    },
    {
      title: "Strengthen Practical Fundamentals",
      description: "Study relevant tools, materials, methods and safety practices.",
      duration: "3 weeks",
      resources: ["science"],
    },
    {
      title: "Develop Hands-on Skills",
      description: "Practise trade-related tasks through approved supervised training.",
      duration: "Ongoing",
      resources: ["projects", "career"],
    },
    {
      title: "Build a Work Portfolio",
      description: "Document completed projects, practical experience and professional skills.",
      duration: "3 weeks",
      resources: ["projects", "career"],
    },
  ]),
};

const generalRoadmap = makeSteps([
  {
    title: "Understand Your Career Field",
    description: "Research your chosen field and identify the knowledge and skills it requires.",
    duration: "2 weeks",
    resources: ["research", "career"],
  },
  {
    title: "Develop Core Skills",
    description: "Strengthen communication, problem solving, digital literacy and field-related skills.",
    duration: "3 weeks",
    resources: ["career", "writing"],
  },
  {
    title: "Gain Practical Experience",
    description: "Work on relevant assignments, case studies, projects or supervised practical tasks.",
    duration: "3 weeks",
    resources: ["projects", "career"],
  },
  {
    title: "Build Your Career Portfolio",
    description: "Organise your work, achievements and experience to demonstrate your capabilities.",
    duration: "3 weeks",
    resources: ["projects", "career"],
  },
]);

const rolePathway = {
  "Backend Developer": "Full Stack Developer",
  "React Developer": "Frontend Developer",
  Accountant: "Accountant",
  "Financial Analyst": "Financial Analyst",
  "Tax Consultant": "Tax Consultant",
  Auditor: "Auditor",
  "Banking Professional": "Banking Professional",
  "Content Writer": "Content Writer",
  Psychologist: "Psychologist",
  "Human Resources Professional": "Human Resources Professional",
  Journalist: "Journalist",
  "Social Worker": "Social Worker",
  "Business Analyst": "Business Analyst",
  "Marketing Manager": "Marketing Manager",
  "Project Manager": "Project Manager",
  Entrepreneur: "Entrepreneur",
  "Research Scientist": "Research Scientist",
  "Data Analyst": "Data Analyst",
  "Lab Technician": "Lab Technician",
  "Research Assistant": "Research Assistant",
  Doctor: "Doctor",
  Pharmacist: "Pharmacist",
  Nurse: "Nurse",
  "Healthcare Administrator": "Healthcare Administrator",
  Lawyer: "Lawyer",
  "Legal Advisor": "Legal Advisor",
  "Corporate Lawyer": "Corporate Lawyer",
  "Legal Researcher": "Legal Researcher",
  "UI/UX Designer": "UI/UX Designer",
  "Graphic Designer": "Graphic Designer",
  Animator: "Animator",
  Illustrator: "Illustrator",
  Technician: "Technician",
  Electrician: "Electrician",
  "Skilled Professional": "Skilled Professional",
};

function Roadmap() {
  const { accountId, loading } = useAuth();

  const [profile, setProfile] = useState(null);
  const [targetRole, setTargetRole] = useState("Frontend Developer");

  const [completedSteps, setCompletedSteps] = useState({});
  const [loadedAccountId, setLoadedAccountId] = useState("");

  const educationalStream =
    profile?.educationalStream || "Engineering & Technology";

  const careerOptions =
    careerGoalsByStream[educationalStream] ||
    careerGoalsByStream["Engineering & Technology"];

  /* =====================================
     LOAD AUTHENTICATED PROFILE
  ===================================== */

  useEffect(() => {
    if (loading) return;

    if (!accountId) {
      setProfile(null);
      setTargetRole("Frontend Developer");
      return;
    }

    const savedProfile = getSavedProfile();

    setProfile(savedProfile);
    setTargetRole(
      savedProfile?.targetRole || "Frontend Developer"
    );
  }, [accountId, loading]);

  /* =====================================
     SYNC PROFILE CHANGES
  ===================================== */

  useEffect(() => {
    if (loading || !accountId) return;

    function updateProfile() {
      const updatedProfile = getSavedProfile();

      setProfile(updatedProfile);

      if (updatedProfile?.targetRole) {
        setTargetRole(updatedProfile.targetRole);
      }
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
  }, [accountId, loading]);

  /* =====================================
     LOAD ACCOUNT-SPECIFIC PROGRESS
  ===================================== */

  useEffect(() => {
    if (loading) return;

    if (!accountId) {
      setCompletedSteps({});
      setLoadedAccountId("");
      return;
    }

    setCompletedSteps(getSavedProgress(accountId));
    setLoadedAccountId(accountId);
  }, [accountId, loading]);

  /* =====================================
     SAVE ACCOUNT-SPECIFIC PROGRESS
  ===================================== */

  useEffect(() => {
    if (
      loading ||
      !accountId ||
      loadedAccountId !== accountId
    ) {
      return;
    }

    const accountProgressKey =
      `${PROGRESS_KEY}_${encodeURIComponent(accountId)}`;

    try {
      localStorage.setItem(
        accountProgressKey,
        JSON.stringify(completedSteps)
      );

      window.dispatchEvent(
        new Event("skillBridgeProgressUpdated")
      );
    } catch (error) {
      console.error("Unable to save roadmap progress:", error);
    }
  }, [completedSteps, accountId, loadedAccountId, loading]);

  /* =====================================
     SELECT ROADMAP
  ===================================== */

  const selectedRoadmap =
    roadmaps[rolePathway[targetRole] || targetRole] ||
    generalRoadmap;

  useEffect(() => {
    if (loading || !accountId || loadedAccountId !== accountId) {
      return;
    }

    window.dispatchEvent(
      new Event("skillBridgeRoadmapUpdated")
    );
  }, [targetRole, selectedRoadmap, accountId, loadedAccountId, loading]);

  const roleProgress = Array.isArray(completedSteps[targetRole])
    ? completedSteps[targetRole]
    : [];

  const completedCount = selectedRoadmap.filter((step) =>
    roleProgress.includes(step.title)
  ).length;

  const progressPercentage = Math.round(
    (completedCount / selectedRoadmap.length) * 100
  );

  const nextStep = selectedRoadmap.find(
    (step) => !roleProgress.includes(step.title)
  );

  /* =====================================
     TOGGLE COMPLETION
  ===================================== */

  function toggleStep(stepTitle) {
    if (
      loading ||
      !accountId ||
      loadedAccountId !== accountId
    ) {
      return;
    }

    setCompletedSteps((previous) => {
      const currentCompleted = Array.isArray(previous[targetRole])
        ? previous[targetRole]
        : [];

      const updatedCompleted = currentCompleted.includes(stepTitle)
        ? currentCompleted.filter((title) => title !== stepTitle)
        : [...currentCompleted, stepTitle];

      return {
        ...previous,
        [targetRole]: updatedCompleted,
      };
    });
  }

  /* =====================================
     WAIT FOR AUTHENTICATION
  ===================================== */

  if (
    loading ||
    !accountId ||
    loadedAccountId !== accountId
  ) {
    return (
      <main className="roadmap-page">
        <header className="roadmap-header">
          <h1>Your Learning Roadmap</h1>
          <p>Loading your learning roadmap...</p>
        </header>
      </main>
    );
  }

  /* =====================================
     UI
  ===================================== */

  return (
    <main className="roadmap-page">
      <header className="roadmap-header">
        <h1>Your Learning Roadmap</h1>
        <p>
          Follow a structured plan to move towards your career goal.
        </p>
      </header>

      <div className="roadmap-selector">
        <label htmlFor="roadmap-stream">
          Your Educational Stream
        </label>

        <select
          id="roadmap-stream"
          value={educationalStream}
          disabled
        >
          <option>{educationalStream}</option>
        </select>

        <label htmlFor="roadmap-role">
          Choose your target role
        </label>

        <select
          id="roadmap-role"
          value={targetRole}
          onChange={(event) => setTargetRole(event.target.value)}
        >
          {!careerOptions.includes(targetRole) && (
            <option value={targetRole}>{targetRole}</option>
          )}

          {careerOptions.map((role) => (
            <option key={role} value={role}>
              {role === "Other" ? "Other / General Career" : role}
            </option>
          ))}
        </select>
      </div>

      <section className="learning-progress-card">
        <div className="learning-progress-heading">
          <h2>Your Learning Progress</h2>
          <span>{progressPercentage}%</span>
        </div>

        <div
          className="learning-progress-track"
          role="progressbar"
          aria-label="Learning roadmap completion"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
        >
          <div
            className="learning-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p>
          {completedCount} of {selectedRoadmap.length} learning steps completed
        </p>

        {nextStep ? (
          <div className="roadmap-next-step">
            <h3>Your Next Step</h3>
            <p>{nextStep.title}</p>
            <span>{nextStep.description}</span>
            <small>Estimated time: {nextStep.duration}</small>
          </div>
        ) : (
          <div className="roadmap-next-step roadmap-all-complete">
            <h3>Roadmap Completed!</h3>
            <p>You've completed every step for this career goal.</p>
            <span>
              Keep practising and build projects to strengthen your skills.
            </span>
          </div>
        )}
      </section>

      <section className="roadmap-list" aria-label="Learning steps">
        {selectedRoadmap.map((step, index) => {
          const isCompleted = roleProgress.includes(step.title);

          const isNextStep =
            !isCompleted && step.title === nextStep?.title;

          const statusClass = isCompleted
            ? "roadmap-card-completed"
            : isNextStep
            ? "roadmap-card-next"
            : "roadmap-card-upcoming";

          const statusLabel = isCompleted
            ? "Completed"
            : isNextStep
            ? "Next Step"
            : "Upcoming";

          return (
            <article
              className={`roadmap-card ${statusClass}`}
              key={step.title}
            >
              <div className="roadmap-number">
                {isCompleted ? "✓" : index + 1}
              </div>

              <div className="roadmap-content">
                <div className="roadmap-card-heading">
                  <h2>{step.title}</h2>
                  <span className="roadmap-status">{statusLabel}</span>
                </div>

                <p>{step.description}</p>

                <span className="roadmap-duration">
                  Estimated duration: {step.duration}
                </span>

                <div className="roadmap-resources">
                  <h3>Recommended Resources</h3>

                  {step.resources.map((resource) => (
                    <a
                      key={resource.title}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="roadmap-resource-link"
                    >
                      <span>
                        <strong>{resource.title}</strong>
                        <small>{resource.platform}</small>
                      </span>

                      <span className="roadmap-resource-arrow">↗</span>
                    </a>
                  ))}
                </div>

                <label className="roadmap-completion-label">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleStep(step.title)}
                  />
                  {isCompleted ? "Completed" : "Mark as completed"}
                </label>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export default Roadmap;
export { roadmaps, generalRoadmap, rolePathway };
