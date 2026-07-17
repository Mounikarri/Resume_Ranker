import React, { useState } from "react";
import { ChevronDown, ChevronUp, User, CheckCircle, XCircle, Star } from "lucide-react";
import ScoreGauge from "@/components/resume/ScoreGauge";
import SkillBadge from "@/components/resume/SkillBadge";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

export default function ResultCard({ result, rank, onStatusChange }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    screened: "text-zinc-400",
    shortlisted: "text-emerald-400",
    rejected: "text-red-400",
  };

  const handleStatus = async (status) => {
    await base44.entities.ResumeScreening.update(result.id, { status });
    onStatusChange?.(result.id, status);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all">
      <div
        className="flex items-center gap-4 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 text-sm font-bold shrink-0">
          #{rank}
        </div>
        <ScoreGauge score={result.match_score || 0} size={56} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-zinc-500" />
            <h3 className="font-semibold text-zinc-100 truncate">{result.candidate_name}</h3>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">
            {(result.matched_skills || []).length} skills matched · {(result.missing_skills || []).length} missing
          </p>
        </div>
        <span className={`text-xs font-medium capitalize ${statusColors[result.status] || "text-zinc-500"}`}>
          {result.status}
        </span>
        {expanded ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-zinc-800 pt-4">
          {result.summary && (
            <p className="text-sm text-zinc-400 leading-relaxed">{result.summary}</p>
          )}

          {(result.matched_skills || []).length > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Matched Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matched_skills.map((s, i) => <SkillBadge key={i} skill={s} type="matched" />)}
              </div>
            </div>
          )}

          {(result.missing_skills || []).length > 0 && (
            <div>
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Missing Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missing_skills.map((s, i) => <SkillBadge key={i} skill={s} type="missing" />)}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="border-emerald-600 text-emerald-400 hover:bg-emerald-400/10"
              onClick={(e) => { e.stopPropagation(); handleStatus("shortlisted"); }}>
              <Star className="w-3 h-3 mr-1" /> Shortlist
            </Button>
            <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-400/10"
              onClick={(e) => { e.stopPropagation(); handleStatus("rejected"); }}>
              <XCircle className="w-3 h-3 mr-1" /> Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}