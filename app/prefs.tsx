"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DICT, type Dict, type Lang } from "@/lib/i18n";
import { TOOLS, type Response } from "@/lib/training";

type Theme = "dark" | "light";
export type Creds = { id: string; token: string };

type Ctx = {
  lang: Lang;
  t: Dict;
  setLang: (l: Lang) => void;
  theme: Theme;
  setTheme: (t: Theme) => void;
  creds: Creds | null;
  setCreds: (c: Creds | null) => void;
  me: Response | null;
  refreshMe: () => void;
  code: string;
  setCode: (c: string) => void;
  toast: (msg: string) => void;
};

const C = createContext<Ctx | null>(null);
export const usePrefs = () => useContext(C)!;

const store = {
  get: (k: string) => {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set: (k: string, v: string | null) => {
    try {
      if (v === null) localStorage.removeItem(k);
      else localStorage.setItem(k, v);
    } catch {}
  },
};

/** fetch with the member's credentials in headers (never in the URL). */
export function api(path: string, creds: Creds | null, init: RequestInit = {}) {
  return fetch(path, { ...init, headers: { "content-type": "application/json", ...(creds && { "x-id": creds.id, "x-token": creds.token }), ...init.headers } });
}

export function Prefs({ children }: { children: ReactNode }) {
  const [lang, setLangS] = useState<Lang>("en");
  const [theme, setThemeS] = useState<Theme>("dark");
  const [creds, setCredsS] = useState<Creds | null>(null);
  const [me, setMe] = useState<Response | null>(null);
  const [code, setCodeS] = useState("");
  const [msg, setMsg] = useState<{ text: string; n: number } | null>(null);

  useEffect(() => {
    const l = store.get("kunz-lang");
    if (l === "he" || l === "en") setLangS(l);
    if (store.get("kunz-theme") === "light") setThemeS("light");
    try {
      setCredsS(JSON.parse(store.get("kunz-training") ?? "null"));
    } catch {}
    // A QR code at the space links to /?code=XXXX: remember it, then clean the URL.
    const url = new URL(location.href);
    const q = url.searchParams.get("code");
    if (q) {
      store.set("kunz-code", q);
      url.searchParams.delete("code");
      history.replaceState(null, "", url);
    }
    setCodeS(q ?? store.get("kunz-code") ?? "");
  }, []);

  const setLang = (l: Lang) => {
    setLangS(l);
    store.set("kunz-lang", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "he" ? "rtl" : "ltr";
  };
  const setTheme = (t: Theme) => {
    setThemeS(t);
    store.set("kunz-theme", t);
    document.documentElement.dataset.theme = t;
  };
  const setCreds = (c: Creds | null) => {
    setCredsS(c);
    store.set("kunz-training", c && JSON.stringify(c));
  };
  const setCode = (c: string) => {
    setCodeS(c);
    store.set("kunz-code", c);
  };

  const refreshMe = useCallback(() => {
    if (!creds) return setMe(null);
    api("/api/responses?me=1", creds)
      .then((r) => r.json())
      .then(setMe)
      .catch(() => {});
  }, [creds]);
  useEffect(refreshMe, [refreshMe]);

  const toast = (text: string) => setMsg({ text, n: Date.now() });
  useEffect(() => {
    if (!msg) return;
    const id = setTimeout(() => setMsg(null), 2400);
    return () => clearTimeout(id);
  }, [msg]);

  return (
    <C.Provider value={{ lang, t: DICT[lang], setLang, theme, setTheme, creds, setCreds, me, refreshMe, code, setCode, toast }}>
      {children}
      {msg && (
        <div className="toast" role="status" key={msg.n}>
          {msg.text}
        </div>
      )}
    </C.Provider>
  );
}

export const toolName = (id: string, lang: Lang) => {
  const t = TOOLS.find((x) => x.id === id);
  return t ? (lang === "he" ? t.he : t.name) : id;
};
export const toolDetail = (id: string, lang: Lang) => {
  const t = TOOLS.find((x) => x.id === id);
  return t ? (lang === "he" ? t.detailHe : t.detail) : "";
};
