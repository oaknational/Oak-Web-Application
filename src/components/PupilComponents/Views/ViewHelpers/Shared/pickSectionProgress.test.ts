import { pickSectionProgress } from "./pickSectionProgress";

describe("pickSectionProgress", () => {
  it.each([
    [{ intro: { isComplete: true } }, "intro", "complete"],
    [{ video: { isComplete: false } }, "video", "in-progress"],
    [{}, "exit-quiz", "not-started"],
  ] as const)("returns %s for %s", (sectionResults, section, expected) => {
    expect(pickSectionProgress({ section, sectionResults })).toBe(expected);
  });
});
