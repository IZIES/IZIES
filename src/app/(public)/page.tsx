
import { BUSINESS_DESCRIPTION, businessMetadata, serviceCatalog, jsonLd } from "@/lib/seo";
import { HeroSection } from "@/components/public/landing/HeroSection";
import { HeroSystemsCanvas } from "@/components/public/landing/HeroSystemsCanvas";
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(serviceCatalog("/")) }} />
      {/* Global Background Synchronized Grid & Radial Glow */}
      <div className="fixed inset-0 z-0 bg-[#04060A] pointer-events-none">
        <HeroSystemsCanvas />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_23%_28%,rgba(5,7,15,0.5),rgba(5,7,15,0.76)_50%,rgba(4,6,10,0.95)_100%)]" />
        {/* Dynamic Abstract Mesh Gradients synced to Logo Colors (Purple/Blue/Cyan) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/[0.02] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-blue-600/[0.02] blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] bg-cyan-600/[0.02] blur-[130px] rounded-full pointer-events-none" />
        
        {/* Subtle Overlay Grid & Sparks */}
        <div className="absolute inset-[-100px] bg-grid-pattern opacity-[0.115] pointer-events-none" style={{ animation: "iz-grid-drift 20s linear infinite" }} />
        <div className="absolute inset-[-100px] bg-spark-layer-1 pointer-events-none" />
        <div className="absolute inset-[-100px] bg-spark-layer-2 pointer-events-none" />
        <div className="absolute inset-[-100px] bg-spark-layer-3 pointer-events-none" />
        
        {/* Global Scanning Beam */}
        <div className="iz-exp-beam" style={{ opacity: 0.2 }} />
      </div>

      <div className="relative min-h-screen text-slate-100 overflow-x-hidden selection:bg-cyan-500/20 selection:text-cyan-300">
        
        {/* Removed fade gradient so canvas seamlessly extends into the Footer */}

      {/* 1-2. Connected Hero and Intro Scene */}
      <div className="relative z-10 overflow-hidden">
        <div className="relative z-10">
          <HeroSection showBackground={false} />
        </div>
        <CompanyIntroSection />
      </div>

      <div className="relative z-10 flex flex-col">
        {/* 3. Specialized Capabilities */}
        <CapabilitiesSection />

        {/* 4. Enterprise Client Delivery */}
        <DeliveryModelsSection />

        {/* 5. Industries */}
        <IndustriesSection />

        {/* 6. What We Build */}
        <WhatWeBuildSection />

        {/* 7. Approach */}
        <ApproachSection />

        {/* 8. Why Choose Us */}
        <WhyChooseUsSection />

        {/* 9. Labs & Innovation Teaser */}
        <LabsInnovationSection />

        {/* 10. About IZIES */}
        <AboutSection />

        {/* 11. Leadership & Founders */}
        <LeadershipSection />

        {/* 12. Consultation */}
        <ContactSection />
      </div>
    </div>
    </>
  );
}
