export type WorkplaceType = "REMOTE" | "HYBRID" | "ON_SITE";
export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type ExperienceLevel = "ENTRY_LEVEL" | "MID_LEVEL" | "SENIOR" | "LEAD" | "EXECUTIVE";
export type JobStatus = "DRAFT" | "PUBLISHED" | "CLOSED" | "ARCHIVED";
export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "ASSESSMENT"
  | "SELECTED"
  | "REJECTED"
  | "WITHDRAWN";

export interface DepartmentSummary {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  _count?: {
    jobs: number;
  };
}

export interface JobSummary {
  id: string;
  title: string;
  slug: string;
  location: string;
  workplaceType: WorkplaceType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel;
  salaryRange: string | null;
  imageUrl?: string | null;
  skills?: string[];
  status: JobStatus;
  createdAt: string | Date;
  department: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface JobDetail extends JobSummary {
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  benefits: string[];
  hiringProcess: string[];
  deadline: string | Date | null;
}

export interface ApplicationRecord {
  id: string;
  jobId: string;
  fullName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  resumeFileName: string;
  resumeFileSize: number;
  linkedInUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
  coverLetter: string | null;
  relevantExperience: string | null;
  additionalInfo: string | null;
  status: ApplicationStatus;
  createdAt: string | Date;
  job: {
    id: string;
    title: string;
    department: {
      name: string;
    };
  };
  notes?: {
    id: string;
    content: string;
    createdAt: string | Date;
    author: {
      name: string;
    };
  }[];
  statusHistory?: {
    id: string;
    previousStatus: ApplicationStatus;
    newStatus: ApplicationStatus;
    reason: string | null;
    createdAt: string | Date;
    changedBy: {
      name: string;
    };
  }[];
}
