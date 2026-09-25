
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  name: 'name',
  role: 'role',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TeamMemberScalarFieldEnum = {
  id: 'id',
  name: 'name',
  role: 'role',
  department: 'department',
  avatarUrl: 'avatarUrl',
  bio: 'bio',
  linkedInUrl: 'linkedInUrl',
  twitterUrl: 'twitterUrl',
  githubUrl: 'githubUrl',
  order: 'order',
  isPublic: 'isPublic',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.HeroTechDomainScalarFieldEnum = {
  id: 'id',
  title: 'title',
  shortTitle: 'shortTitle',
  slug: 'slug',
  icon: 'icon',
  color: 'color',
  position: 'position',
  description: 'description',
  technologies: 'technologies',
  order: 'order',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CandidateScalarFieldEnum = {
  id: 'id',
  email: 'email',
  passwordHash: 'passwordHash',
  fullName: 'fullName',
  headline: 'headline',
  avatarUrl: 'avatarUrl',
  phone: 'phone',
  location: 'location',
  collegeName: 'collegeName',
  degree: 'degree',
  branch: 'branch',
  graduationYear: 'graduationYear',
  cgpa: 'cgpa',
  currentYear: 'currentYear',
  resumeUrl: 'resumeUrl',
  skills: 'skills',
  projects: 'projects',
  linkedInUrl: 'linkedInUrl',
  githubUrl: 'githubUrl',
  portfolioUrl: 'portfolioUrl',
  twitterUrl: 'twitterUrl',
  bio: 'bio',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SkillScalarFieldEnum = {
  id: 'id',
  name: 'name',
  category: 'category',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DepartmentScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  icon: 'icon',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.JobScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  departmentId: 'departmentId',
  location: 'location',
  workplaceType: 'workplaceType',
  employmentType: 'employmentType',
  experienceLevel: 'experienceLevel',
  salaryRange: 'salaryRange',
  imageUrl: 'imageUrl',
  skills: 'skills',
  aboutRole: 'aboutRole',
  responsibilities: 'responsibilities',
  requirements: 'requirements',
  niceToHave: 'niceToHave',
  benefits: 'benefits',
  hiringProcess: 'hiringProcess',
  status: 'status',
  deadline: 'deadline',
  viewsCount: 'viewsCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ApplicationScalarFieldEnum = {
  id: 'id',
  jobId: 'jobId',
  candidateId: 'candidateId',
  fullName: 'fullName',
  email: 'email',
  phone: 'phone',
  collegeName: 'collegeName',
  degree: 'degree',
  branch: 'branch',
  graduationYear: 'graduationYear',
  cgpa: 'cgpa',
  currentYear: 'currentYear',
  resumeUrl: 'resumeUrl',
  resumeFileName: 'resumeFileName',
  resumeFileSize: 'resumeFileSize',
  linkedInUrl: 'linkedInUrl',
  githubUrl: 'githubUrl',
  portfolioUrl: 'portfolioUrl',
  skills: 'skills',
  projects: 'projects',
  coverLetter: 'coverLetter',
  relevantExperience: 'relevantExperience',
  additionalInfo: 'additionalInfo',
  consentGiven: 'consentGiven',
  status: 'status',
  firstCallNotes: 'firstCallNotes',
  firstCallScheduled: 'firstCallScheduled',
  offerSalary: 'offerSalary',
  offerJoiningDate: 'offerJoiningDate',
  offerLocation: 'offerLocation',
  offerTerms: 'offerTerms',
  offerProbation: 'offerProbation',
  offerWorkingHours: 'offerWorkingHours',
  offerNoticePeriod: 'offerNoticePeriod',
  offerSignatory: 'offerSignatory',
  offerSignatureName: 'offerSignatureName',
  offerRefNo: 'offerRefNo',
  offerPdfUrl: 'offerPdfUrl',
  offerSentAt: 'offerSentAt',
  offerAcceptedAt: 'offerAcceptedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ApplicationStatusHistoryScalarFieldEnum = {
  id: 'id',
  applicationId: 'applicationId',
  previousStatus: 'previousStatus',
  newStatus: 'newStatus',
  changedById: 'changedById',
  reason: 'reason',
  createdAt: 'createdAt'
};

exports.Prisma.ApplicationNoteScalarFieldEnum = {
  id: 'id',
  applicationId: 'applicationId',
  authorId: 'authorId',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.EmailNotificationScalarFieldEnum = {
  id: 'id',
  applicationId: 'applicationId',
  recipient: 'recipient',
  stage: 'stage',
  subject: 'subject',
  bodyText: 'bodyText',
  bodyHtml: 'bodyHtml',
  status: 'status',
  sentAt: 'sentAt'
};

exports.Prisma.EmailTemplateScalarFieldEnum = {
  id: 'id',
  stage: 'stage',
  subject: 'subject',
  headline: 'headline',
  introParagraph: 'introParagraph',
  actionCallout: 'actionCallout',
  mainContent: 'mainContent',
  nextSteps: 'nextSteps',
  ctaText: 'ctaText',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OfferLetterSettingsScalarFieldEnum = {
  id: 'id',
  companyName: 'companyName',
  cin: 'cin',
  registeredOffice: 'registeredOffice',
  rdCampus: 'rdCampus',
  defaultSalary: 'defaultSalary',
  defaultJoiningDate: 'defaultJoiningDate',
  defaultLocation: 'defaultLocation',
  defaultEmploymentType: 'defaultEmploymentType',
  defaultProbation: 'defaultProbation',
  defaultWorkingHours: 'defaultWorkingHours',
  defaultNoticePeriod: 'defaultNoticePeriod',
  defaultSignatory: 'defaultSignatory',
  defaultSignatoryTitle: 'defaultSignatoryTitle',
  defaultSpecialTerms: 'defaultSpecialTerms',
  themeStyle: 'themeStyle',
  themeAccentColor: 'themeAccentColor',
  themeFontFamily: 'themeFontFamily',
  themeWatermark: 'themeWatermark',
  headerTagline: 'headerTagline',
  confidentialityBadge: 'confidentialityBadge',
  introParagraph: 'introParagraph',
  acceptanceDeclaration: 'acceptanceDeclaration',
  signatoryHeading: 'signatoryHeading',
  footerNotice: 'footerNotice',
  coreMembers: 'coreMembers',
  rules: 'rules',
  annexureAItems: 'annexureAItems',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SystemSettingScalarFieldEnum = {
  id: 'id',
  smtpHost: 'smtpHost',
  smtpPort: 'smtpPort',
  smtpUser: 'smtpUser',
  smtpPass: 'smtpPass',
  fromEmail: 'fromEmail',
  updatedAt: 'updatedAt',
  contactEmail: 'contactEmail',
  contactPhone: 'contactPhone',
  officeAddress: 'officeAddress',
  linkedinUrl: 'linkedinUrl',
  twitterUrl: 'twitterUrl',
  githubUrl: 'githubUrl',
  instagramUrl: 'instagramUrl',
  globeUrl: 'globeUrl'
};

exports.Prisma.ContactInquiryScalarFieldEnum = {
  id: 'id',
  fullName: 'fullName',
  email: 'email',
  phone: 'phone',
  companyName: 'companyName',
  service: 'service',
  budget: 'budget',
  description: 'description',
  status: 'status',
  source: 'source',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.Role = exports.$Enums.Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  RECRUITER: 'RECRUITER',
  HIRING_MANAGER: 'HIRING_MANAGER'
};

exports.WorkplaceType = exports.$Enums.WorkplaceType = {
  REMOTE: 'REMOTE',
  HYBRID: 'HYBRID',
  ON_SITE: 'ON_SITE'
};

exports.EmploymentType = exports.$Enums.EmploymentType = {
  FULL_TIME: 'FULL_TIME',
  PART_TIME: 'PART_TIME',
  CONTRACT: 'CONTRACT',
  INTERNSHIP: 'INTERNSHIP'
};

exports.ExperienceLevel = exports.$Enums.ExperienceLevel = {
  ENTRY_LEVEL: 'ENTRY_LEVEL',
  MID_LEVEL: 'MID_LEVEL',
  SENIOR: 'SENIOR',
  LEAD: 'LEAD',
  EXECUTIVE: 'EXECUTIVE'
};

exports.JobStatus = exports.$Enums.JobStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CLOSED: 'CLOSED',
  ARCHIVED: 'ARCHIVED'
};

exports.ApplicationStatus = exports.$Enums.ApplicationStatus = {
  APPLIED: 'APPLIED',
  FIRST_CALL: 'FIRST_CALL',
  SCREENING: 'SCREENING',
  SHORTLISTED: 'SHORTLISTED',
  INTERVIEW: 'INTERVIEW',
  ASSESSMENT: 'ASSESSMENT',
  HIRED: 'HIRED',
  SELECTED: 'SELECTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN'
};

exports.InquiryStatus = exports.$Enums.InquiryStatus = {
  NEW: 'NEW',
  IN_REVIEW: 'IN_REVIEW',
  CONTACTED: 'CONTACTED',
  CONVERTED: 'CONVERTED',
  ARCHIVED: 'ARCHIVED'
};

exports.Prisma.ModelName = {
  User: 'User',
  TeamMember: 'TeamMember',
  HeroTechDomain: 'HeroTechDomain',
  Candidate: 'Candidate',
  Skill: 'Skill',
  Department: 'Department',
  Job: 'Job',
  Application: 'Application',
  ApplicationStatusHistory: 'ApplicationStatusHistory',
  ApplicationNote: 'ApplicationNote',
  EmailNotification: 'EmailNotification',
  EmailTemplate: 'EmailTemplate',
  OfferLetterSettings: 'OfferLetterSettings',
  SystemSetting: 'SystemSetting',
  ContactInquiry: 'ContactInquiry'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
