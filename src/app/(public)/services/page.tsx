import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { capabilityContent } from "@/lib/capabilities";
import { businessMetadata, serviceCatalog, jsonLd } from "@/lib/seo";
import { FadeInScroll } from "@/components/public/landing/FadeInScroll";

export const metadata = businessMetadata(
  "Digital Engineering Services",
  "Explore IZIES services in software, AI, web, mobile, automation, APIs, cloud, data, testing and maintenance. Find the capabilities your project needs.",
  "/services",
);

export default function ServicesPage() {
  return (
    <div className="relative max-w-7xl mx-auto px-6 py-20 space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceCatalog("/services")) }} />
      <header className="max-w-3xl space-y-6">
        <Link href="/" className="text-sm text-indigo-300 hover:text-white">IZIES home</Link>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">Digital Engineering Services</h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          IZIES brings software development, AI, automation and cloud engineering together
          to build digital products and business systems. Explore our capabilities below
          to find the work that fits your project, whether you are starting a new product
          or improving an existing application.
        </p>
        <Link href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold">
          Discuss your project <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </header>

      <nav aria-label="Service directory" className="flex flex-wrap gap-3">
        {Object.entries(capabilityContent).map(([id, service]) => (
          <Link key={id} href={`/services/${service.slug}`} className="px-4 py-2 rounded-full border border-white/10 text-sm text-slate-300 hover:text-white hover:border-indigo-400">
            {service.title}
          </Link>
        ))}
      </nav>

      <FadeInScroll>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(capabilityContent).map(([id, service]) => (
            <Link key={id} href={`/services/${service.slug}`} className="glass-card p-8 rounded-3xl border border-white/10 space-y-5 scroll-mt-28 hover:border-indigo-500/40 transition-colors">
              <h2 className="text-2xl font-bold text-white">{service.title}</h2>
              <p className="text-slate-300 leading-relaxed">{service.description}</p>
              <h3 className="text-sm font-semibold text-indigo-300">What we can help you build and improve</h3>
              <ul className="space-y-2 text-sm text-slate-300 list-disc pl-5">
                {service.items.map(item => <li key={item}>{item}</li>)}
              </ul>
              <span className="inline-flex items-center gap-2 text-sm text-indigo-300">Explore details <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
            </Link>
          ))}
        </div>
      </FadeInScroll>

      <FadeInScroll delay={0.1}>
        <section className="max-w-3xl space-y-5">
          <h2 className="text-3xl font-bold text-white">How the work fits together</h2>
          <p className="text-slate-300 leading-relaxed">
            A product can need several capabilities at once: a mobile app may rely on an API,
            a cloud environment and a reporting dashboard. We start with the problem and
            requirements, then plan the design, development, testing and release work around
            the agreed scope. The technology choices follow those needs.
          </p>
          <div className="flex flex-wrap gap-5 text-indigo-300">
            <Link href="/#approach" className="hover:text-white">Explore our delivery process</Link>
            <Link href="/#build" className="hover:text-white">See the types of products we build</Link>
          </div>
        </section>
      </FadeInScroll>

      <FadeInScroll delay={0.2}>
        <section className="max-w-3xl space-y-6">
          <h2 className="text-3xl font-bold text-white">Planning your project</h2>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Can you work on an existing application?</h3>
            <p className="text-slate-300 leading-relaxed">Our capabilities include integrations, maintenance, testing and performance improvements. Share your existing application and the changes you need so the scope can be assessed.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Do I need to choose the technology first?</h3>
            <p className="text-slate-300 leading-relaxed">Start with your users, workflows and requirements. Existing systems, integration needs and maintenance requirements help determine a suitable technical approach.</p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-white">What should I include in an enquiry?</h3>
            <p className="text-slate-300 leading-relaxed">Describe your business, the problem to solve, the people who will use the product and any existing tools it must connect to. Include your priorities and target timeline if you have them.</p>
          </div>
          <Link href="/#contact" className="inline-flex items-center gap-2 text-indigo-300 hover:text-white">Send a project enquiry <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
        </section>
      </FadeInScroll>
    </div>
  );
}
