import { describe, expect, it } from "vitest";
import { IDEAS, MAX_VOTES, cleanVotes, tally } from "./ideas";

describe("cleanVotes", () => {
  it("keeps known ideas, drops duplicates and caps at MAX_VOTES", () => {
    const ids = IDEAS.map((i) => i.id);
    expect(cleanVotes([ids[0], ids[0], "nope", ids[1], ids[2], ids[3]])).toEqual(ids.slice(0, MAX_VOTES));
  });
  it("returns [] for junk", () => {
    expect(cleanVotes("x")).toEqual([]);
    expect(cleanVotes([1, null])).toEqual([]);
  });
});

describe("tally", () => {
  it("counts votes and sorts by votes, then list order", () => {
    const [a, b, c] = IDEAS.map((i) => i.id);
    const rows = tally([[b], [b, c], [c, b]]);
    expect(rows.slice(0, 2).map((r) => [r.idea.id, r.votes])).toEqual([[b, 3], [c, 2]]);
    expect(rows.find((r) => r.idea.id === a)!.votes).toBe(0);
    expect(rows.length).toBe(IDEAS.length);
  });
});
