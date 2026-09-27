"use client";

import { useState } from "react";
import { BUSINESS_EMAIL } from "@/lib/business";
import { Mail, CheckCircle2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionExperience } from "./SectionExperience";

const SOFT_EASE = [0.16, 1, 0.3, 1] as const;

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    service: "AI Solution",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const revealMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.25 },
        transition: { duration: 0.45, ease: SOFT_EASE },
      };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          companyName: "",
          service: "AI Solution",
          description: "",
        });
      } else {
        setFormError(data.error || "Submission failed. Please try again.");
      }
    } catch (err) {
      setFormError("An error occurred while submitting. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="iz-downstream-section iz-depth-9 relative z-10 pt-24 pb-8 px-6 overflow-hidden">
      <SectionExperience variant="contact" />
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <p className="text-center text-sm text-slate-300">
          Remote digital engineering · India &amp; international · 24×7 service availability
          <br />
          <a href={`mailto:${BUSINESS_EMAIL}`} className="text-indigo-300 hover:text-white">{BUSINESS_EMAIL}</a>
        </p>
        <motion.div className="text-center space-y-4" {...revealMotion}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Let’s Connect</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Have an Idea? Let’s Build It Together.
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Tell us what you want to build, improve or automate. Our team will help you identify the right technology and development approach.
          </p>
        </motion.div>

        {/* Inquiry Form Card */}
        <motion.div
          className="iz-feature-card glass-card p-6 sm:p-12 rounded-3xl border border-white/[0.08] shadow-2xl"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.5, delay: 0.08, ease: SOFT_EASE }}
        >
          {submitted ? (
            <motion.div
              className="py-12 text-center space-y-4"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: SOFT_EASE }}
            >
              <motion.div
                className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto"
                initial={shouldReduceMotion ? false : { scale: 0.9 }}
                animate={shouldReduceMotion ? undefined : { scale: 1 }}
                transition={{ duration: 0.35, ease: SOFT_EASE }}
              >
                <CheckCircle2 className="w-8 h-8" />
              </motion.div>
              <h3 className="text-2xl font-bold text-white">Thank You for Connecting!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed font-normal">
                Your project requirements have been received. Our team will review the details and follow up.
              </p>
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="rounded-xl border-white/10"
                >
                  Submit Another Inquiry
                </Button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-6">
              {formError && (
                <div role="alert" className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label htmlFor="contact-full-name" className="block text-xs font-semibold text-slate-300">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    id="contact-full-name"
                    required
                    type="text"
                    placeholder="Your name, so we know who to speak with"
                    autoComplete="name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="h-12 rounded-xl bg-[#060810] border-white/10 text-white focus:border-indigo-500"
                  />
                </div>

                {/* Work Email */}
                <div className="space-y-2">
                  <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-300">
                    Work Email <span className="text-rose-400">*</span>
                  </label>
                  <Input
                    id="contact-email"
                    required
                    type="email"
                    placeholder="name@company.com"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="h-12 rounded-xl bg-[#060810] border-white/10 text-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Phone / WhatsApp */}
                <div className="space-y-2">
                  <label htmlFor="contact-phone" className="block text-xs font-semibold text-slate-300">
                    Phone / WhatsApp Number
                  </label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    placeholder="+91 98765 43210 for a quick discussion"
                    autoComplete="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="h-12 rounded-xl bg-[#060810] border-white/10 text-white focus:border-indigo-500"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-2">
                  <label htmlFor="contact-company" className="block text-xs font-semibold text-slate-300">
                    Company Name / Organization
                  </label>
                  <Input
                    id="contact-company"
                    type="text"
                    placeholder="Your company, startup, or personal brand"
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="h-12 rounded-xl bg-[#060810] border-white/10 text-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Service Required Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="contact-service" className="block text-xs font-semibold text-slate-300">
                    Service Required <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="contact-service"
                    required
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl bg-[#060810] border border-white/10 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="AI Solution">AI Solution</option>
                    <option value="Website/Web Application">Website / Web Application</option>
                    <option value="SaaS Platform">SaaS Platform</option>
                    <option value="Mobile Application">Mobile Application</option>
                    <option value="Automation">Automation & Workflow</option>
                    <option value="Backend/API">Backend & APIs</option>
                    <option value="Cloud/DevOps">Cloud & DevOps</option>
                    <option value="Web3/Blockchain">Web3 & Blockchain</option>
                    <option value="Media/Streaming">Media & Streaming</option>
                    <option value="Other">Other Custom Solution</option>
                  </select>
                </div>
              </div>

              {/* Project Description */}
              <div className="space-y-2">
                <label htmlFor="contact-description" className="block text-xs font-semibold text-slate-300">
                  Project Description & Goals
                </label>
                <textarea
                  id="contact-description"
                  rows={4}
                  placeholder="Example: We need a customer portal with payments, admin dashboard, AI support assistant, and launch target within 8 weeks."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 rounded-xl bg-[#060810] border border-white/10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={shouldReduceMotion || submitting ? undefined : { y: -2 }}
                whileTap={shouldReduceMotion || submitting ? undefined : { scale: 0.98 }}
                className="w-full min-h-14 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition-all cursor-pointer active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Sending Inquiry..." : "Discuss Your Project →"}
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
