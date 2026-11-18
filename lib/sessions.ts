import { TOOLS, type Response, type ToolId } from "./training";

export type Session = {
  id: string;
  toolId: ToolId;
  when: string; // ISO, UTC
  seats: number;
  note: string;
  trainer: { id: string; handle: string; contact: string };
  createdAt: string;
};
export type Signup = { id: string; handle: string; contact: string; at: string };
export type SessionView = Session & { signups: Signup[] };
export type Guide = { checklist: string[]; safety: string; manual: string; updatedBy?: string; updatedAt?: string };

const DAY = 86_400_000;
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Can run sessions and edit the guide: claimed "can train" and a key-holder verified it. */
export const isTrainer = (r: Response | null, toolId: string) =>
  !!r && r.tools[toolId as ToolId] === "train" && !!r.verified?.includes(toolId as ToolId);

/** Minutes east of UTC for Israel at a given instant (120 in winter, 180 in summer). */
function israelOffset(t: number) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(t))
      .map((x) => [x.type, x.value]),
  );
  return (Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - Math.floor(t / 60000) * 60000) / 60000;
}

/** "2026-11-26T20:00" in Israel time to a UTC timestamp, or NaN. */
export function fromIsraelTime(local: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!m) return NaN;
  const naive = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  const first = naive - israelOffset(naive) * 60000;
  return naive - israelOffset(first) * 60000;
}

/** Validates a new session. Returns null when it can't be stored. */
export function cleanSession(body: unknown, now: Date) {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const tool = TOOLS.find((t) => t.id === b.toolId);
  const t = typeof b.when === "string" ? fromIsraelTime(b.when) : NaN;
  const seats = Math.min(12, Math.floor(Number(b.seats)));
  if (!tool || !Number.isFinite(t) || t < now.getTime() || t > now.getTime() + 180 * DAY || !(seats >= 1)) return null;
  return { toolId: tool.id as ToolId, when: new Date(t).toISOString(), seats, note: text(b.note, 200) };
}

/** Sessions from 2 hours ago on, soonest first. */
export const upcoming = <T extends Pick<Session, "when">>(sessions: T[], now: Date) =>
  sessions.filter((s) => Date.parse(s.when) >= now.getTime() - 2 * 3600_000).sort((a, b) => Date.parse(a.when) - Date.parse(b.when));

/** Why someone can't join, or null when they can. */
export function canJoin(s: Session, taken: number, responseId: string, now: Date): "past" | "own" | "full" | null {
  if (Date.parse(s.when) < now.getTime()) return "past";
  if (s.trainer.id === responseId) return "own";
  if (taken >= s.seats) return "full";
  return null;
}

export function cleanGuide(body: unknown): Guide {
  const b = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const list = Array.isArray(b.checklist) ? b.checklist : [];
  const manual = text(b.manual, 300);
  return {
    checklist: list.map((x) => text(x, 120)).filter(Boolean).slice(0, 12),
    safety: text(b.safety, 600),
    manual: /^https?:\/\/\S+$/i.test(manual) ? manual : "",
  };
}
