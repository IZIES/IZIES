import { getStageTemplate } from "./template-store";

export interface EmailTemplateData {
  candidateName: string;
  candidateEmail?: string;
  candidatePhone?: string;
  jobTitle: string;
  departmentName?: string;
  collegeName?: string;
  graduationYear?: number | string;
  stage: string; // 'APPLIED' | 'FIRST_CALL' | 'INTERVIEW' | 'HIRED' | 'REJECTED'
  customNote?: string;
  applicationId?: string;
  appUrl?: string;
  // Offer Letter details for HIRED stage
  offerSalary?: string;
  offerJoiningDate?: string;
  offerLocation?: string;
  offerTerms?: string;
  meetingLink?: string;
  meetingTime?: string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
  stageLabel: string;
  stageColor: string;
}

function replacePlaceholders(str: string, vars: Record<string, string>): string {
  if (!str) return "";
  let out = str;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replaceAll(`{${k}}`, v || "");
  }
  return out;
}

export function renderStageEmail(data: EmailTemplateData): RenderedEmail {
  const {
    candidateName,
    jobTitle,
    departmentName = "Engineering",
    collegeName,
    graduationYear,
    stage,
    customNote,
    appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://izies.in",
  } = data;

  const dashboardUrl = `${appUrl}/candidate/dashboard?tab=applications`;
  const tpl = getStageTemplate(stage);

  const vars: Record<string, string> = {
    candidateName,
    jobTitle,
    departmentName,
    collegeName: collegeName || "",
    graduationYear: graduationYear ? String(graduationYear) : "",
    salary: data.offerSalary || "Unpaid (Experience & Certificate of Completion)",
    joiningDate: data.offerJoiningDate || "1st October 2026",
    location: data.offerLocation || "Remote (India)",
    dashboardUrl,
    offerUrl: data.applicationId ? `${appUrl}/candidate/offer/${data.applicationId}` : dashboardUrl,
  };

  switch (stage) {
    case "APPLIED": {
      const subject = replacePlaceholders(tpl.subject, vars);
      const stageLabel = "Application Received";
      const stageColor = "#3B82F6"; // Blue

      const html = getHtmlWrapper({
        candidateName,
        jobTitle,
        stageLabel,
        stageBadgeBg: "rgba(59, 130, 246, 0.15)",
        stageBadgeBorder: "rgba(59, 130, 246, 0.35)",
        stageBadgeColor: "#60A5FA",
        headline: replacePlaceholders(tpl.headline, vars),
        introParagraph: replacePlaceholders(tpl.introParagraph, vars),
        mainContent: `
          <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            ${replacePlaceholders(tpl.mainContent, vars)}
          </p>
          ${tpl.actionCallout ? `
          <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 12px; padding: 14px 18px; margin: 18px 0; font-size: 13px; color: #bfdbfe; line-height: 1.6;">
            ${replacePlaceholders(tpl.actionCallout, vars)}
          </div>
          ` : ""}
          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #93c5fd; font-weight: 600; font-size: 13px;">What happens next?</p>
            <ul style="margin: 0; padding-left: 20px; color: #94a3b8; font-size: 13px; line-height: 1.6;">
              ${(tpl.nextSteps || [
                "Our hiring team reviews your projects, technical skills, and resume.",
                "If shortlisted, you will receive an invitation to our First Call Screening.",
                "You can check your real-time recruitment progression anytime in your student dashboard.",
              ]).map((s) => `<li>${replacePlaceholders(s, vars)}</li>`).join("")}
            </ul>
          </div>
          ${customNote ? getCustomNoteBlock(customNote) : ""}
        `,
        ctaText: replacePlaceholders(tpl.ctaText, vars) || "Track Status in Student Dashboard →",
        ctaUrl: dashboardUrl,
      });

      const text = `Hi ${candidateName},\n\nThank you for applying for the ${jobTitle} position at IZIES!\n\nYour application and credentials have been received by our hiring squad. We will review your profile and update you once a decision is made.\n\nYou can track your real-time status here:\n${dashboardUrl}\n\nBest regards,\nThe IZIES Recruiting Squad`;

      return { subject, html, text, stageLabel, stageColor };
    }

    case "FIRST_CALL": {
      const subject = replacePlaceholders(tpl.subject, vars);
      const stageLabel = "First Call Screening";
      const stageColor = "#F59E0B"; // Amber

      const html = getHtmlWrapper({
        candidateName,
        jobTitle,
        stageLabel,
        stageBadgeBg: "rgba(245, 158, 11, 0.15)",
        stageBadgeBorder: "rgba(245, 158, 11, 0.35)",
        stageBadgeColor: "#FBBF24",
        headline: replacePlaceholders(tpl.headline, vars),
        introParagraph: replacePlaceholders(tpl.introParagraph, vars),
        mainContent: `
          <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            ${replacePlaceholders(tpl.mainContent, vars)}
          </p>
          ${getMeetingBlock(data.meetingLink || tpl.meetingLink, data.meetingTime || tpl.meetingTime)}
          ${customNote ? getCustomNoteBlock(customNote, "Interviewer Notes / Meeting Details:") : ""}
          ${tpl.actionCallout ? `
          <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.25); border-radius: 12px; padding: 14px 18px; margin: 18px 0; font-size: 13px; color: #fef08a; line-height: 1.6;">
            ${replacePlaceholders(tpl.actionCallout, vars)}
          </div>
          ` : ""}
          <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #FBBF24; font-weight: 600; font-size: 13px;">How to prepare:</p>
            <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
              ${(tpl.nextSteps || [
                "Be ready to walk us through 1 or 2 key projects you've authored or contributed to.",
                "Share what excites you about media streaming, distributed platforms, and high-performance apps.",
                "Bring any questions you have for our team regarding IZIES engineering culture!",
              ]).map((s) => `<li>${replacePlaceholders(s, vars)}</li>`).join("")}
            </ul>
          </div>
        `,
        ctaText: replacePlaceholders(tpl.ctaText, vars) || "View First Call Details in Dashboard →",
        ctaUrl: dashboardUrl,
      });

      const text = `Hi ${candidateName},\n\nCongratulations! You have been shortlisted for a First Call screening round for ${jobTitle} at IZIES.\n\n${customNote ? `Interviewer Note:\n${customNote}\n\n` : ""}Please visit your student dashboard for details and next steps:\n${dashboardUrl}\n\nBest regards,\nThe IZIES Recruiting Squad`;

      return { subject, html, text, stageLabel, stageColor };
    }

    case "INTERVIEW": {
      const subject = replacePlaceholders(tpl.subject, vars);
      const stageLabel = "Technical Interview";
      const stageColor = "#A855F7"; // Purple

      const html = getHtmlWrapper({
        candidateName,
        jobTitle,
        stageLabel,
        stageBadgeBg: "rgba(168, 85, 247, 0.15)",
        stageBadgeBorder: "rgba(168, 85, 247, 0.35)",
        stageBadgeColor: "#C084FC",
        headline: replacePlaceholders(tpl.headline, vars),
        introParagraph: replacePlaceholders(tpl.introParagraph, vars),
        mainContent: `
          <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            ${replacePlaceholders(tpl.mainContent, vars)}
          </p>
          ${getMeetingBlock(data.meetingLink || tpl.meetingLink, data.meetingTime || tpl.meetingTime)}
          ${customNote ? getCustomNoteBlock(customNote, "Technical Round Briefing / Video Call:") : ""}
          ${tpl.actionCallout ? `
          <div style="background: rgba(168, 85, 247, 0.08); border: 1px solid rgba(168, 85, 247, 0.25); border-radius: 12px; padding: 14px 18px; margin: 18px 0; font-size: 13px; color: #e9d5ff; line-height: 1.6;">
            ${replacePlaceholders(tpl.actionCallout, vars)}
          </div>
          ` : ""}
          <div style="background: rgba(168, 85, 247, 0.05); border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #C084FC; font-weight: 600; font-size: 13px;">Format of the round (45-60 min):</p>
            <ul style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
              ${(tpl.nextSteps || [
                "Interactive Coding / Architecture: Live problem solving alongside a senior IZIES engineer.",
                "Code Review & Optimization: Discussing scalability, edge cases, and ergonomic APIs.",
                "Mutual Q&A: Ask us about our tech stack, roadmap, and day-to-day velocity.",
              ]).map((s) => `<li>${replacePlaceholders(s, vars)}</li>`).join("")}
            </ul>
          </div>
        `,
        ctaText: replacePlaceholders(tpl.ctaText, vars) || "Open Candidate Dashboard →",
        ctaUrl: dashboardUrl,
      });

      const text = `Hi ${candidateName},\n\nWe are excited to invite you to the Technical Pairing & Architecture round for ${jobTitle} at IZIES.\n\n${customNote ? `Meeting Info:\n${customNote}\n\n` : ""}Check your dashboard for details:\n${dashboardUrl}\n\nBest regards,\nThe IZIES Engineering Squad`;

      return { subject, html, text, stageLabel, stageColor };
    }

    case "HIRED":
    case "SELECTED": {
      const salary = vars.salary;
      const joiningDate = vars.joiningDate;
      const location = vars.location;

      const subject = replacePlaceholders(tpl.subject, vars);
      const stageLabel = "Official Offer Extended";
      const stageColor = "#10B981"; // Emerald

      const offerUrl = vars.offerUrl;

      const html = getHtmlWrapper({
        candidateName,
        jobTitle,
        stageLabel,
        stageBadgeBg: "rgba(16, 185, 129, 0.15)",
        stageBadgeBorder: "rgba(16, 185, 129, 0.35)",
        stageBadgeColor: "#34D399",
        headline: replacePlaceholders(tpl.headline, vars),
        introParagraph: replacePlaceholders(tpl.introParagraph, vars),
        mainContent: `
          <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            ${replacePlaceholders(tpl.mainContent, vars)}
          </p>

          <!-- High Priority Sign & Return Action Banner -->
          <div style="background: rgba(234, 179, 8, 0.12); border: 1.5px solid rgba(234, 179, 8, 0.4); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; color: #FACC15; font-weight: 800; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
              ✍️ MANDATORY ACTION: PLEASE SIGN & RETURN WITHIN 7 BUSINESS DAYS
            </p>
            <p style="margin: 0; color: #fef08a; font-size: 13px; line-height: 1.6;">
              ${replacePlaceholders(tpl.actionCallout || "Please review all clauses, governance policies, and Annexures. To confirm your acceptance, you are required to digitally sign and submit your offer letter via your Candidate Portal within seven (7) business days.", vars)}
            </p>
          </div>

          <!-- Official Offer Summary Box -->
          <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 78, 59, 0.2)); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 14px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(16, 185, 129, 0.2); padding-bottom: 10px;">
              <span style="color: #34D399; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">📄 Appointment Terms Summary</span>
              <span style="color: #a7f3d0; font-size: 11px; font-family: monospace;">IZIES PRIVATE LIMITED</span>
            </div>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #e2e8f0;">
              <tr>
                <td style="padding: 6px 0; color: #94a3b8; width: 40%;">Position & Role:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${escapeHtml(jobTitle)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Department:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${escapeHtml(departmentName)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Compensation Model:</td>
                <td style="padding: 6px 0; font-weight: 700; color: #34D399;">${escapeHtml(salary)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Expected Date of Joining:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${escapeHtml(joiningDate)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #94a3b8;">Work Location / Mode:</td>
                <td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${escapeHtml(location)}</td>
              </tr>
            </table>
          </div>

          ${customNote ? getCustomNoteBlock(customNote, "Special Terms, Perks & Leadership Note:") : ""}

          <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #34D399; font-weight: 600; font-size: 13px;">Steps to Execute and Return Your Offer:</p>
            <ol style="margin: 0; padding-left: 20px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
              ${(tpl.nextSteps || [
                "Click the button below to access your formal Letter of Appointment.",
                "Read all governance rules, IP assignment, confidentiality terms, and Annexure A.",
                "Sign digitally in Annexure B and submit within seven (7) business days.",
                "Download or print your PDF duplicate copy for your records.",
              ]).map((s) => `<li>${replacePlaceholders(s, vars)}</li>`).join("")}
            </ol>
          </div>
        `,
        ctaText: replacePlaceholders(tpl.ctaText, vars) || "✍️ Review, Sign & Return Official Offer Letter →",
        ctaUrl: offerUrl,
      });

      const text = `Hi ${candidateName},\n\nCongratulations! We are pleased to extend an Official Offer of Appointment for the role of ${jobTitle} at IZIES.\n\nACTION REQUIRED: PLEASE REVIEW, SIGN & RETURN WITHIN 7 DAYS.\n\nAPPOINTMENT SUMMARY:\n- Position: ${jobTitle}\n- Department: ${departmentName}\n- Compensation: ${salary}\n- Joining Date: ${joiningDate}\n- Work Location: ${location}\n\n${customNote ? `Special Terms & Leadership Note:\n${customNote}\n\n` : ""}Please review and digitally sign your official offer letter here:\n${offerUrl}\n\nYour onboarding and mentor pairing will commence upon receiving your signed acceptance.\n\nWarm regards,\nCore Executive Leadership Team\nIZIES Private Limited`;

      return { subject, html, text, stageLabel, stageColor };
    }

    case "REJECTED":
    default: {
      const subject = replacePlaceholders(tpl.subject, vars);
      const stageLabel = "Application Update";
      const stageColor = "#64748B"; // Slate

      const html = getHtmlWrapper({
        candidateName,
        jobTitle,
        stageLabel,
        stageBadgeBg: "rgba(100, 116, 139, 0.15)",
        stageBadgeBorder: "rgba(100, 116, 139, 0.35)",
        stageBadgeColor: "#94A3B8",
        headline: replacePlaceholders(tpl.headline, vars),
        introParagraph: replacePlaceholders(tpl.introParagraph, vars),
        mainContent: `
          <p style="margin: 0 0 16px 0; color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            ${replacePlaceholders(tpl.mainContent, vars)}
          </p>
          ${customNote ? getCustomNoteBlock(customNote, "Recruiter Feedback / Notes:") : ""}
          ${tpl.actionCallout ? `
          <div style="background: rgba(100, 116, 139, 0.08); border: 1px solid rgba(100, 116, 139, 0.25); border-radius: 12px; padding: 14px 18px; margin: 18px 0; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
            ${replacePlaceholders(tpl.actionCallout, vars)}
          </div>
          ` : ""}
          <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; color: #94A3B8; font-weight: 600; font-size: 13px;">Staying Connected</p>
            <ul style="margin: 0; padding-left: 20px; color: #94A3B8; font-size: 13px; line-height: 1.6;">
              ${(tpl.nextSteps || [
                "Your candidate profile remains active in our talent directory.",
                "Our team frequently revisits past applicants as new engineering and internship cohorts open up.",
                "We encourage you to continue building exceptional software and wish you the best in your journey.",
              ]).map((s) => `<li>${replacePlaceholders(s, vars)}</li>`).join("")}
            </ul>
          </div>
        `,
        ctaText: replacePlaceholders(tpl.ctaText, vars) || "View Student Dashboard →",
        ctaUrl: dashboardUrl,
      });

      const text = `Hi ${candidateName},\n\nThank you for applying for the ${jobTitle} position at IZIES. While we are not moving forward for this specific role, your profile remains in our talent pool for future opportunities.\n\n${customNote ? `Notes:\n${customNote}\n\n` : ""}We wish you the very best in your academic and professional journey.\n\nBest regards,\nThe IZIES Recruiting Team`;

      return { subject, html, text, stageLabel, stageColor };
    }
  }
}

// Helpers
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getCustomNoteBlock(note: string, title = "Important Note from Hiring Team:"): string {
  return `
    <div style="background: rgba(59, 130, 246, 0.08); border-left: 3px solid #3B82F6; border-radius: 8px; padding: 14px 16px; margin: 20px 0;">
      <p style="margin: 0 0 6px 0; color: #60A5FA; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
        ${escapeHtml(title)}
      </p>
      <p style="margin: 0; color: #E2E8F0; font-size: 13px; line-height: 1.6; white-space: pre-wrap;">
        ${escapeHtml(note)}
      </p>
    </div>
  `;
}

function getMeetingBlock(meetingLink?: string, meetingTime?: string): string {
  if (!meetingLink && !meetingTime) return "";

  const link = meetingLink?.trim();
  const time = meetingTime?.trim();

  return `
    <div style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 16px; padding: 20px; margin: 20px 0; font-family: sans-serif;">
      <div style="font-size: 12px; font-weight: 700; color: #60A5FA; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px;">
        📅 Scheduled Meeting & Discussion Details
      </div>

      ${time ? `
      <div style="background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 10px 14px; margin-bottom: 12px; color: #F3F4F6; font-size: 13px; font-weight: 600;">
        <span style="color: #9CA3AF;">Date & Time:</span> <span style="color: #60A5FA; font-weight: 700;">${escapeHtml(time)}</span>
      </div>
      ` : ""}

      ${link ? `
      <div style="margin-top: 12px; text-align: center;">
        <a href="${escapeHtml(link)}" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #10B981 100%); color: #FFFFFF; font-weight: 700; font-size: 13px; padding: 11px 22px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);">
          📹 Join Google Meet Call →
        </a>
        <p style="margin: 8px 0 0 0; color: #9CA3AF; font-size: 11px;">
          Direct Link: <a href="${escapeHtml(link)}" target="_blank" style="color: #60A5FA; text-decoration: underline;">${escapeHtml(link)}</a>
        </p>
      </div>
      ` : ""}
    </div>
  `;
}

interface HtmlWrapperProps {
  candidateName: string;
  jobTitle: string;
  stageLabel: string;
  stageBadgeBg: string;
  stageBadgeBorder: string;
  stageBadgeColor: string;
  headline: string;
  introParagraph: string;
  mainContent: string;
  ctaText: string;
  ctaUrl: string;
}

function getHtmlWrapper(props: HtmlWrapperProps): string {
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://izies.in";
  const logoUrl = "https://izies.in/icons/android-chrome-512x512.png";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IZIES Recruitment Notification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070911; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F1F5F9; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #070911; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Container Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0D111E; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: linear-gradient(180deg, #11172A 0%, #0D111E 100%);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; vertical-align: middle;">
                      <img src="${logoUrl}" alt="IZIES" style="height: 36px; width: 36px; border-radius: 10px; vertical-align: middle; margin-right: 10px; object-fit: cover; border: 1px solid rgba(168, 85, 247, 0.4);" />
                      <span style="font-size: 18px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; vertical-align: middle;">IZIES</span>
                      <span style="font-size: 11px; font-weight: 600; color: #60A5FA; background: rgba(37, 99, 235, 0.15); border: 1px solid rgba(37, 99, 235, 0.3); padding: 3px 8px; border-radius: 6px; margin-left: 8px; vertical-align: middle; text-transform: uppercase; letter-spacing: 0.5px;">Careers ATS</span>
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block background-color: ${props.stageBadgeBg}; border: 1px solid ${props.stageBadgeBorder}; color: ${props.stageBadgeColor}; font-size: 11px; font-weight: 700; padding: 5px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${props.stageLabel}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 16px 0; color: #FFFFFF; font-size: 22px; font-weight: 800; tracking-tight; line-height: 1.3;">
                ${props.headline}
              </h1>

              <p style="margin: 0 0 16px 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                Hi <strong>${escapeHtml(props.candidateName)}</strong>,
              </p>

              <p style="margin: 0 0 20px 0; color: #CBD5E1; font-size: 14px; line-height: 1.6;">
                ${props.introParagraph}
              </p>

              ${props.mainContent}

              <!-- CTA Button -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 12px 0;">
                <tr>
                  <td align="center">
                    <a href="${props.ctaUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color: #FFFFFF; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 14px; text-decoration: none; box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);">
                      ${props.ctaText}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #080B14; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="margin: 0 0 6px 0; color: #64748B; font-size: 12px; line-height: 1.5;">
                This is an automated notification from the <strong>IZIES Careers & ATS Portal</strong>.
              </p>
              <p style="margin: 0; color: #475569; font-size: 11px;">
                © 2026 IZIES Private Limited • Universe of Dynamic Digital Experiences.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
