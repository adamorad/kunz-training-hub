import { member } from "@/lib/auth";
import { cleanVotes, tally } from "@/lib/ideas";
import { listBallots, saveBallot } from "@/lib/store";

/** Vote counts (public) and, for members, their own ballot. */
export async function GET(req: Request) {
  const [me, ballots] = await Promise.all([member(req), listBallots()]);
  const rows = tally(ballots.map((b) => b.ideas)).map((r) => ({ id: r.idea.id, votes: r.votes }));
  const mine = me ? (ballots.find((b) => b.id === me.id)?.ideas ?? []) : null;
  return Response.json({ rows, voters: ballots.length, mine }, { headers: { "cache-control": "no-store" } });
}

/** Members replace their ballot: { ideas: string[] } (up to MAX_VOTES). */
export async function POST(req: Request) {
  const me = await member(req);
  if (!me) return Response.json({ error: "member" }, { status: 401 });
  const text = await req.text();
  if (text.length > 2000) return Response.json({ error: "too large" }, { status: 413 });
  let b: Record<string, unknown> = {};
  try {
    b = JSON.parse(text);
  } catch {}
  const ideas = cleanVotes(b.ideas);
  await saveBallot(me.id, ideas);
  return Response.json({ ideas });
}
