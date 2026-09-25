"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CandidateProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/candidate/dashboard?tab=profile");
  }, [router]);

  return (
    <div className="py-24 text-center text-xs text-slate-400 animate-pulse">
      Loading your Candidate Profile...
    </div>
  );
}
