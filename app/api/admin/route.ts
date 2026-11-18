import { isKeyholder } from "@/lib/auth";
import { deleteResponse, deleteSession, rollbackGuide, setVerified } from "@/lib/store";
import { TOOLS, type ToolId } from "@/lib/training";

/** Key-holder actions. Header x-keyholder: KEYHOLDER_CODE. Body: { action, ... }. */
export async function POST(req: Request) {
  if (!isKeyholder(req)) return Response.json({ error: "keyholder" }, { status: 401 });
  let b: Record<string, unknown> = {};
  try {
    b = JSON.parse(await req.text());
  } catch {}
  const id = typeof b.id === "string" ? b.id : "";
  switch (b.action) {
    case "check":
      return Response.json({ ok: true });
    case "verify": {
      const tools = (Array.isArray(b.tools) ? b.tools : []).filter((t): t is ToolId => TOOLS.some((x) => x.id === t));
      return Response.json({ ok: await setVerified(id, tools) });
    }
    case "deleteAnswer":
      await deleteResponse(id);
      return Response.json({ ok: true });
    case "deleteSession":
      await deleteSession(id);
      return Response.json({ ok: true });
    case "rollbackGuide":
      if (!TOOLS.some((t) => t.id === id)) return Response.json({ error: "invalid" }, { status: 400 });
      await rollbackGuide(id);
      return Response.json({ ok: true });
  }
  return Response.json({ error: "invalid" }, { status: 400 });
}
