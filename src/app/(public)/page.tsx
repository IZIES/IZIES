
import { BUSINESS_DESCRIPTION, businessMetadata, serviceCatalog, jsonLd } from "@/lib/seo";
import { HeroSection } from "@/components/public/landing/HeroSection";
import { CompanyIntroSection } from "@/components/public/landing/CompanyIntroSection";
import { CapabilitiesSection } from "@/components/public/landing/CapabilitiesSection";
import { DeliveryModelsSection } from "@/components/public/landing/DeliveryModelsSection";
import { IndustriesSection } from "@/components/public/landing/IndustriesSection";
import { WhatWeBuildSection } from "@/components/public/landing/WhatWeBuildSection";
import { ApproachSection } from "@/components/public/landing/ApproachSection";
import { WhyChooseUsSection } from "@/components/public/landing/WhyChooseUsSection";
import { LabsInnovationSection } from "@/components/public/landing/LabsInnovationSection";
import { AboutSection } from "@/components/public/landing/AboutSection";
import { LeadershipSection } from "@/components/public/landing/LeadershipSection";
import { ContactSection } from "@/components/public/landing/ContactSection";
import { FadeInScroll } from "@/components/public/landing/FadeInScroll";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = businessMetadata(
  "Digital Engineering & Software Development",
  BUSINESS_DESCRIPTION,
  "/",
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#04060A] text-slate-100 overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceCatalog("/")) }} />
      {/* Global Background Synchronized Grid & Radial Glow */}
      <div className="absolute inset-0 z-0 bg-[#04060A] overflow-hidden">
        {/* Dynamic Abstract Mesh Gradients synced to Logo Colors (Purple/Blue/Cyan) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] bg-cyan-600/10 blur-[130px] rounded-full pointer-events-none" />
        
        {/* Subtle Overlay Grid */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.06] pointer-events-none" />
      </div>

      {/* 1. Hero Section */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      <div className="relative z-10 flex flex-col">
        {/* 2. Short Company Intro */}
        <FadeInScroll>
          <CompanyIntroSection />
        </FadeInScroll>

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
  );
}
