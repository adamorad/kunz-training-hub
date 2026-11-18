import "server-only";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { del, get, list, put } from "@vercel/blob";
import type { Answer, Response, ToolId } from "./training";
import type { Guide, Session, SessionView, Signup } from "./sessions";

type Stored = Response & { tokenHash: string };

const BASE = process.env.VERCEL_ENV === "production" ? "" : `${process.env.VERCEL_ENV ?? "local"}/`;
const ROOT = `${BASE}responses/`;
const ID_RE = /^[\w-]{36}$/;
const hash = (t: string) => createHash("sha256").update(t).digest("hex");
const strip = ({ tokenHash: _, ...r }: Stored): Response => r;

async function readJson<T>(pathname: string): Promise<T | null> {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text());
}
const read = (pathname: string) => readJson<Stored>(pathname);

const putJson = (pathname: string, data: unknown) =>
  put(pathname, JSON.stringify(data), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
const write = (r: Stored) => putJson(`${ROOT}${r.id}.json`, r);

export async function listResponses(): Promise<Response[]> {
  const { blobs } = await list({ prefix: ROOT, limit: 1000 });
  const all = await Promise.all(blobs.map((b) => read(b.pathname)));
  return all
    .filter((r): r is Stored => !!r)
    .map(strip)
    .sort((a, b) => a.handle.localeCompare(b.handle));
}

export const countResponses = async () => (await list({ prefix: ROOT, limit: 1000 })).blobs.length;

/** Creates a response, or updates it when id+token match. Returns the credentials to edit it later. */
export async function saveResponse(answer: Answer, id?: string, token?: string) {
  if (id && token && /^[\w-]{36}$/.test(id)) {
    const prev = await read(`${ROOT}${id}.json`);
    const a = Buffer.from(hash(token));
    if (prev && timingSafeEqual(a, Buffer.from(prev.tokenHash))) {
      // A key-holder's verification survives edits, but only for tools still marked "can train".
      const verified = (prev.verified ?? []).filter((t) => answer.tools[t] === "train");
      await write({ ...answer, id, updatedAt: new Date().toISOString(), tokenHash: prev.tokenHash, verified });
      return { id, token };
    }
  }
  const t = randomBytes(24).toString("base64url");
  const r: Stored = { ...answer, id: randomUUID(), updatedAt: new Date().toISOString(), tokenHash: hash(t), verified: [] };
  await write(r);
  return { id: r.id, token: t };
}

/** Key-holders only: set which tools this person is verified to train. */
export async function setVerified(id: string, tools: ToolId[]) {
  const r = ID_RE.test(id) ? await read(`${ROOT}${id}.json`) : null;
  if (!r) return false;
  await write({ ...r, verified: tools.filter((t) => r.tools[t] === "train") });
  return true;
}

export const deleteResponse = (id: string) => (ID_RE.test(id) ? del(`${ROOT}${id}.json`) : Promise.resolve());

export async function getResponse(id: string, token: string): Promise<Response | null> {
  if (!/^[\w-]{36}$/.test(id)) return null;
  const r = await read(`${ROOT}${id}.json`);
  return r && timingSafeEqual(Buffer.from(hash(token)), Buffer.from(r.tokenHash)) ? strip(r) : null;
}

// Sessions: sessions/<id>.json, with one file per signup at signups/<sessionId>/<responseId>.json.
const SESSIONS = `${BASE}sessions/`;
const SIGNUPS = `${BASE}signups/`;
const GUIDES = `${BASE}guides/`;
const ID = /^[\w-]{36}$/;

export async function listSessions(): Promise<SessionView[]> {
  const [{ blobs: ss }, { blobs: su }] = await Promise.all([list({ prefix: SESSIONS, limit: 1000 }), list({ prefix: SIGNUPS, limit: 1000 })]);
  const [sessions, signups] = await Promise.all([
    Promise.all(ss.map((b) => readJson<Session>(b.pathname))),
    Promise.all(su.map(async (b) => [b.pathname.slice(SIGNUPS.length).split("/")[0], await readJson<Signup>(b.pathname)] as const)),
  ]);
  return sessions
    .filter((s): s is Session => !!s)
    .map((s) => ({ ...s, signups: signups.filter(([sid, x]) => sid === s.id && x).map(([, x]) => x!).sort((a, b) => a.at.localeCompare(b.at)) }));
}

export const getSession = (id: string) => (ID.test(id) ? readJson<Session>(`${SESSIONS}${id}.json`) : Promise.resolve(null));

export async function createSession(s: Omit<Session, "id" | "createdAt">) {
  const session: Session = { ...s, id: randomUUID(), createdAt: new Date().toISOString() };
  await putJson(`${SESSIONS}${session.id}.json`, session);
  return session;
}

export async function deleteSession(id: string) {
  const { blobs } = await list({ prefix: `${SIGNUPS}${id}/`, limit: 1000 });
  if (blobs.length) await del(blobs.map((b) => b.pathname));
  await del(`${SESSIONS}${id}.json`);
}

export const countSignups = async (sessionId: string) => (await list({ prefix: `${SIGNUPS}${sessionId}/`, limit: 1000 })).blobs.length;
export const addSignup = (sessionId: string, s: Signup) => putJson(`${SIGNUPS}${sessionId}/${s.id}.json`, s);
export const removeSignup = (sessionId: string, responseId: string) => del(`${SIGNUPS}${sessionId}/${responseId}.json`);
export const countSessions = async () => (await list({ prefix: SESSIONS, limit: 1000 })).blobs.length;

// Guides keep every version (guides/<toolId>/<timestamp>.json) so a bad edit can be seen and rolled back.
export async function getGuide(toolId: string) {
  const { blobs } = await list({ prefix: `${GUIDES}${toolId}/`, limit: 1000 });
  const latest = blobs.map((b) => b.pathname).sort().at(-1);
  return latest ? readJson<Guide>(latest) : null;
}
export const saveGuide = (toolId: string, g: Guide) => putJson(`${GUIDES}${toolId}/${Date.now()}.json`, g);

/** Key-holders: undo the latest guide edit by deleting that version. */
export async function rollbackGuide(toolId: string) {
  const { blobs } = await list({ prefix: `${GUIDES}${toolId}/`, limit: 1000 });
  const latest = blobs.map((b) => b.pathname).sort().at(-1);
  if (latest) await del(latest);
}
