"use client";

import { useEffect, useState } from "react";
import { board, TOOLS, type Answer, type Level, type Person, type Response, type WillTrain } from "@/lib/training";

const KEY = "kunz-training";
const EMPTY: Answer = { handle: "", contact: "", willTrain: "maybe", tools: {}, other: "" };
const LEVELS: { lv: Level | null; label: string }[] = [
  { lv: null, label: "not for me" },
  { lv: "learn", label: "want to learn" },
  { lv: "use", label: "i'm trained" },
  { lv: "train", label: "i can train" },
];
const WILL: { v: WillTrain; label: string }[] = [
  { v: "yes", label: "yes" },
  { v: "maybe", label: "maybe" },
  { v: "no", label: "no, just using" },
];

type Creds = { id: string; token: string };
const loadCreds = (): Creds | null => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "null");
  } catch {
    return null;
  }
};

export default function Training() {
  const [a, setA] = useState<Answer>(EMPTY);
  const [all, setAll] = useState<Response[] | null>(null);
  const [creds, setCreds] = useState<Creds | null>(null);
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [err, setErr] = useState("");
  const [hp, setHp] = useState("");

  const refresh = () =>
    fetch("/api/responses")
      .then((r) => r.json())
      .then(setAll)
      .catch(() => setAll([]));

  useEffect(() => {
    refresh();
    const c = loadCreds();
    if (!c) return;
    setCreds(c);
    fetch(`/api/responses?id=${encodeURIComponent(c.id)}&token=${encodeURIComponent(c.token)}`)
      .then((r) => r.json())
      .then((r: Response | null) => r && setA({ handle: r.handle, contact: r.contact, willTrain: r.willTrain, tools: r.tools, other: r.other }))
      .catch(() => {});
  }, []);

  const setTool = (id: string, lv: Level | null) =>
    setA((p) => {
      const tools = { ...p.tools } as Record<string, Level>;
      if (lv) tools[id] = lv;
      else delete tools[id];
      return { ...p, tools };
    });

  const setWill = (v: WillTrain) =>
    setA((p) => ({
      ...p,
      willTrain: v,
      tools: v === "no" ? Object.fromEntries(Object.entries(p.tools).map(([k, l]) => [k, l === "train" ? "use" : l])) : p.tools,
    }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ answer: a, website: hp, ...creds }),
    }).catch(() => null);
    const data = res && (await res.json().catch(() => null));
    if (!res?.ok || !data?.id) {
      setErr(data?.error ?? "couldn't save, try again");
      setState("error");
      return;
    }
    const c = { id: data.id, token: data.token };
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {}
    setCreds(c);
    setState("saved");
    refresh();
  }

  const rows = all ? board(all) : [];
  const trainers = (all ?? []).filter((r) => r.willTrain !== "no");

  return (
    <>
      <h2>
        <b>§01</b> your answer {creds && <span>· editing yours</span>}
      </h2>
      <form className="card" onSubmit={submit}>
        <label className="field">
          <span>handle *</span>
          <input type="text" required maxLength={40} value={a.handle} onChange={(e) => setA({ ...a, handle: e.target.value })} />
        </label>
        <label className="field">
          <span>how to reach you (telegram @, optional, shown on the board)</span>
          <input type="text" maxLength={60} value={a.contact} onChange={(e) => setA({ ...a, contact: e.target.value })} />
        </label>
        <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={hp} onChange={(e) => setHp(e.target.value)} name="website" />

        <div className="field">
          <span className="dim" style={{ fontSize: 13 }}>would you train other members?</span>
          <div className="seg" role="group" style={{ marginTop: 6 }}>
            {WILL.map((w) => (
              <button type="button" key={w.v} aria-pressed={a.willTrain === w.v} onClick={() => setWill(w.v)}>
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 18 }}>
          <span className="dim" style={{ fontSize: 13 }}>tools that need training</span>
          {TOOLS.map((t) => (
            <div className="tool" key={t.id}>
              <div className="name">
                {t.name} <span className="dim">· {t.detail}</span>
              </div>
              <div className="seg" role="group" aria-label={t.name}>
                {LEVELS.map(({ lv, label }) => (
                  <button
                    type="button"
                    key={label}
                    data-lv={lv ?? "none"}
                    aria-pressed={(a.tools[t.id] ?? null) === lv}
                    disabled={lv === "train" && a.willTrain === "no"}
                    onClick={() => setTool(t.id, lv)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <label className="field" style={{ marginTop: 14 }}>
          <span>missing a tool that needs training? or something else you could teach</span>
          <textarea rows={3} maxLength={300} value={a.other} onChange={(e) => setA({ ...a, other: e.target.value })} />
        </label>

        <button className="submit" disabled={state === "saving"}>
          {state === "saving" ? "saving..." : creds ? "update my answer" : "send"}
        </button>
        {state === "saved" && <p className="note">saved. you can come back and edit from this device.</p>}
        {state === "error" && <p className="note" style={{ color: "var(--gap)" }}>{err}</p>}
      </form>

      <h2>
        <b>§02</b> the board {all && <span>· {all.length} answers</span>}
      </h2>
      {!all ? (
        <p className="dim">loading...</p>
      ) : (
        <div className="board">
          {rows.map((r) => (
            <div className="card row" key={r.tool.id}>
              <h3>
                {r.tool.name}
                {r.gap && <span className="flag">needs a trainer</span>}
              </h3>
              <Line label="can train" people={r.train} kind="train" />
              <Line label="trained" people={r.use} />
              <Line label="wants to learn" people={r.learn} kind="learn" />
            </div>
          ))}
          {trainers.length > 0 && (
            <div className="card row">
              <h3>willing to train</h3>
              <Line label="yes / maybe" people={trainers} kind="train" />
            </div>
          )}
          {all.some((r) => r.other) && (
            <div className="card row">
              <h3>also mentioned</h3>
              {all
                .filter((r) => r.other)
                .map((r) => (
                  <p key={r.id} style={{ fontSize: 13 }}>
                    <span className="dim">{r.handle}:</span> {r.other}
                  </p>
                ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function Line({ label, people, kind }: { label: string; people: Person[]; kind?: "train" | "learn" }) {
  return (
    <div className="line">
      <span>{label}</span>
      {people.length ? (
        <span className="chips">
          {people.map((p, i) => (
            <span className={`chip ${kind ?? ""}`} key={i} title={p.contact || undefined}>
              {p.handle}
              {p.contact && <span className="dim"> {p.contact}</span>}
            </span>
          ))}
        </span>
      ) : (
        <span className="dim">nobody yet</span>
      )}
    </div>
  );
}
