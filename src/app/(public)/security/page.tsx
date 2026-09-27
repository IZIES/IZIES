import type { Metadata } from "next";
import { BUSINESS_EMAIL } from "@/lib/business";

export const metadata: Metadata = {
  title: "Security Standards | IZIES",
  description:
    "Security practices and responsible contact details for IZIES digital engineering services.",
};

export default function SecurityPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-300">
            Trust
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Security Standards
          </h1>
          <p className="text-slate-300 leading-relaxed">
            IZIES treats security as part of the engineering process, from
            planning and access control to deployment and maintenance.
          </p>
        </div>

        <div className="space-y-6 text-sm leading-7 text-slate-300">
          <p>
            We design systems with least-privilege access, environment-based
            secrets, encrypted transport, structured backups where applicable,
            and reviewable deployment processes.
          </p>
          <p>
            For client projects, specific controls depend on the agreed scope,
            hosting environment, compliance needs, and operational risk profile.
          </p>
          <p>
            To report a security concern, email{" "}
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
