import { cleanGuide, isTrainer } from "@/lib/sessions";
import { getGuide, getResponse, saveGuide } from "@/lib/store";
import { TOOLS } from "@/lib/training";

const known = (id: string) => TOOLS.some((t) => t.id === id);

export async function GET(_: Request, ctx: RouteContext<"/api/guides/[id]">) {
  const { id } = await ctx.params;
  if (!known(id)) return Response.json({ error: "unknown tool" }, { status: 404 });
  return Response.json((await getGuide(id)) ?? { checklist: [], safety: "", manual: "" }, { headers: { "cache-control": "no-store" } });
}

/** Trainers for the tool can edit its guide. Body: { id, token, guide }. */
export async function PUT(req: Request, ctx: RouteContext<"/api/guides/[id]">) {
  const { id: toolId } = await ctx.params;
  if (!known(toolId)) return Response.json({ error: "unknown tool" }, { status: 404 });
  const text = await req.text();
  if (text.length > 10000) return Response.json({ error: "too large" }, { status: 413 });
  let b: Record<string, unknown> = {};
  try {
    b = JSON.parse(text);
  } catch {}
  const me = typeof b.id === "string" && typeof b.token === "string" ? await getResponse(b.id, b.token) : null;
  if (!isTrainer(me, toolId)) return Response.json({ error: "trainer" }, { status: 403 });
  const g = { ...cleanGuide(b.guide), updatedBy: me!.handle, updatedAt: new Date().toISOString() };
  await saveGuide(toolId, g);
  return Response.json(g);
}
