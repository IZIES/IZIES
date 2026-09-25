export interface OfferLetterParams {
  applicationId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  collegeName?: string;
  degree?: string;
  jobTitle: string;
  departmentName?: string;
  employmentType?: string;
  workplaceType?: string;
  offerSalary?: string;
  offerJoiningDate?: string;
  offerLocation?: string;
  offerTerms?: string;
  probationPeriod?: string;
  workingHours?: string;
  noticePeriod?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  companyName?: string;
  issueDate?: string;
  appUrl?: string;
  isAccepted?: boolean;
  acceptedAt?: string | Date | null;
  signatureName?: string;
  masterSettings?: MasterOfferSettings;
}

export function isUnpaidCompensation(salaryStr?: string | null): boolean {
  if (!salaryStr) return true;
  const s = salaryStr.toLowerCase().trim();
  if (
    s === "" ||
    s === "0" ||
    s === "₹0" ||
    s.startsWith("₹0/") ||
    s.startsWith("₹0 /") ||
    s.startsWith("0/") ||
    s.startsWith("0 /") ||
    /\b0\b/.test(s) ||
    s.includes("unpaid") ||
    s.includes("nil") ||
    s.includes("experience") ||
    s.includes("certificate") ||
    s.includes("stipend-free") ||
    s.includes("no salary") ||
    s.includes("none") ||
    s.includes("n/a")
  ) {
    return true;
  }
  return false;
}

import { DEFAULT_OFFER_SETTINGS, MasterOfferSettings } from "./template-types";

export function generateOfferRef(applicationId: string): string {
  const year = new Date().getFullYear();
  const suffix = applicationId ? applicationId.slice(-6).toUpperCase() : "DOC001";
  return `IZIES-OFF-${year}-${suffix}`;
}

export function renderOfferLetterHtml(params: OfferLetterParams): string {
  const master: MasterOfferSettings = params.masterSettings || DEFAULT_OFFER_SETTINGS;
  const company = params.companyName || master.companyName;
  const cin = master.cin;
  const office = master.registeredOffice;
  const rdCampus = master.rdCampus;
  const refNo = generateOfferRef(params.applicationId);
  const dateStr =
    params.issueDate ||
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  // Themes & Styling
  const themeStyle = master.themeStyle || "modern-indigo";
  const accentColor = master.themeAccentColor || (
    themeStyle === "executive-slate" ? "#0F172A" :
    themeStyle === "emerald-minimal" ? "#047857" :
    themeStyle === "royal-navy" ? "#172554" :
    themeStyle === "crimson-lux" ? "#991B1B" :
    "#1E40AF"
  );
  const watermarkType = master.themeWatermark || "confidential";
  const fontFamily = master.themeFontFamily === "serif"
    ? "Georgia, 'Times New Roman', serif"
    : master.themeFontFamily === "mono-tech"
    ? "'JetBrains Mono', 'Fira Code', monospace"
    : '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif';

  const headerTagline = master.headerTagline || "LETTER OF APPOINTMENT & FORMAL OFFER OF EMPLOYMENT";
  const confidentialityBadge = master.confidentialityBadge || "STRICTLY PRIVATE & CONFIDENTIAL";
  const introParagraph = master.introParagraph ||
    "We are pleased to formally extend this offer of appointment at IZIES Private Limited. Our leadership team has been thoroughly impressed by your technical depth, problem-solving craft, and alignment with our vision to build world-class digital platforms.";
  const acceptanceDeclaration = master.acceptanceDeclaration ||
    `I, ${params.candidateName}, hereby acknowledge receipt of this formal Letter of Appointment, along with Annexures A & B. I confirm that I have read, understood, and willingly accept all terms, compensation structures, governance policies, and conditions contained herein. I confirm my acceptance of this offer and commit to joining ${company} on ${params.offerJoiningDate || master.defaultJoiningDate}.`;
  const signatoryHeading = master.signatoryHeading || `For and on behalf of ${company}`;
  const footerNotice = master.footerNotice || `${company} • Registered Office: ${office} • Document Reference: ${refNo}\nThis document constitutes a binding corporate appointment contract upon bilateral signature.`;

  const coreMembers = (master.coreMembers && master.coreMembers.length > 0)
    ? master.coreMembers
    : DEFAULT_OFFER_SETTINGS.coreMembers;

  const rules = (master.rules && master.rules.length > 0) ? master.rules : DEFAULT_OFFER_SETTINGS.rules;
  const annexureAItems = (master.annexureAItems && master.annexureAItems.length > 0) ? master.annexureAItems : DEFAULT_OFFER_SETTINGS.annexureAItems;

  const isUnpaid = isUnpaidCompensation(params.offerSalary);
  const salary = params.offerSalary
    ? params.offerSalary
    : master.defaultSalary;
  const joiningDate = params.offerJoiningDate || master.defaultJoiningDate;
  const location = params.offerLocation || params.workplaceType || master.defaultLocation;
  const department = params.departmentName || "Engineering & Distributed Systems";
  const empType = params.employmentType || (isUnpaid ? master.defaultEmploymentType : "Full-Time / Internship");
  const probation = params.probationPeriod || master.defaultProbation;
  const workingHours = params.workingHours || master.defaultWorkingHours;
  const notice = params.noticePeriod || master.defaultNoticePeriod;
  const signatory = params.signatoryName || master.defaultSignatory;
  const signatoryTitle = params.signatoryTitle || master.defaultSignatoryTitle;

  const isAccepted = Boolean(params.isAccepted || params.acceptedAt);
  const acceptedDateFormatted = params.acceptedAt
    ? new Date(params.acceptedAt).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // Helper: lighten a hex color
  const hexToRgb = (hex: string) => {
    const h = hex.replace('#', '');
    return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
  };
  const rgb = hexToRgb(accentColor);
  const accentLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08)`;
  const accentUltraLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04)`;
  const accentMid = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;
  const accentDark = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.92)`;

  // Convert logo to base64 for reliable PDF rendering on server
  let logoSrc = master.logoUrl || "/playaura-logo.png";
  if (typeof window === "undefined") {
    try {
      const _req = eval("require");
      const _fs = _req("fs");
      const _path = _req("path");
      const logoPath = _path.join(process.cwd(), "public", "playaura-logo.png");
      if (_fs.existsSync(logoPath)) {
        const base64Img = _fs.readFileSync(logoPath).toString("base64");
        logoSrc = `data:image/png;base64,${base64Img}`;
      }
    } catch (e) {
      // fallback
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${headerTagline} — ${params.candidateName} — ${company}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    @media print {
      html, body {
        background: #FFFFFF !important;
        color: #0F172A !important;
        padding: 0 !important;
        margin: 0 !important;
        font-size: 9.5pt !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .no-print { display: none !important; }
      .offer-container {
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 16mm 14mm !important;
        border-radius: 0 !important;
      }
      .page-break { page-break-before: always; break-before: page; margin-top: 0; }
      .hero-banner, .candidate-card, .doc-subject, .action-callout, .terms-table, .rule-box, .annexure-header, .council-section, .sig-card {
        print-color-adjust: exact !important;
        -webkit-print-color-adjust: exact !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: ${fontFamily.includes('Georgia') ? "'Playfair Display', Georgia, 'Times New Roman', serif" : fontFamily.includes('JetBrains') ? "'JetBrains Mono', 'Fira Code', monospace" : "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"};
      background: linear-gradient(135deg, #0A0E1A 0%, #0F1629 50%, #060913 100%);
      color: #1E293B;
      padding: 40px 16px;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
    }

    .offer-container {
      max-width: 860px;
      margin: 0 auto;
      background: #FFFFFF;
      border-radius: 2px;
      box-shadow: 0 50px 120px -30px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 0 80px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08);
      position: relative;
      overflow: hidden;
    }

    /* ═══════════════ HERO BANNER ═══════════════ */
    .hero-banner {
      background: linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 40%, #0F172A 100%);
      padding: 40px 52px 36px;
      position: relative;
      overflow: hidden;
    }
    .hero-pattern {
      position: absolute;
      inset: 0;
      opacity: 0.06;
      background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40zm0-40h2l-2 2V0zm0 4l4-4h2l-6 6V4zm0 4l8-8h2L40 10V8zm0 4L52 0h2L40 14v-2zm0 4L56 0h2L40 18v-2zm0 4L60 0h2L40 22v-2zm0 4L64 0h2L40 26v-2zm0 4L68 0h2L40 30v-2zm0 4L72 0h2L40 34v-2zm0 4L76 0h2L40 38v-2zm0 4L80 0v2L42 40h-2zm4 0L80 4v2L46 40h-2zm4 0L80 8v2L50 40h-2zm4 0l28-28v2L54 40h-2zm4 0l24-24v2L58 40h-2zm4 0l20-20v2L62 40h-2zm4 0l16-16v2L66 40h-2zm4 0l12-12v2L70 40h-2zm4 0l8-8v2l-6 6h-2zm4 0l4-4v2l-2 2h-2z' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E");
    }
    .hero-glow {
      position: absolute;
      top: -60px;
      right: -60px;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
      border-radius: 50%;
    }
    .hero-top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      z-index: 2;
      margin-bottom: 20px;
    }
    .hero-doc-type {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 2.5px;
      color: rgba(255,255,255,0.55);
      text-transform: uppercase;
    }
    .hero-doc-type-line {
      width: 32px;
      height: 1px;
      background: rgba(255,255,255,0.3);
    }
    .hero-ref-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.12);
      backdrop-filter: blur(8px);
      color: #FFFFFF;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 600;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10.5px;
      letter-spacing: 0.5px;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .hero-company {
      font-size: 28px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.5px;
      position: relative;
      z-index: 2;
      line-height: 1.2;
    }
    .hero-tagline {
      font-size: 11px;
      font-weight: 600;
      color: rgba(255,255,255,0.5);
      letter-spacing: 1.8px;
      text-transform: uppercase;
      margin-top: 6px;
      position: relative;
      z-index: 2;
    }
    .hero-bottom-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid rgba(255,255,255,0.1);
      position: relative;
      z-index: 2;
    }
    .hero-corp-info {
      font-size: 10px;
      color: rgba(255,255,255,0.4);
      line-height: 1.6;
    }
    .hero-date-block {
      text-align: right;
    }
    .hero-date-label {
      font-size: 9px;
      color: rgba(255,255,255,0.35);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }
    .hero-date-value {
      font-size: 13px;
      color: #FFFFFF;
      font-weight: 700;
      margin-top: 2px;
    }
    .hero-confidential {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #FCD34D;
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-top: 6px;
    }

    /* ═══════════════ DOCUMENT BODY ═══════════════ */
    .doc-body {
      padding: 44px 52px 52px;
      position: relative;
      z-index: 1;
    }
    @media (max-width: 640px) {
      .hero-banner { padding: 28px 20px 24px; }
      .doc-body { padding: 24px 20px 28px; }
      .hero-company { font-size: 22px; }
    }

    /* Watermarks */
    .watermark-diagonal {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 48px; font-weight: 900; letter-spacing: 12px;
      color: rgba(15, 23, 42, 0.025);
      text-transform: uppercase;
      border: 3px solid rgba(15, 23, 42, 0.02);
      padding: 24px 56px; border-radius: 16px;
      pointer-events: none; z-index: 0; white-space: nowrap; user-select: none;
    }
    .watermark-seal {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 340px; height: 340px; border-radius: 50%;
      border: 6px double rgba(15, 23, 42, 0.025);
      display: flex; align-items: center; justify-content: center; text-align: center;
      pointer-events: none; z-index: 0; user-select: none;
      color: rgba(15, 23, 42, 0.03); font-weight: 900; letter-spacing: 2px;
    }
    .watermark-grid {
      position: absolute; inset: 0;
      background-image: radial-gradient(rgba(15, 23, 42, 0.03) 1px, transparent 1px);
      background-size: 18px 18px;
      pointer-events: none; z-index: 0;
    }

    /* ═══════════════ CANDIDATE CARD ═══════════════ */
    .candidate-card {
      background: linear-gradient(135deg, ${accentUltraLight} 0%, #FAFBFD 100%);
      border: 1px solid #E8ECF4;
      border-left: 4px solid ${accentColor};
      padding: 22px 28px;
      border-radius: 0 12px 12px 0;
      margin-bottom: 28px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .candidate-label {
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: ${accentColor};
      opacity: 0.8;
    }
    .candidate-name {
      font-size: 22px;
      font-weight: 800;
      color: #0F172A;
      letter-spacing: -0.3px;
    }
    .candidate-meta-row {
      display: flex; flex-wrap: wrap; align-items: center; gap: 16px;
      font-size: 12px; color: #64748B; margin-top: 4px;
    }
    .candidate-meta-item {
      display: inline-flex; align-items: center; gap: 5px;
    }

    /* ═══════════════ SUBJECT BAR ═══════════════ */
    .doc-subject {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      color: #FFFFFF;
      padding: 14px 22px;
      border-radius: 10px;
      font-size: 12.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 8px 0 24px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-left: 4px solid ${accentColor};
    }

    /* ═══════════════ TEXT STYLES ═══════════════ */
    p {
      font-size: 13.5px;
      color: #374151;
      margin-bottom: 14px;
      text-align: justify;
      line-height: 1.8;
    }

    /* ═══════════════ ACTION CALLOUT ═══════════════ */
    .action-callout {
      background: linear-gradient(135deg, ${accentUltraLight} 0%, #FFFFFF 100%);
      border: 1px solid ${accentColor}25;
      border-left: 4px solid ${accentColor};
      border-radius: 0 12px 12px 0;
      padding: 22px 26px;
      margin: 24px 0;
    }
    .action-callout h4 {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: ${accentColor};
      margin-bottom: 10px;
    }
    .action-callout ol {
      margin-left: 18px;
      font-size: 12.5px;
      line-height: 1.75;
      color: #374151;
    }
    .action-callout li { margin-bottom: 6px; }

    /* ═══════════════ SECTION HEADINGS ═══════════════ */
    .section-heading {
      font-size: 12.5px;
      font-weight: 800;
      color: #0F172A;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 36px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 10px;
      border-bottom: 2px solid #F1F5F9;
      position: relative;
    }
    .section-heading::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 80px;
      height: 2px;
      background: ${accentColor};
    }
    .section-pill {
      font-size: 9.5px;
      font-weight: 700;
      color: ${accentColor};
      background: ${accentLight};
      padding: 4px 10px;
      border-radius: 20px;
      letter-spacing: 0.3px;
    }

    /* ═══════════════ TERMS TABLE ═══════════════ */
    .terms-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
      margin: 16px 0 26px 0;
      font-size: 12.5px;
      border: 1px solid #E8ECF4;
      border-radius: 10px;
      overflow: hidden;
    }
    .terms-table th, .terms-table td {
      padding: 12px 20px;
      border-bottom: 1px solid #F1F5F9;
      text-align: left;
    }
    .terms-table tr:last-child th, .terms-table tr:last-child td { border-bottom: none; }
    .terms-table th {
      background: #F8FAFC;
      color: #64748B;
      font-weight: 600;
      width: 36%;
      border-right: 1px solid #E8ECF4;
      font-size: 12px;
    }
    .terms-table td {
      color: #0F172A;
      font-weight: 600;
      background: #FFFFFF;
    }
    .terms-table tr:nth-child(even) td { background: #FAFAFD; }
    .highlight-salary-cell { background: ${accentUltraLight} !important; }
    .highlight-salary-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 14px; border-radius: 8px;
      background: linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 100%);
      color: #FFFFFF; font-weight: 700; font-size: 12.5px; letter-spacing: 0.3px;
      box-shadow: 0 2px 8px ${accentColor}30;
    }

    /* ═══════════════ RULES / CLAUSES ═══════════════ */
    .rule-box {
      background: #FFFFFF;
      border: 1px solid #F1F5F9;
      border-left: 3px solid ${accentColor};
      border-radius: 0 8px 8px 0;
      padding: 14px 18px;
      margin-bottom: 10px;
    }
    .rule-title {
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
      margin-bottom: 4px;
    }
    .rule-clause-num {
      color: ${accentColor};
      font-weight: 800;
    }
    .rule-text {
      font-size: 11.5px;
      color: #64748B;
      line-height: 1.7;
      text-align: justify;
    }

    /* ═══════════════ ANNEXURE HEADERS ═══════════════ */
    .annexure-header {
      background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
      color: #FFFFFF;
      padding: 13px 22px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      margin-top: 36px;
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-left: 4px solid ${accentColor};
    }

    /* ═══════════════ ACCEPTANCE DECLARATION ═══════════════ */
    .acceptance-declaration {
      background: linear-gradient(135deg, ${accentUltraLight} 0%, #FAFBFD 100%);
      border: 1px solid #E8ECF4;
      border-left: 4px solid ${accentColor};
      border-radius: 0 10px 10px 0;
      padding: 18px 24px;
      font-size: 12px;
      color: #475569;
      font-style: italic;
      margin-top: 14px;
      margin-bottom: 28px;
      line-height: 1.75;
    }

    /* ═══════════════ EXECUTIVE LEADERSHIP COUNCIL ═══════════════ */
    .council-section {
      background: linear-gradient(135deg, #F8FAFD 0%, #F1F4FA 100%);
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 0;
      margin-top: 28px;
      margin-bottom: 32px;
      overflow: hidden;
    }
    .council-banner {
      background: linear-gradient(135deg, ${accentColor} 0%, #0F172A 100%);
      padding: 16px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .council-banner-title {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #FFFFFF;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .council-banner-icon {
      width: 28px; height: 28px;
      background: rgba(255,255,255,0.15);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
    }
    .council-count-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.85);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      border: 1px solid rgba(255,255,255,0.15);
    }
    .council-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 20px 24px;
    }
    @media (max-width: 640px) {
      .council-grid { grid-template-columns: 1fr; }
    }
    .council-card {
      background: #FFFFFF;
      border: 1px solid #E8ECF4;
      border-radius: 12px;
      padding: 16px 18px;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      transition: box-shadow 0.2s ease;
      position: relative;
      overflow: hidden;
    }
    .council-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, ${accentColor} 0%, transparent 100%);
    }
    .council-avatar {
      width: 42px; height: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, ${accentColor} 0%, #0F172A 100%);
      color: #FFFFFF;
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 13px; letter-spacing: 0.5px;
      flex-shrink: 0;
      box-shadow: 0 2px 8px ${accentColor}25;
    }
    .council-details { flex: 1; min-width: 0; }
    .council-name {
      font-weight: 700;
      font-size: 13px;
      color: #0F172A;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }
    .council-verified {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 16px; height: 16px;
      background: #10B981;
      color: #FFFFFF;
      border-radius: 50%;
      font-size: 9px;
      font-weight: 900;
    }
    .council-role {
      font-size: 11px;
      color: #64748B;
      font-weight: 500;
      line-height: 1.4;
      margin-bottom: 6px;
    }
    .council-email-link {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: ${accentColor};
      font-size: 11px;
      font-weight: 600;
      text-decoration: none;
      padding: 3px 10px;
      background: ${accentLight};
      border-radius: 6px;
      border: 1px solid ${accentColor}20;
    }
    .council-email-link:hover { text-decoration: underline; }

    /* ═══════════════ DUAL SIGNATURES ═══════════════ */
    .signatures-section {
      margin-top: 32px;
      padding-top: 28px;
      border-top: 2px solid #F1F5F9;
      position: relative;
    }
    .signatures-section::before {
      content: 'BILATERAL EXECUTION';
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: #FFFFFF;
      padding: 0 16px;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2px;
      color: #94A3B8;
    }
    .signatures-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 8px;
    }
    @media (max-width: 640px) {
      .signatures-grid { grid-template-columns: 1fr; }
    }
    .sig-card {
      border: 1px solid #E8ECF4;
      border-radius: 12px;
      overflow: hidden;
    }
    .sig-card-header {
      padding: 12px 18px;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sig-card-body {
      padding: 18px 20px;
      background: #FFFFFF;
    }
    .sig-seal-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border: 1.5px solid;
      border-radius: 6px;
      font-weight: 800;
      font-size: 9px;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      margin-bottom: 14px;
    }
    .sig-cursive {
      font-family: 'Playfair Display', 'Brush Script MT', 'Segoe Script', cursive, serif;
      font-size: 26px;
      font-weight: 700;
      min-height: 34px;
      display: flex;
      align-items: flex-end;
      font-style: italic;
    }
    .sig-divider {
      width: 100%;
      height: 2px;
      margin: 10px 0;
      border-radius: 1px;
    }
    .sig-authority {
      font-size: 12px;
      font-weight: 700;
      color: #0F172A;
    }
    .sig-meta {
      font-size: 10.5px;
      color: #94A3B8;
      line-height: 1.5;
      margin-top: 4px;
    }

    /* ═══════════════ FOOTER ═══════════════ */
    .doc-footer {
      margin-top: 44px;
      padding-top: 24px;
      border-top: 1px solid #E8ECF4;
      position: relative;
    }
    .doc-footer::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 0;
      width: 60px;
      height: 2px;
      background: ${accentColor};
    }
    .footer-text {
      font-size: 9.5px;
      color: #94A3B8;
      text-align: center;
      line-height: 1.7;
    }
    .footer-brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #F1F5F9;
    }
    .footer-brand-dot {
      width: 4px; height: 4px;
      background: ${accentColor};
      border-radius: 50%;
    }
    .footer-brand-text {
      font-size: 10px;
      font-weight: 700;
      color: #CBD5E1;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  </style>
</head>
<body>
  <div class="offer-container">

    <!-- ═══ PREMIUM HERO BANNER ═══ -->
    <div class="hero-banner">
      <div class="hero-pattern"></div>
      <div class="hero-glow"></div>

      <div class="hero-top-row">
        <div class="hero-doc-type">
          <span class="hero-doc-type-line"></span>
          <span>Official Letter of Appointment</span>
          <span class="hero-doc-type-line"></span>
        </div>
        <div class="hero-ref-pill">◈ ${refNo}</div>
      </div>

      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 8px;">
        <div style="background: rgba(15, 23, 42, 0.45); padding: 4px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.25); box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 20px ${accentColor}40; display: inline-flex; align-items: center; justify-content: center;">
          <img src="${logoSrc}" alt="IZIES Logo" style="width: 46px; height: 46px; border-radius: 10px; object-fit: cover;" />
        </div>
        <div class="hero-company" style="margin: 0; line-height: 1;">${company}</div>
      </div>
      <div class="hero-tagline">${headerTagline}</div>

      <div class="hero-bottom-row">
        <div class="hero-corp-info">
          CIN: ${cin}<br>
          Registered Office: ${office}<br>
          R&D Campus: ${rdCampus}
        </div>
        <div class="hero-date-block">
          <div class="hero-date-label">Date of Issue</div>
          <div class="hero-date-value">${dateStr}</div>
          <div class="hero-confidential">
            <span>●</span>
            <span>${confidentialityBadge}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══ DOCUMENT BODY ═══ -->
    <div class="doc-body">

      ${watermarkType === "confidential" ? `
        <div class="watermark-diagonal">${confidentialityBadge}</div>
      ` : watermarkType === "official-seal" ? `
        <div class="watermark-seal">
          <div>
            <div style="font-size: 12px; letter-spacing: 2px;">★ ${company.toUpperCase()} ★</div>
            <div style="font-size: 16px; font-weight: 900; margin: 8px 0; letter-spacing: 3px;">OFFICIAL APPOINTMENT</div>
            <div style="font-size: 9px; letter-spacing: 1px;">AUTHENTICATED & VERIFIED</div>
          </div>
        </div>
      ` : watermarkType === "subtle-grid" ? `
        <div class="watermark-grid"></div>
      ` : ""}

      <!-- Candidate Addressee Card -->
      <div class="candidate-card">
        <span class="candidate-label">Formal Offer Presented To</span>
        <div class="candidate-name">${params.candidateName}</div>
        <div class="candidate-meta-row">
          <span class="candidate-meta-item">✉ <strong>${params.candidateEmail}</strong></span>
          ${params.candidatePhone ? `<span class="candidate-meta-item">☎ ${params.candidatePhone}</span>` : ""}
          ${params.collegeName ? `<span class="candidate-meta-item">🎓 ${params.collegeName} ${params.degree ? `(${params.degree})` : ""}</span>` : ""}
        </div>
      </div>

      <!-- Document Subject Bar -->
      <div class="doc-subject">
        <span>Letter of Appointment — ${params.jobTitle}</span>
        <span style="font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px;">Class: ${empType}</span>
      </div>

      <!-- Preamble / Narrative -->
      <p>Dear <strong>${params.candidateName}</strong>,</p>
      <p>
        ${introParagraph
          .replace(/\${candidateName}/g, params.candidateName)
          .replace(/\${jobTitle}/g, params.jobTitle)
          .replace(/\${department}/g, department)
          .replace(/\${company}/g, company)}
      </p>

      <!-- Action Callout -->
      <div class="action-callout">
        <h4>✍ Mandatory Action: Review, Sign & Submit This Offer Letter</h4>
        <ol>
          <li><strong>Review All Terms:</strong> Please carefully review the terms of appointment, governance policies, and the complete compensation breakup detailed in <strong>Annexure A</strong>.</li>
          <li><strong>Sign & Return:</strong> To confirm your acceptance, please <strong>sign the duplicate copy digitally via your Candidate Dashboard</strong> or print, execute with physical signature, and return to us within <strong>seven (7) business days</strong> of receipt.</li>
          <li><strong>Onboarding:</strong> Following receipt of your signed acceptance, our People & Talent Operations team will initiate your provisioning, mentor allocation, and orientation schedule.</li>
        </ol>
      </div>

      <!-- SECTION 1: Key Appointment Terms -->
      <div class="section-heading">
        <span>1. Summary of Appointment Terms</span>
        <span class="section-pill">Binding Provisions</span>
      </div>

      <table class="terms-table">
        <tbody>
          <tr>
            <th>Position & Designation</th>
            <td>${params.jobTitle}</td>
          </tr>
          <tr>
            <th>Department / Business Unit</th>
            <td>${department}</td>
          </tr>
          <tr>
            <th>Employment Classification</th>
            <td>${empType}</td>
          </tr>
          <tr>
            <th>Gross Compensation / Stipend</th>
            <td class="highlight-salary-cell">
              <span class="highlight-salary-pill">${salary}</span>
            </td>
          </tr>
          <tr>
            <th>Scheduled Date of Joining</th>
            <td><strong>${joiningDate}</strong></td>
          </tr>
          <tr>
            <th>Workplace Location / Mode</th>
            <td>${location}</td>
          </tr>
          <tr>
            <th>Working Hours & Schedule</th>
            <td>${workingHours}</td>
          </tr>
          <tr>
            <th>Probation & Review Period</th>
            <td>${probation}</td>
          </tr>
          <tr>
            <th>Notice Period</th>
            <td>${notice}</td>
          </tr>
          <tr>
            <th>Reporting Authority</th>
            <td>${signatory} (${signatoryTitle})</td>
          </tr>
        </tbody>
      </table>

      ${params.offerTerms ? `
      <div style="background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%); border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; border-radius: 0 12px 12px 0; padding: 16px 20px; margin-bottom: 24px; font-size: 12px; color: #92400E; line-height: 1.7;">
        <strong style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; color: #B45309;">
          Special Terms, Learning Roadmap & Leadership Perks
        </strong>
        ${params.offerTerms}
      </div>
      ` : ""}

      <div class="page-break"></div>

      <!-- SECTION 2: Rules & Governance -->
      <div class="section-heading">
        <span>2. Terms, Conditions & Corporate Governance</span>
        <span class="section-pill">${rules.length} Policies</span>
      </div>

      ${rules.map((rule: any) => `
        <div class="rule-box">
          <div class="rule-title">
            <span class="rule-clause-num" style="color: ${accentColor};">Clause ${rule.clause}:</span>
            ${rule.title}
          </div>
          <div class="rule-text">
            ${rule.text
              .replace(/\${company}/g, company)
              .replace(/\${probation}/g, probation)
              .replace(/\${workingHours}/g, workingHours)
              .replace(/\${notice}/g, notice)}
          </div>
        </div>
      `).join('')}

      <div class="page-break"></div>

      <!-- ANNEXURE A -->
      <div class="annexure-header">
        <span>Annexure A — Compensation, Entitlements & Certification</span>
        <span style="font-size: 9.5px; font-weight: 600; opacity: 0.7;">Schedule I</span>
      </div>

      <table class="terms-table">
        <thead>
          <tr>
            <th style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: #FFFFFF; font-weight: 700; border-right: none; font-size: 11.5px;">Entitlement / Component</th>
            <th style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: #FFFFFF; text-align: right; font-weight: 700; font-size: 11.5px;">Structure & Provisions</th>
          </tr>
        </thead>
        <tbody>
          ${annexureAItems.map((item: any) => `
            <tr>
              <td><strong>${item.title}</strong></td>
              <td style="text-align: right; color: #0F172A;">${item.desc.replace(/\${salary}/g, salary).replace(/\${empType}/g, empType)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- ANNEXURE B -->
      <div class="annexure-header">
        <span>Annexure B — Leadership Endorsement & Bilateral Acceptance</span>
        <span style="font-size: 9.5px; font-weight: 600; opacity: 0.7;">Schedule II</span>
      </div>

      <p style="font-size: 12.5px; color: #64748B; margin-bottom: 10px;">
        Please confirm your acceptance of this Appointment Letter and all incorporated schedules by signing and dating this document below within seven (7) business days.
      </p>

      <div class="acceptance-declaration">
        &ldquo;${acceptanceDeclaration
          .replace(/\${candidateName}/g, params.candidateName)
          .replace(/\${company}/g, company)
          .replace(/\${joiningDate}/g, joiningDate)}&rdquo;
      </div>

      <!-- ═══ EXECUTIVE LEADERSHIP COUNCIL ═══ -->
      <div class="council-section">
        <div class="council-banner">
          <div class="council-banner-title">
            <span class="council-banner-icon">🛡</span>
            <span>Founding Leadership & Directorate</span>
          </div>
          <span class="council-count-badge">${coreMembers.length} Verified Officers</span>
        </div>

        <div class="council-grid">
          ${coreMembers.map((m: any) => {
            const initials = m.name ? m.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "EX";
            return `
              <div class="council-card">
                <div class="council-avatar">${initials}</div>
                <div class="council-details">
                  <div class="council-name">
                    <span>${m.name}</span>
                    <span class="council-verified">✓</span>
                  </div>
                  <div class="council-role">${m.role}</div>
                  <a href="mailto:${m.email}" class="council-email-link">
                    ✉ ${m.email}
                  </a>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- ═══ DUAL SIGNATURES ═══ -->
      <div class="signatures-section">
        <div class="signatures-grid">

          <!-- Company Signatory -->
          <div class="sig-card">
            <div class="sig-card-header" style="background: linear-gradient(135deg, ${accentColor} 0%, ${accentDark} 100%); color: #FFFFFF;">
              <span>🏛</span>
              <span>${signatoryHeading}</span>
            </div>
            <div class="sig-card-body">
              <div class="sig-seal-badge" style="border-color: ${accentColor}; color: ${accentColor};">◈ Officially Issued & Sealed</div>
              <div class="sig-cursive" style="color: #0F172A;">
                ${signatory}
              </div>
              <div class="sig-divider" style="background: linear-gradient(90deg, ${accentColor} 0%, transparent 100%);"></div>
              <div class="sig-authority">Authorized Signatory: ${signatory}</div>
              <div class="sig-meta">
                Designation: ${signatoryTitle}<br>
                Corporate Seal: Verified Authentication • ${company}
              </div>
            </div>
          </div>

          <!-- Candidate Acceptance -->
          <div class="sig-card">
            <div class="sig-card-header" style="background: ${isAccepted ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)'}; color: ${isAccepted ? '#FFFFFF' : '#475569'};">
              <span>✍</span>
              <span>Candidate Acceptance</span>
            </div>
            <div class="sig-card-body">
              ${isAccepted ? `
                <div class="sig-seal-badge" style="border-color: #2563EB; color: #2563EB;">✓ Digitally Signed & Executed</div>
                <div class="sig-cursive" style="color: #1D4ED8;">
                  ${params.signatureName || params.candidateName}
                </div>
              ` : `
                <div class="sig-seal-badge" style="border-color: #F59E0B; color: #D97706;">⏳ Awaiting Candidate Signature</div>
                <div class="sig-cursive" style="color: #CBD5E1; font-size: 14px; font-style: italic; font-family: inherit;">
                  (Sign digitally or execute physically)
                </div>
              `}
              <div class="sig-divider" style="background: ${isAccepted ? 'linear-gradient(90deg, #2563EB 0%, transparent 100%)' : '#E8ECF4'};"></div>
              <div class="sig-authority">${params.candidateName} (Appointee)</div>
              <div class="sig-meta">
                ${isAccepted ? `
                  Digitally Executed on: <strong>${acceptedDateFormatted || "Accepted"}</strong><br>
                  Security Hash: <span style="font-family: 'JetBrains Mono', monospace; font-size: 9.5px;">${refNo}-VERIFIED</span><br>
                  Verification: Authenticated via Candidate Portal
                ` : `
                  Signature of Appointee Acceptance<br>
                  Date: ________________________<br>
                  Place: ________________________
                `}
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ═══ PREMIUM FOOTER ═══ -->
      <div class="doc-footer">
        <div class="footer-text">
          ${footerNotice.replace(/\n/g, "<br>")}<br>
          Document Security Reference: <strong>${refNo}</strong> • Formally Executed on: ${dateStr}
        </div>
        <div class="footer-brand">
          <span class="footer-brand-dot"></span>
          <span class="footer-brand-text">${company}</span>
          <span class="footer-brand-dot"></span>
        </div>
      </div>

    </div>
  </div>
</body>
</html>`;
}

export function renderOfferLetterText(params: OfferLetterParams): string {
  const master: MasterOfferSettings = params.masterSettings || DEFAULT_OFFER_SETTINGS;
  const company = params.companyName || master.companyName;
  const refNo = generateOfferRef(params.applicationId);
  const dateStr =
    params.issueDate ||
    new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const isUnpaid = isUnpaidCompensation(params.offerSalary);
  const salary = params.offerSalary
    ? params.offerSalary
    : master.defaultSalary;
  const joiningDate = params.offerJoiningDate || master.defaultJoiningDate;
  const location = params.offerLocation || master.defaultLocation;
  const probation = params.probationPeriod || master.defaultProbation;
  const notice = params.noticePeriod || master.defaultNoticePeriod;
  const signatory = params.signatoryName || master.defaultSignatory;
  const signatoryHeading = master.signatoryHeading || `For and on behalf of ${company}`;

  const coreMembers = (master.coreMembers && master.coreMembers.length > 0)
    ? master.coreMembers
    : DEFAULT_OFFER_SETTINGS.coreMembers;

  const rules = (master.rules && master.rules.length > 0) ? master.rules : DEFAULT_OFFER_SETTINGS.rules;

  return `
================================================================================
           ${master.headerTagline || "LETTER OF APPOINTMENT & FORMAL OFFER OF EMPLOYMENT"}
                   ${company.toUpperCase()}
               ${master.confidentialityBadge || "STRICTLY PRIVATE & CONFIDENTIAL"}
================================================================================

Reference: ${refNo}
Date of Issue: ${dateStr}

TO:
Candidate Name : ${params.candidateName}
Email Address  : ${params.candidateEmail}
${params.collegeName ? `Institution    : ${params.collegeName}` : ""}

SUBJECT: APPOINTMENT LETTER FOR THE ROLE OF ${params.jobTitle.toUpperCase()}

Dear ${params.candidateName},

We are pleased to formally offer you appointment as ${params.jobTitle} at ${company}.

MANDATORY ACTION: PLEASE REVIEW, SIGN & RETURN THIS LETTER WITHIN 7 DAYS.

SUMMARY OF KEY TERMS:
--------------------------------------------------------------------------------
1. Designation       : ${params.jobTitle}
2. Department        : ${params.departmentName || "Engineering"}
3. Gross Compensation: ${salary} ${isUnpaid ? "(Unpaid Apprenticeship / Experience)" : ""}
4. Date of Joining   : ${joiningDate}
5. Work Location     : ${location}
6. Probation Period  : ${probation}
7. Notice Period     : ${notice}
${params.offerTerms ? `8. Special Terms   : ${params.offerTerms}\n` : ""}
SUMMARY OF RULES & GOVERNANCE POLICIES:
--------------------------------------------------------------------------------
${rules.map((r: any) => `- Clause ${r.clause} (${r.title}): ${r.text.slice(0, 100)}...`).join("\n")}

ANNEXURE B: FORMAL ACCEPTANCE ("SIGN & RETURN"):
--------------------------------------------------------------------------------
"I, ${params.candidateName}, confirm that I have read, understood, and accept all
terms, conditions, policies, and compensation details. I confirm my commitment
to join on ${joiningDate}."

Candidate Signature: _______________________ Date: ______________

Sincerely,
${signatoryHeading}
Authorized Signatory: ${signatory}

Core Executive Leadership:
${coreMembers.map((m: any) => `• ${m.name} (${m.role}) — Email: ${m.email}`).join("\n")}
================================================================================
`;
}
