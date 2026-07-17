import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

export default function MatchScoreChart({ results }) {
  const data = useMemo(() => {
    return results
      .filter((r) => r.candidate_name)
      .map((r) => ({
        name: r.candidate_name.length > 12 ? r.candidate_name.slice(0, 12) + "…" : r.candidate_name,
        score: r.match_score || 0,
        status: r.status,
      }))
      .sort((a, b) => b.score - a.score);
  }, [results]);

  const colorFor = (s) => (s >= 80 ? "#34d399" : s >= 60 ? "#fbbf24" : s >= 40 ? "#f97316" : "#ef4444");

  if (data.length === 0) return null;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-4">Match Score Distribution</h3>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: "#71717a", fontSize: 11 }} axisLine={{ stroke: "#27272a" }} />
          <YAxis type="category" dataKey="name" tick={{ fill: "#a1a1aa", fontSize: 11 }} width={90} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: "#27272a33" }}
            contentStyle={{ background: "#18181b", border: "1px solid #3f3f46", borderRadius: 8, fontSize: 12, color: "#e4e4e7" }}
            formatter={(v) => [`${v}%`, "Match Score"]}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, i) => (
              <Cell key={i} fill={colorFor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}