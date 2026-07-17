import React, { useState, useCallback } from "react";
import { Upload, FileText, X } from "lucide-react";

export default function DropZone({ files, setFiles, accept = ".pdf,.doc,.docx,.txt", multiple = true, label = "Drop resumes here" }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOut = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(prev => [...prev, ...droppedFiles]);
    }
  }, [setFiles]);

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragging
            ? "border-emerald-400 bg-emerald-400/5 scale-[1.01]"
            : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"
          }`}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex flex-col items-center gap-3">
          <div className={`p-3 rounded-full transition-colors ${isDragging ? "bg-emerald-400/10" : "bg-zinc-800"}`}>
            <Upload className={`w-6 h-6 ${isDragging ? "text-emerald-400" : "text-zinc-400"}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-300">{label}</p>
            <p className="text-xs text-zinc-500 mt-1">PDF, DOC, DOCX, or TXT</p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-3 bg-zinc-800/50 rounded-lg px-3 py-2">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-zinc-300 truncate flex-1">{file.name}</span>
              <span className="text-xs text-zinc-500">{(file.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => removeFile(i)} className="p-1 hover:bg-zinc-700 rounded transition-colors">
                <X className="w-3 h-3 text-zinc-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}