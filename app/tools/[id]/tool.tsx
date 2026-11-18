"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { isTrainer, type Guide } from "@/lib/sessions";
import { board } from "@/lib/training";
import { useAnswers } from "../../hub";
import { api, toolDetail, toolName, usePrefs } from "../../prefs";
import { NewSessionButton, PeopleList, SessionCard, useSessions } from "../../sessions-ui";
import { Sheet } from "../../ui";

export default function ToolPage({ id }: { id: string }) {
  const { t, lang, me } = usePrefs();
  const { all } = useAnswers();
  const sessions = useSessions(id);
  const [guide, setGuide] = useState<Guide | null>(null);
  const [editing, setEditing] = useState(false);
  const loadGuide = useCallback(() => {
    fetch(`/api/guides/${id}`).then((r) => r.json()).then(setGuide).catch(() => {});
  }, [id]);
  useEffect(loadGuide, [loadGuide]);

  const row = all ? board(all).find((r) => r.tool.id === id) : null;
  const canEdit = isTrainer(me, id);
  const hasGuide = guide && (guide.checklist.length || guide.safety || guide.manual);

  return (
    <main className="enter">
      <Link href="/#tools" className="meta" style={{ textDecoration: "none" }}>
        {lang === "he" ? "→" : "←"} {t.back}
      </Link>
      <h1>{toolName(id, lang)}</h1>
      <p className="lede">{toolDetail(id, lang)}</p>
      {row && (
        <div className="stats num" style={{ marginBottom: 8 }}>
          <div className="stat"><b>{row.train.length}</b><span><i className="dot train" />{t.canTrain}</span></div>
          <div className="stat"><b>{row.use.length}</b><span><i className="dot use" />{t.trained}</span></div>
          <div className="stat"><b>{row.learn.length}</b><span><i className="dot learn" />{t.wantLearn}</span></div>
        </div>
      )}

      <div className="section-label">
        <span>{t.guide}</span>
        {canEdit && (
          <button className="btn btn-ghost" style={{ minHeight: 0, padding: 0, fontSize: 12 }} onClick={() => setEditing(true)}>
            {t.editGuide}
          </button>
        )}
      </div>
      <div className="card">
        {!guide ? (
          <div className="row empty">{t.loading}</div>
        ) : !hasGuide ? (
          <div className="row empty">{t.noGuide}</div>
        ) : (
          <>
            {guide.checklist.length > 0 && (
              <div className="row">
                <ol style={{ margin: 0, paddingInlineStart: 20, display: "grid", gap: 6 }}>
                  {guide.checklist.map((c, i) => <li key={i} dir="auto">{c}</li>)}
                </ol>
              </div>
            )}
            {guide.safety && (
              <div className="row">
                <div className="field-label" style={{ color: "var(--danger)" }}>{t.safety}</div>
                <div dir="auto" style={{ whiteSpace: "pre-wrap" }}>{guide.safety}</div>
              </div>
            )}
            {guide.manual && (
              <a className="row" href={guide.manual} target="_blank" rel="noopener noreferrer nofollow">
                {t.manual} ↗
              </a>
            )}
            {guide.updatedBy && guide.updatedAt && (
              <div className="row meta">{t.editedBy(guide.updatedBy, new Date(guide.updatedAt).toLocaleDateString(lang === "he" ? "he-IL" : "en-GB"))}</div>
            )}
          </>
        )}
      </div>

      <div className="section-label">
        <span>{t.sessionsFor}</span>
      </div>
      <div style={{ marginBottom: 12 }}>
        <NewSessionButton tool={id} onDone={sessions.refresh} />
      </div>
      <div className="card">
        {!sessions.list ? (
          <div className="row empty">{t.loading}</div>
        ) : sessions.list.length ? (
          sessions.list.map((s) => <SessionCard key={s.id} s={s} onChange={sessions.refresh} showTool={false} />)
        ) : (
          <div className="row empty">{t.noSessions}</div>
        )}
      </div>
      {row && row.learn.length > 0 && <p className="hint num">{t.waitingOn(row.learn.length)}</p>}

      <div className="section-label">{t.people}</div>
      <div className="card">
        {row && row.train.length + row.use.length + row.learn.length > 0 ? (
          <>
            <PeopleList people={row.train} kind="train" />
            <PeopleList people={row.use} kind="use" />
            <PeopleList people={row.learn} kind="learn" />
          </>
        ) : (
          <div className="row empty">{t.nobody}</div>
        )}
      </div>

      {editing && guide && <GuideSheet id={id} guide={guide} onClose={() => setEditing(false)} onSaved={loadGuide} />}
    </main>
  );
}

function GuideSheet({ id, guide, onClose, onSaved }: { id: string; guide: Guide; onClose: () => void; onSaved: () => void }) {
  const { t, creds, toast } = usePrefs();
  const [checklist, setChecklist] = useState(guide.checklist.join("\n"));
  const [safety, setSafety] = useState(guide.safety);
  const [manual, setManual] = useState(guide.manual);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const r = await api(`/api/guides/${id}`, creds, {
      method: "PUT",
      body: JSON.stringify({ ...creds, guide: { checklist: checklist.split("\n"), safety, manual } }),
    }).catch(() => null);
    setBusy(false);
    if (!r?.ok) return toast(t.saveErr);
    toast(t.savedToast);
    onSaved();
    onClose();
  }

  return (
    <Sheet title={t.editGuide} onClose={onClose}>
      <form className="stack" onSubmit={save}>
        <label className="field boxed">
          <div className="field-label">{t.guide}</div>
          <textarea className="input" rows={6} placeholder={t.checklistPh} value={checklist} onChange={(e) => setChecklist(e.target.value)} />
        </label>
        <label className="field boxed">
          <div className="field-label">{t.safety}</div>
          <textarea className="input" rows={3} maxLength={600} placeholder={t.safetyPh} value={safety} onChange={(e) => setSafety(e.target.value)} />
        </label>
        <label className="field boxed">
          <div className="field-label">{t.manual}</div>
          <input className="input" type="url" dir="ltr" placeholder={t.manualPh} value={manual} onChange={(e) => setManual(e.target.value)} />
        </label>
        <button className="btn btn-primary" disabled={busy}>
          {busy ? t.saving : t.save}
        </button>
      </form>
    </Sheet>
  );
}
