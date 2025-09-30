import { hasNonMatchingWords } from "./hasNonMatchingWords";

describe("hasNonMatchingWords", () => {
  it("returns true when the term contains 3 extra words", () => {
    const result = hasNonMatchingWords("the history of golf", {
      subject: "history",
    });
    expect(result).toBe(true);
  });
  it("returns false when there are 2 extra words", () => {
    const result = hasNonMatchingWords("history of golf", {
      subject: "history",
    });
    expect(result).toBe(false);
  });
  it("returns false when there is 1 extra word", () => {
    const result = hasNonMatchingWords("golf history", {
      subject: "history",
    });
    expect(result).toBe(false);
  });
  it("returns false when there are no extra words", () => {
    const result = hasNonMatchingWords(" history ", {
      subject: "history",
    });
    expect(result).toBe(false);
  });
});
