type SectionExperienceProps = {
  variant:
    | "scan"
    | "constellation"
    | "pipeline"
    | "industries"
    | "products"
    | "protocol"
    | "trust"
    | "labs"
    | "story"
    | "leadership"
    | "contact";
  mode?: "full" | "accent";
};

export function SectionExperience({ variant, mode = "full" }: SectionExperienceProps) {
  const variantClass = {
    scan: "iz-section-scan",
    constellation: "iz-section-constellation",
    pipeline: "iz-section-pipeline",
    industries: "iz-section-industries",
    products: "iz-section-products",
    protocol: "iz-section-protocol",
    trust: "iz-section-trust",
    labs: "iz-section-labs",
    story: "iz-section-story",
    leadership: "iz-section-leadership",
    contact: "iz-section-contact",
  }[variant];

  return (
    <div className={`iz-section-experience ${variantClass} ${mode === "accent" ? "iz-section-accent-only" : ""}`} aria-hidden="true">
      {mode === "full" && <div className="iz-exp-flow" />}
      {mode === "full" && <div className="iz-exp-grid" />}
      <div className="iz-exp-orbit iz-exp-orbit-a" />
      <div className="iz-exp-orbit iz-exp-orbit-b" />
      <div className="iz-exp-beam" />
      <div className="iz-exp-pulse iz-exp-pulse-a" />
      <div className="iz-exp-pulse iz-exp-pulse-b" />
      <div className="iz-exp-pulse iz-exp-pulse-c" />
      <div className="iz-exp-star iz-exp-star-a" />
      <div className="iz-exp-star iz-exp-star-b" />
      <div className="iz-exp-shoot iz-exp-shoot-a" />
      <div className="iz-exp-shoot iz-exp-shoot-b" />
      <div className="iz-exp-window iz-exp-window-a" />
      <div className="iz-exp-window iz-exp-window-b" />
      <div className="iz-exp-ribbon" />
    </div>
  );
}
