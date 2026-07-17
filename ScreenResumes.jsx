import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import DropZone from "@/components/resume/DropZone";

export default function ScreenResumes() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [screening, setScreening] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, step: "" });

  const handleScreen = async () => {
    if (!title.trim() || !description.trim() || files.length === 0) return;
    setScreening(true);

    try {
      // Step 1: Extract skills from job description
      setProgress({ current: 0, total: files.length + 1, step: "Analyzing job description..." });

      const skillsResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this job description and extract the key required skills, technologies, qualifications, and competencies. Return them as a JSON object.

Job Description:
${description}`,
        response_json_schema: {
          type: "object",
          properties: {
            skills: { type: "array", items: { type: "string" } }
          }
        }
      });

      const requiredSkills = skillsResult.skills || [];

      // Step 2: Create job description record
      const job = await base44.entities.JobDescription.create({
        title: title.trim(),
        description: description.trim(),
        required_skills: requiredSkills,
        status: "active"
      });

      // Step 3: Process each resume
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress({ current: i + 1, total: files.length + 1, step: `Screening ${file.name}...` });

        // Upload file
        const { file_url } = await base44.integrations.Core.UploadFile({ file });

        // Extract text and analyze with AI
        const analysis = await base44.integrations.Core.InvokeLLM({
          prompt: `You are an expert HR recruiter. Analyze this resume against the job description below.

JOB TITLE: ${title}

JOB DESCRIPTION:
${description}

REQUIRED SKILLS: ${requiredSkills.join(", ")}

Analyze the attached resume file and provide:
1. The candidate's name
2. An overall match score (0-100) based on how well the resume matches the job requirements
3. Which required skills are present in the resume
4. Which required skills are missing
5. A brief 2-3 sentence summary of the candidate's fit

Be accurate and fair in scoring.`,
          file_urls: [file_url],
          response_json_schema: {
            type: "object",
            properties: {
              candidate_name: { type: "string" },
              match_score: { type: "number" },
              matched_skills: { type: "array", items: { type: "string" } },
              missing_skills: { type: "array", items: { type: "string" } },
              summary: { type: "string" }
            }
          }
        });

        await base44.entities.ResumeScreening.create({
          job_description_id: job.id,
          candidate_name: analysis.candidate_name || file.name.replace(/\.[^.]+$/, ""),
          resume_file_url: file_url,
          match_score: Math.round(analysis.match_score || 0),
          matched_skills: analysis.matched_skills || [],
          missing_skills: analysis.missing_skills || [],
          summary: analysis.summary || "",
          status: "screened"
        });
      }

      navigate(`/results/${job.id}`);
    } catch (err) {
      console.error(err);
      setScreening(false);
    }
  };

  const isReady = title.trim() && description.trim() && files.length > 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/50">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center gap-4">
          <Link to="/">
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-zinc-400" />
            </button>
          </Link>
          <h1 className="text-lg font-bold tracking-tight">New Screening</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        {screening ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-6">
              <div className="w-16 h-16 bg-emerald-400/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
            </div>
            <h2 className="text-lg font-semibold text-zinc-200 mb-2">{progress.step}</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Processing {progress.current} of {progress.total}
            </p>
            <div className="w-64 bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <section className="space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-400 block mb-2">Job Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 h-11"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-400 block mb-2">Job Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={8}
                  className="bg-zinc-900 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 resize-none"
                />
              </div>
            </section>

            <section className="space-y-3">
              <label className="text-sm font-medium text-zinc-400 block">Resumes</label>
              <DropZone files={files} setFiles={setFiles} />
            </section>

            <Button
              onClick={handleScreen}
              disabled={!isReady}
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold text-base disabled:opacity-40"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Screen {files.length} Resume{files.length !== 1 ? "s" : ""}
            </Button>
          </>
        )}
      </main>
    </div>
  );
}