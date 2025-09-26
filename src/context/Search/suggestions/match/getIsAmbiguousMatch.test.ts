import { getIsAmbiguousMatch } from "./getIsAmbiguousMatch";

describe("isAmbiguousMatch", () => {
  it("returns true when the term contains 3 extra words", () => {
    const result = getIsAmbiguousMatch("the history of golf", {
      subject: "history",
    });
    expect(result).toBe(true);
  });
  it("returns false when there are 2 extra words", () => {
    const result = getIsAmbiguousMatch("history of golf", {
      subject: "history",
    });
    expect(result).toBe(false);
  });
  it("returns false when there is 1 extra word", () => {
    const result = getIsAmbiguousMatch("golf history", {
      subject: "history",
    });
    expect(result).toBe(false);
  });
  it("returns false when there are no extra words", () => {
    const result = getIsAmbiguousMatch(" history ", {
      subject: "history",
    });
    expect(result).toBe(false);
  });
});
