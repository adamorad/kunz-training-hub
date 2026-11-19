"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CATS, IDEAS, MAX_VOTES } from "@/lib/ideas";
import { api, usePrefs } from "../prefs";

type Data = { rows: { id: string; votes: number }[]; voters: number; mine: string[] | null };

export default function Ideas() {
  const { t, lang, creds, toast } = usePrefs();
  const [data, setData] = useState<Data | null>(null);
  const [order, setOrder] = useState<string[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [cat, setCat] = useState<string>("all");

  useEffect(() => {
    api("/api/votes", creds)
      .then((r) => r.json())
      .then((d: Data) => {
        setData(d);
        setMine(d.mine ?? []);
        // Order once on load, so cards don't jump around while you vote.
        setOrder(d.rows.map((r) => r.id));
      })
      .catch(() => {});
  }, [creds]);

  const base = (id: string) => data?.rows.find((r) => r.id === id)?.votes ?? 0;
  const had = (id: string) => !!data?.mine?.includes(id);
  const count = (id: string) => base(id) - (had(id) ? 1 : 0) + (mine.includes(id) ? 1 : 0);
  const max = Math.max(1, ...IDEAS.map((i) => count(i.id)));
  const left = MAX_VOTES - mine.length;

  async function toggle(id: string) {
    if (!creds) return toast(t.voteFirst);
    const on = mine.includes(id);
    if (!on && left <= 0) return toast(t.noVotesLeft);
    const next = on ? mine.filter((x) => x !== id) : [...mine, id];
    const prev = mine;
    setMine(next);
    setBusy(true);
    const r = await api("/api/votes", creds, { method: "POST", body: JSON.stringify({ ideas: next }) }).catch(() => null);
    setBusy(false);
    if (!r?.ok) {
      setMine(prev);
      toast(t.saveErr);
    }
  }

  const ideas = (order.length ? order.map((id) => IDEAS.find((i) => i.id === id)!).filter(Boolean) : IDEAS).filter((i) => cat === "all" || i.cat === cat);

  return (
    <main className="enter">
      <Link href="/#tools" className="meta" style={{ textDecoration: "none" }}>
        {lang === "he" ? "→" : "←"} {t.back2}
      </Link>
      <h1>{t.ideasTitle}</h1>
      <p className="lede">{t.ideasLede}</p>

      <div className="ballot" aria-live="polite">
        <span className="ballot-dots" aria-hidden>
          {Array.from({ length: MAX_VOTES }, (_, i) => (
            <i key={i} className={i < mine.length ? "on" : ""} />
          ))}
        </span>
        <span className="meta num">{creds ? (left > 0 ? t.votesLeft(left) : t.votesNone) : t.voteFirst}</span>
        {data && <span className="meta num" style={{ marginInlineStart: "auto", whiteSpace: "nowrap" }}>{t.voters(data.voters)}</span>}
      </div>

      <div className="chips-row" role="group" aria-label="Filter">
        {["all", ...CATS].map((c) => (
          <button key={c} className="chip-btn" aria-pressed={cat === c} onClick={(e) => { setCat(c); e.currentTarget.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" }); }}>
            {t.cats[c]}
            <span className="num">{c === "all" ? IDEAS.length : IDEAS.filter((i) => i.cat === c).length}</span>
          </button>
        ))}
      </div>

      <div className="stack">
        {ideas.map((idea) => {
          const on = mine.includes(idea.id);
          const n = count(idea.id);
          return (
            <div className={`card row idea${on ? " on" : ""}`} key={idea.id}>
              <div className="title-row" style={{ alignItems: "flex-start" }}>
                <div style={{ minWidth: 0 }}>
                  <div className="h3">{lang === "he" ? idea.he : idea.en}</div>
                  <p className="meta" style={{ margin: "4px 0 0", color: "var(--text-2)", fontSize: 14, lineHeight: "20px" }}>
                    {lang === "he" ? idea.sumHe : idea.sumEn}
                  </p>
                </div>
                <button className="vote-btn" aria-pressed={on} disabled={busy} onClick={() => toggle(idea.id)}>
                  <svg viewBox="0 0 24 24" aria-hidden>
                    <path d={on ? "M5 12.5l4.5 4.5L19 7.5" : "M12 5v14M5 12h14"} />
                  </svg>
                  {on ? t.voted : t.vote}
                </button>
              </div>
              <div className="idea-bar">
                <div className="bar-track" style={{ flex: 1, marginTop: 0 }}>
                  <div className="bar-fill idea-fill" style={{ width: `${(n / max) * 100}%` }} />
                </div>
                <span className="meta num" style={{ minWidth: 56, textAlign: "end" }}>{t.votes(n)}</span>
              </div>
              <div className="title-row" style={{ marginTop: 10 }}>
                <span className="tag">{t.effort[idea.effort]}</span>
                <a className="meta" href={idea.url} target="_blank" rel="noopener noreferrer">
                  {t.readPlan} ↗
                </a>
              </div>
            </div>
          );
        })}
      </div>
      <p className="hint" style={{ textAlign: "center", marginTop: 24 }}>
        <a href="https://github.com/adamorad/kunz-training-hub/tree/main/docs/ideas" target="_blank" rel="noopener noreferrer">
          {t.helpBuild}
        </a>
      </p>
    </main>
  );
}
