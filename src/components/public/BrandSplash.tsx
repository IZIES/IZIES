"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function BrandSplash() {
  const [visible, setVisible] = useState(true);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    const shouldHold = new URLSearchParams(window.location.search).get("splash") === "hold";
    setHold(shouldHold);
    if (shouldHold) return;

    const timeout = window.setTimeout(() => setVisible(false), 2700);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className={`iz-brand-splash${hold ? " iz-brand-splash--hold" : ""}`} aria-label="Loading IZIES" aria-live="polite">
      <div className="iz-brand-splash__noise" aria-hidden="true" />
      <div className="iz-brand-splash__mark" aria-hidden="true">
        <Image
          className="iz-brand-splash__logo iz-brand-splash__logo-base"
          src="/brand/izies-logo-monochrome-white.png"
          alt=""
          fill
          priority
          sizes="250px"
        />
        <Image
          className="iz-brand-splash__logo iz-brand-splash__logo-fill"
          src="/brand/izies-logo-transparent.png"
          alt=""
          fill
          priority
          sizes="250px"
        />
      </div>
      <div className="iz-brand-splash__label">
        <span>IZIES</span>
        <small>Digital systems loading</small>
      </div>
    </div>
  );
}
