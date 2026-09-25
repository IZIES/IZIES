import { Metadata } from "next";
import { JobsDirectoryClient } from "./JobsDirectoryClient";
import { metadata } from "./metadata";

export { metadata };

export default function JobsDirectoryPage() {
  return <JobsDirectoryClient />;
}