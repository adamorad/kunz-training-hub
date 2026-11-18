import { clean } from "@/lib/training";
import { countResponses, getResponse, listResponses, saveResponse } from "@/lib/store";

/** Everyone's answers (no tokens). ?export=1 downloads them as JSON. With ?id=&token= returns your own. */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const [id, token] = [q.get("id"), q.get("token")];
  if (id && token) return Response.json(await getResponse(id, token), { headers: { "cache-control": "no-store" } });
  const all = await listResponses();
  return Response.json(all, {
    headers: {
      "cache-control": "no-store",
      ...(q.get("export") && { "content-disposition": `attachment; filename="kunz-training-${new Date().toISOString().slice(0, 10)}.json"` }),
    },
  });
}

export async function POST(req: Request) {
  const text = await req.text();
  if (text.length > 5000) return Response.json({ error: "too large" }, { status: 413 });
  let body: Record<string, unknown> | null = null;
  try {
    body = JSON.parse(text);
  } catch {}
  if (body?.website) return Response.json({ ok: true });
  const answer = clean(body?.answer);
  if (!answer) return Response.json({ error: "Please add your name or handle." }, { status: 400 });
  const id = typeof body?.id === "string" ? body.id : undefined;
  const token = typeof body?.token === "string" ? body.token : undefined;
  if (!id && (await countResponses()) >= 500) return Response.json({ error: "Too many answers right now." }, { status: 429 });
  return Response.json(await saveResponse(answer, id, token));
}
