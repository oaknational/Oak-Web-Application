import { getSectionProgress } from "./getSectionProgress";

describe("getSectionProgress", () => {
  it.each([
    [{ isComplete: true, hasProgress: true }, "complete"],
    [{ isComplete: false, hasProgress: true }, "in-progress"],
    [{ isComplete: false, hasProgress: false }, "not-started"],
  ] as const)("returns %s as %s", (args, expected) => {
    expect(getSectionProgress(args)).toBe(expected);
  });
});
