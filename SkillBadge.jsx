import React from "react";

export default function SkillBadge({ skill, type = "matched" }) {
  const styles = {
    matched: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    missing: "bg-red-400/10 text-red-400 border-red-400/20",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[type]}`}>
      {skill}
    </span>
  );
}