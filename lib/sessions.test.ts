import { describe, expect, it } from "vitest";
import { canJoin, cleanGuide, cleanSession, isTrainer, upcoming } from "./sessions";

const now = new Date("2026-11-20T10:00:00Z");
const r = (tools: Record<string, string>, verified: string[] = ["laser", "resin"]) =>
  ({ id: "r1", handle: "noa", contact: "", willTrain: "yes", tools, other: "", updatedAt: "", verified }) as never;

describe("isTrainer", () => {
  it("needs both the claim and a key-holder's verification for that tool", () => {
    expect(isTrainer(r({ laser: "train" }), "laser")).toBe(true);
    expect(isTrainer(r({ laser: "train" }, []), "laser")).toBe(false);
    expect(isTrainer(r({ laser: "use" }), "laser")).toBe(false);
    expect(isTrainer(r({ laser: "train" }), "resin")).toBe(false);
    expect(isTrainer(null, "laser")).toBe(false);
  });
});

describe("cleanSession", () => {
  it("accepts a future session and caps seats and note", () => {
    const s = cleanSession({ toolId: "laser", when: "2026-11-26T20:00", seats: 40, note: " bring glasses " + "x".repeat(300) }, now);
    expect(s?.toolId).toBe("laser");
    expect(s?.seats).toBe(12);
    expect(s?.note.startsWith("bring glasses")).toBe(true);
    expect(s?.note.length).toBe(200);
  });

  it("reads a time without zone as Israel time", () => {
    expect(cleanSession({ toolId: "laser", when: "2026-11-26T20:00", seats: 3 }, now)?.when).toBe("2026-11-26T18:00:00.000Z");
  });

  it("rejects unknown tools, past or far-future times, and bad seats", () => {
    expect(cleanSession({ toolId: "nuke", when: "2026-11-26T20:00", seats: 3 }, now)).toBeNull();
    expect(cleanSession({ toolId: "laser", when: "2026-11-19T20:00", seats: 3 }, now)).toBeNull();
    expect(cleanSession({ toolId: "laser", when: "2027-12-01T20:00", seats: 3 }, now)).toBeNull();
    expect(cleanSession({ toolId: "laser", when: "soon", seats: 3 }, now)).toBeNull();
    expect(cleanSession({ toolId: "laser", when: "2026-11-26T20:00", seats: 0 }, now)).toBeNull();
  });
});

describe("upcoming", () => {
  it("keeps sessions from 2 hours ago on, soonest first", () => {
    const s = (id: string, when: string) => ({ id, when }) as never;
    const out = upcoming([s("late", "2026-11-25T10:00:00Z"), s("old", "2026-11-20T07:00:00Z"), s("now", "2026-11-20T08:30:00Z")], now);
    expect(out.map((x: { id: string }) => x.id)).toEqual(["now", "late"]);
  });
});

describe("canJoin", () => {
  const session = { id: "s1", toolId: "laser", when: "2026-11-26T18:00:00.000Z", seats: 2, trainer: { id: "t1", handle: "noa", contact: "" } } as never;
  it("allows a free seat", () => expect(canJoin(session, 1, "r2", now)).toBeNull());
  it("refuses a full session", () => expect(canJoin(session, 2, "r2", now)).toBe("full"));
  it("refuses the trainer", () => expect(canJoin(session, 0, "t1", now)).toBe("own"));
  it("refuses a past session", () => expect(canJoin(session, 0, "r2", new Date("2026-11-27T00:00:00Z"))).toBe("past"));
});

describe("cleanGuide", () => {
  it("keeps non-empty checklist lines, caps them, and only allows http links", () => {
    const g = cleanGuide({ checklist: ["  focus the lens ", "", 5, ...Array(20).fill("x")], safety: " never leave it running ", manual: "javascript:alert(1)" });
    expect(g.checklist[0]).toBe("focus the lens");
    expect(g.checklist.length).toBe(12);
    expect(g.safety).toBe("never leave it running");
    expect(g.manual).toBe("");
    expect(cleanGuide({ manual: "https://example.com/manual.pdf" }).manual).toBe("https://example.com/manual.pdf");
  });
});
