"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Upload, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Stage = "idle" | "extracting" | "analyzing" | "generating" | "done" | "error";

export default function SimulatePage() {
  const t = useTranslations();
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [html, setHtml] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/gif",
  ];

  const handleFile = (f: File) => {
    if (ACCEPTED.includes(f.type)) {
      setFile(f);
      setError("");
      setStage("idle");
      setHtml("");
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setStage("extracting");
    setError("");
    setHtml("");

    const formData = new FormData();
    formData.append("pdf", file);

    const t1 = setTimeout(() => setStage("analyzing"), 2500);
    const t2 = setTimeout(() => setStage("generating"), 9000);

    try {
      const res = await fetch("http://localhost:3001/api/simulations/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setHtml(data.html);
      setTitle(data.title || "Simulation");
      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStage("error");
    } finally {
      clearTimeout(t1);
      clearTimeout(t2);
    }
  };

  const handleReset = () => {
    setFile(null);
    setStage("idle");
    setHtml("");
    setTitle("");
    setError("");
  };

  // --- DONE: show simulation ---
  if (stage === "done" && html) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{title}</h1>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-card-border text-sm font-medium transition-colors"
          >
            <RotateCcw size={14} />
            {t("simulate.newSimulation")}
          </button>
        </div>
        <div className="rounded-2xl overflow-hidden border border-card-border bg-card">
          <iframe
            srcDoc={html}
            sandbox="allow-scripts"
            title={title}
            className="w-full border-0"
            style={{ height: "700px" }}
          />
        </div>
      </div>
    );
  }

  // --- LOADING ---
  if (stage === "extracting" || stage === "analyzing" || stage === "generating") {
    const stages = [
      { key: "extracting", label: t("simulate.extracting") },
      { key: "analyzing", label: t("simulate.analyzing") },
      { key: "generating", label: t("simulate.buildingSim") },
    ];
    const currentIdx = stages.findIndex((s) => s.key === stage);

    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="2.5" />
              <ellipse cx="12" cy="12" rx="10" ry="4" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          {stages.map((s, i) => {
            const isActive = i === currentIdx;
            const isDone = i < currentIdx;
            return (
              <div
                key={s.key}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  isActive
                    ? "bg-primary/10 border border-primary/30"
                    : isDone
                      ? "bg-success/10 border border-success/20"
                      : "bg-muted border border-transparent"
                )}
              >
                {isDone ? (
                  <svg className="w-5 h-5 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : (
                  <div className={cn("w-5 h-5 rounded-full border-2", isActive ? "border-primary border-t-transparent animate-spin" : "border-muted-foreground/30")} />
                )}
                <span className={cn("text-sm font-medium", isActive ? "text-foreground" : isDone ? "text-success" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-muted-foreground text-sm mt-8">{t("simulate.waitMessage")}</p>
      </div>
    );
  }

  // --- UPLOAD ---
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("simulate.title")}</h1>
        <p className="text-muted-foreground">{t("simulate.subtitle")}</p>
      </div>

      {/* Drop zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-card-border hover:border-primary/50 hover:bg-muted/50"
        )}
        onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const f = e.dataTransfer.files[0];
          if (f) handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.png,.jpg,.jpeg,.webp,.gif"
          onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
            <Upload className="w-7 h-7 text-primary" />
          </div>
          {file ? (
            <div>
              <p className="text-lg font-semibold">{file.name}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {(file.size / 1024).toFixed(0)} KB
              </p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold">{t("simulate.dropzone")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("simulate.dropzoneHint")}</p>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {stage === "error" && error && (
        <div className="mt-6 bg-danger/10 border border-danger/20 rounded-xl p-4">
          <p className="text-danger font-medium">{t("simulate.failed")}</p>
          <p className="text-danger/80 text-sm mt-1">{error}</p>
          <button
            onClick={handleGenerate}
            className="mt-3 px-4 py-2 bg-danger/20 hover:bg-danger/30 text-danger rounded-lg text-sm font-medium transition-colors"
          >
            {t("simulate.tryAgain")}
          </button>
        </div>
      )}

      {/* Generate button */}
      {file && stage !== "error" && (
        <button
          onClick={handleGenerate}
          className="w-full mt-6 py-4 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors text-lg"
        >
          {t("simulate.generateBtn")}
        </button>
      )}
    </div>
  );
}
