
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Send } from "lucide-react";
import "./Chatbot.css";

const STORAGE_KEY = "skillBridgeChatHistory";
const PROFILE_KEY = "skillBridgeProfile";
const MAX_MESSAGES = 50;

// Remove emojis from chatbot replies, including saved messages.
const cleanBotText = (text = "") =>
  text
    .replace(
      /[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D]/gu,
      ""
    )
    .replace(/[ \t]+/g, " ")
    .trim();

// Create welcome message.
const createWelcomeMessage = () => ({
  sender: "bot",
  text: "Hi! Welcome to SkillBridge AI! I'm your personal career assistant. I can help you with resumes, skills, career planning, professional communication, and interview preparation. What would you like to explore today?",
  time: new Date().toISOString(),
});

// Load saved conversation.
const getSavedMessages = () => {
  try {
    const savedMessages = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    if (Array.isArray(savedMessages) && savedMessages.length > 0) {
      return savedMessages.slice(-MAX_MESSAGES).map((savedMessage) =>
        savedMessage?.sender === "bot"
          ? {
              ...savedMessage,
              text: cleanBotText(savedMessage.text || ""),
            }
          : savedMessage
      );
    }
  } catch (error) {
    console.error("Unable to load chat history:", error);
  }

  return [createWelcomeMessage()];
};

// Stream-specific learning guidance.
const streamGuidance = {
  "engineering & technology": {
    focus: "technical knowledge, practical projects and problem-solving",
    advice:
      "Strengthen your fundamentals, practise technical concepts, build projects and learn to explain your technical decisions.",
    examples:
      "software development, engineering projects, programming, testing, technical documentation and problem-solving",
  },

  commerce: {
    focus: "business knowledge, financial understanding and analytical skills",
    advice:
      "Develop your understanding of accounting, finance, business operations, communication and relevant digital tools.",
    examples:
      "financial analysis, accounting exercises, business case studies, spreadsheets and market research",
  },

  "arts & humanities": {
    focus: "communication, research, creativity and critical thinking",
    advice:
      "Build strong writing and communication skills, practise research, develop critical thinking and create a portfolio of your work.",
    examples:
      "research projects, content writing, presentations, creative work and social analysis",
  },

  management: {
    focus: "leadership, business strategy and organisational skills",
    advice:
      "Develop leadership, teamwork, decision-making, business communication and project management skills.",
    examples:
      "business case studies, management presentations, marketing plans, team projects and strategic analysis",
  },

  science: {
    focus: "scientific knowledge, research and analytical thinking",
    advice:
      "Strengthen your subject fundamentals, practise scientific analysis and develop research and practical investigation skills.",
    examples:
      "laboratory work, research projects, data analysis, scientific reports and practical experiments",
  },

  "medical & healthcare": {
    focus: "healthcare knowledge, practical competence and patient communication",
    advice:
      "Strengthen your subject knowledge, develop professional communication, understand healthcare ethics and focus on practical learning.",
    examples:
      "case studies, healthcare research, clinical concepts, patient communication and healthcare documentation",
  },

  law: {
    focus: "legal knowledge, research, reasoning and professional communication",
    advice:
      "Develop your understanding of legal concepts, practise legal research, improve argumentation and build clear professional writing skills.",
    examples:
      "case analysis, legal research, moot court preparation, legal writing and policy analysis",
  },

  "design & creative arts": {
    focus: "creative thinking, design skills and portfolio development",
    advice:
      "Practise your creative tools, understand design principles, develop original concepts and build a portfolio that demonstrates your process.",
    examples:
      "design projects, visual presentations, creative portfolios, branding concepts and user-focused designs",
  },

  "vocational studies": {
    focus: "practical abilities, technical training and workplace readiness",
    advice:
      "Focus on hands-on practice, industry-relevant tools, professional behaviour and demonstrating your abilities through practical work.",
    examples:
      "practical assignments, demonstrations, trade-specific projects, workplace simulations and skill assessments",
  },

  other: {
    focus: "subject knowledge, practical experience and transferable skills",
    advice:
      "Strengthen your knowledge, identify relevant career requirements and build practical experience through projects and activities.",
    examples:
      "subject-related projects, research, presentations, practical assignments and professional development",
  },
};

function Chatbot() {
  const location = useLocation();
  const currentPage = location.pathname;

  // Page-specific suggestions.
  const pageSuggestions = {
    "/resume-checker": [
      "How can I improve my resume?",
      "What mistakes should I fix in my resume?",
      "How can I make my resume ATS-friendly?",
      "What skills should I add to my resume?",
    ],

    "/opportunities": [
      "Which jobs match my profile?",
      "What skills are required for these jobs?",
      "How can I improve my chances of getting hired?",
      "How should I prepare before applying?",
    ],

    "/skill-gap": [
      "Which skills am I missing?",
      "How can I improve my skill match?",
      "Which skill should I learn first?",
      "How can I become job-ready?",
    ],

    "/roadmap": [
      "What should I learn next?",
      "How can I follow my learning roadmap?",
      "How should I track my learning progress?",
      "Can you help me plan my learning?",
    ],

    "/resources": [
      "Which learning resources should I use?",
      "How do I choose the right course?",
      "What should I practise today?",
      "Can you suggest project ideas?",
    ],

    "/dashboard": [
      "How am I progressing?",
      "What should I focus on next?",
      "How can I improve my career readiness?",
      "Help me plan my learning goals.",
    ],
  };

  const defaultSuggestions = [
    "What do you know about my profile?",
    "Suggest skills for my career.",
    "Help me prepare for interviews.",
    "How can I improve my career readiness?",
  ];

  const suggestions =
    pageSuggestions[currentPage] || defaultSuggestions;

  const [isOpen, setIsOpen] = useState(false);

  // Read the student profile.
  const [studentProfile, setStudentProfile] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY));
    } catch (error) {
      return null;
    }
  });

  // Update profile whenever the student edits it.
  useEffect(() => {
    const updateStudentProfile = () => {
      try {
        const savedProfile = JSON.parse(
          localStorage.getItem(PROFILE_KEY)
        );

        setStudentProfile(savedProfile);
      } catch (error) {
        setStudentProfile(null);
      }
    };

    window.addEventListener(
      "skillBridgeProfileUpdated",
      updateStudentProfile
    );

    window.addEventListener("storage", updateStudentProfile);

    return () => {
      window.removeEventListener(
        "skillBridgeProfileUpdated",
        updateStudentProfile
      );

      window.removeEventListener(
        "storage",
        updateStudentProfile
      );
    };
  }, []);

  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [showClearConfirmation, setShowClearConfirmation] =
    useState(false);

  const [messages, setMessages] = useState(getSavedMessages);

  const messagesEndRef = useRef(null);

  // Save conversation whenever messages change.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(messages.slice(-MAX_MESSAGES))
      );
    } catch (error) {
      console.error("Unable to save chat history:", error);
    }
  }, [messages]);

  // Automatically scroll to the latest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  // =========================================
  // PROFILE CONTEXT
  // =========================================

  const getProfileContext = () => {
    const studentName =
      studentProfile?.studentName?.trim() || "there";

    const educationalStream =
      studentProfile?.educationalStream?.trim() || "";

    const course =
      studentProfile?.customCourse?.trim() ||
      studentProfile?.course?.trim() ||
      "";

    const targetRole =
      studentProfile?.targetRole?.trim() || "";

    const selectedSkills = Array.isArray(
      studentProfile?.selectedSkills
    )
      ? studentProfile.selectedSkills
      : [];

    const hasProfile = Boolean(
      studentProfile &&
      (
        studentProfile.studentName ||
        studentProfile.educationalStream ||
        studentProfile.course ||
        studentProfile.targetRole ||
        selectedSkills.length > 0
      )
    );

    const streamKey = educationalStream.toLowerCase();

    const streamInfo =
      streamGuidance[streamKey] || {
        focus: "subject knowledge, practical experience and career development",
        advice:
          "Build strong subject fundamentals, develop practical abilities and identify the skills required for your career.",
        examples:
          "practical projects, research, presentations and subject-related assignments",
      };

    const skillsText =
      selectedSkills.length > 0
        ? selectedSkills.join(", ")
        : "No skills added to your profile yet";

    return {
      studentName,
      educationalStream,
      course,
      targetRole,
      selectedSkills,
      skillsText,
      hasProfile,
      streamInfo,
    };
  };

  // =========================================
  // BOT RESPONSE GENERATION
  // =========================================

  const getBotResponse = (userMessage) => {
    const question = userMessage.toLowerCase().trim();

    const {
      studentName,
      educationalStream,
      course,
      targetRole,
      selectedSkills,
      skillsText,
      hasProfile,
      streamInfo,
    } = getProfileContext();

    const career = targetRole || "your chosen career";
    const stream = educationalStream || "your academic stream";
    const courseName = course || "your course";

    const profileContext = `
Your educational stream: ${stream}
Your course: ${courseName}
Your target career: ${career}
Your selected skills: ${skillsText}`;

    const asksForGeneralHelp =
      question.includes("help") ||
      question.includes("guide me") ||
      question.includes("what should i do") ||
      question.includes("where should i start");

    // =========================================
    // 1. PROFILE QUESTIONS
    // =========================================

    if (
      question.includes("my profile") ||
      question.includes("my target role") ||
      question.includes("my target career") ||
      question.includes("my selected skills") ||
      question.includes("what do you know about me") ||
      question.includes("my educational stream") ||
      question.includes("my stream") ||
      question.includes("my course") ||
      question.includes("my education")
    ) {
      if (!hasProfile) {
        return "I couldn't find your profile yet. Please complete your student profile so I can provide personalized guidance based on your education, career interests and skills.";
      }

      return `Here's the information available in your SkillBridge AI profile, ${studentName}:

Name: ${studentName}

Educational Stream: ${stream}

Course: ${courseName}

Target Career: ${career}

Selected Skills: ${skillsText}

I use these details to make my career and learning suggestions more relevant to your background.`;
    }

    // =========================================
    // 2. GREETINGS
    // =========================================

    if (
      /^(hello|hi|hey|good morning|good afternoon|good evening)[!. ]*$/.test(
        question
      )
    ) {
      return `Hello, ${studentName}!

Welcome to SkillBridge AI.

I can help you with your education, career planning, skill development, professional communication and interview preparation.

What would you like to work on today?`;
    }

    // =========================================
    // 3. SKILLBRIDGE PLATFORM
    // =========================================

    if (
      question.includes("skillbridge") ||
      question.includes("website") ||
      question.includes("platform")
    ) {
      return `Welcome to SkillBridge AI, ${studentName}!

SkillBridge AI helps students from different academic backgrounds prepare for their future careers.

The platform includes:

1. Student Profiles
2. Skill Gap Analysis
3. Personalized Learning Roadmaps
4. Learning Resources
5. Daily Learning Goals
6. Learning Progress Tracking
7. Resume Checker
8. Professional Communication and Corporate Readiness
9. Interview Preparation
10. Job Opportunities

The platform aims to connect academic learning with practical career preparation.

${hasProfile ? `Your current target career is ${career}.` : "Create your profile to get personalized career guidance."}`;
    }

    // =========================================
    // 4. STREAM AND COURSE GUIDANCE
    // =========================================

    if (
      question.includes("my stream") ||
      question.includes("my educational background") ||
      question.includes("my course") ||
      question.includes("my academic background") ||
      question.includes("what can i do after") ||
      question.includes("career options after")
    ) {
      if (!hasProfile) {
        return "Please complete your profile first. I can then use your educational stream and course to provide more relevant career guidance.";
      }

      return `Your Academic Background

Hi ${studentName}!

Your educational stream: ${stream}

Your course: ${courseName}

Your current target career: ${career}

Based on your academic background, I recommend focusing on ${streamInfo.focus}.

Some useful areas to explore include:

${streamInfo.examples}.

You can also explore different career opportunities related to your course and interests.

Remember that your educational background is a starting point. You can develop additional skills and explore career paths beyond your current subject area.`;
    }

    // =========================================
    // 5. STREAM-SPECIFIC LEARNING ADVICE
    // =========================================

    if (
      question.includes("which skills should i learn") ||
      question.includes("skills for my stream") ||
      question.includes("skills for my course") ||
      question.includes("what should i learn for my background")
    ) {
      return `Learning Recommendations for ${studentName}

Your educational stream: ${stream}

Your course: ${courseName}

Your target career: ${career}

Your learning focus should include ${streamInfo.focus}.

Here are my recommendations:

1. ${streamInfo.advice}
2. Identify the essential skills required for ${career}.
3. Practise through relevant assignments and practical activities.
4. Build projects or examples that demonstrate your abilities.
5. Improve your communication and workplace readiness.
6. Track your learning through your SkillBridge AI roadmap.

Your current profile skills:
${skillsText}

Try to develop one important skill at a time instead of learning everything together.`;
    }

    // =========================================
    // 6. PAGE-AWARE RESPONSES
    // =========================================

    if (
      currentPage === "/resume-checker" &&
      (
        asksForGeneralHelp ||
        question.includes("resume") ||
        question.includes("cv") ||
        question.includes("ats") ||
        question.includes("mistake") ||
        question.includes("improve my document")
      )
    ) {
      return `Resume Checker Guidance

Hi ${studentName}!

You're currently on the Resume Checker page.

Here's how to use it effectively:

1. Upload your resume in PDF format.
2. Wait for text extraction to finish.
3. Analyse your resume.
4. Review the strengths and areas that need improvement.
5. Check your education, skills, projects and experience.
6. Make the suggested changes and review your resume again.

Your profile information:
${profileContext}

For your target career (${career}), highlight relevant experience and practical work.

Your resume should also reflect the expectations of your educational background and chosen industry.

Tip: Use clear headings, concise bullet points and measurable achievements wherever possible.`;
    }

    if (
      currentPage === "/opportunities" &&
      (
        asksForGeneralHelp ||
        question.includes("job") ||
        question.includes("opportunit") ||
        question.includes("internship") ||
        question.includes("skill") ||
        question.includes("match") ||
        question.includes("apply") ||
        question.includes("hired") ||
        question.includes("employer")
      )
    ) {
      return `Job Opportunities Guidance

Hi ${studentName}!

You're currently on the Job Opportunities page.

Here's how to use it:

1. Search for roles related to ${career}.
2. Explore opportunities that match your educational background.
3. Use the available filters to narrow down listings.
4. Review the responsibilities and requirements.
5. Compare required skills with your current skills.
6. Save opportunities you want to revisit.
7. Read the employer's original application instructions.

Your profile information:
${profileContext}

Tip: Prioritise opportunities where you meet the core requirements. Use additional requirements to plan what to learn next.`;
    }

    if (
      currentPage === "/skill-gap" &&
      (
        asksForGeneralHelp ||
        question.includes("skill") ||
        question.includes("gap") ||
        question.includes("missing") ||
        question.includes("match") ||
        question.includes("job-ready") ||
        question.includes("job ready")
      )
    ) {
      return `Skill Gap Analysis Guidance

Hi ${studentName}!

Your Skill Gap Analysis helps you compare your current skills with the skills expected for your target career.

Your educational stream: ${stream}

Your course: ${courseName}

Your target career: ${career}

Your selected skills:
${skillsText}

Here's what I recommend:

1. Review the skills shown in your analysis.
2. Identify the skills you haven't learned or practised yet.
3. Prioritise essential career-related skills.
4. Use Learning Resources to study missing topics.
5. Practise each skill through a relevant project or assignment.
6. Revisit your analysis as your profile improves.

Tip: Focus on skills that are useful for your career rather than learning unrelated topics.`;
    }

    if (
      currentPage === "/roadmap" &&
      (
        asksForGeneralHelp ||
        question.includes("roadmap") ||
        question.includes("learn") ||
        question.includes("next") ||
        question.includes("milestone") ||
        question.includes("study") ||
        question.includes("learning plan") ||
        question.includes("track my progress")
      )
    ) {
      return `Learning Roadmap Guidance

Hi ${studentName}!

You're currently viewing your Learning Roadmap for ${career}.

Your academic background: ${stream} - ${courseName}

Here's how to make the most of your roadmap:

1. Start with the first incomplete learning milestone.
2. Understand the topics and objectives.
3. Use Learning Resources to study each topic.
4. Practise what you learn through relevant activities.
5. Mark a milestone complete only after practising it.
6. Move to the next milestone when you understand the topic.

Tip: Your learning should connect your academic knowledge with the practical skills required for ${career}.`;
    }

    if (
      currentPage === "/resources" &&
      (
        asksForGeneralHelp ||
        question.includes("resource") ||
        question.includes("course") ||
        question.includes("practis") ||
        question.includes("practice") ||
        question.includes("project") ||
        question.includes("tutorial") ||
        question.includes("study")
      )
    ) {
      return `Learning Resources Guidance

Hi ${studentName}!

You're currently on Learning Resources.

Your target career: ${career}

Your educational stream: ${stream}

Your course: ${courseName}

Here's how to choose and use resources:

1. Start with a topic identified in your Skill Gap Analysis.
2. Choose a beginner-friendly explanation or course.
3. Practise alongside the lesson.
4. Apply what you learn through projects or assignments.
5. Save useful resources and revisit them.
6. Move to advanced material once you understand the basics.

Your current skills:
${skillsText}

Tip: Choose resources that support both your academic background and your career goals.`;
    }

    if (
      currentPage === "/dashboard" &&
      (
        asksForGeneralHelp ||
        question.includes("progress") ||
        question.includes("focus") ||
        question.includes("goal") ||
        question.includes("career readiness") ||
        question.includes("career-ready") ||
        question.includes("career ready")
      )
    ) {
      return `Dashboard Guidance

Hi ${studentName}!

Use your Dashboard to review your learning activity and decide what to focus on next.

Your target career: ${career}

Your academic background: ${stream} - ${courseName}

Your profile skills:
${skillsText}

A practical next-step plan:

1. Review your current learning progress.
2. Check your daily goals.
3. Continue your next incomplete roadmap milestone.
4. Review your Skill Gap Analysis.
5. Practise an important skill through a project or exercise.
6. Work on your professional communication.

Tip: Choose one priority task each day and work towards completing it.`;
    }

    // =========================================
    // 7. PROFESSIONAL COMMUNICATION
    // =========================================

    if (
      question.includes("professional communication") ||
      question.includes("corporate readiness") ||
      question.includes("workplace communication") ||
      question.includes("professional email") ||
      question.includes("corporate etiquette")
    ) {
      return `Professional Communication Guidance

Hi ${studentName}!

Professional communication is important regardless of your educational background or target career.

I recommend practising these areas:

1. Professional email writing.
2. Clear workplace communication.
3. Interview communication.
4. Corporate etiquette.
5. Responding to feedback.
6. Participating in team discussions.

Your academic background: ${stream}

Your target career: ${career}

Try the Professional Communication and Corporate Readiness section on SkillBridge AI. Complete the exercises and compare your answers with the sample responses.

The goal is to communicate clearly, respectfully and confidently in professional situations.`;
    }

    // =========================================
    // 8. RESUME QUESTIONS
    // =========================================

    if (
      question.includes("resume") ||
      question.includes("cv")
    ) {
      return `Let's improve your resume, ${studentName}!

Your educational background: ${stream} - ${courseName}

Your target career: ${career}

Here are some suggestions:

1. Highlight skills relevant to your target career.
2. Include academic and practical projects.
3. Mention internships and certifications where relevant.
4. Use action words to describe your achievements.
5. Keep your resume clear and professional.
6. Include measurable achievements wherever possible.

Your current profile skills:
${skillsText}

Make sure your resume demonstrates your abilities through practical work and relevant examples.

You can use the Resume Checker page to review your PDF resume.`;
    }

    // =========================================
    // 9. CURRENT SKILLS
    // =========================================

    if (
      question.includes("what skills do i have") ||
      question.includes("my current skills") ||
      question.includes("skills in my profile")
    ) {
      if (!hasProfile) {
        return "Please create your student profile first. Then I can tell you which skills you have selected!";
      }

      return `Here are your current skills, ${studentName}:

${skillsText}

Your educational stream: ${stream}

Your course: ${courseName}

Your target career: ${career}

Keep updating your skills as you learn new concepts and complete practical activities!`;
    }

    // =========================================
    // 10. SKILL DEVELOPMENT
    // =========================================

    if (
      question.includes("skill") ||
      question.includes("learn") ||
      question.includes("improve myself")
    ) {
      return `Your Personalized Learning Advice

Hi ${studentName}!

Your academic background: ${stream} - ${courseName}

Your target career: ${career}

Your selected skills:
${skillsText}

Your learning focus should include ${streamInfo.focus}.

Here is what I recommend:

1. Strengthen your existing skills.
2. Identify additional skills required for ${career}.
3. Practise through relevant projects and assignments.
4. Follow your Learning Roadmap.
5. Explore relevant Learning Resources.
6. Set daily learning goals and track your progress.

Remember: Consistent practice is more valuable than trying to learn everything at once!`;
    }

    // =========================================
    // 11. ROADMAP AND LEARNING PLAN
    // =========================================

    if (
      question.includes("roadmap") ||
      question.includes("learning plan") ||
      question.includes("what should i learn next")
    ) {
      return `Your Learning Roadmap

Hi ${studentName}!

Your target career: ${career}

Your educational stream: ${stream}

Your course: ${courseName}

I recommend following this approach:

1. Review the skills required for your target career.
2. Identify which skills you still need to develop.
3. Connect your academic knowledge with practical learning.
4. Follow the Learning Roadmap.
5. Complete one milestone at a time.
6. Practise what you learn through relevant projects.
7. Track your daily learning goals.

Visit the Learning Roadmap section to continue your learning journey!`;
    }

    // =========================================
    // 12. INTERVIEW PREPARATION
    // =========================================

    if (
      question.includes("interview") ||
      question.includes("placement")
    ) {
      return `Interview Preparation for ${career}

Hi ${studentName}!

Here is your preparation plan:

1. Study the fundamentals related to ${career}.
2. Prepare commonly asked interview questions.
3. Practise explaining your projects and skills.
4. Connect your academic knowledge to real-world situations.
5. Improve your professional communication.
6. Prepare examples that demonstrate your abilities.
7. Practise answering questions with confidence.

Your educational background: ${stream} - ${courseName}

Your selected skills:
${skillsText}

My suggestion: Start with basic questions and gradually move towards more advanced topics.`;
    }

    // =========================================
    // 13. CAREER AND JOB GUIDANCE
    // =========================================

    if (
      question.includes("career") ||
      question.includes("job") ||
      question.includes("profession") ||
      question.includes("internship")
    ) {
      return `Your Career Development Plan

Hi ${studentName}!

Your academic background: ${stream} - ${courseName}

Your target career: ${career}

Your current skills:
${skillsText}

Here is what you should focus on:

1. Understand the responsibilities of a ${career}.
2. Research the qualifications and skills employers expect.
3. Identify gaps in your current skill set.
4. Build practical experience related to your field.
5. Create a professional resume and portfolio.
6. Improve your communication and interview skills.
7. Explore relevant internships and job opportunities.

Your academic background can provide a foundation, while additional skills and experience can help you explore more career opportunities.`;
    }

    // =========================================
    // 14. PROJECT AND PORTFOLIO SUGGESTIONS
    // =========================================

    if (
      question.includes("project") ||
      question.includes("portfolio")
    ) {
      return `Project Recommendations for ${career}

Hi ${studentName}!

Your educational stream: ${stream}

Your course: ${courseName}

Your selected skills:
${skillsText}

Here are some suggestions:

1. Start with a beginner-friendly project related to your field.
2. Build an intermediate project that solves a real-world problem.
3. Create an advanced project demonstrating your abilities.
4. Document your work and explain the process.
5. Include your best work in a portfolio.
6. Prepare to explain your contribution during interviews.

Some suitable project areas include:
${streamInfo.examples}.

Focus on quality, practical value and clearly demonstrating what you have learned.`;
    }

    // =========================================
    // 15. DEFAULT RESPONSE
    // =========================================

    return `That's an interesting question, ${studentName}!

I can currently help you with:

1. Resume improvement.
2. Skill development.
3. Learning roadmaps.
4. Stream and course-related career guidance.
5. Interview preparation.
6. Professional communication.
7. Career and internship guidance.
8. Project recommendations.

You can also ask me about your saved profile and I can show you the information available there.

${hasProfile ? `Your current target career is ${career}.` : "Complete your profile to receive personalized guidance."}

Try asking me a specific question, and I'll guide you!`;
  };

  // =========================================
  // SEND MESSAGE
  // =========================================

  const handleSendMessage = () => {
    if (!message.trim() || isTyping) return;

    const userMessage = message.trim();

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        sender: "user",
        text: userMessage,
        time: new Date().toISOString(),
      },
    ].slice(-MAX_MESSAGES));

    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply = cleanBotText(
        getBotResponse(userMessage)
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          sender: "bot",
          text: botReply,
          time: new Date().toISOString(),
        },
      ].slice(-MAX_MESSAGES));

      setIsTyping(false);
    }, 1200);
  };

  // =========================================
  // CLEAR CHAT
  // =========================================

  const handleClearChat = () => {
    const welcomeMessage = createWelcomeMessage();

    setMessages([welcomeMessage]);
    setMessage("");
    setIsTyping(false);
    setShowClearConfirmation(false);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([welcomeMessage])
    );
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div className="chatbot-container">

      {!isOpen && (
        <button
          className="chatbot-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open SkillBridge AI assistant"
        >
          <MessageCircle size={25} strokeWidth={1.8} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot-window">

          {/* Chatbot Header */}
          <div className="chatbot-header">
            <div>
              <h3>
                {studentProfile?.studentName
                  ? `Hi, ${studentProfile.studentName}!`
                  : "SkillBridge AI"}
              </h3>

              <span>Your personal career assistant</span>
            </div>

            <div className="chatbot-header-actions">

              <button
                className="chatbot-clear"
                onClick={() => setShowClearConfirmation(true)}
                title="Clear conversation"
              >
                Clear
              </button>

              <button
                className="chatbot-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                ×
              </button>

            </div>
          </div>

          {/* Clear Chat Confirmation */}
          {showClearConfirmation && (
            <div className="clear-confirmation">
              <div className="clear-confirmation-box">

                <h3>Clear conversation?</h3>

                <p>
                  Are you sure you want to clear your chat history?
                  This action cannot be undone.
                </p>

                <div className="clear-confirmation-actions">

                  <button
                    className="cancel-clear"
                    onClick={() =>
                      setShowClearConfirmation(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="confirm-clear"
                    onClick={handleClearChat}
                  >
                    Clear Chat
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div className="chatbot-messages">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.sender === "user"
                    ? "user-message"
                    : "bot-message"
                }
              >
                <div className="message-text">
                  {msg.text}
                </div>

                <div className="message-time">
                  {new Date(msg.time).toLocaleTimeString(
                    "en-IN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </div>
              </div>
            ))}

            {/* Suggested Questions */}
            {messages.length === 1 && (
              <div className="suggested-questions">
                <p>Here are some things you can ask me:</p>

                {suggestions.map((question, index) => (
                  <button
                    key={index}
                    className="suggestion-button"
                    onClick={() => setMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="bot-message typing-indicator">
                SkillBridge AI is typing...
              </div>
            )}

            <div ref={messagesEndRef} />

          </div>

          {/* Chat Input */}
          <div className="chatbot-input-area">

            <input
              type="text"
              placeholder="Ask me anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />

            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              aria-label="Send message"
            >
              <Send size={18} strokeWidth={2} />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Chatbot;
