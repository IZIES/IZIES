import { z } from "zod";

export const applicationSchema = z.object({
  jobId: z.string().min(1, "Job ID is required"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(7, "Valid phone number is required"),
  resumeUrl: z
    .string()
    .url("Please enter a valid URL (e.g., Google Drive, Dropbox, Notion, or personal link)")
    .min(5, "Resume link is required"),
  linkedInUrl: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  githubUrl: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Invalid Portfolio URL").optional().or(z.literal("")),
  coverLetter: z.string().max(2500, "Cover letter must be under 2500 characters").optional(),
  relevantExperience: z.string().max(1000).optional(),
  additionalInfo: z.string().max(1000).optional(),
  consentGiven: z.boolean().refine((val) => val === true, {
    message: "You must consent to data processing for this application",
  }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
