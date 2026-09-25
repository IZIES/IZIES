export interface StageTemplateConfig {
  stage: string;
  subject: string;
  headline: string;
  introParagraph: string;
  actionCallout?: string;
  mainContent: string;
  nextSteps: string[];
  ctaText: string;
  meetingLink?: string;
  meetingTime?: string;
}

export interface CoreMemberItem {
  name: string;
  role: string;
  email: string;
  department?: string;
}

export interface MasterOfferSettings {
  companyName: string;
  cin: string;
  registeredOffice: string;
  rdCampus: string;
  defaultSalary: string;
  defaultJoiningDate: string;
  defaultLocation: string;
  defaultEmploymentType: string;
  defaultProbation: string;
  defaultWorkingHours: string;
  defaultNoticePeriod: string;
  defaultSignatory: string;
  defaultSignatoryTitle: string;
  defaultSpecialTerms: string;

  // Theme & Styling Options
  logoUrl?: string;
  themeStyle: string; // "modern-indigo" | "executive-slate" | "emerald-minimal" | "royal-navy" | "crimson-lux"
  themeAccentColor: string; // e.g. "#1E40AF"
  themeFontFamily: string; // "inter" | "serif" | "system"
  themeWatermark: string; // "confidential" | "official-seal" | "subtle-grid" | "none"

  // Narrative, Header & Declaration Customizations
  headerTagline: string;
  confidentialityBadge: string;
  introParagraph: string;
  acceptanceDeclaration: string;
  signatoryHeading: string;
  footerNotice: string;

  // Core Members (Name, Role, Email)
  coreMembers: CoreMemberItem[];

  rules: Array<{ clause: string; title: string; text: string }>;
  annexureAItems: Array<{ title: string; desc: string }>;
}

export const DEFAULT_STAGE_TEMPLATES: Record<string, StageTemplateConfig> = {
  APPLIED: {
    stage: "APPLIED",
    subject: "Application Received: {jobTitle}",
    headline: "Application Successfully Received 🚀",
    introParagraph:
      "Thank you for applying to IZIES Technologies for the position of <strong>{jobTitle}</strong>. We are thrilled to review your profile.",
    actionCallout:
      "Your application is currently being evaluated by our engineering leadership team. You can monitor your real-time stage progress directly from your student dashboard.",
    mainContent:
      "Our hiring and engineering leads carefully assess every application. We look at foundational understanding, problem-solving craft, personal projects, and code hygiene rather than just resume buzzwords.",
    nextSteps: [
      "Our talent team will review your profile, GitHub repositories, and submitted coursework.",
      "If shortlisted, you will receive an invitation to an introductory First Call screening.",
      "Track your status, test assignments, and upcoming schedules anytime in your Student Portal.",
    ],
    ctaText: "Track Application Status →",
  },
  FIRST_CALL: {
    stage: "FIRST_CALL",
    subject: "Interview Invitation: First Call Screening — {jobTitle} 📞",
    headline: "Great News! Invited for First Call Screening 📞✨",
    introParagraph:
      "Following a thorough evaluation of your application for <strong>{jobTitle}</strong>, our team is excited to invite you to an introductory First Call screening.",
    actionCallout:
      "This is a relaxed 20–30 minute conversational session designed to discuss your project journey, technical curiosities, and what working at IZIES entails.",
    mainContent:
      "During this round, we want to hear about the engineering challenges you enjoy solving, your familiarity with modern web platforms, and your availability for the role.",
    nextSteps: [
      "Review the custom meeting details or invite link provided below.",
      "Be prepared to talk through your highlighted projects and coursework.",
      "Prepare any questions you have about IZIES engineering culture and vision.",
    ],
    ctaText: "Open Candidate Dashboard →",
  },
  INTERVIEW: {
    stage: "INTERVIEW",
    subject: "Technical Pairing & Architecture Round: {jobTitle} 💻",
    headline: "You're Moving Forward: Technical Pairing Round 💻🔥",
    introParagraph:
      "Congratulations on advancing past the introductory stage! We are pleased to invite you to the <strong>Technical Pairing & Architecture Round</strong> for <strong>{jobTitle}</strong>.",
    actionCallout:
      "This session is an interactive, collaborative pairing interview with our core tech leads. We focus on real-world engineering thinking, clean code, and design patterns.",
    mainContent:
      "We value clear reasoning, architectural instincts, and pragmatic trade-offs over memorized algorithms. You'll work together with an engineer on a practical problem.",
    nextSteps: [
      "Ensure you have a reliable broadband connection, quiet workspace, and preferred IDE ready.",
      "The meeting will be conducted via Google Meet / Screen share.",
      "You will be asked to walk through an architectural concept and build a working snippet.",
    ],
    ctaText: "View Interview Schedule →",
  },
  HIRED: {
    stage: "HIRED",
    subject: "Official Offer Letter: {jobTitle} — Please Review & Sign ✍️",
    headline: "Official Offer of Appointment — Please Review, Sign & Return ✍️🎉",
    introParagraph:
      "On behalf of the entire IZIES leadership and engineering team, we are exceedingly pleased to extend this formal <strong>Letter of Appointment & Offer</strong> to you for the position of <strong>{jobTitle}</strong>!",
    actionCallout:
      "MANDATORY ACTION: Please review all clauses, governance policies, and Annexures. To confirm your acceptance, you are required to digitally sign and submit your offer letter via your Candidate Portal within seven (7) business days.",
    mainContent:
      "Throughout our evaluation process, your technical depth, craftsmanship, problem-solving abilities, and initiative stood out. We have generated your formal Letter of Appointment detailing your role, company governance rules, and Annexures.",
    nextSteps: [
      "Click the button below to access your formal Letter of Appointment.",
      "Read all governance rules, IP assignment, confidentiality terms, and Annexure A.",
      "Sign digitally in Annexure B and submit within seven (7) business days.",
      "Download or print your PDF duplicate copy for your records.",
    ],
    ctaText: "✍️ Review, Sign & Return Official Offer Letter →",
  },
  REJECTED: {
    stage: "REJECTED",
    subject: "Update regarding your application for {jobTitle}",
    headline: "Application Status Update",
    introParagraph:
      "Thank you for taking the time to apply and speak with our team regarding the <strong>{jobTitle}</strong> position at IZIES.",
    actionCallout:
      "While we are not moving forward with your application for this specific role at this time, your profile will remain in our talent network for future opportunities.",
    mainContent:
      "We received a very high volume of remarkable applications, and after careful review, we have chosen to move forward with other candidates whose skill sets and project timelines more closely align with our immediate needs.",
    nextSteps: [
      "Your candidate profile remains active in our talent directory.",
      "Our team frequently revisits past applicants as new engineering and internship cohorts open up.",
      "We encourage you to continue building exceptional software and wish you the best in your journey.",
    ],
    ctaText: "View Student Dashboard →",
  },
};

export const DEFAULT_OFFER_SETTINGS: MasterOfferSettings = {
  companyName: "IZIES Private Limited",
  cin: "U72900DL2024PTC098712",
  registeredOffice: "Innovation Building, Cyber Hub, DLF Phase 2, Gurugram, India",
  rdCampus: "Outer Ring Road, Bengaluru, Karnataka, India",
  defaultSalary: "Unpaid (Experience & Certificate of Completion)",
  defaultJoiningDate: "1st October 2026",
  defaultLocation: "Remote (India)",
  defaultEmploymentType: "Unpaid Internship / Apprenticeship",
  defaultProbation: "Three (3) Months from Date of Joining",
  defaultWorkingHours: "Flexible (20–40 Hours / Week with Core Collaboration Windows)",
  defaultNoticePeriod: "Fifteen (15) Days written notice",
  defaultSignatory: "Core Executive Leadership Team",
  defaultSignatoryTitle: "Talent Operations & Technology Architecture",
  defaultSpecialTerms:
    "1-on-1 Engineering Mentorship, Official Experience Certificate on Corporate Letterhead, Milestone LOR, and Fast-Track PPO Evaluation.",

  // Theme & Styling Defaults
  themeStyle: "modern-indigo",
  themeAccentColor: "#1E40AF",
  themeFontFamily: "inter",
  themeWatermark: "confidential",

  // Narrative & Heading Defaults
  headerTagline: "LETTER OF APPOINTMENT & FORMAL OFFER OF EMPLOYMENT",
  confidentialityBadge: "STRICTLY PRIVATE & CONFIDENTIAL",
  introParagraph:
    "We are pleased to formally extend this offer of appointment at IZIES Private Limited. Our leadership team has been thoroughly impressed by your technical depth, problem-solving craft, and alignment with our vision to build world-class digital platforms.",
  acceptanceDeclaration:
    "I hereby acknowledge receipt of this formal Letter of Appointment, along with Annexures A & B. I confirm that I have read, understood, and willingly accept all terms, compensation structures, governance policies, and conditions contained herein. I confirm my acceptance of this offer and commit to joining on the scheduled date.",
  signatoryHeading: "For and on behalf of IZIES Private Limited",
  footerNotice:
    "This document constitutes a binding corporate appointment contract upon bilateral signature. All rights reserved.",

  // 4 Core Members with Name, Role, Email
  coreMembers: [
    {
      name: "Karan Singhania",
      role: "Co-Founder & Chief Product Architect",
      email: "karan@izies.com",
      department: "Leadership",
    },
    {
      name: "Aarav Mehta",
      role: "Head of Systems & Distributed Platform",
      email: "aarav@izies.com",
      department: "Engineering",
    },
    {
      name: "Rhea Sen",
      role: "Lead Product & UX Designer",
      email: "rhea@izies.com",
      department: "Design",
    },
    {
      name: "Devika Sharma",
      role: "Talent & People Operations Lead",
      email: "devika@izies.com",
      department: "Community & Talent",
    },
  ],
  rules: [
    {
      clause: "2.1",
      title: "Duties, Deliverables & Code of Craftsmanship",
      text: "You shall faithfully and diligently perform all duties assigned to your role, adhering strictly to IZIES's established engineering standards, sprint cadences, architectural blueprints, and security best practices. You agree to devote your full business time, energy, and best efforts to promote the interests of the Company.",
    },
    {
      clause: "2.2",
      title: "Probation, Milestones & Formal Confirmation",
      text: "Your performance will be evaluated against assigned project milestones during your initial term. During this period, your code quality, cross-functional collaboration, velocity, and initiative will be evaluated against quarterly OKRs. Upon satisfactory completion, your certification or confirmation will be issued in writing.",
    },
    {
      clause: "2.3",
      title: "Working Hours, Attendance & Remote Flexibility",
      text: "Standard working arrangements are flexible with core collaboration hours. If working remotely or under hybrid arrangements, you agree to maintain active connectivity, reliable broadband, and timely attendance at scheduled engineering forums and sprint reviews.",
    },
    {
      clause: "2.4",
      title: "Intellectual Property, Patents & Inventions Assignment",
      text: "All software applications, algorithms, UI components, patents, technical documentation, trade secrets, and copyrightable works conceptualized, designed, or authored by you during the period of your engagement shall constitute 'Works Made for Hire' and shall be the exclusive, perpetual, and worldwide property of the Company. You hereby irrevocably assign all rights to the Company.",
    },
    {
      clause: "2.5",
      title: "Non-Disclosure, Proprietary Information & Data Security (NDA)",
      text: "During and after your tenure, you shall maintain strict confidentiality concerning all proprietary source code, internal architectural schemas, encryption keys, business models, client credentials, and financial information. You shall not disclose or duplicate proprietary information without prior written authorization.",
    },
    {
      clause: "2.6",
      title: "Exclusivity, Moonlighting & Conflict of Interest",
      text: "Your position is an exclusive engagement. You shall not, without prior written consent, directly or indirectly engage in any other business, advisory engagement, freelance contracting, or commercial activity that conflicts with your obligations to the Company.",
    },
    {
      clause: "2.7",
      title: "Non-Compete & Non-Solicitation",
      text: "For a period of twelve (12) months following the completion or termination of your engagement for any reason, you agree not to solicit, induce, or attempt to hire any existing employee, consultant, or client into a competing commercial entity.",
    },
    {
      clause: "2.8",
      title: "Leaves, Academic Flexibility & Wellness Policy",
      text: "You will be entitled to structured leave days alongside statutory public holidays. For college students, special exam preparation leave and flexible submission windows will be accommodated with prior coordinator intimation.",
    },
    {
      clause: "2.9",
      title: "Separation Process & Notice Period",
      text: "Either party may conclude this engagement by providing written notice as per key terms. The Company reserves the right to terminate engagement immediately for cause (including breach of confidentiality, fraud, or violation of code of conduct). Upon separation, you shall return all company assets.",
    },
    {
      clause: "2.10",
      title: "Verification of Academic Credentials & Background Checks",
      text: "This offer is strictly contingent upon successful verification of your academic degrees, college enrollment/transcripts, identity proofs (Aadhaar / PAN / Passport), and satisfactory reference checks. Any false representation will result in immediate revocation.",
    },
    {
      clause: "2.11",
      title: "Governing Law & Jurisdiction",
      text: "This Agreement and all associated rights shall be governed by and construed in accordance with the substantive laws of India. The courts of competent jurisdiction situated at Bengaluru or New Delhi shall have exclusive jurisdiction over all disputes arising hereunder.",
    },
  ],
  annexureAItems: [
    { title: "Mode of Appointment", desc: "Unpaid Internship / Project Apprenticeship" },
    { title: "Financial Compensation / Cash Stipend", desc: "₹0 / Nil (Unpaid Industry Learning & Mentorship Engagement)" },
    { title: "Official Certificate of Completion", desc: "Issued on Corporate Letterhead with Verifiable Credential Ref ID" },
    { title: "Letter of Recommendation (LOR)", desc: "Personalized LOR signed by Founding Leadership based on project performance" },
    { title: "1-on-1 Engineering Mentorship", desc: "Direct Architectural Guidance & Weekly Sprint Pair Programming" },
    { title: "Live Production Codebase Exposure", desc: "Full Developer Access to IZIES Repositories & Cloud Infrastructure" },
    { title: "Pre-Placement Offer (PPO) Fast-Track", desc: "Priority Fast-Track Evaluation for Paid Roles upon Team Expansion" },
    { title: "Academic Flexibility", desc: "University Exam Leaves & Flexible Project Hours Accommodated" },
  ],
};
