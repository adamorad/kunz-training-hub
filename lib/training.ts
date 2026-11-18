/** Tools at Kunz that need training before use. Edit this list to add or remove tools. */
export const TOOLS = [
  { id: "laser", name: "Laser cutter", detail: "40W CO2", he: "חותך לייזר", detailHe: "CO2 40W" },
  { id: "resin", name: "Resin printer", detail: "Fumes, gloves, curing", he: "מדפסת שרף", detailHe: "אדים, כפפות, ייבוש" },
  { id: "fdm", name: "Filament printer", detail: "FDM", he: "מדפסת פילמנט", detailHe: "FDM" },
  { id: "solder", name: "Soldering", detail: "Iron, fumes, burns", he: "הלחמה", detailHe: "מלחם, אדים, כוויות" },
  { id: "hotair", name: "Hot air", detail: "Rework station", he: "אוויר חם", detailHe: "תחנת ריוורק" },
  { id: "scope", name: "Oscilloscope", detail: "The new one", he: "אוסצילוסקופ", detailHe: "החדש" },
] as const;

export type ToolId = (typeof TOOLS)[number]["id"];
/** learn = wants training, use = trained, train = can train others. */
export type Level = "learn" | "use" | "train";
export type WillTrain = "yes" | "maybe" | "no";

export type Answer = {
  handle: string;
  contact: string;
  willTrain: WillTrain;
  tools: Partial<Record<ToolId, Level>>;
  other: string;
};
/** verified: tools a key-holder confirmed this person can train. */
export type Response = Answer & { id: string; updatedAt: string; verified?: ToolId[] };

/** What people without member access see: no contact details. */
export const publicView = (r: Response): Response => ({ ...r, contact: "" });

const LEVELS: Level[] = ["learn", "use", "train"];
const WILL: WillTrain[] = ["yes", "maybe", "no"];
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Validates a submitted form. Returns null when it can't be stored. */
export function clean(body: unknown): Answer | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const handle = text(b.handle, 40);
  if (!handle) return null;
  const willTrain = WILL.includes(b.willTrain as WillTrain) ? (b.willTrain as WillTrain) : "no";
  const raw = b.tools && typeof b.tools === "object" ? (b.tools as Record<string, unknown>) : {};
  const tools: Answer["tools"] = {};
  for (const t of TOOLS) {
    const lv = raw[t.id] as Level;
    if (!LEVELS.includes(lv)) continue;
    tools[t.id] = lv === "train" && willTrain === "no" ? "use" : lv;
  }
  return { handle, contact: text(b.contact, 60), willTrain, tools, other: text(b.other, 300) };
}

export type Person = Pick<Response, "handle" | "contact">;
export type Row = { tool: (typeof TOOLS)[number]; train: Person[]; use: Person[]; learn: Person[]; gap: boolean };

/** Who can train, who is trained and who wants to learn, per tool. */
export function board(responses: Response[]): Row[] {
  return TOOLS.map((tool) => {
    const pick = (lv: Level) =>
      responses.filter((r) => r.tools[tool.id] === lv).map((r) => ({ handle: r.handle, contact: r.contact }));
    const train = pick("train");
    const learn = pick("learn");
    return { tool, train, use: pick("use"), learn, gap: learn.length > 0 && train.length === 0 };
  });
}

type Tool = (typeof TOOLS)[number];
export type Trainer = Person & { willTrain: WillTrain; tools: Tool[]; verified: ToolId[] };

/** Who can train what (most tools first), and who is willing but hasn't picked a tool. */
export function trainers(responses: Response[]) {
  const all = responses
    .filter((r) => r.willTrain !== "no")
    .map((r) => ({ handle: r.handle, contact: r.contact, willTrain: r.willTrain, tools: TOOLS.filter((t) => r.tools[t.id] === "train") as Tool[], verified: r.verified ?? [] }));
  return {
    can: all.filter((t) => t.tools.length).sort((a, b) => b.tools.length - a.tools.length),
    willing: all.filter((t) => !t.tools.length),
  };
}
