import { describe, expect, it } from "vitest";

import { getAllPaths } from "./getAllPaths";

describe("getAllPaths", () => {
  it("returns all paths to a match", () => {
    const obj1 = {
      foo: { bar: [{ baz: "bing" }, { baz: "bing" }] },
    };

    const matcher = (v: unknown) => (v as { baz: string })?.baz === "bing";

    expect(getAllPaths(obj1, matcher)).toEqual([
      ["foo", "bar", "0"],
      ["foo", "bar", "1"],
    ]);
  });
});
