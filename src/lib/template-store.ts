import fs from "fs";
import path from "path";
import { prisma, ApplicationStatus } from "./prisma";
import {
  StageTemplateConfig,
  MasterOfferSettings,
  DEFAULT_STAGE_TEMPLATES,
  DEFAULT_OFFER_SETTINGS,
} from "./template-types";

export type { StageTemplateConfig, MasterOfferSettings };
export { DEFAULT_STAGE_TEMPLATES, DEFAULT_OFFER_SETTINGS };

const DATA_DIR = path.join(process.cwd(), "src", "data");
const TEMPLATES_FILE = path.join(DATA_DIR, "email-templates.json");
const OFFER_SETTINGS_FILE = path.join(DATA_DIR, "offer-settings.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// In-memory cache for synchronous renderers
let memoryTemplatesCache: Record<string, StageTemplateConfig> = { ...DEFAULT_STAGE_TEMPLATES };
let memoryOfferSettingsCache: MasterOfferSettings = { ...DEFAULT_OFFER_SETTINGS };

// =========================================================================
// 1. DATABASE-BACKED STAGE EMAIL TEMPLATES
// =========================================================================

export async function getAllStageTemplatesFromDb(): Promise<Record<string, StageTemplateConfig>> {
  const result: Record<string, StageTemplateConfig> = { ...DEFAULT_STAGE_TEMPLATES };

  try {
    const dbTemplates = await prisma.emailTemplate.findMany();
    for (const t of dbTemplates) {
      result[t.stage] = {
        stage: t.stage,
        subject: t.subject,
        headline: t.headline,
        introParagraph: t.introParagraph,
        actionCallout: t.actionCallout || undefined,
        mainContent: t.mainContent,
        nextSteps: Array.isArray(t.nextSteps) ? t.nextSteps : [],
        ctaText: t.ctaText,
      };
    }
    // Update caches
    memoryTemplatesCache = result;
    ensureDataDir();
    fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(result, null, 2), "utf-8");
  } catch (err) {
    console.error("Error reading templates from database, falling back to cache/defaults:", err);
  }

  return result;
}

export async function getStageTemplateFromDb(stage: string): Promise<StageTemplateConfig> {
  const all = await getAllStageTemplatesFromDb();
  return all[stage] || DEFAULT_STAGE_TEMPLATES[stage] || DEFAULT_STAGE_TEMPLATES.APPLIED;
}

export async function saveStageTemplateToDb(
  stage: string,
  config: Partial<StageTemplateConfig>
): Promise<StageTemplateConfig> {
  const validStage = (stage.toUpperCase() in ApplicationStatus
    ? stage.toUpperCase()
    : "APPLIED") as ApplicationStatus;

  const current = getStageTemplate(stage);
  const updated: StageTemplateConfig = {
    ...current,
    ...config,
    stage: validStage,
  };

  try {
    await prisma.emailTemplate.upsert({
      where: { stage: validStage },
      update: {
        subject: updated.subject,
        headline: updated.headline,
        introParagraph: updated.introParagraph,
        actionCallout: updated.actionCallout || null,
        mainContent: updated.mainContent,
        nextSteps: updated.nextSteps || [],
        ctaText: updated.ctaText,
      },
      create: {
        stage: validStage,
        subject: updated.subject,
        headline: updated.headline,
        introParagraph: updated.introParagraph,
        actionCallout: updated.actionCallout || null,
        mainContent: updated.mainContent,
        nextSteps: updated.nextSteps || [],
        ctaText: updated.ctaText,
      },
    });
  } catch (err) {
    console.error(`Failed to upsert template for ${stage} in DB:`, err);
  }

  // Update sync cache & disk file
  if (!memoryTemplatesCache) {
    memoryTemplatesCache = { ...DEFAULT_STAGE_TEMPLATES };
  }
  memoryTemplatesCache[validStage] = updated;
  ensureDataDir();
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(memoryTemplatesCache, null, 2), "utf-8");

  return updated;
}

export async function resetStageTemplateInDb(stage: string): Promise<StageTemplateConfig> {
  const validStage = (stage.toUpperCase() in ApplicationStatus
    ? stage.toUpperCase()
    : "APPLIED") as ApplicationStatus;
  const def = DEFAULT_STAGE_TEMPLATES[validStage] || DEFAULT_STAGE_TEMPLATES.APPLIED;

  try {
    await prisma.emailTemplate.deleteMany({
      where: { stage: validStage },
    });
  } catch (err) {
    console.error(`Failed to delete custom template for ${stage} from DB:`, err);
  }

  if (memoryTemplatesCache) {
    memoryTemplatesCache[validStage] = def;
  }
  ensureDataDir();
  const all = getAllStageTemplates();
  all[validStage] = def;
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(all, null, 2), "utf-8");

  return def;
}

// Synchronous fast-access versions
export function getAllStageTemplates(): Record<string, StageTemplateConfig> {
  if (memoryTemplatesCache) {
    return memoryTemplatesCache;
  }
  ensureDataDir();
  try {
    if (fs.existsSync(TEMPLATES_FILE)) {
      const raw = fs.readFileSync(TEMPLATES_FILE, "utf-8");
      memoryTemplatesCache = { ...DEFAULT_STAGE_TEMPLATES, ...JSON.parse(raw) };
      return memoryTemplatesCache;
    }
  } catch (err) {
    console.error("Error reading templates from file cache:", err);
  }
  memoryTemplatesCache = { ...DEFAULT_STAGE_TEMPLATES };
  return memoryTemplatesCache;
}

export function getStageTemplate(stage: string): StageTemplateConfig {
  const all = getAllStageTemplates();
  return all[stage] || DEFAULT_STAGE_TEMPLATES[stage] || DEFAULT_STAGE_TEMPLATES.APPLIED;
}

export function saveStageTemplate(stage: string, config: Partial<StageTemplateConfig>): StageTemplateConfig {
  // Fire and forget DB save in background while returning instantly
  saveStageTemplateToDb(stage, config).catch((e) => console.error("Async DB save error:", e));
  const all = getAllStageTemplates();
  const current = all[stage] || DEFAULT_STAGE_TEMPLATES[stage];
  const updated = { ...current, ...config, stage };
  all[stage] = updated;
  memoryTemplatesCache = all;
  ensureDataDir();
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(all, null, 2), "utf-8");
  return updated;
}

export function resetStageTemplate(stage: string): StageTemplateConfig {
  resetStageTemplateInDb(stage).catch((e) => console.error("Async DB reset error:", e));
  const all = getAllStageTemplates();
  all[stage] = DEFAULT_STAGE_TEMPLATES[stage];
  memoryTemplatesCache = all;
  ensureDataDir();
  fs.writeFileSync(TEMPLATES_FILE, JSON.stringify(all, null, 2), "utf-8");
  return DEFAULT_STAGE_TEMPLATES[stage];
}

// =========================================================================
// 2. DATABASE-BACKED MASTER OFFER LETTER SETTINGS & RULES
// =========================================================================

export async function getMasterOfferSettingsFromDb(): Promise<MasterOfferSettings> {
  try {
    const dbSettings = await prisma.offerLetterSettings.findUnique({
      where: { id: "default" },
    });

    if (dbSettings) {
      const parsedRules =
        Array.isArray(dbSettings.rules) && dbSettings.rules.length > 0
          ? (dbSettings.rules as any)
          : DEFAULT_OFFER_SETTINGS.rules;

      const parsedAnnexure =
        Array.isArray(dbSettings.annexureAItems) && dbSettings.annexureAItems.length > 0
          ? (dbSettings.annexureAItems as any)
          : DEFAULT_OFFER_SETTINGS.annexureAItems;

      let parsedCoreMembers = DEFAULT_OFFER_SETTINGS.coreMembers;
      if (dbSettings.coreMembers && Array.isArray(dbSettings.coreMembers) && (dbSettings.coreMembers as any[]).length > 0) {
        parsedCoreMembers = dbSettings.coreMembers as any;
      }

      const loaded: MasterOfferSettings = {
        companyName: dbSettings.companyName || DEFAULT_OFFER_SETTINGS.companyName,
        cin: dbSettings.cin || DEFAULT_OFFER_SETTINGS.cin,
        registeredOffice: dbSettings.registeredOffice || DEFAULT_OFFER_SETTINGS.registeredOffice,
        rdCampus: dbSettings.rdCampus || DEFAULT_OFFER_SETTINGS.rdCampus,
        defaultSalary: dbSettings.defaultSalary || DEFAULT_OFFER_SETTINGS.defaultSalary,
        defaultJoiningDate: dbSettings.defaultJoiningDate || DEFAULT_OFFER_SETTINGS.defaultJoiningDate,
        defaultLocation: dbSettings.defaultLocation || DEFAULT_OFFER_SETTINGS.defaultLocation,
        defaultEmploymentType: dbSettings.defaultEmploymentType || DEFAULT_OFFER_SETTINGS.defaultEmploymentType,
        defaultProbation: dbSettings.defaultProbation || DEFAULT_OFFER_SETTINGS.defaultProbation,
        defaultWorkingHours: dbSettings.defaultWorkingHours || DEFAULT_OFFER_SETTINGS.defaultWorkingHours,
        defaultNoticePeriod: dbSettings.defaultNoticePeriod || DEFAULT_OFFER_SETTINGS.defaultNoticePeriod,
        defaultSignatory: dbSettings.defaultSignatory || DEFAULT_OFFER_SETTINGS.defaultSignatory,
        defaultSignatoryTitle: dbSettings.defaultSignatoryTitle || DEFAULT_OFFER_SETTINGS.defaultSignatoryTitle,
        defaultSpecialTerms: dbSettings.defaultSpecialTerms || DEFAULT_OFFER_SETTINGS.defaultSpecialTerms,
        themeStyle: (dbSettings as any).themeStyle || DEFAULT_OFFER_SETTINGS.themeStyle,
        themeAccentColor: (dbSettings as any).themeAccentColor || DEFAULT_OFFER_SETTINGS.themeAccentColor,
        themeFontFamily: (dbSettings as any).themeFontFamily || DEFAULT_OFFER_SETTINGS.themeFontFamily,
        themeWatermark: (dbSettings as any).themeWatermark || DEFAULT_OFFER_SETTINGS.themeWatermark,
        headerTagline: (dbSettings as any).headerTagline || DEFAULT_OFFER_SETTINGS.headerTagline,
        confidentialityBadge: (dbSettings as any).confidentialityBadge || DEFAULT_OFFER_SETTINGS.confidentialityBadge,
        introParagraph: (dbSettings as any).introParagraph || DEFAULT_OFFER_SETTINGS.introParagraph,
        acceptanceDeclaration: (dbSettings as any).acceptanceDeclaration || DEFAULT_OFFER_SETTINGS.acceptanceDeclaration,
        signatoryHeading: (dbSettings as any).signatoryHeading || DEFAULT_OFFER_SETTINGS.signatoryHeading,
        footerNotice: (dbSettings as any).footerNotice || DEFAULT_OFFER_SETTINGS.footerNotice,
        coreMembers: parsedCoreMembers,
        rules: parsedRules,
        annexureAItems: parsedAnnexure,
      };

      memoryOfferSettingsCache = loaded;
      ensureDataDir();
      fs.writeFileSync(OFFER_SETTINGS_FILE, JSON.stringify(loaded, null, 2), "utf-8");
      return loaded;
    }
  } catch (err) {
    console.error("Error reading master offer settings from DB:", err);
  }

  return getMasterOfferSettings();
}

export async function saveMasterOfferSettingsToDb(
  settings: Partial<MasterOfferSettings>
): Promise<MasterOfferSettings> {
  const current = getMasterOfferSettings();
  const updated: MasterOfferSettings = {
    ...current,
    ...settings,
  };

  try {
    await prisma.offerLetterSettings.upsert({
      where: { id: "default" },
      update: {
        companyName: updated.companyName,
        cin: updated.cin,
        registeredOffice: updated.registeredOffice,
        rdCampus: updated.rdCampus,
        defaultSalary: updated.defaultSalary,
        defaultJoiningDate: updated.defaultJoiningDate,
        defaultLocation: updated.defaultLocation,
        defaultEmploymentType: updated.defaultEmploymentType,
        defaultProbation: updated.defaultProbation,
        defaultWorkingHours: updated.defaultWorkingHours,
        defaultNoticePeriod: updated.defaultNoticePeriod,
        defaultSignatory: updated.defaultSignatory,
        defaultSignatoryTitle: updated.defaultSignatoryTitle,
        defaultSpecialTerms: updated.defaultSpecialTerms,
        themeStyle: updated.themeStyle,
        themeAccentColor: updated.themeAccentColor,
        themeFontFamily: updated.themeFontFamily,
        themeWatermark: updated.themeWatermark,
        headerTagline: updated.headerTagline,
        confidentialityBadge: updated.confidentialityBadge,
        introParagraph: updated.introParagraph,
        acceptanceDeclaration: updated.acceptanceDeclaration,
        signatoryHeading: updated.signatoryHeading,
        footerNotice: updated.footerNotice,
        coreMembers: updated.coreMembers as any,
        rules: updated.rules as any,
        annexureAItems: updated.annexureAItems as any,
      } as any,
      create: {
        id: "default",
        companyName: updated.companyName,
        cin: updated.cin,
        registeredOffice: updated.registeredOffice,
        rdCampus: updated.rdCampus,
        defaultSalary: updated.defaultSalary,
        defaultJoiningDate: updated.defaultJoiningDate,
        defaultLocation: updated.defaultLocation,
        defaultEmploymentType: updated.defaultEmploymentType,
        defaultProbation: updated.defaultProbation,
        defaultWorkingHours: updated.defaultWorkingHours,
        defaultNoticePeriod: updated.defaultNoticePeriod,
        defaultSignatory: updated.defaultSignatory,
        defaultSignatoryTitle: updated.defaultSignatoryTitle,
        defaultSpecialTerms: updated.defaultSpecialTerms,
        themeStyle: updated.themeStyle,
        themeAccentColor: updated.themeAccentColor,
        themeFontFamily: updated.themeFontFamily,
        themeWatermark: updated.themeWatermark,
        headerTagline: updated.headerTagline,
        confidentialityBadge: updated.confidentialityBadge,
        introParagraph: updated.introParagraph,
        acceptanceDeclaration: updated.acceptanceDeclaration,
        signatoryHeading: updated.signatoryHeading,
        footerNotice: updated.footerNotice,
        coreMembers: updated.coreMembers as any,
        rules: updated.rules as any,
        annexureAItems: updated.annexureAItems as any,
      } as any,
    });
  } catch (err) {
    console.error("Failed to save master offer settings in DB:", err);
  }

  memoryOfferSettingsCache = updated;
  ensureDataDir();
  fs.writeFileSync(OFFER_SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");

  return updated;
}

export async function resetMasterOfferSettingsInDb(): Promise<MasterOfferSettings> {
  try {
    await prisma.offerLetterSettings.deleteMany({
      where: { id: "default" },
    });
  } catch (err) {
    console.error("Failed to reset master offer settings in DB:", err);
  }

  memoryOfferSettingsCache = DEFAULT_OFFER_SETTINGS;
  ensureDataDir();
  fs.writeFileSync(OFFER_SETTINGS_FILE, JSON.stringify(DEFAULT_OFFER_SETTINGS, null, 2), "utf-8");
  return DEFAULT_OFFER_SETTINGS;
}

// Synchronous fast-access versions
export function getMasterOfferSettings(): MasterOfferSettings {
  if (memoryOfferSettingsCache) {
    return memoryOfferSettingsCache;
  }
  ensureDataDir();
  try {
    if (fs.existsSync(OFFER_SETTINGS_FILE)) {
      const raw = fs.readFileSync(OFFER_SETTINGS_FILE, "utf-8");
      memoryOfferSettingsCache = { ...DEFAULT_OFFER_SETTINGS, ...JSON.parse(raw) };
      return memoryOfferSettingsCache;
    }
  } catch (err) {
    console.error("Error reading master offer settings from file cache:", err);
  }
  memoryOfferSettingsCache = DEFAULT_OFFER_SETTINGS;
  return DEFAULT_OFFER_SETTINGS;
}

export function saveMasterOfferSettings(settings: Partial<MasterOfferSettings>): MasterOfferSettings {
  saveMasterOfferSettingsToDb(settings).catch((e) => console.error("Async DB offer settings save error:", e));
  const current = getMasterOfferSettings();
  const updated = { ...current, ...settings };
  memoryOfferSettingsCache = updated;
  ensureDataDir();
  fs.writeFileSync(OFFER_SETTINGS_FILE, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

export function resetMasterOfferSettings(): MasterOfferSettings {
  resetMasterOfferSettingsInDb().catch((e) => console.error("Async DB offer settings reset error:", e));
  memoryOfferSettingsCache = DEFAULT_OFFER_SETTINGS;
  ensureDataDir();
  fs.writeFileSync(OFFER_SETTINGS_FILE, JSON.stringify(DEFAULT_OFFER_SETTINGS, null, 2), "utf-8");
  return DEFAULT_OFFER_SETTINGS;
}
