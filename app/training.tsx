"use client";

import { useEffect, useState } from "react";
import { board, TOOLS, type Answer, type Level, type Person, type Response, type WillTrain } from "@/lib/training";

const KEY = "kunz-training";
const EMPTY: Answer = { handle: "", contact: "", willTrain: "maybe", tools: {}, other: "" };
const LEVELS: { lv: Level | null; label: string }[] = [
  { lv: null, label: "No" },
  { lv: "learn", label: "Learn" },
  { lv: "use", label: "Trained" },
  { lv: "train", label: "Can train" },
];
const WILL: { v: WillTrain; label: string }[] = [
  { v: "yes", label: "Yes" },
  { v: "maybe", label: "Maybe" },
  { v: "no", label: "No" },
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
      setErr(data?.error ?? "Couldn't save. Try again.");
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
        <span>About you</span>
        {creds && <span>Editing your answer</span>}
      </h2>
      <form onSubmit={submit}>
        <div className="group">
          <label className="cell" style={{ display: "block" }}>
            <div className="label">Name or handle</div>
            <input className="input" required maxLength={40} placeholder="Required" value={a.handle} onChange={(e) => setA({ ...a, handle: e.target.value })} />
          </label>
          <label className="cell" style={{ display: "block" }}>
            <div className="label">Telegram</div>
            <input className="input" maxLength={60} placeholder="@handle, optional" value={a.contact} onChange={(e) => setA({ ...a, contact: e.target.value })} />
          </label>
        </div>
        <p className="foot">Your name and Telegram are shown on the board so people can find you.</p>
        <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={hp} onChange={(e) => setHp(e.target.value)} name="website" />

        <h2>Would you train other members?</h2>
        <div className="group">
          <div className="cell">
            <div className="seg" role="group" aria-label="Would you train other members?">
              {WILL.map((w) => (
                <button type="button" key={w.v} aria-pressed={a.willTrain === w.v} onClick={() => setWill(w.v)}>
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <h2>Tools that need training</h2>
        <div className="group">
          {TOOLS.map((t) => (
            <div className="cell" key={t.id}>
              <div className="tool-head">
                <span className="tool-name">{t.name}</span>
                <span className="tool-detail">{t.detail}</span>
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

        <h2>Anything else</h2>
        <div className="group">
          <label className="cell" style={{ display: "block" }}>
            <textarea className="input" rows={3} maxLength={300} placeholder="A tool we missed, or something else you could teach" value={a.other} onChange={(e) => setA({ ...a, other: e.target.value })} />
          </label>
        </div>

        <button className="submit" disabled={state === "saving"}>
          {state === "saving" ? "Saving..." : creds ? "Update my answer" : "Send"}
        </button>
        {state === "saved" && <p className="note">Saved. You can edit it later from this device.</p>}
        {state === "error" && <p className="note err">{err}</p>}
      </form>

      <h2 className="big">The board</h2>
      <p className="sub">{all ? `${all.length} ${all.length === 1 ? "answer" : "answers"} so far` : "Loading..."}</p>
      {all && (
        <div className="board">
          {rows.map((r) => (
            <div className="group" key={r.tool.id}>
              <div className="cell">
                <div className="card-title">
                  <h3>{r.tool.name}</h3>
                  {r.gap ? <span className="badge gap">Needs a trainer</span> : r.train.length > 0 && <span className="badge ok">Has a trainer</span>}
                </div>
                <div className="stats">
                  <div className="stat train"><b>{r.train.length}</b><span>Can train</span></div>
                  <div className="stat use"><b>{r.use.length}</b><span>Trained</span></div>
                  <div className="stat learn"><b>{r.learn.length}</b><span>Want to learn</span></div>
                </div>
              </div>
              {r.train.length + r.use.length + r.learn.length > 0 && (
                <div className="cell people">
                  {r.train.map((p, i) => <PersonRow key={`t${i}`} p={p} role="train" />)}
                  {r.use.map((p, i) => <PersonRow key={`u${i}`} p={p} role="use" />)}
                  {r.learn.map((p, i) => <PersonRow key={`l${i}`} p={p} role="learn" />)}
                </div>
              )}
            </div>
          ))}
          {trainers.length > 0 && (
            <div className="group">
              <div className="cell"><div className="card-title"><h3>Willing to train</h3></div></div>
              <div className="cell people">
                {trainers.map((p) => <PersonRow key={p.id} p={p} label={p.willTrain === "yes" ? "Yes" : "Maybe"} role="train" />)}
              </div>
            </div>
          )}
          {all.some((r) => r.other) && (
            <div className="group">
              <div className="cell"><div className="card-title"><h3>Also mentioned</h3></div></div>
              {all.filter((r) => r.other).map((r) => (
                <div className="cell" key={r.id}>
                  <div className="label">{r.handle}</div>
                  {r.other}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

const ROLE = { train: "Can train", use: "Trained", learn: "Wants to learn" } as const;
const HUES = ["#ff9500", "#ff2d55", "#5856d6", "#34c759", "#007aff", "#af52de", "#5ac8fa", "#ffcc00"];
const hue = (s: string) => HUES[[...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % HUES.length];

function PersonRow({ p, role, label }: { p: Person; role: Level; label?: string }) {
  return (
    <div className="person">
      <span className="avatar" style={{ background: hue(p.handle) }}>{p.handle.slice(0, 1).toUpperCase()}</span>
      <span className="who">
        <div>{p.handle}</div>
        {p.contact && <div className="contact">{p.contact}</div>}
      </span>
      <span className={`role ${role}`}>{label ?? ROLE[role]}</span>
    </div>
  );
}
