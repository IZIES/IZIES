import Link from "next/link";
import { BUSINESS_EMAIL } from "@/lib/business";
import { Globe, Linkedin, Github, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export async function Footer() {
  const settings = await prisma.systemSetting.findUnique({
    where: { id: "default" },
  });
  const contactEmail = settings?.contactEmail || BUSINESS_EMAIL;
  return (
    <footer className="border-t border-white/[0.08] bg-[#05070D] pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <Image
                  width={36}
                  height={36}
                  src="/brand/izies-logo-transparent.png"
                  alt="IZIES"
                  className="h-7 w-7 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white">IZIES</span>
                <p className="text-[11px] text-slate-500">Technology & Digital Innovation</p>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              IZIES builds intelligent digital solutions across AI, software, automation, cloud and emerging technologies.
            </p>

            <div className="flex flex-col gap-2.5 pt-2 pb-2">
              {settings?.officeAddress && (
                <div className="flex items-start gap-2.5 text-xs text-slate-400">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-400" />
                  <span className="whitespace-pre-line leading-relaxed">{settings.officeAddress}</span>
                </div>
              )}

              {contactEmail && (
                <div className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Mail className="w-4 h-4 shrink-0 text-blue-400" />
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {contactEmail
                      .split(/[,/\n|]+/)
                      .map((e) => e.trim())
                      .filter(Boolean)
                      .map((email, idx, arr) => (
                        <span key={idx} className="flex items-center gap-2">
                          <a
                            href={`mailto:${email}`}
                            className="hover:text-white transition-colors"
                          >
                            {email}
                          </a>
                          {idx < arr.length - 1 && <span className="text-slate-600">•</span>}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {settings?.contactPhone && (
                <div className="flex items-center gap-2.5 text-xs text-slate-400">
                  <Phone className="w-4 h-4 shrink-0 text-emerald-400" />
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    {settings.contactPhone
                      .split(/[,/\n|]+/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((phone, idx, arr) => (
                        <span key={idx} className="flex items-center gap-2">
                          <a
                            href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                            className="hover:text-white transition-colors"
                          >
                            {phone}
                          </a>
                          {idx < arr.length - 1 && <span className="text-slate-600">•</span>}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Social Channels */}
            <div className="flex items-center gap-2 pt-2">
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.twitterUrl && (
                <a
                  href={settings.twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
                  aria-label="X (formerly Twitter)"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.globeUrl && (
                <a
                  href={settings.globeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-slate-400 hover:text-white transition-colors"
                  aria-label="Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/services" className="hover:text-white transition-colors">
                  Capabilities
                </a>
              </li>
              <li>
                <a href="/#industries" className="hover:text-white transition-colors">
                  Industries
                </a>
              </li>
              <li>
                <a href="/#approach" className="hover:text-white transition-colors">
                  Our Approach
                </a>
              </li>
              <li>
                <a href="/#build" className="hover:text-white transition-colors">
                  What We Build
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="/#about" className="hover:text-white transition-colors">
                  About IZIES
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers & Talent
                </Link>
              </li>
              <li>
                <a href="/#labs" className="hover:text-white transition-colors">
                  IZIES Labs
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Trust Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Legal & Trust
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">
                  Security Standards
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Line */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 IZIES. Everything Digital, Made Possible.</p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Built for scale, intelligence, and modern craft</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
