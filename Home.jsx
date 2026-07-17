import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Plus, Briefcase, FileText, TrendingUp, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await base44.entities.JobDescription.list("-created_date");
      setJobs(data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-400/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ResumeScreen</h1>
              <p className="text-xs text-zinc-500">AI-Powered Resume Analysis</p>
            </div>
          </div>
          <Link to="/screen">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium">
              <Plus className="w-4 h-4 mr-2" /> New Screening
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mb-5">
              <Briefcase className="w-8 h-8 text-zinc-600" />
            </div>
            <h2 className="text-lg font-semibold text-zinc-300 mb-2">No screenings yet</h2>
            <p className="text-sm text-zinc-500 max-w-sm mb-6">
              Start by creating a new screening — paste a job description and upload resumes to get AI-powered rankings.
            </p>
            <Link to="/screen">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-medium">
                <Plus className="w-4 h-4 mr-2" /> Create First Screening
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Recent Screenings</h2>
            {jobs.map((job) => (
              <Link key={job.id} to={`/results/${job.id}`}>
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center group-hover:bg-emerald-400/10 transition-colors">
                      <FileText className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-zinc-200 truncate">{job.title}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {new Date(job.created_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {job.required_skills?.length > 0 && ` · ${job.required_skills.length} skills tracked`}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      job.status === "active" ? "bg-emerald-400/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}