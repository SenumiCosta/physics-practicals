"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const localeNames: Record<string, string> = {
  en: "English",
  si: "සිංහල",
  ta: "தமிழ்",
};

const localeShort: Record<string, string> = {
  en: "EN",
  si: "සි",
  ta: "த",
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale as "en" | "si" | "ta" });
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <Globe size={16} />
        {localeShort[locale]}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-card-border rounded-xl shadow-lg overflow-hidden min-w-[140px] z-50">
          {Object.entries(localeNames).map(([code, name]) => (
            <button
              key={code}
              onClick={() => switchLocale(code)}
              className={cn(
                "w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors",
                code === locale && "bg-primary/10 text-primary font-medium"
              )}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
