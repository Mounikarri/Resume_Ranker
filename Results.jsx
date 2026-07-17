import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Briefcase, Users, Target, AlertTriangle } from "lucide-react";
import ResultCard from "@/components/resume/ResultCard";
import SkillBadge from "@/components/resume/SkillBadge";
import MatchScoreChart from "@/components/resume/MatchScoreChart";
import SkillInsights from "@/components/resume/SkillInsights";

export default function Results() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      const [jobData, screenings] = await Promise.all([
        base44.entities.JobDescription.get(jobId),
        base44.entities.ResumeScreening.filter({ job_description_id: jobId }, "-match_score")
      ]);
      setJob(jobData);
      setResults(screenings);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (id, status) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-500">Screening not found</p>
      </div>
    );
  }

  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + (r.match_score || 0), 0) / results.length)
    : 0;
  const shortlisted = results.filter(r => r.status === "shortlisted").length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link to="/">
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight truncate">{job.title}</h1>
            <p className="text-xs text-zinc-500">{results.length} candidates screened</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
            <Users className="w-5 h-5 text-zinc-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">{results.length}</p>
            <p className="text-xs text-zinc-500">Candidates</p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
            <Target className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-emerald-400">{avgScore}%</p>
            <p className="text-xs text-zinc-500">Avg Match</p>
          </div>
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 text-center">
            <Briefcase className="w-5 h-5 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-400">{shortlisted}</p>
            <p className="text-xs text-zinc-500">Shortlisted</p>
          </div>
        </div>

        {/* Match Score Distribution Chart */}
        <MatchScoreChart results={results} />

        {/* Skill Insights: Skills to Learn + Key Shortlisting Skills */}
        <SkillInsights results={results} />

        {/* Required Skills */}
        {job.required_skills?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Required Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {job.required_skills.map((s, i) => <SkillBadge key={i} skill={s} type="matched" />)}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Ranked Candidates
          </p>
          {results.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No results yet</p>
            </div>
          ) : (
            results.map((result, i) => (
              <ResultCard key={result.id} result={result} rank={i + 1} onStatusChange={handleStatusChange} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}