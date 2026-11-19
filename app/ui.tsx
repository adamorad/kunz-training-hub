"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";
import { usePrefs } from "./prefs";

export function Seg<T extends string | null>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { v: T; label: string; disabled?: boolean; lv?: string }[];
  onChange: (v: T) => void;
  label: string;
}) {
  const i = Math.max(0, options.findIndex((o) => o.v === value));
  const n = options.length;
  return (
    <div className="seg" role="group" aria-label={label}>
      <span className="seg-thumb" style={{ insetInlineStart: `calc(3px + (100% - 6px) * ${i} / ${n})`, width: `calc((100% - 6px) / ${n})` }} />
      {options.map((o) => (
        <button type="button" key={String(o.v)} data-lv={o.lv} aria-pressed={o.v === value} disabled={o.disabled} onClick={() => onChange(o.v)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Sheet({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const { t } = usePrefs();
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal aria-label={title}>
        <div className="grab" />
        <div className="sheet-head">
          <span className="h3">{title}</span>
          <button className="btn btn-ghost" onClick={onClose}>
            {t.close}
          </button>
        </div>
        {children}
      </div>
    </>
  );
}

const HUES = ["#ffb27a", "#ff8fa8", "#a99bff", "#7fdba0", "#8fb4f5", "#d59bf5", "#86dcef", "#f5d97a"];
export const hue = (s: string) => HUES[[...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % HUES.length];

export function Avatar({ handle }: { handle: string }) {
  return (
    <span className="avatar" style={{ background: hue(handle) }} aria-hidden>
      {handle.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function Header() {
  const { t, lang, setLang, theme, setTheme } = usePrefs();
  return (
    <header className="top">
      <Link href="/" className="brand">
        <Mark />
        <span>{t.hub}</span>
      </Link>
      <button className="icon-btn" onClick={() => setLang(lang === "en" ? "he" : "en")} aria-label={t.language}>
        {lang === "en" ? "עב" : "EN"}
      </button>
      <button className="icon-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={t.theme}>
        {theme === "dark" ? <Sun /> : <Moon />}
      </button>
    </header>
  );
}

/** Kunz's hamster (the Telegram channel's emoji), generated with Higgsfield. */
export const Mark = () => <img className="mark" src="/logo.png" alt="" width={32} height={32} />;

const svg = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };
export const Chevron = () => (
  <svg {...svg} className="chev" aria-hidden>
    <path d="M9 6l6 6-6 6" />
  </svg>
);
export const Sun = () => (
  <svg {...svg}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
export const Moon = () => (
  <svg {...svg}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
  </svg>
);
export const IconYou = () => (
  <svg {...svg}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
export const IconSessions = () => (
  <svg {...svg}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
export const IconTrainers = () => (
  <svg {...svg}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
  </svg>
);
export const IconTools = () => (
  <svg {...svg}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
  </svg>
);
