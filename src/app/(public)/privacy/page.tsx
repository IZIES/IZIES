import type { Metadata } from "next";
import { BUSINESS_EMAIL } from "@/lib/business";

export const metadata: Metadata = {
  title: "Privacy Policy | IZIES",
  description:
    "Privacy information for people contacting IZIES about websites, apps, AI, automation, and software development services.",
};

export default function PrivacyPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Legal
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-slate-300 leading-relaxed">
            IZIES uses the details you share through our contact forms and direct
            email only to understand your inquiry, respond to you, and prepare a
            relevant project discussion.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-7 text-slate-300">
          <p>
            We may collect your name, email address, phone number, company name,
            selected service, and project description when you contact us. We do
            not sell this information.
          </p>
          <p>
            Project information may be reviewed by the IZIES team so we can
            evaluate scope, timelines, technology fit, and next steps. We keep
            inquiry details only for business communication, support, and record
            keeping.
          </p>
          <p>
            To request an update or deletion of your inquiry details, contact us
            at{" "}
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
