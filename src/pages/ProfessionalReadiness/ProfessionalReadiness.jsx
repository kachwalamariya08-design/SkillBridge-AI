
import { useEffect, useState } from "react";
import {
  Mail,
  MessageSquare,
  Users,
  BriefcaseBusiness,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  Target,
  ArrowLeft,
  PenLine,
  ClipboardCheck,
  Clock3,
  Award,
  Brain,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import "./ProfessionalReadiness.css";

const PROFILE_STORAGE_KEY = "skillBridgeProfile";

// These are base keys. Actual storage keys are generated per account.
const STORAGE_KEY = "skillBridgeReadinessProgress";
const PRACTICE_STORAGE_KEY = "skillBridgeReadinessPractice";
const CHECKLIST_STORAGE_KEY = "skillBridgeReadinessChecklist";

/*
 * Existing module IDs and the first three lesson positions are preserved.
 * This keeps previously saved lesson-completion keys valid.
 */
const modules = [
  {
    id: "email",
    title: "Professional Email Writing",
    description:
      "Develop precise, persuasive and audience-aware written communication for real workplace situations.",
    icon: Mail,
    lessons: [
      {
        title: "Introduction to Professional Emails",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "A professional email is a written record of a business or academic interaction. Effective emails make the purpose immediately clear, give the recipient the context needed to act and make the next step explicit.",
        points: [
          "Use a subject line that communicates the topic and required action.",
          "Put the most important information near the beginning.",
          "Separate context, request and deadline so the message is easy to scan.",
          "Use a tone suited to the recipient and the relationship.",
          "Proofread names, dates, attachments and action requests before sending.",
        ],
        example: {
          subject: "Application for Internship Opportunity",
          body: `Dear Hiring Manager,

I am writing to express my interest in the internship opportunity at your organisation. I would appreciate the opportunity to discuss my application further.

Thank you for your time and consideration.

Regards,
Your Name`,
        },
      },
      {
        title: "Writing Formal Applications",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Formal applications are used to request opportunities, permissions or consideration. A strong application establishes who you are, states the request, provides relevant evidence and makes the next step easy for the recipient.",
        points: [
          "State the purpose of the application in the opening paragraph.",
          "Include only details relevant to the request.",
          "Support your request with evidence where appropriate.",
          "Mention attached documents explicitly.",
          "Close with a clear, courteous request for consideration.",
        ],
        example: {
          subject: "Application for Leave",
          body: `Dear Sir/Madam,

I am writing to request leave for two days due to personal reasons. I would be grateful if you could approve my request.

Thank you for your understanding.

Regards,
Your Name`,
        },
      },
      {
        title: "Follow-up Emails",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "A follow-up email helps move an unanswered conversation forward without creating unnecessary pressure. It should remind the recipient of the context, state the reason for following up and make a reasonable request.",
        points: [
          "Reply in the existing email thread when possible.",
          "Refer briefly to the original application or conversation.",
          "Ask for an update without assuming the recipient has ignored you.",
          "Avoid repeated follow-ups within an unreasonable interval.",
          "Thank the recipient and retain a professional tone.",
        ],
        example: {
          subject: "Follow-up Regarding Internship Application",
          body: `Dear Hiring Manager,

I hope you are doing well. I am following up on my internship application submitted recently. I would appreciate any update regarding its status.

Thank you for your time.

Regards,
Your Name`,
        },
      },
      {
        title: "Escalation and Risk Communication",
        difficulty: "Advanced",
        duration: "25 min",
        content:
          "An escalation email communicates a risk that cannot be resolved at the current level or may affect a commitment. The goal is not to assign blame. It is to make the impact visible, explain what has already been attempted and request a decision or support before the risk becomes a larger problem.",
        points: [
          "Lead with the issue and the impact on delivery, quality, cost or stakeholders.",
          "Distinguish confirmed facts from assumptions.",
          "Explain what has already been tried and why it has not resolved the issue.",
          "Present realistic options with trade-offs instead of sending only a problem.",
          "State the decision or support required and the time by which it is needed.",
          "Keep the language factual; avoid blame, exaggeration and emotional wording.",
        ],
        example: {
          subject: "Decision Required: Delivery Risk for Client Milestone",
          body: `Hello [Manager Name],

I want to flag a delivery risk for the client milestone scheduled for [date]. The integration work is blocked because the external API credentials have not yet been provided. The team has completed the work that can proceed independently, but the remaining integration and testing cannot be completed until access is available.

We have followed up with the service owner and prepared a test plan so work can resume as soon as access is granted. The current risk is a delay to the planned handover.

Could you help confirm an escalation contact or approve a revised handover plan by [time/date]? I will share another status update once we have confirmation.

Regards,
[Your Name]`,
        },
      },
      {
        title: "Negotiation and Difficult Email Threads",
        difficulty: "Advanced",
        duration: "25 min",
        content:
          "Professional negotiation by email means reaching a workable agreement while protecting the relationship. Strong messages acknowledge the other party's needs, explain constraints with evidence and offer alternatives that can be evaluated.",
        points: [
          "Identify the outcome each party needs before proposing a compromise.",
          "Explain constraints using facts rather than vague statements.",
          "Offer options, such as revised scope, phased delivery or a new deadline.",
          "Make concessions deliberately; do not promise work that cannot be delivered.",
          "Confirm the agreed owner, deliverable and date in writing.",
          "If a thread becomes tense, move to a call when appropriate and summarise decisions afterward.",
        ],
        example: {
          subject: "Proposed Adjustment to Project Timeline",
          body: `Hello [Name],

I understand that the original delivery date is important to your team. Based on the additional review requirements, completing the full scope by Friday would create a quality risk.

One option is to deliver the completed priority items on Friday and the remaining items by Tuesday. Alternatively, we can retain Friday as the date if the lower-priority items are moved to a later phase.

Please let me know which option best supports your priorities. Once confirmed, I will update the delivery plan and owners.

Regards,
[Your Name]`,
        },
      },
    ],
  },
  {
    id: "workplace",
    title: "Workplace Communication",
    description:
      "Handle complex conversations, coordinate teams and communicate clearly under pressure.",
    icon: MessageSquare,
    lessons: [
      {
        title: "Communicating Professionally",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Professional communication means sharing information respectfully, clearly and appropriately. It also involves listening, checking understanding and choosing the right communication channel.",
        points: [
          "Listen carefully before responding.",
          "Use polite and respectful language.",
          "Stay focused on the topic and desired outcome.",
          "Ask questions when something is unclear.",
          "Adapt the level of detail to the audience.",
        ],
        example: {
          subject: "Instead of saying",
          body: `Unprofessional: I don't understand this. Explain it again.

Professional: Could you please clarify this point? I would like to make sure I understand it correctly.`,
        },
      },
      {
        title: "Professional Messaging",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Workplace messages are useful for quick coordination, but short messages still need context. A good message explains why you are contacting someone, what you need and when you need it.",
        points: [
          "Start with a suitable greeting when appropriate.",
          "Explain your message directly.",
          "Avoid slang and unnecessary abbreviations.",
          "Do not use chat messages for sensitive or complex discussions that need a formal record.",
          "Respond within a reasonable time or acknowledge when you will respond.",
        ],
        example: {
          subject: "Request for Clarification",
          body: `Hello,

Could you please share some clarification regarding the assigned task? I want to ensure that I complete it correctly.

Thank you.`,
        },
      },
      {
        title: "Team Communication",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Effective teamwork requires shared understanding of goals, responsibilities and progress. Communication should make dependencies visible early, rather than waiting until a deadline is missed.",
        points: [
          "Share progress regularly and accurately.",
          "Respect different opinions and expertise.",
          "Communicate delays as soon as they become foreseeable.",
          "Make task ownership and dependencies explicit.",
          "Give and receive feedback constructively.",
        ],
        example: {
          subject: "Project Update",
          body: `Hello Team,

I have completed my assigned part of the project. I will review the remaining tasks and share any updates during our next discussion.

Thank you.`,
        },
      },
      {
        title: "Resolving Conflict and Conflicting Instructions",
        difficulty: "Advanced",
        duration: "30 min",
        content:
          "Workplace conflict often comes from unclear expectations, competing priorities or different interpretations of a goal. A professional response separates the people from the problem, confirms the facts and moves the discussion toward an agreed decision.",
        points: [
          "Describe the observable issue rather than judging a person's intentions.",
          "Ask each stakeholder to clarify their expectations and constraints.",
          "Identify where instructions conflict and what decision is needed.",
          "Use agreed priorities, deadlines and project goals to guide the discussion.",
          "Document the final decision, owner and next checkpoint.",
          "Escalate respectfully when the conflict creates a material delivery, compliance or safety risk.",
        ],
        example: {
          subject: "Clarifying Competing Priorities",
          body: `Hello [Names],

I have received two requests with overlapping deadlines: [Task A] for [person/team] and [Task B] for [person/team]. Based on the current workload, I cannot complete both to the expected standard by the requested times.

Could we confirm which task has priority, or agree on a revised sequence? Once the priority is confirmed, I will share an updated timeline with both teams.

Regards,
[Your Name]`,
        },
      },
      {
        title: "Managing Stakeholders and Project Updates",
        difficulty: "Advanced",
        duration: "30 min",
        content:
          "Stakeholder communication is not simply reporting activity. It means giving each audience the information they need to make decisions. A project team may need detailed blockers, while a senior stakeholder may need impact, options and a decision request.",
        points: [
          "Map stakeholders by their influence, interest and information needs.",
          "Tailor detail without changing the underlying facts.",
          "Separate completed work, current risks and forecast dates.",
          "Raise a risk with its likely impact and mitigation plan.",
          "Avoid reporting uncertain estimates as confirmed commitments.",
          "Close updates with clear owners and next actions.",
        ],
        example: {
          subject: "Weekly Project Status",
          body: `Status: At risk

Completed: Requirements review and initial prototype.
In progress: Integration and validation.
Risk: A delayed dependency may affect the planned handover.
Mitigation: The team is preparing an alternative test path while access is confirmed.
Decision required: Confirm whether the lower-priority feature can move to the next release.
Next update: [Date and time]

Regards,
[Your Name]`,
        },
      },
    ],
  },
  {
    id: "interview",
    title: "Interview Communication",
    description:
      "Prepare for behavioural, situational and role-related interviews with structured, evidence-based answers.",
    icon: BriefcaseBusiness,
    lessons: [
      {
        title: "Introducing Yourself",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "A good self-introduction briefly explains your background, relevant strengths and direction. It should be tailored to the role rather than delivered as a full personal history.",
        points: [
          "Start with your current education or professional background.",
          "Mention relevant projects, experience or responsibilities.",
          "Highlight strengths that matter to the role.",
          "Explain why the opportunity interests you.",
          "Keep the introduction focused and conversational.",
        ],
        example: {
          subject: "Sample Self-Introduction",
          body: `Good morning. My name is Your Name. I am currently pursuing my education in my chosen field. I am interested in developing my professional skills and gaining practical experience. I consider myself a motivated learner who enjoys taking on new challenges. I look forward to contributing and learning through this opportunity.`,
        },
      },
      {
        title: "Answering Common Questions",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Interview answers should respond directly to the question, include relevant evidence and avoid unsupported claims. A concise example is often more convincing than a list of adjectives.",
        points: [
          "Understand what the interviewer is asking.",
          "Give a direct answer before adding detail.",
          "Support your answer with a specific example.",
          "Avoid memorised or exaggerated responses.",
          "Connect your example to the role when relevant.",
        ],
        example: {
          subject: "Question: What are your strengths?",
          body: `One of my strengths is my willingness to learn. When I encounter something unfamiliar, I try to understand it, practise it and apply what I have learned. I am also comfortable working with others and accepting feedback.`,
        },
      },
      {
        title: "Speaking with Confidence",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Confidence comes from preparation, clear communication and the ability to express your thoughts calmly. It does not require pretending to know everything.",
        points: [
          "Speak at a steady pace.",
          "Maintain natural eye contact where culturally appropriate.",
          "Avoid rushing through answers.",
          "Take a moment to organise your thoughts.",
          "If you do not know something, explain how you would approach learning or solving it.",
        ],
        example: {
          subject: "When you don't know an answer",
          body: `I am not completely familiar with that topic yet. I would first clarify the requirement, review the relevant documentation and test my understanding. I would be happy to explain how I would approach the problem.`,
        },
      },
      {
        title: "Behavioural Interviews Using the STAR Method",
        difficulty: "Advanced",
        duration: "30 min",
        content:
          "Behavioural questions ask for evidence of how you acted in a real situation. The STAR structure helps keep an answer focused: Situation, Task, Action and Result. The Action section should receive the most attention because it shows what you personally contributed.",
        points: [
          "Situation: Give only the context needed to understand the challenge.",
          "Task: Explain your responsibility or the goal you had to achieve.",
          "Action: Describe the specific steps you personally took and why.",
          "Result: State the outcome, using measurable evidence where available.",
          "Reflection: Explain what you learned if the question invites it.",
          "Be precise about your own contribution in team achievements.",
        ],
        example: {
          subject: "STAR answer framework",
          body: `Situation: Our student project was falling behind because tasks and ownership were unclear.

Task: I was responsible for coordinating the remaining work before the demonstration.

Action: I listed the outstanding tasks, confirmed owners, identified dependencies and arranged short progress check-ins. When one task became blocked, I helped the team agree on a smaller deliverable that could be completed first.

Result: We completed the essential demonstration flow on time and documented the remaining work for the next iteration.

Reflection: I learned to make dependencies and risks visible earlier.`,
        },
      },
      {
        title: "Situational, Case-Based and Follow-up Questions",
        difficulty: "Advanced",
        duration: "30 min",
        content:
          "Situational interviews test how you reason when there is no single obvious answer. Interviewers may introduce new constraints after your first response. A strong candidate clarifies assumptions, explains trade-offs, chooses a defensible approach and adapts when new information appears.",
        points: [
          "Clarify the objective, constraints and success criteria.",
          "State important assumptions instead of treating them as facts.",
          "Compare options using impact, effort, risk and urgency.",
          "Explain your decision and what evidence would change it.",
          "Respond calmly when the interviewer challenges your approach.",
          "Do not bluff; explain how you would investigate unknown information.",
        ],
        example: {
          subject: "Case response structure",
          body: `First, I would clarify the expected outcome and the constraints.

I would then identify the available options and compare them based on impact, time, risk and resources. I would recommend the option that best meets the priority while explaining its trade-offs.

Before implementation, I would confirm the decision with the relevant stakeholders. I would monitor the result and adjust the plan if the assumptions prove incorrect.`,
        },
      },
    ],
  },
  {
    id: "etiquette",
    title: "Corporate Etiquette",
    description:
      "Build sound professional judgement in meetings, feedback, ethical decisions and collaborative work.",
    icon: Users,
    lessons: [
      {
        title: "Professional Behaviour",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Professional behaviour involves being responsible, respectful and reliable in academic and workplace environments. It is demonstrated through consistent actions, not just formal language.",
        points: [
          "Be punctual and prepared.",
          "Take responsibility for your work.",
          "Respect colleagues and supervisors.",
          "Communicate honestly about progress and mistakes.",
          "Maintain appropriate professional boundaries.",
        ],
        example: {
          subject: "Professional Habit",
          body: `If you are running late for a meeting, inform the concerned person as early as possible and provide a realistic arrival time.`,
        },
      },
      {
        title: "Workplace Meetings",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Meetings help teams discuss ideas, make decisions and coordinate their work. Good meeting behaviour includes preparation, purposeful contributions and clear follow-through.",
        points: [
          "Join meetings on time.",
          "Prepare relevant information beforehand.",
          "Allow others to finish speaking.",
          "Share ideas clearly and respectfully.",
          "Record decisions, owners and deadlines.",
        ],
        example: {
          subject: "Participating in a Meeting",
          body: `I would like to add a suggestion to this discussion. We could consider dividing the task into smaller parts so that everyone has a clear responsibility.`,
        },
      },
      {
        title: "Teamwork and Professional Conduct",
        difficulty: "Foundation",
        duration: "15 min",
        content:
          "Good professional conduct helps create a respectful and productive working environment. It includes protecting confidential information, recognising contributions and addressing disagreements constructively.",
        points: [
          "Respect everyone's contribution.",
          "Avoid unnecessary conflicts.",
          "Handle disagreements constructively.",
          "Keep confidential information private.",
          "Give credit accurately and do not present another person's work as your own.",
        ],
        example: {
          subject: "Handling Disagreement",
          body: `I understand your point of view. I have a slightly different suggestion, and I would like to explain why it might also work.`,
        },
      },
      {
        title: "Ethical Judgement and Confidentiality",
        difficulty: "Advanced",
        duration: "30 min",
        content:
          "Professional judgement includes recognising when a decision could affect privacy, fairness, safety or trust. If you are unsure whether information can be shared or an action is appropriate, pause and check the relevant policy or authorised person rather than making assumptions.",
        points: [
          "Share confidential information only with authorised people and for a legitimate purpose.",
          "Do not access, copy or disclose data simply because it is technically available.",
          "Disclose conflicts of interest that could affect your judgement.",
          "Correct inaccurate information rather than allowing others to rely on it.",
          "Use official reporting channels for serious misconduct or safety concerns.",
          "Keep a factual record of decisions when accountability matters.",
        ],
        example: {
          subject: "Responding to a request for confidential data",
          body: `I understand why the information would be useful. Before sharing it, I need to confirm that the request is authorised and that the data can be shared for this purpose.

I will check the applicable process with the appropriate owner and let you know what information can be provided safely.`,
        },
      },
      {
        title: "Giving Feedback and Leading Discussions",
        difficulty: "Advanced",
        duration: "30 min",
        content:
          "Constructive feedback focuses on observable behaviour and its impact, then agrees on a practical next step. Leading a discussion also means making space for different views, keeping the group focused and confirming decisions.",
        points: [
          "Describe the specific behaviour or work product rather than labelling a person.",
          "Explain the impact using concrete examples.",
          "Invite the other person's perspective before concluding.",
          "Agree on a realistic improvement action and follow-up point.",
          "In meetings, summarise options and check whether the group has reached a decision.",
          "Document actions, owners and due dates after the discussion.",
        ],
        example: {
          subject: "Constructive feedback",
          body: `I noticed that the last two status updates were shared after the agreed time. This made it difficult for the team to identify blockers before the review.

Could we agree on a shorter update by 3 PM on review days? I would also like to understand whether the current reporting process is creating any difficulty.`,
        },
      },
    ],
  },
];

/* =========================================
   PRACTICE EXERCISES
   Existing exercise IDs are preserved.
========================================= */

const practiceExercises = [
  {
    id: "email-practice",
    module: "Professional Email Writing",
    level: "Foundation",
    title: "Write an Internship Application Email",
    scenario:
      "You found an internship opportunity at a company. Write a professional email to the hiring manager expressing your interest in applying.",
    instructions:
      "Include a suitable subject, greeting, introduction, reason for applying and a polite closing.",
    sampleAnswer: `Subject: Application for Internship Opportunity

Dear Hiring Manager,

I am writing to express my interest in the internship opportunity at your organisation. I am eager to gain practical experience and develop my professional skills.

I would appreciate the opportunity to be considered for this position. Please find my resume attached for your review.

Thank you for your time and consideration.

Regards,
Your Name`,
    checklist: [
      "Did I include a clear subject line?",
      "Did I use a professional greeting?",
      "Did I explain why I am applying?",
      "Did I maintain a polite and formal tone?",
      "Did I include an appropriate closing?",
    ],
  },
  {
    id: "email-information",
    module: "Professional Email Writing",
    level: "Foundation",
    title: "Request Information Through Email",
    scenario:
      "You are interested in joining a professional training programme, but you need information about its eligibility criteria, duration and registration process. Write an email to the programme coordinator.",
    instructions:
      "Introduce yourself, explain your interest and ask your questions in a clear and organised manner.",
    sampleAnswer: `Subject: Request for Information Regarding Training Programme

Dear Programme Coordinator,

I hope you are doing well.

I am interested in participating in your professional training programme. I would appreciate it if you could share some additional information regarding the eligibility criteria, programme duration and registration process.

Please also let me know if there are any important documents required for registration.

Thank you for your time and assistance. I look forward to your response.

Regards,
Your Name`,
    checklist: [
      "Did I clearly explain why I am writing?",
      "Did I introduce myself appropriately?",
      "Did I ask specific and relevant questions?",
      "Did I use polite and professional language?",
      "Did I end the email appropriately?",
    ],
  },
  {
    id: "email-followup",
    module: "Professional Email Writing",
    level: "Intermediate",
    title: "Write a Follow-up After an Interview",
    scenario:
      "You attended a job interview one week ago but have not received an update. Write a polite follow-up email to the recruiter.",
    instructions:
      "Mention the interview, express continued interest and politely request an update without sounding impatient.",
    sampleAnswer: `Subject: Follow-up Regarding Interview

Dear Hiring Manager,

I hope you are doing well.

I am writing to follow up on the interview I attended last week for the position. I enjoyed learning more about the opportunity and remain interested in joining your organisation.

I would appreciate any update you could share regarding the selection process.

Thank you for your time and consideration.

Regards,
Your Name`,
    checklist: [
      "Did I mention the interview clearly?",
      "Did I express continued interest?",
      "Did I request an update politely?",
      "Did I avoid sounding demanding?",
      "Did I use a professional closing?",
    ],
  },
  {
    id: "email-escalation-advanced",
    module: "Professional Email Writing",
    level: "Advanced",
    title: "Escalate a Critical Delivery Risk",
    scenario:
      "You are coordinating a deliverable due in 48 hours. A third-party dependency has been unavailable for a day, testing cannot be completed without it, and the client has already been promised the original date. Your manager needs a decision, not just an update.",
    instructions:
      "Write an escalation email of 180–250 words. Include: a concise issue summary, verified facts, impact, actions already taken, at least two options with trade-offs, your recommendation and a specific decision deadline. Do not blame the third party or promise an outcome you cannot control.",
    sampleAnswer: `Subject: Decision Required Today: Risk to Client Delivery

Hello [Manager Name],

I am escalating a delivery risk for the client milestone scheduled for [date]. The third-party service has been unavailable since [time], and the integration tests that depend on it cannot currently be completed. The team has completed the independent work and prepared the test cases.

We have contacted the service owner and are checking whether a temporary test environment is available. If access is not restored today, the full handover may be delayed and the quality of an unverified release would be at risk.

We have two options:
1. Retain the date for the completed scope and move the blocked integration items to a controlled follow-up release.
2. Move the full handover by one working day so that integration and validation can be completed together.

I recommend option 2 unless the client confirms that a phased handover is acceptable. Could you confirm the preferred approach by 3 PM today so that we can communicate a consistent plan?

I will provide another update once the dependency owner responds.

Regards,
[Your Name]`,
    checklist: [
      "Did I distinguish verified facts from assumptions?",
      "Did I explain the delivery or quality impact?",
      "Did I mention actions already taken?",
      "Did I present at least two realistic options and trade-offs?",
      "Did I make a reasoned recommendation?",
      "Did I request a specific decision by a clear deadline?",
      "Did I avoid blame and unsupported promises?",
    ],
    rubric: [
      { label: "Clarity and structure", detail: "The issue and required decision are immediately clear.", points: 15 },
      { label: "Evidence and impact", detail: "Facts, dependencies and consequences are explained accurately.", points: 20 },
      { label: "Options and trade-offs", detail: "At least two feasible paths are compared.", points: 25 },
      { label: "Recommendation", detail: "The recommendation is justified and practical.", points: 20 },
      { label: "Professional tone", detail: "The message is accountable, calm and non-accusatory.", points: 10 },
      { label: "Action request", detail: "An owner, decision and deadline are explicit.", points: 10 },
    ],
    deliverables: [
      "Escalation email",
      "Two delivery options with trade-offs",
      "One recommended option",
      "A clear decision deadline",
    ],
  },
  {
    id: "email-negotiation-advanced",
    module: "Professional Email Writing",
    level: "Advanced",
    title: "Negotiate Scope Without Damaging the Relationship",
    scenario:
      "A client asks your team to add three new requirements to a project that is already scheduled for delivery this week. The original scope and deadline were agreed in writing. Your team can complete the original work or one of the new requirements by the deadline, but not all of them.",
    instructions:
      "Draft a response that acknowledges the request, refers to the agreed scope without sounding defensive, explains the constraint, offers at least two options and asks the client to confirm a priority. Include a short internal note explaining what you would not promise.",
    sampleAnswer: `Subject: Aligning on Additional Requirements and Delivery

Hello [Client Name],

Thank you for sharing the additional requirements. We understand how they could improve the final outcome and would be happy to assess them.

The current delivery plan is based on the scope agreed on [date]. With the remaining time, adding all three requirements would put the quality and delivery date at risk.

We can offer two approaches:
1. Retain the agreed delivery date and prioritise one of the new requirements, moving the other two into a follow-up phase.
2. Include all three requirements and agree on a revised delivery date after estimating the additional work.

Could you let us know which requirements have the highest priority? We can then confirm the impact and provide an updated plan before proceeding.

Regards,
[Your Name]

Internal note: I would not confirm that all three requirements can be delivered by the original date until the team has estimated the work and approved the revised scope.`,
    checklist: [
      "Did I acknowledge the client's needs?",
      "Did I refer to the agreed scope neutrally?",
      "Did I explain the constraint without blaming anyone?",
      "Did I offer at least two practical options?",
      "Did I ask the client to prioritise or confirm a choice?",
      "Did I avoid committing before estimating the work?",
    ],
    rubric: [
      { label: "Relationship management", detail: "The response acknowledges the client and remains constructive.", points: 15 },
      { label: "Scope control", detail: "The original agreement and new request are clearly distinguished.", points: 20 },
      { label: "Option quality", detail: "Options are realistic and explain the delivery implications.", points: 25 },
      { label: "Negotiation", detail: "The client is guided toward a clear priority and decision.", points: 20 },
      { label: "Risk awareness", detail: "The response avoids unsupported commitments.", points: 20 },
    ],
    deliverables: [
      "Client-facing email",
      "Two options",
      "Internal note on commitment boundaries",
    ],
  },
  {
    id: "workplace-practice",
    module: "Workplace Communication",
    level: "Foundation",
    title: "Respond to a Colleague Professionally",
    scenario:
      "A colleague asks you to complete a task, but you need clarification about the deadline and requirements. Write a professional response.",
    instructions:
      "Acknowledge the request, politely ask for clarification and show that you are willing to complete the task.",
    sampleAnswer: `Hello,

Thank you for sharing the task with me. I would be happy to work on it.

Could you please clarify the expected deadline and any specific requirements I should follow?

I want to ensure that I complete the task correctly.

Regards,
Your Name`,
    checklist: [
      "Did I acknowledge the request?",
      "Did I ask clear questions?",
      "Did I use respectful language?",
      "Did I communicate my willingness to help?",
    ],
  },
  {
    id: "workplace-update",
    module: "Workplace Communication",
    level: "Intermediate",
    title: "Give a Professional Project Update",
    scenario:
      "Your manager asks you to provide an update about a project you are working on. You have completed some tasks, but a few tasks are still in progress.",
    instructions:
      "Explain what you have completed, what remains and what you plan to do next.",
    sampleAnswer: `Hello,

I would like to share a brief update regarding the project.

I have completed the initial research and finished the first part of the assigned work. The remaining tasks are currently in progress.

I plan to complete the pending work by the agreed deadline and will share another update if there are any changes.

Please let me know if you would like any additional information.

Regards,
Your Name`,
    checklist: [
      "Did I clearly explain completed tasks?",
      "Did I mention the pending work?",
      "Did I communicate the next steps?",
      "Did I provide a realistic update?",
      "Was my message organised and professional?",
    ],
  },
  {
    id: "workplace-delay",
    module: "Workplace Communication",
    level: "Intermediate",
    title: "Communicate a Delay Professionally",
    scenario:
      "You are unable to complete an assigned task by the original deadline because you encountered an unexpected problem. Your manager needs to be informed.",
    instructions:
      "Take responsibility, explain the situation briefly, communicate the expected completion time and suggest a solution.",
    sampleAnswer: `Hello,

I wanted to inform you that I may need additional time to complete the assigned task due to an unexpected issue.

I apologise for the delay. I am working on resolving the issue and expect to complete the task by tomorrow afternoon.

I will keep you updated on the progress and appreciate your understanding.

Regards,
Your Name`,
    checklist: [
      "Did I inform the manager promptly?",
      "Did I explain the delay briefly?",
      "Did I take responsibility?",
      "Did I provide a realistic revised deadline?",
      "Did I communicate a plan to resolve the issue?",
    ],
  },
  {
    id: "workplace-conflict-advanced",
    module: "Workplace Communication",
    level: "Advanced",
    title: "Resolve Conflicting Instructions From Two Managers",
    scenario:
      "You are supporting two project leads. Manager A asks you to finish a client report by tomorrow morning. Manager B asks you to complete urgent data validation for a review at the same time. Both say their task is the top priority. You estimate that each task needs six hours, and you have eight working hours available.",
    instructions:
      "Write a response to both managers. Identify the conflict, state the capacity constraint, ask for a priority decision and propose a workable sequence or scope adjustment. Then write a short action plan for what you will do while waiting for the decision.",
    sampleAnswer: `Hello [Manager A] and [Manager B],

I want to confirm priorities because the client report and data validation are both currently due tomorrow morning. Each task requires approximately six hours, while I have eight working hours available. Completing both in full within the available time would put quality at risk.

Could you please confirm which deliverable has the higher business priority? One option is to complete the critical data validation first and provide a partial report containing the verified sections. Another option is to agree on a revised deadline for one deliverable or identify additional support.

While the priority is being confirmed, I will organise the source material, identify the report sections that can be completed independently and prepare the validation checklist.

Once we agree on the priority, I will share a realistic schedule and progress checkpoint.

Regards,
[Your Name]`,
    checklist: [
      "Did I state the conflict neutrally?",
      "Did I quantify the available capacity and workload?",
      "Did I avoid choosing a manager based on status or pressure?",
      "Did I offer practical alternatives?",
      "Did I identify useful work that can proceed before the decision?",
      "Did I request one explicit priority decision?",
      "Did I commit only to a realistic plan?",
    ],
    rubric: [
      { label: "Problem definition", detail: "The conflict and capacity constraint are made explicit.", points: 20 },
      { label: "Stakeholder handling", detail: "Both managers are addressed fairly and respectfully.", points: 15 },
      { label: "Decision options", detail: "Options are feasible and expose trade-offs.", points: 25 },
      { label: "Initiative", detail: "Useful work is identified while awaiting direction.", points: 20 },
      { label: "Professional judgement", detail: "The response avoids unrealistic commitments and blame.", points: 20 },
    ],
    deliverables: [
      "Joint response to both managers",
      "At least two options",
      "Interim action plan",
    ],
  },
  {
    id: "workplace-stakeholder-advanced",
    module: "Workplace Communication",
    level: "Advanced",
    title: "Prepare a Stakeholder Risk Briefing",
    scenario:
      "A project is 70% complete. A key supplier has changed its delivery date, which may delay the final handover by five working days. The project team believes it can recover two days by rearranging tasks, but that estimate has not yet been validated. Senior stakeholders want a status update today.",
    instructions:
      "Prepare a concise stakeholder briefing with: current status, confirmed facts, unverified assumptions, impact, mitigation, decision required and next update time. Do not present the possible two-day recovery as guaranteed.",
    sampleAnswer: `Project status: At risk

Current position:
The project is approximately 70% complete. The supplier has confirmed a delivery date that is five working days later than the date in the original plan.

Confirmed impact:
The supplier dependency may move the final handover by five working days.

Mitigation under review:
The team is assessing whether tasks can be rearranged to recover up to two days. This estimate has not yet been validated.

Decision required:
Please confirm whether the team should prioritise the revised delivery plan or investigate an alternative supplier at additional cost.

Next steps:
The project lead will validate the recovery estimate and share an updated forecast by [time/date]. Until then, the five-day impact remains the planning risk.`,
    checklist: [
      "Did I separate confirmed facts from unverified estimates?",
      "Did I state the current project status?",
      "Did I explain the likely impact?",
      "Did I describe mitigation without guaranteeing success?",
      "Did I identify a decision needed from stakeholders?",
      "Did I include an owner and next update time?",
    ],
    rubric: [
      { label: "Accuracy", detail: "Confirmed facts and estimates are clearly separated.", points: 25 },
      { label: "Impact analysis", detail: "The schedule and stakeholder implications are clear.", points: 20 },
      { label: "Mitigation", detail: "Actions are realistic and appropriately qualified.", points: 20 },
      { label: "Decision framing", detail: "The requested decision is specific.", points: 20 },
      { label: "Executive clarity", detail: "The briefing is concise and easy to scan.", points: 15 },
    ],
    deliverables: [
      "Stakeholder status brief",
      "Risk and impact statement",
      "Mitigation and decision request",
    ],
  },
  {
    id: "interview-practice",
    module: "Interview Communication",
    level: "Foundation",
    title: "Introduce Yourself in an Interview",
    scenario:
      "Imagine you are attending your first job interview. The interviewer asks: Tell me about yourself. Write your response.",
    instructions:
      "Include your educational background, interests, strengths and career goals. Keep your introduction relevant and concise.",
    sampleAnswer: `Good morning.

My name is Your Name. I am currently pursuing my education in my chosen field.

I am interested in developing my knowledge and gaining practical experience. My strengths include being willing to learn, adapting to new situations and working collaboratively.

I am looking forward to applying my skills, learning from experienced professionals and contributing to the organisation.

Thank you.`,
    checklist: [
      "Did I introduce myself clearly?",
      "Did I mention my educational background?",
      "Did I highlight relevant strengths or interests?",
      "Did I explain my career goals?",
      "Was my introduction clear and concise?",
    ],
  },
  {
    id: "interview-strengths",
    module: "Interview Communication",
    level: "Intermediate",
    title: "Explain Your Strengths and Weaknesses",
    scenario:
      "During an interview, the recruiter asks: What are your greatest strengths and weaknesses? Write an honest and professional response.",
    instructions:
      "Mention at least two strengths with examples. Identify one genuine weakness and explain what you are doing to improve it.",
    sampleAnswer: `One of my greatest strengths is my willingness to learn. I enjoy exploring new topics and applying what I learn to practical situations.

Another strength is my ability to work collaboratively. I try to listen to different perspectives and contribute positively to team activities.

One area I am currently improving is my confidence when speaking in front of a group. I am working on this by participating in discussions and practising presentations.

I believe continuous improvement is important for professional growth.`,
    checklist: [
      "Did I mention relevant strengths?",
      "Did I support my strengths with examples?",
      "Did I identify a genuine weakness?",
      "Did I explain how I am improving?",
      "Did I maintain an honest and confident tone?",
    ],
  },
  {
    id: "interview-selection",
    module: "Interview Communication",
    level: "Intermediate",
    title: "Answer: Why Should We Select You?",
    scenario:
      "You are attending an interview for an entry-level position. The interviewer asks: Why should we select you over other candidates?",
    instructions:
      "Explain your relevant skills, willingness to learn, positive qualities and how you could contribute to the organisation. Avoid comparing yourself negatively with others.",
    sampleAnswer: `I believe I would be a suitable candidate because I am motivated to learn, develop my skills and contribute positively to the team.

I have been working on building my knowledge in my chosen field and applying it through practical learning activities.

Although I am at the beginning of my professional journey, I am adaptable, responsible and open to feedback.

I would value the opportunity to learn from experienced professionals while contributing my efforts to the organisation.`,
    checklist: [
      "Did I explain why I am suitable for the position?",
      "Did I mention relevant skills or knowledge?",
      "Did I demonstrate willingness to learn?",
      "Did I explain how I could contribute?",
      "Did I avoid making unrealistic claims?",
    ],
  },
  {
    id: "interview-star-advanced",
    module: "Interview Communication",
    level: "Advanced",
    title: "Build a Strong STAR Answer",
    scenario:
      "An interviewer asks: Tell me about a time you had to take responsibility when a team project was falling behind. You may use a genuine academic, volunteer, personal or professional example. Do not invent achievements.",
    instructions:
      "Write a 180–250 word answer using Situation, Task, Action and Result. Make your personal contribution clear, include evidence of the outcome and finish with what you learned. If you have not experienced this exact situation, use the closest genuine example and explain the context honestly.",
    sampleAnswer: `Situation: During a group assignment, our work was behind schedule because responsibilities were unclear and two tasks depended on the same unfinished research.

Task: I needed to help the group organise the remaining work so we could submit a complete result.

Action: I suggested listing the outstanding tasks, identifying dependencies and assigning one owner to each item. I checked what could be completed independently and arranged a short progress review. When one section remained blocked, I discussed a smaller interim deliverable with the group rather than allowing the entire project to stop.

Result: We clarified ownership, completed the essential sections and submitted the work with a clear record of the remaining limitations.

Reflection: I learned that raising a delivery risk early and agreeing on ownership is more effective than waiting until the deadline is close.`,
    checklist: [
      "Did I give enough context without overexplaining?",
      "Did I state my responsibility clearly?",
      "Did I describe my own actions rather than only the team's actions?",
      "Did I include a specific and truthful result?",
      "Did I explain what I learned?",
      "Did I avoid inventing metrics or achievements?",
    ],
    rubric: [
      { label: "Situation and task", detail: "The context and personal responsibility are clear.", points: 20 },
      { label: "Personal actions", detail: "Actions are specific and show the candidate's contribution.", points: 30 },
      { label: "Result and evidence", detail: "The outcome is credible and supported by evidence.", points: 25 },
      { label: "Reflection", detail: "The learning is relevant and thoughtful.", points: 15 },
      { label: "Conciseness", detail: "The answer is structured and interview-appropriate.", points: 10 },
    ],
    deliverables: [
      "STAR response",
      "Evidence of personal contribution",
      "Result and reflection",
    ],
  },
  {
    id: "interview-case-advanced",
    module: "Interview Communication",
    level: "Advanced",
    title: "Handle a Changing Case Interview",
    scenario:
      "You are asked how you would handle a project that is behind schedule. You propose reducing lower-priority scope. The interviewer then adds: The client says every feature is essential, and the team cannot work overtime. Explain how you would respond to the new information.",
    instructions:
      "Write your initial approach and then a separate response to the new constraint. Clarify what information you need, compare options, explain trade-offs and identify how you would communicate the recommendation. Do not assume that scope can be reduced without stakeholder approval.",
    sampleAnswer: `Initial approach:
I would first identify the tasks causing the delay, the remaining effort, dependencies and the features required for the agreed outcome. I would compare the current forecast with the committed date and identify the highest-impact risks.

After the new information:
If every feature is considered essential and overtime is unavailable, I would not assume that scope can simply be removed. I would validate estimates, look for tasks that can run in parallel, check whether dependencies can be resolved earlier and assess whether additional approved resources are possible.

I would present the client with evidence-based options, such as a revised date, phased acceptance if the client permits it, or an approved change to resources. I would explain the quality and schedule trade-offs and ask the decision-makers to confirm the acceptable option.

I would then document the decision, update the plan and communicate progress against the revised baseline.`,
    checklist: [
      "Did I clarify the goal and constraints?",
      "Did I adapt my answer when new information was introduced?",
      "Did I avoid assuming that scope could be removed?",
      "Did I compare feasible options and trade-offs?",
      "Did I explain how I would involve decision-makers?",
      "Did I identify how the decision would be documented and monitored?",
    ],
    rubric: [
      { label: "Structured reasoning", detail: "The response follows a clear problem-solving sequence.", points: 20 },
      { label: "Adaptability", detail: "The candidate responds to the new constraint rather than repeating the first answer.", points: 25 },
      { label: "Trade-off analysis", detail: "Options and consequences are compared realistically.", points: 25 },
      { label: "Stakeholder judgement", detail: "The correct decision-makers are involved.", points: 15 },
      { label: "Communication", detail: "The recommendation is clear and defensible.", points: 15 },
    ],
    deliverables: [
      "Initial case approach",
      "Revised approach after the new constraint",
      "Options and trade-offs",
      "Recommendation and communication plan",
    ],
  },
  {
    id: "etiquette-practice",
    module: "Corporate Etiquette",
    level: "Foundation",
    title: "Handle a Workplace Disagreement",
    scenario:
      "During a team meeting, a colleague disagrees with your suggestion in front of the team. How would you respond professionally?",
    instructions:
      "Write a response that demonstrates respect, open-mindedness and constructive communication.",
    sampleAnswer: `Thank you for sharing your perspective.

I understand your point, and I appreciate the alternative suggestion. I would like to explain the reasoning behind my idea as well.

Perhaps we can discuss both approaches and decide which one would work best for the team.

I am open to feedback and happy to consider other solutions.`,
    checklist: [
      "Did I acknowledge the other person's opinion?",
      "Did I avoid aggressive or defensive language?",
      "Did I communicate my viewpoint respectfully?",
      "Did I focus on finding a solution?",
      "Did I demonstrate teamwork?",
    ],
  },
  {
    id: "etiquette-meeting",
    module: "Corporate Etiquette",
    level: "Intermediate",
    title: "Participate in a Team Meeting",
    scenario:
      "Your team is discussing ways to improve a project. You have an idea that could make the work more organised, but you are unsure how to introduce it.",
    instructions:
      "Write a short statement presenting your suggestion, explaining its benefit and inviting feedback from your teammates.",
    sampleAnswer: `I would like to suggest an approach that could help us organise the project more effectively.

We could divide the work into smaller tasks and assign responsibilities based on each team member's strengths.

This may help us track progress and manage deadlines more efficiently.

I would also like to hear everyone's thoughts and suggestions before we finalise the approach.`,
    checklist: [
      "Did I introduce my idea clearly?",
      "Did I explain the benefit of my suggestion?",
      "Did I use respectful language?",
      "Did I encourage others to contribute?",
      "Did I demonstrate a collaborative attitude?",
    ],
  },
  {
    id: "etiquette-feedback",
    module: "Corporate Etiquette",
    level: "Intermediate",
    title: "Respond to Negative Feedback",
    scenario:
      "Your supervisor reviews your work and points out several mistakes. You feel disappointed, but you want to respond professionally and improve your performance.",
    instructions:
      "Acknowledge the feedback, avoid becoming defensive, ask for clarification if needed and explain how you will improve.",
    sampleAnswer: `Thank you for reviewing my work and sharing your feedback.

I understand that there are areas where I need to improve. I will review the points you mentioned and make the necessary corrections.

Could you please clarify one of the suggestions so that I can understand how to improve that part?

I appreciate your guidance and will work on avoiding these mistakes in the future.`,
    checklist: [
      "Did I acknowledge the feedback?",
      "Did I avoid defensive language?",
      "Did I show willingness to improve?",
      "Did I ask for clarification where necessary?",
      "Did I communicate a positive attitude?",
    ],
  },
  {
    id: "etiquette-ethics-advanced",
    module: "Corporate Etiquette",
    level: "Advanced",
    title: "Respond to an Ethical Dilemma",
    scenario:
      "A colleague asks you to share a spreadsheet containing customer or student information because it would make their task faster. You are not sure whether they are authorised to access it. The colleague says the request is urgent and that everyone shares such files informally.",
    instructions:
      "Write a professional response to the colleague and outline the steps you would take. Address confidentiality, authorisation, urgency and how to find a safe alternative. Do not assume that urgency grants permission.",
    sampleAnswer: `I understand that the information would help complete the task quickly. Before sharing the spreadsheet, I need to confirm that access is authorised and that the information can be used for this purpose.

I will check the approved access process with the data owner or relevant supervisor. In the meantime, I can help identify whether an approved summary or limited set of non-sensitive information would meet the immediate need.

I would not send the full file through an informal channel until access has been confirmed. Once the appropriate permission is in place, I can use the approved sharing method and make sure only the required information is provided.`,
    checklist: [
      "Did I recognise the confidentiality concern?",
      "Did I avoid treating urgency as permission?",
      "Did I identify an appropriate person or process to verify access?",
      "Did I suggest a safer alternative where possible?",
      "Did I avoid sharing the information through an informal channel?",
      "Did I keep the response respectful and practical?",
    ],
    rubric: [
      { label: "Risk recognition", detail: "The privacy and authorisation issue is identified.", points: 25 },
      { label: "Decision quality", detail: "The response does not assume urgency overrides access controls.", points: 25 },
      { label: "Practical alternative", detail: "A safe way to support the work is proposed.", points: 20 },
      { label: "Escalation path", detail: "The correct owner or process is identified.", points: 15 },
      { label: "Professional tone", detail: "The colleague is treated respectfully.", points: 15 },
    ],
    deliverables: [
      "Response to the colleague",
      "Authorisation check",
      "Safe alternative",
      "Approved next step",
    ],
  },
  {
    id: "etiquette-leadership-advanced",
    module: "Corporate Etiquette",
    level: "Advanced",
    title: "Lead a Meeting That Is Going Off Track",
    scenario:
      "You are facilitating a project meeting. Two participants are arguing about the cause of a delay, another participant has not spoken, and the meeting has ten minutes remaining. The team still needs to agree on next steps.",
    instructions:
      "Write a short facilitation script. De-escalate the disagreement, bring the discussion back to evidence, invite the quieter participant to contribute, summarise the decision needed and close with owners and deadlines.",
    sampleAnswer: `I appreciate that both of you have different views about what caused the delay. To make progress, could we separate the confirmed facts from the assumptions and identify the specific dependency that is currently blocking the work?

We have limited time, so I suggest we record the cause that is supported by the available evidence and list anything that still needs verification.

[Name], we have not heard your perspective yet. Is there any dependency or risk we may be missing?

Based on the discussion, our next steps are:
1. [Owner] will verify the dependency by [time].
2. [Owner] will prepare the revised task sequence by [date].
3. I will share the updated plan with the team after those checks are complete.

Before we close, does anyone see a critical action missing or an owner that needs to be changed?`,
    checklist: [
      "Did I acknowledge the disagreement without taking sides prematurely?",
      "Did I redirect the discussion toward evidence?",
      "Did I invite the quieter participant to contribute?",
      "Did I identify the decision needed before the meeting ends?",
      "Did I assign clear owners and deadlines?",
      "Did I confirm whether any critical action was missing?",
    ],
    rubric: [
      { label: "Facilitation", detail: "The discussion is redirected without dismissing participants.", points: 20 },
      { label: "Evidence focus", detail: "Facts are separated from assumptions.", points: 20 },
      { label: "Inclusion", detail: "The quieter participant is invited into the discussion.", points: 15 },
      { label: "Decision making", detail: "The meeting moves toward a clear decision.", points: 20 },
      { label: "Follow-through", detail: "Actions, owners and deadlines are confirmed.", points: 25 },
    ],
    deliverables: [
      "Meeting facilitation script",
      "Decision summary",
      "Action list with owners and deadlines",
    ],
  },
];

/* =========================================
   LOCAL STORAGE HELPERS
========================================= */

function readStorage(key, fallback = {}) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function getAccountStorageKey(baseKey, accountId) {
  if (!accountId) return "";

  return `${baseKey}_${encodeURIComponent(accountId)}`;
}

function getSavedProfile() {
  return readStorage(PROFILE_STORAGE_KEY, null);
}

/* =========================================
   PROFILE-AWARE CONTENT
========================================= */

function getProfileDetails(profile) {
  const role = profile?.targetRole?.trim() || "";
  const stream = profile?.educationalStream?.trim() || "";
  const course =
    profile?.customCourse?.trim() ||
    profile?.course?.trim() ||
    "";

  return {
    role,
    stream,
    course,
    careerLabel: role || "your chosen career",
    educationLabel: course || stream || "your chosen field",
  };
}

function getPersonalizedModules(profile) {
  const { careerLabel, educationLabel } = getProfileDetails(profile);

  return modules.map((module) => {
    if (module.id === "email") {
      return {
        ...module,
        lessons: module.lessons.map((lesson, index) => {
          if (index !== 0) return lesson;

          return {
            ...lesson,
            example: {
              subject: `Application for ${careerLabel} Opportunity`,
              body: `Dear Hiring Manager,

I am writing to express my interest in an opportunity related to ${careerLabel}. My educational background in ${educationLabel} has encouraged me to develop my knowledge and professional skills in this area.

I would appreciate the opportunity to be considered for a suitable position.

Thank you for your time and consideration.

Regards,
Your Name`,
            },
          };
        }),
      };
    }

    if (module.id === "interview") {
      return {
        ...module,
        lessons: module.lessons.map((lesson, index) => {
          if (index === 0) {
            return {
              ...lesson,
              example: {
                subject: "Your Profile-Based Self-Introduction",
                body: `Good morning.

My name is Your Name. I am currently pursuing ${educationLabel}.

I am interested in building my career as a ${careerLabel}. I am focused on developing my knowledge, improving my professional skills and gaining practical experience.

I consider myself a motivated learner who is open to feedback and new challenges.

Thank you.`,
              },
            };
          }

          if (index === 1) {
            return {
              ...lesson,
              example: {
                subject: "Question: Why are you interested in this career?",
                body: `I am interested in pursuing a career as a ${careerLabel} because it matches my professional interests and goals.

My educational background in ${educationLabel} has helped me develop an understanding of this area. I would like to continue improving my skills, gain practical experience and contribute positively to an organisation.`,
              },
            };
          }

          return lesson;
        }),
      };
    }

    return module;
  });
}

function getPersonalizedPracticeExercises(profile) {
  const { careerLabel, educationLabel } = getProfileDetails(profile);

  return practiceExercises.map((exercise) => {
    switch (exercise.id) {
      case "email-practice":
        return {
          ...exercise,
          title: `Apply for a ${careerLabel} Opportunity`,
          scenario: `You found an internship, job or professional opportunity related to ${careerLabel}. Write a professional email to the hiring manager expressing your interest in applying.`,
          sampleAnswer: `Subject: Application for ${careerLabel} Opportunity

Dear Hiring Manager,

I am writing to express my interest in the ${careerLabel} opportunity at your organisation.

I am currently pursuing ${educationLabel} and I am eager to apply my knowledge, gain practical experience and develop my professional skills in this area.

I would appreciate the opportunity to be considered for this position. Please find my resume attached for your review.

Thank you for your time and consideration.

Regards,
Your Name`,
        };

      case "workplace-practice":
        return {
          ...exercise,
          scenario: `Imagine you are working in a role related to ${careerLabel}. A colleague asks you to complete a task, but you need clarification about the deadline and requirements. Write a professional response.`,
          sampleAnswer: `Hello,

Thank you for sharing the task with me. I would be happy to work on it.

Could you please clarify the expected deadline and any specific requirements I should follow?

I want to ensure that I complete the task correctly and meet the expected standards.

Regards,
Your Name`,
        };

      case "interview-practice":
        return {
          ...exercise,
          title: `Introduce Yourself as a ${careerLabel}`,
          scenario: `Imagine you are attending an interview for a ${careerLabel} position. The interviewer asks: Tell me about yourself. Write your response.`,
          instructions: `Include your educational background in ${educationLabel}, your interests, strengths and your goal of becoming a ${careerLabel}. Keep your introduction relevant and concise.`,
          sampleAnswer: `Good morning.

My name is Your Name. I am currently pursuing ${educationLabel}.

I am interested in building my career as a ${careerLabel}. I enjoy learning new things, improving my abilities and applying my knowledge to practical situations.

My strengths include being adaptable, willing to learn and comfortable working with others.

I look forward to gaining professional experience, developing my skills and contributing to the organisation.

Thank you.`,
        };

      case "etiquette-practice":
        return {
          ...exercise,
          scenario: `Imagine you are working with a team in a ${careerLabel}-related environment. During a team discussion, a colleague disagrees with your suggestion. How would you respond professionally?`,
        };

      default:
        return exercise;
    }
  });
}

/* =========================================
   MAIN COMPONENT
========================================= */

function ProfessionalReadiness() {
  const { accountId, loading: authLoading } = useAuth();

  // Account-specific learning data starts empty until the active account loads.
  const [completedLessons, setCompletedLessons] = useState({});
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [checkedItems, setCheckedItems] = useState({});

  // Prevent storage effects from saving one account's data into another account.
  const [loadedAccountId, setLoadedAccountId] = useState("");

  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [visibleSamples, setVisibleSamples] = useState({});
  const [visibleRubrics, setVisibleRubrics] = useState({});
  const [expandedPractice, setExpandedPractice] = useState({});
  const [profile, setProfile] = useState(getSavedProfile);

  /*
   * Load progress, answers and checklist data for the authenticated account.
   * Old global keys are intentionally not migrated because their owner is unknown.
   */
  useEffect(() => {
    if (authLoading) return;

    if (!accountId) {
      setCompletedLessons({});
      setPracticeAnswers({});
      setCheckedItems({});
      setLoadedAccountId("");
      return;
    }

    setLoadedAccountId("");

    const progressKey = getAccountStorageKey(STORAGE_KEY, accountId);
    const practiceKey = getAccountStorageKey(PRACTICE_STORAGE_KEY, accountId);
    const checklistKey = getAccountStorageKey(CHECKLIST_STORAGE_KEY, accountId);

    setCompletedLessons(readStorage(progressKey, {}));
    setPracticeAnswers(readStorage(practiceKey, {}));
    setCheckedItems(readStorage(checklistKey, {}));

    setLoadedAccountId(accountId);
  }, [accountId, authLoading]);

  /*
   * Profile remains the active profile managed by AuthContext.
   * It is not stored separately under the readiness keys.
   */
  useEffect(() => {
    const updateProfile = () => setProfile(getSavedProfile());

    window.addEventListener("skillBridgeProfileUpdated", updateProfile);
    window.addEventListener("storage", updateProfile);

    return () => {
      window.removeEventListener("skillBridgeProfileUpdated", updateProfile);
      window.removeEventListener("storage", updateProfile);
    };
  }, []);

  /*
   * Save lesson progress only after the correct account's data has loaded.
   */
  useEffect(() => {
    if (
      authLoading ||
      !accountId ||
      loadedAccountId !== accountId
    ) {
      return;
    }

    const key = getAccountStorageKey(STORAGE_KEY, accountId);
    localStorage.setItem(key, JSON.stringify(completedLessons));
  }, [completedLessons, accountId, authLoading, loadedAccountId]);

  /*
   * Save practice answers only for the currently loaded account.
   */
  useEffect(() => {
    if (
      authLoading ||
      !accountId ||
      loadedAccountId !== accountId
    ) {
      return;
    }

    const key = getAccountStorageKey(PRACTICE_STORAGE_KEY, accountId);
    localStorage.setItem(key, JSON.stringify(practiceAnswers));
  }, [practiceAnswers, accountId, authLoading, loadedAccountId]);

  /*
   * Save checklist selections only for the currently loaded account.
   */
  useEffect(() => {
    if (
      authLoading ||
      !accountId ||
      loadedAccountId !== accountId
    ) {
      return;
    }

    const key = getAccountStorageKey(CHECKLIST_STORAGE_KEY, accountId);
    localStorage.setItem(key, JSON.stringify(checkedItems));
  }, [checkedItems, accountId, authLoading, loadedAccountId]);

  const personalizedModules = getPersonalizedModules(profile);
  const personalizedExercises = getPersonalizedPracticeExercises(profile);
  const profileDetails = getProfileDetails(profile);

  const handlePracticeAnswerChange = (exerciseId, answer) => {
    setPracticeAnswers((previous) => ({
      ...previous,
      [exerciseId]: answer,
    }));
  };

  const handleChecklistChange = (exerciseId, itemIndex, checked) => {
    setCheckedItems((previous) => ({
      ...previous,
      [exerciseId]: {
        ...previous[exerciseId],
        [itemIndex]: checked,
      },
    }));
  };

  const toggleSampleAnswer = (exerciseId) => {
    setVisibleSamples((previous) => ({
      ...previous,
      [exerciseId]: !previous[exerciseId],
    }));
  };

  const toggleRubric = (exerciseId) => {
    setVisibleRubrics((previous) => ({
      ...previous,
      [exerciseId]: !previous[exerciseId],
    }));
  };

  const totalLessons = personalizedModules.reduce(
    (total, module) => total + module.lessons.length,
    0
  );

  const completedCount = personalizedModules.reduce(
    (total, module) =>
      total +
      module.lessons.filter((_, index) =>
        Boolean(completedLessons[`${module.id}-${index}`])
      ).length,
    0
  );

  const progressPercentage =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  const isLessonCompleted = (moduleId, lessonIndex) =>
    Boolean(completedLessons[`${moduleId}-${lessonIndex}`]);

  const toggleLessonCompletion = (moduleId, lessonIndex) => {
    const key = `${moduleId}-${lessonIndex}`;

    setCompletedLessons((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  const selectedModule = personalizedModules.find(
    (module) => module.id === activeModule
  );
  const selectedLesson = selectedModule?.lessons[activeLesson];

  // Avoid showing an empty or stale progress screen before authentication resolves.
  if (authLoading || (accountId && loadedAccountId !== accountId)) {
    return (
      <div className="readiness-page">
        <div className="readiness-container">
          <p>Loading your professional readiness progress...</p>
        </div>
      </div>
    );
  }

  /* LESSON DETAIL VIEW */

  if (selectedModule && selectedLesson) {
    const LessonIcon = selectedModule.icon;

    return (
      <div className="readiness-page">
        <div className="readiness-container">
          <button
            className="readiness-back-button"
            onClick={() => setActiveLesson(null)}
          >
            <ArrowLeft size={18} />
            Back to {selectedModule.title}
          </button>

          <div className="readiness-lesson-header">
            <div className="readiness-module-icon">
              <LessonIcon size={25} />
            </div>
            <div>
              <p className="readiness-eyebrow">{selectedModule.title}</p>
              <h1>{selectedLesson.title}</h1>
              <div className="readiness-meta-row">
                <span className={`readiness-level ${selectedLesson.difficulty === "Advanced" ? "advanced" : ""}`}>
                  {selectedLesson.difficulty || "Foundation"}
                </span>
                <span><Clock3 size={14} /> {selectedLesson.duration || "15 min"}</span>
              </div>
            </div>
          </div>

          <section className="readiness-content-card">
            <h2>Lesson Overview</h2>
            <p>{selectedLesson.content}</p>

            <h2>Key Points to Remember</h2>
            <ul className="readiness-points">
              {selectedLesson.points.map((point, index) => (
                <li key={index}>
                  <CheckCircle2 size={18} />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="readiness-example">
              <h3>{selectedLesson.example.subject}</h3>
              <p>{selectedLesson.example.body}</p>
            </div>

            <button
              className={`readiness-complete-button ${
                isLessonCompleted(activeModule, activeLesson) ? "completed" : ""
              }`}
              onClick={() => toggleLessonCompletion(activeModule, activeLesson)}
            >
              <CheckCircle2 size={18} />
              {isLessonCompleted(activeModule, activeLesson)
                ? "Mark as Incomplete"
                : "Mark Lesson as Complete"}
            </button>
          </section>

          <div className="readiness-lesson-navigation">
            {selectedModule.lessons.map((lesson, index) => (
              <button
                key={lesson.title}
                className={activeLesson === index ? "active" : ""}
                onClick={() => setActiveLesson(index)}
              >
                <span>{index + 1}. {lesson.title}</span>
                {isLessonCompleted(activeModule, index) && (
                  <CheckCircle2 size={17} />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* MODULE DETAIL VIEW */

  if (selectedModule) {
    const ModuleIcon = selectedModule.icon;
    const moduleCompleted = selectedModule.lessons.filter((_, index) =>
      isLessonCompleted(selectedModule.id, index)
    ).length;
    const modulePercentage = Math.round(
      (moduleCompleted / selectedModule.lessons.length) * 100
    );

    return (
      <div className="readiness-page">
        <div className="readiness-container">
          <button
            className="readiness-back-button"
            onClick={() => setActiveModule(null)}
          >
            <ArrowLeft size={18} />
            Back to all modules
          </button>

          <div className="readiness-lesson-header">
            <div className="readiness-module-icon">
              <ModuleIcon size={25} />
            </div>
            <div>
              <p className="readiness-eyebrow">Professional Readiness Module</p>
              <h1>{selectedModule.title}</h1>
              <p>{selectedModule.description}</p>
            </div>
          </div>

          <section className="readiness-content-card">
            <div className="readiness-module-progress">
              <span>{moduleCompleted} of {selectedModule.lessons.length} lessons completed</span>
              <span>{modulePercentage}%</span>
            </div>
            <div className="readiness-progress-track">
              <div className="readiness-progress-fill" style={{ width: `${modulePercentage}%` }} />
            </div>

            <h2>Lessons</h2>
            <div className="readiness-lesson-list">
              {selectedModule.lessons.map((lesson, index) => {
                const completed = isLessonCompleted(selectedModule.id, index);

                return (
                  <button
                    className="readiness-lesson-item"
                    key={lesson.title}
                    onClick={() => setActiveLesson(index)}
                  >
                    <span className="readiness-lesson-number">
                      {completed ? <CheckCircle2 size={20} /> : index + 1}
                    </span>
                    <span className="readiness-lesson-name">
                      <strong>{lesson.title}</strong>
                      <small>
                        {lesson.difficulty || "Foundation"} · {lesson.duration || "15 min"} · {completed ? "Completed" : "Start lesson"}
                      </small>
                    </span>
                    <ChevronRight size={20} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  }

  /* MAIN PAGE */

  return (
    <div className="readiness-page">
      <div className="readiness-container">
        <div className="readiness-hero">
          <div className="readiness-hero-icon">
            <BookOpen size={30} />
          </div>
          <p className="readiness-eyebrow">Career Development Programme</p>
          <h1>Professional Communication & Corporate Readiness</h1>
          <p>
            Build practical communication, decision-making and workplace
            judgement through structured lessons and realistic professional
            scenarios.
          </p>
          {profileDetails.role && (
            <p>
              Your practice activities are adapted for your goal of becoming
              a {profileDetails.role}.
            </p>
          )}
          <div className="readiness-programme-stats">
            <span><BookOpen size={16} /> 20 lessons</span>
            <span><PenLine size={16} /> 20 exercises</span>
            <span><Award size={16} /> Foundation to Advanced</span>
          </div>
        </div>

        <section className="readiness-overview">
          <div className="readiness-overview-heading">
            <div>
              <h2>Your Learning Progress</h2>
              <p>Track your progress as you complete each lesson.</p>
            </div>
            <Target size={26} />
          </div>
          <div className="readiness-progress-info">
            <strong>{progressPercentage}% completed</strong>
            <span>{completedCount} of {totalLessons} lessons</span>
          </div>
          <div className="readiness-progress-track">
            <div className="readiness-progress-fill" style={{ width: `${progressPercentage}%` }} />
          </div>
        </section>

        <div className="readiness-section-heading">
          <div>
            <h2>Learning Modules</h2>
            <p>Progress from core professional skills to advanced workplace situations.</p>
          </div>
        </div>

        <div className="readiness-module-grid">
          {personalizedModules.map((module) => {
            const ModuleIcon = module.icon;
            const completed = module.lessons.filter((_, index) =>
              isLessonCompleted(module.id, index)
            ).length;
            const percentage = Math.round((completed / module.lessons.length) * 100);
            const advancedCount = module.lessons.filter(
              (lesson) => lesson.difficulty === "Advanced"
            ).length;

            return (
              <button
                className="readiness-module-card"
                key={module.id}
                onClick={() => setActiveModule(module.id)}
              >
                <div className="readiness-card-top">
                  <div className="readiness-module-icon"><ModuleIcon size={24} /></div>
                  <ChevronRight size={20} />
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <div className="readiness-module-tags">
                  <span>{module.lessons.length} lessons</span>
                  <span>{advancedCount} advanced</span>
                </div>
                <div className="readiness-card-footer">
                  <span>{completed}/{module.lessons.length} lessons completed</span>
                  <span>{percentage}%</span>
                </div>
                <div className="readiness-progress-track">
                  <div className="readiness-progress-fill" style={{ width: `${percentage}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        <section className="practice-section">
          <div className="practice-heading">
            <div className="practice-heading-icon"><Brain size={25} /></div>
            <p className="readiness-eyebrow">Apply What You Learn</p>
            <h2>Professional Scenario Lab</h2>
            <p>
              Work through realistic situations, prepare professional
              responses and assess your work against clear evaluation criteria.
              Advanced tasks require reasoning, trade-off analysis and practical
              decision-making.
            </p>
            {profileDetails.role && (
              <p>
                These exercises include examples related to your selected
                career goal: <strong>{profileDetails.role}</strong>.
              </p>
            )}
          </div>

          <div className="practice-list">
            {personalizedExercises.map((exercise) => {
              const checkedCount = exercise.checklist.filter((_, index) =>
                Boolean(checkedItems[exercise.id]?.[index])
              ).length;
              const rubricTotal = exercise.rubric
                ? exercise.rubric.reduce((sum, item) => sum + item.points, 0)
                : 0;

              return (
                <article className="practice-card" key={exercise.id}>
                  <div className="practice-card-header">
                    <div className="practice-card-title">
                      <span className="practice-module">{exercise.module}</span>
                      <h3>{exercise.title}</h3>
                      <div className="practice-card-meta">
                        <span className={`readiness-level ${exercise.level === "Advanced" ? "advanced" : ""}`}>
                          {exercise.level}
                        </span>
                        {practiceAnswers[exercise.id]?.trim() && (
                          <span className="practice-saved-indicator">
                            <CheckCircle2 size={13} /> Response saved
                          </span>
                        )}
                      </div>
                    </div>
                    <PenLine size={20} />
                  </div>

                  <div className="practice-card-preview">
                    <p>{exercise.scenario}</p>
                  </div>

                  <button
                    type="button"
                    className="practice-expand-button"
                    aria-expanded={Boolean(expandedPractice[exercise.id])}
                    onClick={() =>
                      setExpandedPractice((previous) => ({
                        ...previous,
                        [exercise.id]: !previous[exercise.id],
                      }))
                    }
                  >
                    {expandedPractice[exercise.id] ? "Close exercise" : "Start exercise"}
                    <ChevronRight
                      size={17}
                      className={expandedPractice[exercise.id] ? "expanded" : ""}
                    />
                  </button>

                  {expandedPractice[exercise.id] && (
                    <div className="practice-expanded-content">
                      <div className="practice-scenario">
                        <h4>Full situation</h4>
                        <p>{exercise.scenario}</p>
                      </div>

                      <div className="practice-instructions">
                        <h4>Your task</h4>
                        <p>{exercise.instructions}</p>
                      </div>

                      {exercise.deliverables && (
                        <div className="readiness-deliverables">
                          <h4>Required deliverables</h4>
                          <ul>
                            {exercise.deliverables.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <label className="practice-field-label" htmlFor={`answer-${exercise.id}`}>
                        Your response
                      </label>
                      <textarea
                        id={`answer-${exercise.id}`}
                        className="practice-textarea"
                        rows={exercise.level === "Advanced" ? 9 : 6}
                        placeholder={
                          exercise.level === "Advanced"
                            ? "Analyse the situation, explain your reasoning and write your professional response..."
                            : "Write your response here..."
                        }
                        value={practiceAnswers[exercise.id] || ""}
                        onChange={(event) =>
                          handlePracticeAnswerChange(exercise.id, event.target.value)
                        }
                      />

                      <div className="practice-answer-status">
                        {practiceAnswers[exercise.id]?.trim()
                          ? "Your response is saved automatically."
                          : "Your response will be saved automatically as you type."}
                      </div>

                      <div className="practice-self-assessment">
                        <div className="practice-assessment-heading">
                          <div>
                            <ClipboardCheck size={20} />
                            <h4>Self-assessment</h4>
                          </div>
                          <span>{checkedCount}/{exercise.checklist.length} reviewed</span>
                        </div>
                        <p>Review your response against these points:</p>
                        <div className="practice-checklist">
                          {exercise.checklist.map((item, index) => (
                            <label className="practice-checklist-item" key={index}>
                              <input
                                type="checkbox"
                                checked={Boolean(checkedItems[exercise.id]?.[index])}
                                onChange={(event) =>
                                  handleChecklistChange(
                                    exercise.id,
                                    index,
                                    event.target.checked
                                  )
                                }
                              />
                              <span>{item}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {exercise.rubric && (
                        <div className="readiness-rubric">
                          <button
                            type="button"
                            className="practice-sample-button"
                            onClick={() => toggleRubric(exercise.id)}
                          >
                            {visibleRubrics[exercise.id]
                              ? "Hide evaluation rubric"
                              : `View evaluation rubric (${rubricTotal} points)`}
                          </button>
                          {visibleRubrics[exercise.id] && (
                            <div className="readiness-rubric-content">
                              <h4>How your work should be evaluated</h4>
                              {exercise.rubric.map((criterion) => (
                                <div className="readiness-rubric-row" key={criterion.label}>
                                  <div>
                                    <strong>{criterion.label}</strong>
                                    <p>{criterion.detail}</p>
                                  </div>
                                  <span>{criterion.points} pts</span>
                                </div>
                              ))}
                              <p className="readiness-rubric-note">
                                Use this rubric to evaluate your own response. The current
                                version does not assign an automatic score.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <button
                        type="button"
                        className="practice-sample-button"
                        onClick={() => toggleSampleAnswer(exercise.id)}
                      >
                        {visibleSamples[exercise.id] ? "Hide Model Answer" : "View Model Answer"}
                      </button>

                      {visibleSamples[exercise.id] && (
                        <div className="practice-sample-answer">
                          <h4>Model Professional Answer</h4>
                          <pre>{exercise.sampleAnswer}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="readiness-programme-note">
          <ShieldCheck size={22} />
          <div>
            <h3>Practice with professional judgement</h3>
            <p>
              Model answers are examples, not scripts to memorise. In real
              workplaces, the best response depends on the facts, policies,
              people involved and the authority you have to make a decision.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProfessionalReadiness;
