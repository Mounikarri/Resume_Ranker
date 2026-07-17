import React, { useMemo } from "react";
import { GraduationCap, TrendingUp } from "lucide-react";

export default function SkillInsights({ results }) {
  const insights = useMemo(() => {
    const missingMap = {};
    const matchedMap = {};

    results.forEach((r) => {
      (r.missing_skills || []).forEach((s) => {
        const key = s.toLowerCase().trim();
        missingMap[key] = (missingMap[key] || 0) + 1;
      });
      (r.matched_skills || []).forEach((s) => {
        const key = s.toLowerCase().trim();
        matchedMap[key] = (matchedMap[key] || 0) + 1;
      });
    });

    const topMissing = Object.entries(missingMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));

    const topMatched = Object.entries(matchedMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([skill, count]) => ({ skill, count }));

    return { topMissing, topMatched, total: results.length };
  }, [results]);

  if (insights.topMissing.length === 0 && insights.topMatched.length === 0) return null;

  const maxMissing = insights.topMissing[0]?.count || 1;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Skills to Learn */}
      {insights.topMissing.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Skills to Learn</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Most commonly missing across candidates</p>
          <div className="space-y-2.5">
            {insights.topMissing.map(({ skill, count }) => (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-sm text-zinc-300 w-32 truncate capitalize">{skill}</span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400/70 rounded-full transition-all duration-700"
                    style={{ width: `${(count / maxMissing) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Shortlisting Skills */}
      {insights.topMatched.length > 0 && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Key Shortlisting Skills</h3>
          </div>
          <p className="text-xs text-zinc-500 mb-4">Top skills found in screened candidates</p>
          <div className="space-y-2.5">
            {insights.topMatched.map(({ skill, count }) => {
              const maxMatched = insights.topMatched[0]?.count || 1;
              return (
                <div key={skill} className="flex items-center gap-3">
                  <span className="text-sm text-zinc-300 w-32 truncate capitalize">{skill}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400/70 rounded-full transition-all duration-700"
                      style={{ width: `${(count / maxMatched) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-zinc-500 w-6 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}