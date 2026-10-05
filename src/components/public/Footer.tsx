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
  const websiteUrl =
    settings?.globeUrl && !settings.globeUrl.includes("izies.vercel.app")
      ? settings.globeUrl
      : "https://izies.in";

  return (
    <footer className="relative pt-20 pb-12 text-slate-400 overflow-hidden">
      {/* Huge Glowing Orb Background */}
      <div className="absolute left-0 right-0 top-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[150px] left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/15 blur-[120px] rounded-[100%]" />
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-indigo-500/15 blur-[100px] rounded-[100%]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand Col */}
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative flex items-center justify-center">
                <Image
                  width={48}
                  height={48}
                  src="/brand/izies-logo-transparent.png"
                  alt="IZIES"
                  className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,1)] transition-all duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-logo font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-300">IZIES</span>
                </div>
                <span className="text-[11px] text-cyan-400/80 uppercase tracking-widest font-semibold mt-0.5">Technology & Digital Innovation</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              IZIES builds intelligent digital solutions across AI, software, automation, cloud and emerging technologies. We engineer the future.
            </p>

            {/* Contact Pills */}
            <div className="flex flex-col gap-3 pt-2">
              {settings?.officeAddress && (
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors w-fit max-w-[320px]">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-cyan-400" />
                  <span className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">{settings.officeAddress}</span>
                </div>
              )}

              {contactEmail && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors w-fit">
                  <Mail className="w-4 h-4 shrink-0 text-indigo-400" />
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    {contactEmail
                      .split(/[,/\n|]+/)
                      .map((e) => e.trim())
                      .filter(Boolean)
                      .map((email, idx, arr) => (
                        <span key={idx} className="flex items-center gap-2">
                          <a href={`mailto:${email}`} className="text-slate-300 hover:text-cyan-400 transition-colors">
                            {email}
                          </a>
                          {idx < arr.length - 1 && <span className="text-slate-600">•</span>}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {settings?.contactPhone && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors w-fit">
                  <Phone className="w-4 h-4 shrink-0 text-emerald-400" />
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                    {settings.contactPhone
                      .split(/[,/\n|]+/)
                      .map((p) => p.trim())
                      .filter(Boolean)
                      .map((phone, idx, arr) => (
                        <span key={idx} className="flex items-center gap-2">
                          <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="text-slate-300 hover:text-emerald-400 transition-colors">
                            {phone}
                          </a>
                          {idx < arr.length - 1 && <span className="text-slate-600">•</span>}
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Column 1 */}
          <div>
            <h4 className="text-xs font-bold text-white/90 uppercase tracking-widest mb-6 border-b border-white/10 pb-3 inline-block">
              Explore
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { name: "Capabilities", href: "/services" },
                { name: "Industries", href: "/#industries" },
                { name: "Our Approach", href: "/#approach" },
                { name: "What We Build", href: "/#build" }
              ].map((link) => (
                <li key={link.name} className="group">
                  <a href={link.href} className="inline-flex items-center text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all duration-300">
                    <span className="opacity-0 group-hover:opacity-100 mr-2 text-cyan-400 transition-opacity duration-300">›</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold text-white/90 uppercase tracking-widest mb-6 border-b border-white/10 pb-3 inline-block">
              Company
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { name: "About IZIES", href: "/#about" },
                { name: "Contact", href: "/#contact" },
                { name: "Careers & Talent", href: "/careers" },
                { name: "Products & Labs", href: "/products" },
                { name: "IZIES Labs", href: "/#labs" }
              ].map((link) => (
                <li key={link.name} className="group">
                  <Link href={link.href} className="inline-flex items-center text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-2 transition-all duration-300">
                    <span className="opacity-0 group-hover:opacity-100 mr-2 text-indigo-400 transition-opacity duration-300">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Trust Column */}
          <div>
            <h4 className="text-xs font-bold text-white/90 uppercase tracking-widest mb-6 border-b border-white/10 pb-3 inline-block">
              Legal & Trust
            </h4>
            <ul className="space-y-4 text-sm font-medium">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Security Standards", href: "/security" }
              ].map((link) => (
                <li key={link.name} className="group">
                  <Link href={link.href} className="inline-flex items-center text-slate-400 group-hover:text-white group-hover:translate-x-2 transition-all duration-300">
                    <span className="opacity-0 group-hover:opacity-100 mr-2 text-white transition-opacity duration-300">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social & Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Social Channels */}
          <div className="flex items-center gap-3">
            {[
              { icon: Linkedin, url: settings?.linkedinUrl, color: "hover:text-blue-400 hover:border-blue-400/50 hover:bg-blue-400/10", label: "LinkedIn" },
              { icon: Github, url: settings?.githubUrl, color: "hover:text-white hover:border-white/50 hover:bg-white/10", label: "GitHub" },
              { icon: Instagram, url: settings?.instagramUrl, color: "hover:text-pink-400 hover:border-pink-400/50 hover:bg-pink-400/10", label: "Instagram" },
              { icon: Twitter, url: settings?.twitterUrl, color: "hover:text-sky-400 hover:border-sky-400/50 hover:bg-sky-400/10", label: "Twitter" },
              { icon: Globe, url: websiteUrl, color: "hover:text-cyan-400 hover:border-cyan-400/50 hover:bg-cyan-400/10", label: "Website" }
            ].map((social, idx) => social.url ? (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${social.color}`}
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ) : null)}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-slate-500 font-medium tracking-wide">
            <p>© 2026 IZIES. Everything Digital, Made Possible.</p>
            <div className="hidden sm:block h-3 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400/90">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Online & Secure</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
