"use client";

import Link from "next/link";
import {
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Briefcase,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface JobCardItemProps {
  job: any;
  onToggleStatus: (jobId: string, currentStatus: string) => void;
  onDeleteJob: (jobId: string) => void;
}

export function JobCardItem({
  job,
  onToggleStatus,
  onDeleteJob,
}: JobCardItemProps) {
  return (
    <div className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0 hover:bg-white/[0.01] px-2 rounded-xl transition-colors">
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        {/* Cover Thumbnail */}
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl overflow-hidden border border-white/10 bg-[#060810] shrink-0 relative flex items-center justify-center">
          {job.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <Image width={400} height={400}
              src={job.imageUrl}
              alt={job.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-tr from-blue-600/20 to-purple-600/20 flex items-center justify-center text-blue-400">
              <Briefcase className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/admin/jobs/${job.id}`}
              className="font-bold text-base text-white hover:text-blue-400 transition-colors truncate max-w-[280px] sm:max-w-md"
            >
              {job.title}
            </Link>
            <Badge variant={job.status === "PUBLISHED" ? "success" : "secondary"}>
              {job.status}
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/5">
              {job.department?.name || "General"}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400">
            <span>{job.location}</span>
            <span>•</span>
            <span className="capitalize">{job.employmentType.toLowerCase().replace("_", " ")}</span>
            <span>•</span>
            <span className="capitalize">{job.workplaceType.toLowerCase().replace("_", " ")}</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">
              {job._count?.applications || 0} applicants
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onToggleStatus(job.id, job.status)}
          className="h-8 text-xs border-white/10"
        >
          {job.status === "PUBLISHED" ? (
            <>
              <XCircle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              <span>Close</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              <span>Publish</span>
            </>
          )}
        </Button>

        <Link href={`/jobs/${job.slug}`} target="_blank">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-slate-400 hover:text-white"
            title="View Public Page"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </Button>
        </Link>

        <Link href={`/admin/jobs/${job.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-slate-400 hover:text-white"
            title="Edit Requisition"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </Button>
        </Link>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteJob(job.id)}
          className="h-8 px-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
          title="Delete Job"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
