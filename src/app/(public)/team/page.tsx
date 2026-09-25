import { Metadata } from "next";
import { OurTeamClient } from "./TeamClient";
import { metadata } from "./metadata";

export { metadata };

export default function OurTeamPage() {
  return <OurTeamClient />;
}