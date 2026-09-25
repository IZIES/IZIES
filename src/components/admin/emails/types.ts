export interface EmailLogItem {
  id: string;
  recipient: string;
  subject: string;
  stage: string;
  sentAt: string;
  bodyHtml: string;
  bodyText: string;
  status?: string;
  application?: {
    id: string;
    fullName: string;
    email: string;
    collegeName?: string;
    job?: {
      id: string;
      title: string;
      department?: { name: string };
    };
  };
}

export interface StageCardConfig {
  stage: string;
  label: string;
  badgeVariant: "default" | "warning" | "purple" | "success" | "danger";
  icon: string;
  trigger: string;
  description: string;
}

export const STAGE_CARDS: StageCardConfig[] = [
  {
    stage: "APPLIED",
    label: "Application Received",
    badgeVariant: "default",
    icon: "🚀",
    trigger: "Automatic on candidate application submit",
    description: "Dispatched instantly when candidate applies. Confirms resume delivery and provides student tracking portal link.",
  },
  {
    stage: "FIRST_CALL",
    label: "First Call Screening",
    badgeVariant: "warning",
    icon: "📞",
    trigger: "Recruiter moves stage to 'First Call'",
    description: "Invites candidate to introductory screening. Outlines conversation details, interviewer briefing, and call timings.",
  },
  {
    stage: "SCREENING",
    label: "Background & Resume Review",
    badgeVariant: "default",
    icon: "🔍",
    trigger: "Recruiter moves stage to 'Screening'",
    description: "Notifies candidate that their profile, college credentials, and GitHub repositories are actively under evaluation.",
  },
  {
    stage: "SHORTLISTED",
    label: "Shortlisted for Evaluation",
    badgeVariant: "purple",
    icon: "⭐",
    trigger: "Recruiter moves stage to 'Shortlisted'",
    description: "Informs candidate they have been shortlisted and selected for upcoming specialized interview rounds.",
  },
  {
    stage: "INTERVIEW",
    label: "Technical Pairing Round",
    badgeVariant: "purple",
    icon: "💻",
    trigger: "Recruiter moves stage to 'Interview'",
    description: "Advances candidate to live pairing round. Injects Google Meet link, code requirements, and problem briefing.",
  },
  {
    stage: "ASSESSMENT",
    label: "Take-Home Task & Assignment",
    badgeVariant: "warning",
    icon: "📝",
    trigger: "Recruiter moves stage to 'Assessment'",
    description: "Sends practical coding challenge, assignment instructions, repository link, and submission deadline details.",
  },
  {
    stage: "SELECTED",
    label: "Selected for Offer Process",
    badgeVariant: "success",
    icon: "🎯",
    trigger: "Recruiter moves stage to 'Selected'",
    description: "Congratulates candidate on clearing evaluation rounds and informs them that formal offer terms are being prepared.",
  },
  {
    stage: "HIRED",
    label: "Official Offer Letter & Welcome",
    badgeVariant: "success",
    icon: "🎉",
    trigger: "Recruiter moves stage to 'Offer / Hire'",
    description: "Mandatory 'Sign & Return' offer email with link to digital Letter of Appointment and acceptance requirement.",
  },
  {
    stage: "REJECTED",
    label: "Application Update / Pass",
    badgeVariant: "danger",
    icon: "🤝",
    trigger: "Recruiter moves stage to 'Pass / Archive'",
    description: "Respectful, constructive message thanking candidate and retaining their profile in talent directory.",
  },
  {
    stage: "WITHDRAWN",
    label: "Application Withdrawal",
    badgeVariant: "danger",
    icon: "🏷️",
    trigger: "Candidate or recruiter marks as 'Withdrawn'",
    description: "Acknowledges application withdrawal and welcomes candidate to apply again in future hiring cycles.",
  },
];

export function getStatusVariant(status?: string): "success" | "warning" | "danger" | "default" {
  switch (status) {
    case "SENT":
      return "success";
    case "QUEUED":
      return "warning";
    case "FAILED":
      return "danger";
    default:
      return "default";
  }
}

export function getStageVariant(stage: string): "default" | "warning" | "purple" | "success" | "danger" {
  switch (stage) {
    case "APPLIED":
    case "SCREENING":
      return "default";
    case "FIRST_CALL":
    case "ASSESSMENT":
      return "warning";
    case "SHORTLISTED":
    case "INTERVIEW":
      return "purple";
    case "SELECTED":
    case "HIRED":
      return "success";
    case "REJECTED":
    case "WITHDRAWN":
      return "danger";
    default:
      return "default";
  }
}
