import { canJoin, cleanSession, isTrainer, upcoming } from "@/lib/sessions";
import { member } from "@/lib/auth";
import { addSignup, countSessions, countSignups, createSession, deleteSession, getResponse, getSession, listSessions, removeSignup } from "@/lib/store";

/** Upcoming sessions with their signups. ?tool= narrows to one tool. */
export async function GET(req: Request) {
  const tool = new URL(req.url).searchParams.get("tool");
  const all = upcoming(await listSessions(), new Date()).filter((s) => !tool || s.toolId === tool);
  // Contacts only for members.
  const out = (await member(req)) ? all : all.map((s) => ({ ...s, trainer: { ...s.trainer, contact: "" }, signups: s.signups.map((x) => ({ ...x, contact: "" })) }));
  return Response.json(out, { headers: { "cache-control": "no-store" } });
}

const bad = (error: string, status = 400) => Response.json({ error }, { status });

/** { id, token, action: create | cancel | join | leave, ... } */
export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > 5000) return bad("too large", 413);
  let b: Record<string, unknown> = {};
  try {
    b = JSON.parse(text);
  } catch {}
  const me = typeof b.id === "string" && typeof b.token === "string" ? await getResponse(b.id, b.token) : null;
  if (!me) return bad("member", 401);
  const now = new Date();

  if (b.action === "create") {
    const s = cleanSession(b, now);
    if (!s) return bad("invalid");
    if (!isTrainer(me, s.toolId)) return bad("trainer", 403);
    if ((await countSessions()) >= 500) return bad("busy", 429);
    return Response.json(await createSession({ ...s, trainer: { id: me.id, handle: me.handle, contact: me.contact } }));
  }

  const session = typeof b.sessionId === "string" ? await getSession(b.sessionId) : null;
  if (!session) return bad("missing", 404);

  if (b.action === "cancel") {
    if (session.trainer.id !== me.id) return bad("trainer", 403);
    await deleteSession(session.id);
    return Response.json({ ok: true });
  }
  if (b.action === "join") {
    const why = canJoin(session, await countSignups(session.id), me.id, now);
    if (why) return bad(why, 409);
    await addSignup(session.id, { id: me.id, handle: me.handle, contact: me.contact, at: now.toISOString() });
    // Re-check after writing: the session may have been cancelled or filled meanwhile.
    if (!(await getSession(session.id)) || (await countSignups(session.id)) > session.seats) {
      await removeSignup(session.id, me.id);
      return bad("full", 409);
    }
    return Response.json({ ok: true });
  }
  if (b.action === "leave") {
    await removeSignup(session.id, me.id);
    return Response.json({ ok: true });
  }
  return bad("invalid");
}
