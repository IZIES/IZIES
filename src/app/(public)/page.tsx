
import nextDynamic from "next/dynamic";
import { BUSINESS_DESCRIPTION, businessMetadata, serviceCatalog, jsonLd } from "@/lib/seo";
import { HeroSection } from "@/components/public/landing/HeroSection";
import { HeroSystemsCanvas } from "@/components/public/landing/HeroSystemsCanvas";
import { CompanyIntroSection } from "@/components/public/landing/CompanyIntroSection";
import { FadeInScroll } from "@/components/public/landing/FadeInScroll";

// Lazy loaded sections — loaded only when user scrolls near them
const CapabilitiesSection = nextDynamic(() => import("@/components/public/landing/CapabilitiesSection").then(mod => mod.CapabilitiesSection));
const DeliveryModelsSection = nextDynamic(() => import("@/components/public/landing/DeliveryModelsSection").then(mod => mod.DeliveryModelsSection));
const IndustriesSection = nextDynamic(() => import("@/components/public/landing/IndustriesSection").then(mod => mod.IndustriesSection));
const WhatWeBuildSection = nextDynamic(() => import("@/components/public/landing/WhatWeBuildSection").then(mod => mod.WhatWeBuildSection));
const ApproachSection = nextDynamic(() => import("@/components/public/landing/ApproachSection").then(mod => mod.ApproachSection));
const WhyChooseUsSection = nextDynamic(() => import("@/components/public/landing/WhyChooseUsSection").then(mod => mod.WhyChooseUsSection));
const LabsInnovationSection = nextDynamic(() => import("@/components/public/landing/LabsInnovationSection").then(mod => mod.LabsInnovationSection));
const AboutSection = nextDynamic(() => import("@/components/public/landing/AboutSection").then(mod => mod.AboutSection));
const LeadershipSection = nextDynamic(() => import("@/components/public/landing/LeadershipSection").then(mod => mod.LeadershipSection));
const ContactSection = nextDynamic(() => import("@/components/public/landing/ContactSection").then(mod => mod.ContactSection));

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = businessMetadata(
  "Digital Engineering & Software Development",
  BUSINESS_DESCRIPTION,
  "/",
);

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceCatalog("/")) }} />
      {/* Global Background Synchronized Grid & Radial Glow */}
      <div className="fixed inset-0 z-0 bg-[#04060A] pointer-events-none overflow-hidden">
        <HeroSystemsCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_23%_28%,rgba(5,7,15,0.5),rgba(5,7,15,0.76)_50%,rgba(4,6,10,0.95)_100%)]" />
        {/* Mesh Gradients — GPU accelerated to prevent scroll lag */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/[0.02] blur-[120px] rounded-full pointer-events-none transform-gpu will-change-transform" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-blue-600/[0.02] blur-[150px] rounded-full pointer-events-none transform-gpu will-change-transform" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] bg-cyan-600/[0.02] blur-[130px] rounded-full pointer-events-none transform-gpu will-change-transform" />
        
        {/* Subtle Overlay Grid & Sparks */}
        <div className="absolute inset-[-100px] bg-grid-pattern opacity-[0.115] pointer-events-none" style={{ animation: "iz-grid-drift 20s linear infinite" }} />
        <div className="absolute inset-[-100px] bg-spark-layer-1 pointer-events-none" />
        <div className="absolute inset-[-100px] bg-spark-layer-2 pointer-events-none" />
        <div className="absolute inset-[-100px] bg-spark-layer-3 pointer-events-none" />
        
        {/* Global Scanning Beam */}
        <div className="iz-exp-beam" style={{ opacity: 0.2 }} />
      </div>

      <div className="relative min-h-screen text-slate-100 overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
        
      {/* 1-2. Connected Hero and Intro Scene */}
      <div className="relative z-10 overflow-hidden">
        <div className="relative z-10">
          <HeroSection showBackground={false} />
        </div>
        <CompanyIntroSection />
      </div>

      <div className="relative z-10 flex flex-col">
        {/* 3. Specialized Capabilities */}
        <FadeInScroll>
          <CapabilitiesSection />
        </FadeInScroll>

        {/* 4. Enterprise Client Delivery */}
        <FadeInScroll>
          <DeliveryModelsSection />
        </FadeInScroll>

        {/* 5. Industries */}
        <FadeInScroll>
          <IndustriesSection />
        </FadeInScroll>

        {/* 6. What We Build */}
        <FadeInScroll>
          <WhatWeBuildSection />
        </FadeInScroll>

        {/* 7. Approach */}
        <FadeInScroll>
          <ApproachSection />
        </FadeInScroll>

        {/* 8. Why Choose Us */}
        <FadeInScroll>
          <WhyChooseUsSection />
        </FadeInScroll>

        {/* 9. Labs & Innovation Teaser */}
        <FadeInScroll>
          <LabsInnovationSection />
        </FadeInScroll>

        {/* 10. About IZIES */}
        <FadeInScroll>
          <AboutSection />
        </FadeInScroll>

        {/* 11. Leadership & Founders */}
        <FadeInScroll>
          <LeadershipSection />
        </FadeInScroll>

        {/* 12. Consultation */}
        <FadeInScroll>
          <ContactSection />
        </FadeInScroll>
      </div>
    </div>
    </>
  );
}
