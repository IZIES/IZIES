import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ChevronRight, Mail } from "lucide-react";
import { BUSINESS_EMAIL } from "@/lib/business";
import { capabilityContent } from "@/lib/capabilities";
import { getServiceBySlug, serviceIds } from "@/lib/service-details";
import { businessMetadata, jsonLd, ORGANIZATION_ID, SITE_URL } from "@/lib/seo";

type Props = { params: { slug: string } };

// Only the service catalog's known URLs should resolve to a detail page.
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceIds.map(id => ({ slug: capabilityContent[id].slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();
  return businessMetadata(service.metaTitle, service.metaDescription, `/services/${service.slug}`);
}

export default function ServiceDetailPage({ params }: Props) {
  const service = getServiceBySlug(params.slug);
  if (!service) notFound();

  const url = `${SITE_URL}/services/${service.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: service.title,
        description: service.description,
        url,
        provider: { "@id": ORGANIZATION_ID },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "IZIES", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_URL}/services` },
          { "@type": "ListItem", position: 3, name: service.title, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: service.faqs.map(faq => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer }
        }))
      }
    ],
  };

  return (
    <article className="relative max-w-7xl mx-auto px-6 py-12 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />

      <nav aria-label="Breadcrumb" className="mb-10 text-xs sm:text-sm text-slate-400">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-white">IZIES</Link></li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li><Link href="/services" className="hover:text-white">Services</Link></li>
          <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
          <li aria-current="page" className="text-indigo-300">{service.title}</li>
        </ol>
      </nav>

      <header className="relative max-w-4xl space-y-6 pb-14 sm:pb-20">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" aria-hidden="true" />
        <p className="relative inline-flex px-3.5 py-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/10 text-xs font-semibold text-indigo-300">{service.badge}</p>
        <h1 className="relative text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">{service.title}</h1>
        <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-3xl">{service.description}</p>
        <div className="flex flex-wrap gap-4 pt-2">
          <Link href="/#contact" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:opacity-90">
            Discuss your project <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <a href="#scope" className="inline-flex items-center px-6 py-3 rounded-2xl border border-white/10 text-sm text-slate-300 hover:text-white hover:bg-white/5">Explore the scope</a>
        </div>
        <p className="text-xs text-slate-400">Remote delivery for businesses in India and internationally.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-12 lg:gap-16">
        <div className="min-w-0 space-y-16">
          <section id="overview" className="space-y-5 scroll-mt-28">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Build around the problem you need to solve</h2>
            {service.introduction.map(paragraph => <p key={paragraph} className="text-slate-300 leading-relaxed">{paragraph}</p>)}
          </section>

          <section id="scope" className="space-y-6 scroll-mt-28">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">What the work can include</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.items.map(item => (
                <li key={item} className="glass-card flex items-start gap-3 rounded-2xl p-5 border border-white/10 text-sm text-slate-200 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-1 text-indigo-400" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section id="use-cases" className="space-y-6 scroll-mt-28">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Example use cases</h2>
            <div className="space-y-5">
              {service.useCases.map(item => (
                <div key={item.title} className="border-l-2 border-indigo-500/30 pl-5 space-y-2">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="approach" className="space-y-5 scroll-mt-28">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Technical approach</h2>
            <p className="text-slate-300 leading-relaxed">{service.approach}</p>
          </section>

          <section id="delivery" className="space-y-6 scroll-mt-28">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">From requirements to delivery</h2>
            <ol className="space-y-6">
              {service.process.map((step, index) => (
                <li key={step.title} className="flex gap-4">
                  <span className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-sm font-mono text-indigo-300">{String(index + 1).padStart(2, "0")}</span>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="questions" className="space-y-6 scroll-mt-28">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Common questions</h2>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {service.faqs.map(faq => (
                <div key={faq.question} className="py-6 space-y-3">
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside aria-labelledby="project-planning" className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-5">
            <h2 id="project-planning" className="text-xl font-bold text-white">Plan your project</h2>
            <p className="text-sm text-slate-400 leading-relaxed">These details help define the scope and the next steps:</p>
            <ul className="list-disc pl-4 space-y-3 text-sm text-slate-300 leading-relaxed">
              {service.planning.map(item => <li key={item}>{item}</li>)}
            </ul>
            <a href={`mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(`${service.title} enquiry`)}`} className="inline-flex items-start gap-2 text-sm text-indigo-300 hover:text-white break-all">
              <Mail className="w-4 h-4 shrink-0 mt-0.5" aria-hidden="true" />{BUSINESS_EMAIL}
            </a>
          </div>
          <nav aria-label="On this page" className="rounded-3xl border border-white/10 p-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">On this page</p>
            <ul className="space-y-3 text-sm text-slate-300">
              {[["overview", "Overview"], ["scope", "Scope & deliverables"], ["use-cases", "Example use cases"], ["approach", "Technical approach"], ["delivery", "Delivery process"], ["questions", "Common questions"]].map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className="hover:text-indigo-300">{label}</a></li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>

      <section className="mt-20 pt-12 border-t border-white/10 space-y-6" aria-labelledby="related-services">
        <h2 id="related-services" className="text-2xl sm:text-3xl font-bold text-white">Related services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {service.related.map(id => {
            const related = capabilityContent[id];
            return (
              <Link key={id} href={`/services/${related.slug}`} className="glass-card rounded-2xl border border-white/10 p-6 space-y-3 hover:border-indigo-500/40">
                <h3 className="text-lg font-semibold text-white">{related.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{related.description}</p>
                <span className="inline-flex items-center gap-2 text-sm text-indigo-300">Explore service <ArrowRight className="w-4 h-4" aria-hidden="true" /></span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-16 glass-card p-8 sm:p-10 rounded-3xl border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <h2 className="text-2xl font-bold text-white">Tell us what you need to build or improve</h2>
          <p className="text-slate-300 leading-relaxed">Share your requirements and existing setup so we can discuss a scope that fits your business.</p>
        </div>
        <Link href="/#contact" className="shrink-0 inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500">Start a conversation <ArrowRight className="w-4 h-4" aria-hidden="true" /></Link>
      </section>
    </article>
  );
}
