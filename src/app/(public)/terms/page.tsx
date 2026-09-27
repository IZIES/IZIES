import type { Metadata } from "next";
import { BUSINESS_EMAIL } from "@/lib/business";

export const metadata: Metadata = {
  title: "Terms of Service | IZIES",
  description:
    "Basic terms for using the IZIES public website and contacting IZIES for digital engineering services.",
};

export default function TermsPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Legal
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="text-slate-300 leading-relaxed">
            This website is provided to introduce IZIES services and let visitors
            contact our team about websites, apps, AI, automation, cloud, and
            software development work.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-7 text-slate-300">
          <p>
            Information on this website is for general business communication.
            A project begins only after scope, deliverables, timelines, pricing,
            ownership, and support terms are agreed in writing.
          </p>
          <p>
            Visitors should not submit confidential credentials, production
            secrets, private keys, or sensitive customer data through public
            forms. Share those details only through an agreed secure process.
          </p>
          <p>
            For service, billing, or project-related questions, contact{" "}
            <a className="text-indigo-300 hover:text-white" href={`mailto:${BUSINESS_EMAIL}`}>
              {BUSINESS_EMAIL}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
