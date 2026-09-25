"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowRight, AlertCircle, Link as LinkIcon, Lock, Mail, User, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [degree, setDegree] = useState("B.Tech");
  const [branch, setBranch] = useState("Computer Science");
  const [graduationYear, setGraduationYear] = useState("2026");
  const [cgpa, setCgpa] = useState("");
  const [currentYear, setCurrentYear] = useState("3rd Year");
  const [resumeUrl, setResumeUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedInUrl, setLinkedInUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/candidate/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.candidate) {
          router.replace("/candidate/dashboard");
        }
      })
      .catch(() => {});
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/candidate/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          phone,
          collegeName,
          degree,
          branch,
          graduationYear,
          cgpa,
          currentYear,
          resumeUrl,
          githubUrl,
          linkedInUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      // Dispatch event to update navbar instantly
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("candidate-auth-change"));
      }

      // Check for redirect param
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const redirectUrl = params?.get("redirect") || "/candidate/dashboard";

      window.location.href = redirectUrl;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-16 px-4 max-w-2xl mx-auto">
      <div className="p-5 sm:p-10 rounded-3xl border border-white/10 bg-[#0B0F19] shadow-2xl relative space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Create Student / Candidate Profile
          </h1>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Set up your profile once with your college and resume link to apply for IZIES internships in 1-click.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Info */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">1. Account Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Full Name *</label>
                <Input
                  required
                  placeholder="e.g. Rahul Verma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Email Address *</label>
                <Input
                  required
                  type="email"
                  placeholder="rahul@college.edu or gmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-slate-300 mb-1">Password *</label>
                <Input
                  required
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-300 mb-1">Phone Number *</label>
                <Input
                  required
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Academic / College Details */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              2. College & Education Information
            </h3>
            <div>
              <label className="block text-xs text-slate-300 mb-1">College / University Name *</label>
              <Input
                required
                placeholder="e.g. Delhi Technological University (DTU), BITS, VIT..."
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Degree</label>
                <Input placeholder="B.Tech" value={degree} onChange={(e) => setDegree(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Branch</label>
                <Input placeholder="CSE / IT" value={branch} onChange={(e) => setBranch(e.target.value)} />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Grad Year</label>
                <select
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                  className="w-full h-11 px-2 rounded-xl bg-card border border-border text-xs text-foreground"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">CGPA / %</label>
                <Input placeholder="8.6 CGPA" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Resume & Profiles */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              3. Resume & Work Links
            </h3>
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Resume Link (Google Drive / Dropbox / Notion link) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <Input
                  required
                  type="url"
                  placeholder="https://drive.google.com/file/d/... or https://notion.so/..."
                  className="pl-10 text-xs"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs text-slate-400 mb-1">GitHub Profile</label>
                <Input
                  type="url"
                  placeholder="github.com/..."
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">LinkedIn Profile</label>
                <Input
                  type="url"
                  placeholder="linkedin.com/in/..."
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" size="lg" isLoading={loading} className="w-full gap-2 mt-4">
            <span>Create Profile & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <p className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{" "}
            <Link href="/candidate/login" className="text-blue-400 font-semibold hover:underline">
              Log in here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
