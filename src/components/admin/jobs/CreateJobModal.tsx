"use client";

import { useState, useEffect } from "react";
import { Briefcase, Plus, AlertCircle, X, Check, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const IMAGE_PRESETS = [
  {
    label: "Frontend / React / UI",
    url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60",
  },
  {
    label: "Backend & Systems",
    url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
  },
  {
    label: "AI / Machine Learning",
    url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=60",
  },
  {
    label: "Mobile Apps (iOS/Android)",
    url: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
  },
  {
    label: "Product & UI/UX Design",
    url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=60",
  },
  {
    label: "Growth & Marketing",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
  },
];

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  departments: any[];
  onJobCreated: () => void;
  onDepartmentCreated: (newDept: any) => void;
}

export function CreateJobModal({
  isOpen,
  onClose,
  departments,
  onJobCreated,
  onDepartmentCreated,
}: CreateJobModalProps) {
  const [title, setTitle] = useState("");
  const [departmentId, setDepartmentId] = useState(departments[0]?.id || "");
  const [location, setLocation] = useState("Remote");
  const [workplaceType, setWorkplaceType] = useState("REMOTE");
  const [employmentType, setEmploymentType] = useState("FULL_TIME");
  const [experienceLevel, setExperienceLevel] = useState("SENIOR");
  const [salaryRange, setSalaryRange] = useState("$80k - $120k");
  const [imageUrl, setImageUrl] = useState("");
  const [skills, setSkills] = useState<string[]>(["React", "Next.js", "TypeScript"]);
  const [skillInput, setSkillInput] = useState("");
  const [masterSkills, setMasterSkills] = useState<any[]>([]);
  const [showNewSkillInput, setShowNewSkillInput] = useState(false);
  const [newMasterSkillName, setNewMasterSkillName] = useState("");
  const [newMasterSkillCategory, setNewMasterSkillCategory] = useState("Frontend");
  const [isCreatingSkill, setIsCreatingSkill] = useState(false);
  const [skillFeedback, setSkillFeedback] = useState<string | null>(null);

  const [aboutRole, setAboutRole] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits, setBenefits] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Fetch Master Skills on modal open
  useEffect(() => {
    if (isOpen) {
      fetch("/api/admin/skills")
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.skills) {
            setMasterSkills(data.skills);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddSkill(skillInput);
    }
  };

  const handleCreateMasterSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterSkillName.trim()) return;

    setIsCreatingSkill(true);
    setSkillFeedback(null);

    try {
      const res = await fetch("/api/admin/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMasterSkillName.trim(),
          category: newMasterSkillCategory,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create skill");
      }

      const createdSkill = data.skill;
      if (!masterSkills.some((s) => s.id === createdSkill.id)) {
        setMasterSkills((prev) => [...prev, createdSkill].sort((a, b) => a.name.localeCompare(b.name)));
      }
      handleAddSkill(createdSkill.name);
      setSkillFeedback(`✓ "${createdSkill.name}" added to skills!`);
      setNewMasterSkillName("");
      setShowNewSkillInput(false);
    } catch (err: any) {
      setSkillFeedback(`Error: ${err.message}`);
    } finally {
      setIsCreatingSkill(false);
    }
  };

  // Inline New Department Creator State
  const [showNewDeptInput, setShowNewDeptInput] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");
  const [isCreatingDept, setIsCreatingDept] = useState(false);
  const [deptFeedback, setDeptFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptName.trim()) return;

    setIsCreatingDept(true);
    setDeptFeedback(null);

    try {
      const res = await fetch("/api/admin/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDeptName.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create department");
      }

      const createdDept = data.department;
      onDepartmentCreated(createdDept);
      setDepartmentId(createdDept.id);
      setDeptFeedback(`✓ "${createdDept.name}" created & selected!`);
      setNewDeptName("");
      setShowNewDeptInput(false);
    } catch (err: any) {
      setDeptFeedback(`Error: ${err.message}`);
    } finally {
      setIsCreatingDept(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    const activeDeptId = departmentId || departments[0]?.id;
    if (!activeDeptId) {
      setCreateError("Please select or create a department for this job opening.");
      return;
    }

    setIsCreating(true);

    try {
      const res = await fetch("/api/admin/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          departmentId: activeDeptId,
          location,
          workplaceType,
          employmentType,
          experienceLevel,
          salaryRange,
          imageUrl: imageUrl.trim() || undefined,
          skills: skills.length > 0 ? skills : undefined,
          aboutRole,
          responsibilities: responsibilities
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          requirements: requirements
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          benefits: benefits
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean),
          status: "PUBLISHED",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create job");
      }

      onClose();
      // Reset form
      setTitle("");
      setImageUrl("");
      setSkills(["React", "Next.js", "TypeScript"]);
      setSkillInput("");
      setAboutRole("");
      setResponsibilities("");
      setRequirements("");
      setShowNewDeptInput(false);
      onJobCreated();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#090D18] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Create New Job Opening</h2>
              <p className="text-xs text-slate-400">Define role details, cover image banner, department, and requirements.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {createError && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{createError}</span>
          </div>
        )}

        <form onSubmit={handleCreateJob} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Job Title *</label>
            <Input
              required
              placeholder="e.g. Senior Machine Learning Engineer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Department Selector + Dynamic Add Department */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-300">Department *</label>
              {!showNewDeptInput && (
                <button
                  type="button"
                  onClick={() => setShowNewDeptInput(true)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>+ Create New Department</span>
                </button>
              )}
            </div>

            {/* Inline New Department Input */}
            {showNewDeptInput && (
              <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/25 space-y-2 animate-in fade-in duration-200">
                <p className="text-[11px] font-semibold text-blue-400">Add New Department</p>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. AI & ML, Gaming Engine, Growth, HR & Ops..."
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    className="text-xs h-9"
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateDepartment}
                    isLoading={isCreatingDept}
                    className="h-9 px-3 text-xs bg-blue-600 hover:bg-blue-500 shrink-0 gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowNewDeptInput(false);
                      setNewDeptName("");
                    }}
                    className="h-9 px-2 text-xs text-slate-400 hover:text-white shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {deptFeedback && (
              <p className="text-[11px] text-emerald-400">{deptFeedback}</p>
            )}

            <select
              value={departmentId || departments[0]?.id || ""}
              onChange={(e) => setDepartmentId(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-card border border-border text-sm text-foreground focus:outline-none"
              required
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Job Cover Image / Banner URL */}
          <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Job Cover Image / Banner URL (Optional)</span>
              </label>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="text-[11px] text-rose-400 hover:underline"
                >
                  Clear Image
                </button>
              )}
            </div>

            <Input
              type="url"
              placeholder="https://images.unsplash.com/... or https://yourcdn.com/banner.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="text-xs font-mono"
            />

            {/* Image Presets Selector */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Quick Preset Covers (Click to Apply):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {IMAGE_PRESETS.map((preset) => {
                  const isSelected = imageUrl === preset.url;
                  return (
                    <button
                      type="button"
                      key={preset.label}
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                        isSelected
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                          : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/10 border border-white/[0.06]"
                      }`}
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Image Preview */}
            {imageUrl && (
              <div className="mt-2 relative h-28 rounded-xl overflow-hidden border border-white/10 bg-[#060810]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image width={400} height={400}
                  src={imageUrl}
                  alt="Job Cover Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=60";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                  <span className="text-[10px] text-white/90 font-medium bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    Live Banner Preview
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tech Stack & Required Skills Tag Input */}
          <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Tech Stack & Skill Badges</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-400">{skills.length} skills selected</span>
                {!showNewSkillInput && (
                  <button
                    type="button"
                    onClick={() => setShowNewSkillInput(true)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    <span>+ Create New Skill</span>
                  </button>
                )}
              </div>
            </div>

            {/* Inline New Master Skill Creator */}
            {showNewSkillInput && (
              <div className="p-3 rounded-2xl bg-blue-500/5 border border-blue-500/25 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-blue-400">Add New Master Skill to Database</p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewSkillInput(false);
                      setNewMasterSkillName("");
                    }}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    &times;
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="e.g. Next.js, Rust, Solidity, Kafka, PyTorch..."
                    value={newMasterSkillName}
                    onChange={(e) => setNewMasterSkillName(e.target.value)}
                    className="text-xs h-9"
                    autoFocus
                  />
                  <select
                    value={newMasterSkillCategory}
                    onChange={(e) => setNewMasterSkillCategory(e.target.value)}
                    className="h-9 px-2.5 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="AI / ML">AI / ML</option>
                    <option value="Mobile">Mobile</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Core">Core</option>
                  </select>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateMasterSkill}
                    isLoading={isCreatingSkill}
                    className="h-9 px-3 text-xs bg-blue-600 hover:bg-blue-500 shrink-0 gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </Button>
                </div>
              </div>
            )}

            {skillFeedback && (
              <p className="text-[11px] text-emerald-400">{skillFeedback}</p>
            )}

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl bg-[#060810] border border-white/10">
              {skills.length === 0 ? (
                <span className="text-xs text-slate-500 py-0.5 px-1 italic">
                  No skills selected yet. Click any skill below or type to add.
                </span>
              ) : (
                skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 border border-blue-500/30 text-blue-300 shadow-sm animate-in fade-in zoom-in-95 duration-150"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-blue-400/70 hover:text-white p-0.5 rounded transition-colors"
                      title={`Remove ${skill}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Custom Skill Input */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type skill & press Enter (or pick from master list below)..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className="text-xs h-9"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleAddSkill(skillInput)}
                disabled={!skillInput.trim()}
                className="h-9 px-3 text-xs border-white/10 hover:border-blue-500/30 shrink-0"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                <span>Add</span>
              </Button>
            </div>

            {/* Master Skills List From DB */}
            <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Available Master Skills (Click to Select / Deselect):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1 rounded-lg bg-white/[0.01]">
                {(masterSkills.length > 0 ? masterSkills : [
                  { name: "React" }, { name: "Next.js" }, { name: "TypeScript" }, { name: "Node.js" },
                  { name: "Python" }, { name: "PostgreSQL" }, { name: "Tailwind CSS" }, { name: "Figma" },
                  { name: "Docker" }, { name: "FastAPI" }, { name: "GraphQL" }, { name: "Redis" }
                ]).map((s: any) => {
                  const isAlreadyAdded = skills.includes(s.name);
                  return (
                    <button
                      type="button"
                      key={s.id || s.name}
                      onClick={() => {
                        if (isAlreadyAdded) {
                          handleRemoveSkill(s.name);
                        } else {
                          handleAddSkill(s.name);
                        }
                      }}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                        isAlreadyAdded
                          ? "bg-blue-500/30 text-blue-200 border border-blue-500/50 font-semibold"
                          : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/10 border border-white/[0.06]"
                      }`}
                    >
                      {isAlreadyAdded ? `✓ ${s.name}` : `+ ${s.name}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Location *</label>
              <Input
                required
                placeholder="e.g. Remote (India) or Bengaluru, India"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Compensation / Stipend</label>
              <Input
                placeholder="e.g. ₹25,000 - ₹45,000 / month or $80k - $120k"
                value={salaryRange}
                onChange={(e) => setSalaryRange(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Workplace Type</label>
              <select
                value={workplaceType}
                onChange={(e) => setWorkplaceType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
              >
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ON_SITE">On-Site</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Employment</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-card border border-border text-xs text-foreground focus:outline-none"
              >
                <option value="ENTRY_LEVEL">Entry / Student</option>
                <option value="MID_LEVEL">Mid Level</option>
                <option value="SENIOR">Senior</option>
                <option value="LEAD">Lead</option>
                <option value="EXECUTIVE">Executive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">About the Role *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe what the engineer will work on, team mission, and impact..."
              className="w-full rounded-2xl border border-white/10 bg-card/60 px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={aboutRole}
              onChange={(e) => setAboutRole(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Key Responsibilities (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="Design scalable API services&#10;Pair with frontend engineers on architecture&#10;Write comprehensive tests"
              className="w-full rounded-2xl border border-white/10 bg-card/60 px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Requirements & Skills (one per line)
            </label>
            <textarea
              rows={3}
              placeholder="Proficiency with TypeScript & React&#10;Experience with PostgreSQL / Prisma&#10;Strong communication skills"
              className="w-full rounded-2xl border border-white/10 bg-card/60 px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Perks & Benefits (one per line)
            </label>
            <textarea
              rows={2}
              placeholder="Competitive Stipend & PPO track&#10;1-on-1 Engineering mentorship&#10;Flexible remote hours"
              className="w-full rounded-2xl border border-white/10 bg-card/60 px-4 py-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={benefits}
              onChange={(e) => setBenefits(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating} className="gap-2">
              <Plus className="w-4 h-4" />
              <span>Create & Publish Job</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
