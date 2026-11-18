"use client";

import { useCallback, useEffect, useState } from "react";
import { isTrainer, type SessionView } from "@/lib/sessions";
import { TOOLS } from "@/lib/training";
import { api, toolName, usePrefs } from "./prefs";
import { Avatar, Sheet } from "./ui";

export function useSessions(tool?: string) {
  const { creds } = usePrefs();
  const [list, setList] = useState<SessionView[] | null>(null);
  const refresh = useCallback(() => {
    api(`/api/sessions${tool ? `?tool=${tool}` : ""}`, creds)
      .then((r) => r.json())
      .then(setList)
      .catch(() => setList([]));
  }, [creds, tool]);
  useEffect(refresh, [refresh]);
  return { list, refresh };
}

const fmt = (iso: string, lang: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(lang === "he" ? "he-IL" : "en-GB", { timeZone: "Asia/Jerusalem", ...opts }).format(new Date(iso));

export function SessionCard({ s, onChange, showTool = true }: { s: SessionView; onChange: () => void; showTool?: boolean }) {
  const { t, lang, creds, me, toast } = usePrefs();
  const [busy, setBusy] = useState(false);
  const mine = me?.id === s.trainer.id;
  const joined = !!me && s.signups.some((x) => x.id === me.id);
  const left = s.seats - s.signups.length;

  async function act(action: string, ok: string) {
    if (!creds) return toast(t.answerFirst);
    setBusy(true);
    const r = await api("/api/sessions", creds, { method: "POST", body: JSON.stringify({ ...creds, action, sessionId: s.id }) }).catch(() => null);
    const d = await r?.json().catch(() => null);
    setBusy(false);
    toast(r?.ok ? ok : (t.errors[d?.error] ?? t.saveErr));
    onChange();
  }

  return (
    <div className="row">
      <div className="person" style={{ alignItems: "flex-start" }}>
        <div className="date num">
          <span>{fmt(s.when, lang, { weekday: "short" })}</span>
          <b>{fmt(s.when, lang, { day: "numeric" })}</b>
          <span>{fmt(s.when, lang, { month: "short" })}</span>
        </div>
        <div className="who">
          <div style={{ fontWeight: 600 }}>{showTool ? toolName(s.toolId, lang) : fmt(s.when, lang, { weekday: "long" })}</div>
          <div className="meta num">
            {fmt(s.when, lang, { hour: "2-digit", minute: "2-digit", hour12: false })} · {t.by} {s.trainer.handle}
            {s.trainer.contact && <> <bdi>{s.trainer.contact}</bdi></>}
          </div>
          {s.note && <div dir="auto" className="meta" style={{ marginTop: 4, color: "var(--text-2)" }}>{s.note}</div>}
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(s.signups.length / s.seats) * 100}%` }} />
          </div>
          <div className="title-row" style={{ marginTop: 8 }}>
            <span className="meta num">{left > 0 ? t.seatsLeft(left, s.seats) : t.full}</span>
            {mine ? (
              <button className="btn btn-ghost btn-danger" disabled={busy} onClick={() => act("cancel", t.cancelled)}>
                {t.cancel}
              </button>
            ) : joined ? (
              <button className="btn btn-2" disabled={busy} onClick={() => act("leave", t.leftToast)}>
                {t.joined} · {t.leave}
              </button>
            ) : (
              <button className="btn btn-2" disabled={busy || left <= 0} onClick={() => act("join", t.joinedToast)}>
                {left > 0 ? t.join : t.full}
              </button>
            )}
          </div>
          {s.signups.length > 0 && (
            <div className="tags" style={{ marginTop: 10 }}>
              {s.signups.map((x) => (
                <span className="tag" key={x.id}>
                  {x.handle}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function NewSessionButton({ tool, onDone }: { tool?: string; onDone: () => void }) {
  const { t, me } = usePrefs();
  const [open, setOpen] = useState(false);
  const mine = TOOLS.filter((x) => isTrainer(me, x.id) && (!tool || x.id === tool));
  if (!mine.length) return null;
  return (
    <>
      <button className="btn btn-2" onClick={() => setOpen(true)}>
        + {t.newSession}
      </button>
      {open && <NewSessionSheet tools={mine.map((x) => x.id)} onClose={() => setOpen(false)} onDone={onDone} />}
    </>
  );
}

function NewSessionSheet({ tools, onClose, onDone }: { tools: string[]; onClose: () => void; onDone: () => void }) {
  const { t, lang, creds, toast } = usePrefs();
  const [toolId, setToolId] = useState(tools[0]);
  const [when, setWhen] = useState("");
  const [seats, setSeats] = useState(4);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api("/api/sessions", creds, { method: "POST", body: JSON.stringify({ ...creds, action: "create", toolId, when, seats, note }) }).catch(() => null);
    setBusy(false);
    if (!r?.ok) return toast(t.saveErr);
    toast(t.posted);
    onDone();
    onClose();
  }

  return (
    <Sheet title={t.postSession} onClose={onClose}>
      <form className="stack" onSubmit={submit}>
        {tools.length > 1 && (
          <label className="field boxed">
            <div className="field-label">{t.tool}</div>
            <select className="input" value={toolId} onChange={(e) => setToolId(e.target.value)}>
              {tools.map((id) => (
                <option key={id} value={id}>
                  {toolName(id, lang)}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="field boxed">
          <div className="field-label">{t.when}</div>
          <input className="input" type="datetime-local" required value={when} onChange={(e) => setWhen(e.target.value)} />
        </label>
        <label className="field boxed">
          <div className="field-label">{t.seats}</div>
          <input className="input num" type="number" min={1} max={12} required value={seats} onChange={(e) => setSeats(+e.target.value)} />
        </label>
        <label className="field boxed">
          <div className="field-label">{t.note}</div>
          <input className="input" maxLength={200} placeholder={t.notePh} value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? t.saving : t.post}
        </button>
      </form>
    </Sheet>
  );
}

export function PeopleList({ people, kind }: { people: { handle: string; contact: string }[]; kind: "train" | "use" | "learn" }) {
  const { t } = usePrefs();
  const label = { train: t.canTrain, use: t.trained, learn: t.wantsLearn }[kind];
  return (
    <>
      {people.map((p, i) => (
        <div className="row person" key={kind + i}>
          <Avatar handle={p.handle} />
          <div className="who">
            <div>{p.handle}</div>
            {p.contact && <div className="meta"><bdi>{p.contact}</bdi></div>}
          </div>
          <span className={`tag ${kind}`}>{label}</span>
        </div>
      ))}
    </>
  );
}
