import { z } from "zod";

export const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  departmentId: z.string().min(1, "Department is required"),
  location: z.string().min(2, "Location is required"),
  workplaceType: z.enum(["REMOTE", "HYBRID", "ON_SITE"]),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]),
  experienceLevel: z.enum(["ENTRY_LEVEL", "MID_LEVEL", "SENIOR", "LEAD", "EXECUTIVE"]),
  salaryRange: z.string().optional(),
  imageUrl: z.string().optional().nullable(),
  skills: z.array(z.string()).default([]),
  aboutRole: z.string().min(20, "Please provide a descriptive role overview"),
  responsibilities: z.array(z.string().min(1)).min(1, "At least one responsibility is required"),
  requirements: z.array(z.string().min(1)).min(1, "At least one requirement is required"),
  niceToHave: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  hiringProcess: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"]).default("PUBLISHED"),
  deadline: z.string().optional().nullable(),
});

export type JobInput = z.infer<typeof jobSchema>;
