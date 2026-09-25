"use client";

import { useState } from "react";
import {
  User,
  GraduationCap,
  Link as LinkIcon,
  Code,
  Layers,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface ProjectItem {
  id: string;
  title: string;
  githubUrl?: string;
  liveUrl?: string;
  techStack?: string;
  description?: string;
}

const POPULAR_SKILLS = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "PostgreSQL",
  "TailwindCSS",
  "HTML5 & CSS3",
  "Docker",
  "Git & GitHub",
  "Prisma ORM",
  "REST APIs",
  "GraphQL",
  "Figma",
  "C++",
  "Java",
  "Express.js",
  "AWS",
  "MongoDB",
];

interface CandidateProfileTabProps {
  fullName: string;
  setFullName: (s: string) => void;
  headline: string;
  setHeadline: (s: string) => void;
  phone: string;
  setPhone: (s: string) => void;
  location: string;
  setLocation: (s: string) => void;
  bio: string;
  setBio: (s: string) => void;
  collegeName: string;
  setCollegeName: (s: string) => void;
  degree: string;
  setDegree: (s: string) => void;
  branch: string;
  setBranch: (s: string) => void;
  currentYear: string;
  setCurrentYear: (s: string) => void;
  graduationYear: string;
  setGraduationYear: (s: string) => void;
  cgpa: string;
  setCgpa: (s: string) => void;
  resumeUrl: string;
  setResumeUrl: (s: string) => void;
  skills: string[];
  setSkills: React.Dispatch<React.SetStateAction<string[]>>;
  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  githubUrl: string;
  setGithubUrl: (s: string) => void;
  linkedInUrl: string;
  setLinkedInUrl: (s: string) => void;
  portfolioUrl: string;
  setPortfolioUrl: (s: string) => void;
  twitterUrl: string;
  setTwitterUrl: (s: string) => void;
  isSaving: boolean;
  saveSuccess: boolean;
  onSaveProfile: (e: React.FormEvent) => void;
  onOpenResumePreview: () => void;
}

export function CandidateProfileTab({
  fullName,
  setFullName,
  headline,
  setHeadline,
  phone,
  setPhone,
  location,
  setLocation,
  bio,
  setBio,
  collegeName,
  setCollegeName,
  degree,
  setDegree,
  branch,
  setBranch,
  currentYear,
  setCurrentYear,
  graduationYear,
  setGraduationYear,
  cgpa,
  setCgpa,
  resumeUrl,
  setResumeUrl,
  skills,
  setSkills,
  projects,
  setProjects,
  githubUrl,
  setGithubUrl,
  linkedInUrl,
  setLinkedInUrl,
  portfolioUrl,
  setPortfolioUrl,
  twitterUrl,
  setTwitterUrl,
  isSaving,
  saveSuccess,
  onSaveProfile,
  onOpenResumePreview,
}: CandidateProfileTabProps) {
  const [newSkillInput, setNewSkillInput] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectLive, setProjectLive] = useState("");
  const [projectTech, setProjectTech] = useState("");
  const [projectDesc, setProjectDesc] = useState("");

  const handleAddSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleAddProject = () => {
    if (!projectTitle.trim()) return;
    const newProj: ProjectItem = {
      id: Date.now().toString(),
      title: projectTitle.trim(),
      githubUrl: projectGithub.trim() || undefined,
      liveUrl: projectLive.trim() || undefined,
      techStack: projectTech.trim() || undefined,
      description: projectDesc.trim() || undefined,
    };
    setProjects((prev) => [...prev, newProj]);
    setProjectTitle("");
    setProjectGithub("");
    setProjectLive("");
    setProjectTech("");
    setProjectDesc("");
    setShowAddProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <form onSubmit={onSaveProfile} className="space-y-8">
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Your candidate profile and resume link have been saved successfully!</span>
          </div>
          <span className="text-[11px] text-emerald-400/80">Saved to Cloud</span>
        </div>
      )}

      {/* SECTION 1: Personal & Headline */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#090D18] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              <span>Personal & Headline</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Basic contact info and your professional introduction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name <span className="text-rose-400">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Aryan Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Professional Headline / Tagline
            </label>
            <Input
              placeholder="e.g. Full Stack Developer | 3rd Year B.Tech CSE"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Phone Number <span className="text-rose-400">*</span>
            </label>
            <Input
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Location</label>
            <Input
              placeholder="e.g. New Delhi, India"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Bio / About Me (Elevator Pitch)
          </label>
          <textarea
            rows={3}
            placeholder="Share a short summary about yourself, what you like to build, and what drives you..."
            className="w-full rounded-2xl border border-white/10 bg-[#060810] px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
      </div>

      {/* SECTION 2: College & Academics */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#090D18] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span>College & Academic Credentials</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Your university, degree, graduation timeline, and grades.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              College / University Name <span className="text-rose-400">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Delhi Technological University (DTU), BITS Pilani, IIT Delhi, VIT..."
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Degree</label>
              <Input placeholder="B.Tech" value={degree} onChange={(e) => setDegree(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Branch / Major</label>
              <Input placeholder="CSE / IT / ECE" value={branch} onChange={(e) => setBranch(e.target.value)} />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Current Year</label>
              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#060810] border border-white/10 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="Final Year">Final Year</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Graduation Year</label>
              <select
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-[#060810] border border-white/10 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
                <option value="2029">2029</option>
              </select>
            </div>
          </div>

          <div className="w-full sm:w-1/3">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">CGPA or Percentage</label>
            <Input placeholder="e.g. 9.1 CGPA or 88%" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
          </div>
        </div>
      </div>

      {/* SECTION 3: Resume / Drive Link & Embedded Preview */}
      <div className="p-6 sm:p-8 rounded-3xl border border-blue-500/20 bg-[#090D18] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-cyan-400" />
              <span>Resume & CV Drive Link</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Attach your public Google Drive, Notion, Dropbox, or hosted PDF link.
            </p>
          </div>

          {resumeUrl && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenResumePreview}
              className="gap-1.5 text-xs text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10 shrink-0"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Open Full Screen Preview</span>
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-xs font-medium text-slate-300">
            Resume Link URL <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
              <LinkIcon className="w-4 h-4" />
            </div>
            <Input
              required
              type="url"
              placeholder="https://drive.google.com/file/d/... or https://dropbox.com/..."
              className="pl-10 text-xs font-mono"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            💡 <strong className="text-slate-300">Important for Google Drive:</strong> Right-click file in Drive &rarr; Share &rarr; General Access &rarr; select <strong className="text-slate-200">&quot;Anyone with the link can view&quot;</strong>.
          </p>
        </div>

        {/* Live Resume Preview Card on Profile */}
        {resumeUrl && (
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-blue-400" />
                <span>Live Embedded Resume Preview:</span>
              </span>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Open in Drive ↗</span>
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#05070D] p-2 overflow-hidden shadow-inner">
              <iframe
                src={
                  resumeUrl.includes("drive.google.com")
                    ? resumeUrl.replace(/\/view(\?.*)?$/, "/preview").replace(/\/edit(\?.*)?$/, "/preview")
                    : resumeUrl
                }
                title="Resume Preview"
                className="w-full h-80 sm:h-96 rounded-xl border border-white/[0.06] bg-white"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: Skills & Tech Stack */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#090D18] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              <span>Skills & Technologies</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Highlight the frameworks, languages, and tools you know.
            </p>
          </div>
        </div>

        {/* Current Skills Badges */}
        <div className="space-y-3">
          <span className="text-xs text-slate-400 block">Your Added Skills:</span>
          <div className="flex flex-wrap items-center gap-2 min-h-[40px] p-3 rounded-2xl bg-[#060810] border border-white/10">
            {skills.length === 0 ? (
              <span className="text-xs text-slate-500">No skills added yet. Select from suggestions below or type your own!</span>
            ) : (
              skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-medium"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    &times;
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* Add Custom Skill Input */}
        <div className="flex items-center gap-2 max-w-md">
          <Input
            placeholder="Type a skill (e.g. Next.js, Go, Redis)..."
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill(newSkillInput);
              }
            }}
            className="text-xs"
          />
          <Button
            type="button"
            size="sm"
            onClick={() => handleAddSkill(newSkillInput)}
            className="gap-1 text-xs shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </Button>
        </div>

        {/* Quick Suggestions */}
        <div className="space-y-2 pt-2">
          <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
            Quick Suggestions (Click to Add):
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((popSkill) => {
              const already = skills.includes(popSkill);
              return (
                <button
                  type="button"
                  key={popSkill}
                  onClick={() => (already ? handleRemoveSkill(popSkill) : handleAddSkill(popSkill))}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    already
                      ? "bg-blue-600/30 text-blue-300 border border-blue-500/40"
                      : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/10 border border-white/[0.06]"
                  }`}
                >
                  {already ? "✓ " : "+ "}
                  {popSkill}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 5: Featured Projects */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#090D18] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Featured Projects Showcase</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Showcase projects you&apos;ve built to impress recruiters.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={() => setShowAddProject(!showAddProject)}
            className="gap-1.5 text-xs bg-purple-600 hover:bg-purple-500 text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </Button>
        </div>

        {/* Add Project Form Box */}
        {showAddProject && (
          <div className="p-5 rounded-2xl border border-purple-500/30 bg-[#060810] space-y-4 animate-in fade-in">
            <h4 className="font-semibold text-white text-sm">Add New Project</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Project Name *</label>
                <Input
                  placeholder="e.g. DevPulse AI Code Reviewer"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Tech Stack Used</label>
                <Input
                  placeholder="e.g. Next.js, Prisma, Tailwind, PostgreSQL"
                  value={projectTech}
                  onChange={(e) => setProjectTech(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">GitHub Repo URL</label>
                <Input
                  placeholder="https://github.com/..."
                  value={projectGithub}
                  onChange={(e) => setProjectGithub(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-300 mb-1">Live Demo / Deployed Link</label>
                <Input
                  placeholder="https://myproject.vercel.app"
                  value={projectLive}
                  onChange={(e) => setProjectLive(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1">Project Description</label>
              <textarea
                rows={2}
                placeholder="Describe what the project does, key technical challenges, or impact..."
                className="w-full rounded-xl border border-white/10 bg-card/60 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowAddProject(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleAddProject}
                className="text-xs bg-purple-600 hover:bg-purple-500 text-white"
              >
                Save Project
              </Button>
            </div>
          </div>
        )}

        {/* List of Added Projects */}
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-white/10 text-center text-xs text-slate-500">
              No projects added yet. Click &quot;Add Project&quot; to showcase your work.
            </div>
          ) : (
            projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#060810] flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-sm">{proj.title}</h4>
                    {proj.techStack && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-purple-300 border border-white/10">
                        {proj.techStack}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                  )}
                  <div className="flex items-center gap-3 pt-1 text-xs">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-300 hover:text-white flex items-center gap-1"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code</span>
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveProject(proj.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 self-start transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 6: Social & Portfolio Links */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#090D18] space-y-6">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Globe className="w-5 h-5 text-amber-400" />
              <span>Social & Professional Presence</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Links to your GitHub, LinkedIn, Portfolio, or Twitter.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span>GitHub Profile</span>
            </label>
            <Input
              placeholder="https://github.com/username"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-blue-400" />
              <span>LinkedIn Profile</span>
            </label>
            <Input
              placeholder="https://linkedin.com/in/username"
              value={linkedInUrl}
              onChange={(e) => setLinkedInUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Portfolio Website</span>
            </label>
            <Input
              placeholder="https://yourportfolio.dev"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Twitter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Twitter / X Profile</span>
            </label>
            <Input
              placeholder="https://x.com/username"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      <div className="sticky bottom-3 sm:bottom-6 z-20 p-3 sm:p-4 rounded-2xl border border-white/10 bg-[#0B0F1E]/95 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="text-xs text-slate-400 text-center sm:text-left">
          {saveSuccess ? (
            <span className="text-emerald-400 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile details saved! Your 1-click applications will use this latest info.</span>
            </span>
          ) : (
            <span>Make sure your college credentials & resume link are up to date.</span>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isSaving}
          className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-500 font-bold px-8 shadow-xl shadow-blue-500/20 py-3 text-xs sm:text-sm"
        >
          <Save className="w-4 h-4" />
          <span>Save & Update Profile</span>
        </Button>
      </div>
    </form>
  );
}
