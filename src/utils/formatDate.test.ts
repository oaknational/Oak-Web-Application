import { describe, expect, it } from "vitest";

import formatDate from "./formatDate";

describe("formatDate", () => {
  it("should default to format like 14 April 1989", () => {
    expect(formatDate("1989-04-14")).toBe("14 April 1989");
  });
  it("can update the month format with options", () => {
    expect(formatDate("1989-04-14", { month: "short" })).toBe("14 Apr 1989");
  });
});
