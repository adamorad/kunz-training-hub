import "server-only";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { get, list, put } from "@vercel/blob";
import type { Answer, Response } from "./training";

type Stored = Response & { tokenHash: string };

const BASE = process.env.VERCEL_ENV === "production" ? "" : `${process.env.VERCEL_ENV ?? "local"}/`;
const ROOT = `${BASE}responses/`;
const hash = (t: string) => createHash("sha256").update(t).digest("hex");
const strip = ({ tokenHash: _, ...r }: Stored): Response => r;

async function read(pathname: string): Promise<Stored | null> {
  const res = await get(pathname, { access: "private", useCache: false });
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text());
}

const write = (r: Stored) =>
  put(`${ROOT}${r.id}.json`, JSON.stringify(r), {
    access: "private",
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });

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
      await write({ ...answer, id, updatedAt: new Date().toISOString(), tokenHash: prev.tokenHash });
      return { id, token };
    }
  }
  const t = randomBytes(24).toString("base64url");
  const r: Stored = { ...answer, id: randomUUID(), updatedAt: new Date().toISOString(), tokenHash: hash(t) };
  await write(r);
  return { id: r.id, token: t };
}

export async function getResponse(id: string, token: string): Promise<Response | null> {
  if (!/^[\w-]{36}$/.test(id)) return null;
  const r = await read(`${ROOT}${id}.json`);
  return r && timingSafeEqual(Buffer.from(hash(token)), Buffer.from(r.tokenHash)) ? strip(r) : null;
}
