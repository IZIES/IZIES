"use client";

import { useEffect, useState } from "react";
import { Mail, Shield, CheckCircle2, AlertCircle, Save, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendTestEmailModal } from "@/components/admin/emails/SendTestEmailModal";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [hasPassword, setHasPassword] = useState(false);

  // Company Profile Settings
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [globeUrl, setGlobeUrl] = useState("");
  
  const [savingCompany, setSavingCompany] = useState(false);
  const [companyResult, setCompanyResult] = useState<{ success: boolean; message: string } | null>(null);

  // Send Test Stage Email Modal
  const [testModalOpen, setTestModalOpen] = useState(false);

  useEffect(() => {
    // Fetch Email Settings
    fetch("/api/settings/email")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setSmtpHost(data.settings.smtpHost || "");
          setSmtpPort(data.settings.smtpPort?.toString() || "587");
          setSmtpUser(data.settings.smtpUser || "");
          setFromEmail(data.settings.fromEmail || "");
          setHasPassword(data.settings.hasPassword);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Fetch Company Settings
    fetch("/api/settings/company")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.settings) {
          setContactEmail(data.settings.contactEmail || "");
          setContactPhone(data.settings.contactPhone || "");
          setOfficeAddress(data.settings.officeAddress || "");
          setLinkedinUrl(data.settings.linkedinUrl || "");
          setTwitterUrl(data.settings.twitterUrl || "");
          setGithubUrl(data.settings.githubUrl || "");
          setInstagramUrl(data.settings.instagramUrl || "");
          setGlobeUrl(data.settings.globeUrl || "");
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/settings/email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass, // only send if changed
          fromEmail,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setHasPassword(data.settings.hasPassword);
        setSmtpPass(""); // clear field after save
        setTestResult({ success: true, message: "Settings saved successfully!" });
      } else {
        setTestResult({ success: false, message: data.error || "Failed to save settings." });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/settings/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass, // include if user typed a new one, else API will use existing
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestResult({ success: true, message: "SMTP connection successful! Credentials are valid." });
      } else {
        setTestResult({ success: false, message: data.error || "Connection failed." });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSaveCompany = async () => {
    setSavingCompany(true);
    setCompanyResult(null);
    try {
      const res = await fetch("/api/settings/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactEmail,
          contactPhone,
          officeAddress,
          linkedinUrl,
          twitterUrl,
          githubUrl,
          instagramUrl,
          globeUrl
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompanyResult({ success: true, message: "Company profile saved successfully!" });
      } else {
        setCompanyResult({ success: false, message: data.error || "Failed to save company settings." });
      }
    } catch (err: any) {
      setCompanyResult({ success: false, message: err.message });
    } finally {
      setSavingCompany(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-400 animate-pulse">Loading settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">System Settings</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Configure SMTP credentials, test stage emails, and manage email delivery settings.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setTestModalOpen(true)}
          className="text-xs h-9 bg-blue-600 hover:bg-blue-500 text-white font-semibold gap-1.5 shadow-md self-start sm:self-auto"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send Test Stage Email</span>
        </Button>
      </div>

      <div className="p-6 rounded-3xl border border-white/[0.08] bg-[#0A0D18] space-y-6">
        <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">SMTP Email Configuration</h2>
            <p className="text-xs text-slate-400">
              Used for sending offer letters, stage updates, and interview invites.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">SMTP Host</label>
            <Input
              placeholder="smtp.gmail.com"
              value={smtpHost}
              onChange={(e) => setSmtpHost(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">SMTP Port</label>
            <Input
              type="number"
              placeholder="587 or 465"
              value={smtpPort}
              onChange={(e) => setSmtpPort(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">SMTP Username / Email</label>
            <Input
              placeholder="careers@izies.io"
              value={smtpUser}
              onChange={(e) => setSmtpUser(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300 flex justify-between">
              <span>SMTP Password / App Password</span>
              {hasPassword && <span className="text-emerald-400 text-[10px]">Password is set</span>}
            </label>
            <Input
              type="password"
              placeholder={hasPassword ? "•••••••••••• (Leave blank to keep current)" : "Enter SMTP Password"}
              value={smtpPass}
              onChange={(e) => setSmtpPass(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-medium text-slate-300">Sender Identity (From Email)</label>
            <Input
              placeholder='"IZIES Careers" <careers@izies.io>'
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
            />
            <p className="text-[10px] text-slate-500 mt-1">This is how the sender will appear in the candidate&apos;s inbox.</p>
          </div>
        </div>

        {testResult && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
            testResult.success 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>
            {testResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}

        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={handleTest} isLoading={testing} className="gap-2 text-xs h-9">
            <Shield className="w-4 h-4" />
            <span>Test SMTP Connection</span>
          </Button>
          <Button onClick={handleSave} isLoading={saving} className="gap-2 text-xs h-9">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </div>

      {/* COMPANY PROFILE & SOCIAL LINKS CARD */}
      <div className="p-6 rounded-3xl border border-white/[0.08] bg-[#0A0D18] space-y-6">
        <div className="flex items-center gap-3 border-b border-white/[0.06] pb-4">
          <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Company Profile & Social Links</h2>
            <p className="text-xs text-slate-400">
              Update company contact details and social links displayed on the public footer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Public Contact Email</label>
            <Input
              placeholder="hello@izies.io"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Public Contact Phone(s)</label>
            <Input
              placeholder="+91 98765 43210, +91 91234 56789"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
            />
            <p className="text-[10px] text-slate-500">Supports multiple numbers (comma or slash separated).</p>
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-medium text-slate-300">Office Location / Address</label>
            <Input
              placeholder="123 Innovation Drive, Tech City"
              value={officeAddress}
              onChange={(e) => setOfficeAddress(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">LinkedIn URL</label>
            <Input
              placeholder="https://linkedin.com/company/izies"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Twitter (X) URL</label>
            <Input
              placeholder="https://x.com/izies"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">GitHub URL</label>
            <Input
              placeholder="https://github.com/izies"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-300">Instagram URL</label>
            <Input
              placeholder="https://instagram.com/izies"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-medium text-slate-300">Company Website URL</label>
            <Input
              placeholder="https://izies.io"
              value={globeUrl}
              onChange={(e) => setGlobeUrl(e.target.value)}
            />
          </div>
        </div>

        {companyResult && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
            companyResult.success 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}>
            {companyResult.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
            <span>{companyResult.message}</span>
          </div>
        )}

        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-end">
          <Button onClick={handleSaveCompany} isLoading={savingCompany} className="gap-2 text-xs h-9">
            <Save className="w-4 h-4" />
            <span>Save Company Profile</span>
          </Button>
        </div>
      </div>

      {/* QUICK STAGE EMAIL TESTER CARD */}
      <div className="p-6 rounded-3xl border border-white/[0.08] bg-[#0A0D18] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Stage Email Testing Sandbox</h2>
              <p className="text-xs text-slate-400">
                Send test stage emails (Application Received, First Call, Interview, Offer, Rejection, etc.) directly to your email address to check inbox delivery before live candidates receive them.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setTestModalOpen(true)}
            className="text-xs h-8 bg-purple-600 hover:bg-purple-500 text-white gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Test Any Stage Email</span>
          </Button>
        </div>
      </div>

      {/* Send Test Email Modal */}
      <SendTestEmailModal
        isOpen={testModalOpen}
        onClose={() => setTestModalOpen(false)}
        defaultStage="APPLIED"
      />
    </div>
  );
}
