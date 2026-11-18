"use client";

import { useCallback, useEffect, useState } from "react";
import type { SessionView } from "@/lib/sessions";
import { TOOLS, type Response, type ToolId } from "@/lib/training";

/** Key-holders: verify trainers, remove answers and sessions, undo guide edits. English only. */
export default function Admin() {
  const [code, setCode] = useState("");
  const [ok, setOk] = useState(false);
  const [all, setAll] = useState<Response[]>([]);
  const [sessions, setSessions] = useState<SessionView[]>([]);
  const [note, setNote] = useState("");

  const call = useCallback(
    (body: object) => fetch("/api/admin", { method: "POST", headers: { "content-type": "application/json", "x-keyholder": code }, body: JSON.stringify(body) }),
    [code],
  );
  const load = useCallback(async () => {
    const h = { "x-keyholder": code };
    setAll(await (await fetch("/api/responses", { headers: h })).json());
    setSessions(await (await fetch("/api/sessions")).json());
  }, [code]);

  useEffect(() => {
    try {
      const c = sessionStorage.getItem("kunz-keyholder");
      if (c) setCode(c);
    } catch {}
  }, []);

  async function login(e?: React.FormEvent) {
    e?.preventDefault();
    const r = await call({ action: "check" });
    if (!r.ok) return setNote("Wrong code.");
    try {
      sessionStorage.setItem("kunz-keyholder", code);
    } catch {}
    setOk(true);
    setNote("");
    load();
  }

  async function run(body: object, done: string) {
    const r = await call(body);
    setNote(r.ok ? done : "Failed.");
    load();
  }

  if (!ok)
    return (
      <main>
        <h1>Key-holders</h1>
        <form className="card" onSubmit={login}>
          <label className="row field">
            <div className="field-label">Key-holder code</div>
            <input className="input" type="password" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="current-password" />
          </label>
          <div className="row">
            <button className="btn btn-primary">Open</button>
          </div>
        </form>
        {note && <p className="hint">{note}</p>}
      </main>
    );

  return (
    <main className="enter">
      <h1>Key-holders</h1>
      {note && <p className="hint">{note}</p>}

      <div className="section-label">Answers ({all.length}). Tick the tools each person is verified to train.</div>
      <div className="card">
        {all.map((r) => {
          const claims = TOOLS.filter((x) => r.tools[x.id] === "train");
          return (
            <div className="row" key={r.id}>
              <div className="title-row">
                <span>
                  <b>{r.handle}</b> <span className="meta">{r.contact}</span>
                </span>
                <button className="btn btn-ghost btn-danger" onClick={() => confirmed(`Delete ${r.handle}'s answer?`) && run({ action: "deleteAnswer", id: r.id }, "Answer deleted.")}>
                  Delete
                </button>
              </div>
              {claims.length ? (
                <div className="tags" style={{ marginTop: 8 }}>
                  {claims.map((x) => {
                    const on = !!r.verified?.includes(x.id);
                    const next = on ? (r.verified ?? []).filter((v) => v !== x.id) : [...(r.verified ?? []), x.id as ToolId];
                    return (
                      <button key={x.id} className={`tag ${on ? "train" : "muted"}`} style={{ border: 0, cursor: "pointer" }} onClick={() => run({ action: "verify", id: r.id, tools: next }, "Updated.")}>
                        {on ? "✓ " : ""}
                        {x.name}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="meta">No training claims</div>
              )}
              {r.other && <div className="meta" style={{ marginTop: 6 }}>{r.other}</div>}
            </div>
          );
        })}
      </div>

      <div className="section-label">Upcoming sessions</div>
      <div className="card">
        {sessions.length ? (
          sessions.map((s) => (
            <div className="row title-row" key={s.id}>
              <span>
                {s.toolId} · {new Date(s.when).toLocaleString("en-GB", { timeZone: "Asia/Jerusalem" })} · {s.trainer.handle} · {s.signups.length}/{s.seats}
              </span>
              <button className="btn btn-ghost btn-danger" onClick={() => confirmed("Delete this session?") && run({ action: "deleteSession", id: s.id }, "Session deleted.")}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <div className="row empty">None</div>
        )}
      </div>

      <div className="section-label">Guides: undo the latest edit</div>
      <div className="card">
        {TOOLS.map((x) => (
          <div className="row title-row" key={x.id}>
            <a href={`/tools/${x.id}`}>{x.name}</a>
            <button className="btn btn-ghost" onClick={() => confirmed(`Undo the latest ${x.name} guide edit?`) && run({ action: "rollbackGuide", id: x.id }, "Guide rolled back.")}>
              Undo last edit
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

// window.confirm is fine on a key-holder-only page.
const confirmed = (q: string) => window.confirm(q);
