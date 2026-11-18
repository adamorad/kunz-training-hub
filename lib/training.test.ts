import { describe, expect, it } from "vitest";
import { board, clean, trainers, TOOLS } from "./training";

describe("clean", () => {
  it("keeps a valid answer and trims text", () => {
    const r = clean({ handle: "  noa ", contact: "@noa", willTrain: "yes", tools: { laser: "train", resin: "learn" }, other: " lathe " });
    expect(r).toEqual({ handle: "noa", contact: "@noa", willTrain: "yes", tools: { laser: "train", resin: "learn" }, other: "lathe" });
  });

  it("rejects a missing handle", () => {
    expect(clean({ handle: " ", willTrain: "yes", tools: {} })).toBeNull();
  });

  it("drops unknown tools and levels, and 'none'", () => {
    const r = clean({ handle: "x", willTrain: "maybe", tools: { laser: "god", nuke: "train", resin: "none", fdm: "use" } });
    expect(r?.tools).toEqual({ fdm: "use" });
  });

  it("defaults willTrain to no and caps lengths", () => {
    const r = clean({ handle: "a".repeat(100), tools: {}, other: "b".repeat(1000) });
    expect(r?.willTrain).toBe("no");
    expect(r?.handle.length).toBe(40);
    expect(r?.other.length).toBe(300);
  });

  it("does not count 'train' on a tool when the person won't train", () => {
    const r = clean({ handle: "x", willTrain: "no", tools: { laser: "train" } });
    expect(r?.tools).toEqual({ laser: "use" });
  });
});

describe("board", () => {
  const a = { id: "1", handle: "noa", contact: "@noa", willTrain: "yes" as const, tools: { laser: "train" as const }, other: "", updatedAt: "" };
  const b = { id: "2", handle: "eitan", contact: "", willTrain: "no" as const, tools: { laser: "use" as const, resin: "learn" as const }, other: "", updatedAt: "" };
  const c = { id: "3", handle: "dana", contact: "", willTrain: "maybe" as const, tools: { laser: "learn" as const }, other: "", updatedAt: "" };

  it("groups people per tool in TOOLS order", () => {
    const rows = board([a, b, c]);
    expect(rows.map((r) => r.tool.id)).toEqual(TOOLS.map((t) => t.id));
    const laser = rows.find((r) => r.tool.id === "laser")!;
    expect(laser.train.map((p) => p.handle)).toEqual(["noa"]);
    expect(laser.use.map((p) => p.handle)).toEqual(["eitan"]);
    expect(laser.learn.map((p) => p.handle)).toEqual(["dana"]);
  });

  it("flags tools where people want to learn but nobody trains", () => {
    const resin = board([a, b, c]).find((r) => r.tool.id === "resin")!;
    expect(resin.gap).toBe(true);
    expect(board([a, b, c]).find((r) => r.tool.id === "laser")!.gap).toBe(false);
  });
});

describe("trainers", () => {
  const base = { contact: "", other: "", updatedAt: "" };
  const rs = [
    { ...base, id: "1", handle: "noa", willTrain: "yes" as const, tools: { laser: "train" as const, solder: "train" as const, fdm: "use" as const } },
    { ...base, id: "2", handle: "eitan", willTrain: "maybe" as const, tools: { fdm: "train" as const } },
    { ...base, id: "3", handle: "dana", willTrain: "yes" as const, tools: { resin: "learn" as const } },
    { ...base, id: "4", handle: "omer", willTrain: "no" as const, tools: { scope: "use" as const } },
  ];

  it("lists who can train what, most tools first, tools in TOOLS order", () => {
    const t = trainers(rs);
    expect(t.can.map((p) => [p.handle, p.tools.map((x) => x.id)])).toEqual([
      ["noa", ["laser", "solder"]],
      ["eitan", ["fdm"]],
    ]);
  });

  it("lists people willing to train who haven't picked a tool yet", () => {
    expect(trainers(rs).willing.map((p) => p.handle)).toEqual(["dana"]);
  });
});
