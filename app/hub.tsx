"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { board, trainers, TOOLS, type Answer, type Level, type Response, type WillTrain } from "@/lib/training";
import { api, toolDetail, toolName, usePrefs } from "./prefs";
import { NewSessionButton, SessionCard, useSessions } from "./sessions-ui";
import { Avatar, IconSessions, IconTools, IconTrainers, IconYou, Seg } from "./ui";

const TABS = ["you", "sessions", "trainers", "tools"] as const;
type Tab = (typeof TABS)[number];

export function useAnswers() {
  const { creds } = usePrefs();
  const [all, setAll] = useState<Response[] | null>(null);
  const refresh = useCallback(() => {
    api("/api/responses", creds)
      .then((r) => r.json())
      .then(setAll)
      .catch(() => setAll([]));
  }, [creds]);
  useEffect(refresh, [refresh]);
  return { all, refresh };
}

export default function Hub() {
  const { t, creds } = usePrefs();
  const [tab, setTabS] = useState<Tab>("you");
  const answers = useAnswers();
  const sessions = useSessions();

  useEffect(() => {
    const h = location.hash.slice(1) as Tab;
    if (TABS.includes(h)) setTabS(h);
    else if (localStorage.getItem("kunz-training")) setTabS("sessions");
  }, []);
  const setTab = (x: Tab) => {
    setTabS(x);
    history.replaceState(null, "", `#${x}`);
    scrollTo({ top: 0, behavior: "smooth" });
  };

  const labels = { you: t.tabMe, sessions: t.tabSessions, trainers: t.tabTrainers, tools: t.tabTools };
  const icons = { you: <IconYou />, sessions: <IconSessions />, trainers: <IconTrainers />, tools: <IconTools /> };
  const i = TABS.indexOf(tab);

  return (
    <>
      <main key={tab}>
        {tab === "you" && <You onSaved={() => { answers.refresh(); setTab("sessions"); }} />}
        {tab === "sessions" && <Sessions {...sessions} />}
        {tab === "trainers" && <Trainers all={answers.all} />}
        {tab === "tools" && <Tools all={answers.all} sessions={sessions.list} />}
        <footer>
          {t.footer} <a href="https://github.com/adamorad/kunz-training-hub">{t.source}</a>
          {creds && (
            <>
              {" · "}
              <a href="/api/responses?export=1">{t.download}</a>
            </>
          )}
        </footer>
      </main>
      <nav className="tabs" aria-label="Sections">
        <div className="tabs-inner">
          <span className="tab-pip" style={{ insetInlineStart: `${i * 25}%` }} />
          {TABS.map((x) => (
            <button key={x} className="tab" aria-current={tab === x ? "page" : undefined} onClick={() => setTab(x)}>
              {icons[x]}
              {labels[x]}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

/* ---------- You: the form ---------- */

const EMPTY: Answer = { handle: "", contact: "", willTrain: "maybe", tools: {}, other: "" };

function You({ onSaved }: { onSaved: () => void }) {
  const { t, lang, creds, setCreds, me, refreshMe, code, setCode, toast } = usePrefs();
  const [a, setA] = useState<Answer>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [hp, setHp] = useState("");

  useEffect(() => {
    if (me) setA({ handle: me.handle, contact: me.contact, willTrain: me.willTrain, tools: me.tools, other: me.other });
  }, [me]);

  const setTool = (id: string, lv: Level | null) =>
    setA((p) => {
      const tools = { ...p.tools } as Record<string, Level>;
      if (lv) tools[id] = lv;
      else delete tools[id];
      return { ...p, tools };
    });
  const setWill = (v: WillTrain) =>
    setA((p) => ({ ...p, willTrain: v, tools: v === "no" ? Object.fromEntries(Object.entries(p.tools).map(([k, l]) => [k, l === "train" ? "use" : l])) : p.tools }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await api("/api/responses", null, { method: "POST", body: JSON.stringify({ answer: a, website: hp, code, ...(me && creds) }) }).catch(() => null);
    const d = r && (await r.json().catch(() => null));
    setBusy(false);
    if (!r?.ok || !d?.id) return setErr(d?.error === "code" ? t.codeErr : t.saveErr);
    setCreds({ id: d.id, token: d.token });
    refreshMe();
    toast(t.savedToast);
    onSaved();
  }

  const unverified = me && TOOLS.some((x) => me.tools[x.id] === "train" && !me.verified?.includes(x.id));

  return (
    <div className="enter">
      <h1>{t.title}</h1>
      <p className="lede">{t.lede}</p>
      <form onSubmit={submit}>
        {!me && (
          <>
            <div className="card" style={{ marginTop: 24 }}>
              <label className="row field">
                <div className="field-label">{t.code}</div>
                <input className="input" required autoCapitalize="off" autoComplete="off" placeholder={t.codePh} value={code} onChange={(e) => setCode(e.target.value)} />
              </label>
            </div>
            <p className="hint">{t.codeNote}</p>
          </>
        )}

        <div className="section-label">
          <span>{t.aboutYou}</span>
          {me && <span>{t.editing}</span>}
        </div>
        <div className="card">
          <label className="row field">
            <div className="field-label">{t.handle}</div>
            <input className="input" required maxLength={40} placeholder={t.handlePh} value={a.handle} onChange={(e) => setA({ ...a, handle: e.target.value })} />
          </label>
          <label className="row field">
            <div className="field-label">{t.telegram}</div>
            <input className="input" dir="ltr" maxLength={60} placeholder={t.telegramPh} value={a.contact} onChange={(e) => setA({ ...a, contact: e.target.value })} />
          </label>
        </div>
        <p className="hint">{t.memberOnly}</p>
        <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden value={hp} onChange={(e) => setHp(e.target.value)} name="website" />

        <div className="section-label">{t.willTrainQ}</div>
        <div className="card">
          <div className="row">
            <Seg label={t.willTrainQ} value={a.willTrain} onChange={setWill} options={[{ v: "yes", label: t.yes }, { v: "maybe", label: t.maybe }, { v: "no", label: t.no }]} />
          </div>
        </div>

        <div className="section-label">{t.toolsQ}</div>
        <div className="card">
          {TOOLS.map((x) => (
            <div className="row" key={x.id}>
              <div className="title-row" style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 600 }}>
                  {toolName(x.id, lang)}
                  {me?.verified?.includes(x.id) && <span className="tag train" style={{ marginInlineStart: 8 }}>{t.verified}</span>}
                </span>
                <span className="meta">{toolDetail(x.id, lang)}</span>
              </div>
              <Seg<Level | null>
                label={toolName(x.id, lang)}
                value={a.tools[x.id] ?? null}
                onChange={(v) => setTool(x.id, v)}
                options={[
                  { v: null, label: t.lvNo },
                  { v: "learn", label: t.lvLearn, lv: "learn" },
                  { v: "use", label: t.lvUse, lv: "use" },
                  { v: "train", label: t.lvTrain, lv: "train", disabled: a.willTrain === "no" },
                ]}
              />
            </div>
          ))}
        </div>
        {unverified && <p className="hint">{t.unverifiedNote}</p>}

        <div className="section-label">{t.anything}</div>
        <div className="card">
          <label className="row field">
            <textarea className="input" rows={3} maxLength={300} placeholder={t.anythingPh} value={a.other} onChange={(e) => setA({ ...a, other: e.target.value })} />
          </label>
        </div>

        <div style={{ marginTop: 24 }}>
          <button className="btn btn-primary" disabled={busy}>
            {busy ? t.saving : me ? t.update : t.send}
          </button>
          {err && <p className="hint" style={{ color: "var(--danger)", textAlign: "center" }}>{err}</p>}
        </div>
      </form>
    </div>
  );
}

/* ---------- Sessions ---------- */

function Sessions({ list, refresh }: ReturnType<typeof useSessions>) {
  const { t, creds } = usePrefs();
  return (
    <div className="enter">
      <div className="title-row">
        <h1>{t.upcoming}</h1>
      </div>
      <div style={{ margin: "8px 0 16px" }}>
        <NewSessionButton onDone={refresh} />
      </div>
      {!list ? (
        <p className="empty">{t.loading}</p>
      ) : list.length ? (
        <div className="card">
          {list.map((s) => (
            <SessionCard key={s.id} s={s} onChange={refresh} />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="row empty">{t.noSessions}</div>
        </div>
      )}
      {!creds && <p className="hint">{t.answerFirst}</p>}
    </div>
  );
}

/* ---------- Trainers ---------- */

function Trainers({ all }: { all: Response[] | null }) {
  const { t, lang } = usePrefs();
  if (!all) return <p className="empty">{t.loading}</p>;
  const tr = trainers(all);
  const gaps = board(all).filter((r) => r.gap);
  return (
    <div className="enter">
      <h1>{t.vTrainers}</h1>
      <p className="lede num">{t.answers(all.length)}</p>
      <div className="card">
        {tr.can.length ? (
          tr.can.map((p, i) => (
            <div className="row person" key={i} style={{ alignItems: "flex-start" }}>
              <Avatar handle={p.handle} />
              <div className="who">
                <div>
                  {p.handle} {p.contact && <bdi className="meta">{p.contact}</bdi>}
                </div>
                <div className="tags" style={{ marginTop: 6 }}>
                  {p.tools.map((x) => {
                    const ok = p.verified.includes(x.id);
                    return (
                      <Link href={`/tools/${x.id}`} key={x.id} className={`tag ${ok ? "train" : "muted"}`} title={ok ? t.verified : t.unverified} style={{ textDecoration: "none" }}>
                        {toolName(x.id, lang)}
                        {!ok && " ?"}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="row empty">{t.noTrainers}</div>
        )}
      </div>
      <p className="hint">
        <span className="tag train">{t.verified}</span> <span className="tag muted">{t.unverified} ?</span>
      </p>

      {tr.willing.length > 0 && (
        <>
          <div className="section-label">{t.willingNoTool}</div>
          <div className="card">
            {tr.willing.map((p, i) => (
              <div className="row person" key={i}>
                <Avatar handle={p.handle} />
                <div className="who">
                  <div>{p.handle}</div>
                  {p.contact && <div className="meta"><bdi>{p.contact}</bdi></div>}
                </div>
                <span className="tag">{p.willTrain === "yes" ? t.yes : t.maybe}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {gaps.length > 0 && (
        <>
          <div className="section-label">{t.needsTrainer}</div>
          <div className="card">
            {gaps.map((r) => (
              <Link href={`/tools/${r.tool.id}`} className="row title-row" key={r.tool.id}>
                <span>{toolName(r.tool.id, lang)}</span>
                <span className="tag learn num">{t.waiting(r.learn.length)}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Tools ---------- */

function Tools({ all, sessions }: { all: Response[] | null; sessions: ReturnType<typeof useSessions>["list"] }) {
  const { t, lang } = usePrefs();
  if (!all) return <p className="empty">{t.loading}</p>;
  const rows = board(all);
  return (
    <div className="enter">
      <h1>{t.tabTools}</h1>
      <p className="lede">{t.toolsQ}</p>
      <div className="stack">
        {rows.map((r) => {
          const next = sessions?.find((s) => s.toolId === r.tool.id);
          return (
            <Link href={`/tools/${r.tool.id}`} className="card row" key={r.tool.id} style={{ display: "block", textDecoration: "none" }}>
              <div className="title-row">
                <span className="h3">{toolName(r.tool.id, lang)}</span>
                {r.gap ? <span className="tag learn">{t.needsTrainer}</span> : r.train.length > 0 && <span className="tag train">{t.hasTrainer}</span>}
              </div>
              <div className="meta">{toolDetail(r.tool.id, lang)}</div>
              <div className="stats num">
                <div className="stat"><b>{r.train.length}</b><span><i className="dot train" />{t.canTrain}</span></div>
                <div className="stat"><b>{r.use.length}</b><span><i className="dot use" />{t.trained}</span></div>
                <div className="stat"><b>{r.learn.length}</b><span><i className="dot learn" />{t.wantLearn}</span></div>
              </div>
              {next && (
                <div className="meta" style={{ marginTop: 12 }}>
                  <IconSessionsSmall /> {new Intl.DateTimeFormat(lang === "he" ? "he-IL" : "en-GB", { timeZone: "Asia/Jerusalem", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(next.when))}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const IconSessionsSmall = () => (
  <span style={{ display: "inline-block", width: 14, height: 14, verticalAlign: "-2px" }}>
    <IconSessions />
  </span>
);
