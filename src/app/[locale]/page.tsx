"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Upload, Bot, Atom, ArrowRight } from "lucide-react";

export default function HomePage() {
  const t = useTranslations();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Atom size={16} />
            Sri Lankan A/L Physics
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {t("dashboard.welcome")}
          </h1>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            {t("dashboard.welcomeDesc")}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/simulate"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-dark transition-colors text-lg"
            >
              <Upload size={20} />
              {t("dashboard.uploadCTA")}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/ai-assistant"
              className="inline-flex items-center gap-2 bg-card border border-card-border px-8 py-3.5 rounded-xl font-semibold hover:bg-muted transition-colors text-lg"
            >
              <Bot size={20} />
              {t("dashboard.askAI")}
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: 1,
              icon: <Upload size={28} className="text-primary" />,
              title: "Upload",
              desc: "Drop a PDF or photo of any physics practical from the A/L syllabus.",
            },
            {
              step: 2,
              icon: <Atom size={28} className="text-primary" />,
              title: "AI Analyzes",
              desc: "Gemini AI extracts equations, parameters, and apparatus from your practical.",
            },
            {
              step: 3,
              icon: (
                <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ),
              title: "Simulate",
              desc: "Get a live, interactive simulation with sliders and real-time graphs.",
            },
          ].map((item) => (
            <div key={item.step} className="bg-card border border-card-border rounded-xl p-6 text-center">
              <div className="flex justify-center mb-4">{item.icon}</div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
                  {item.step}
                </span>
                <h3 className="font-semibold text-lg">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
