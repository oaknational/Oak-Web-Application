import { shouldPersistVideoTimeElapsed } from "./shouldPersistVideoTimeElapsed";

describe("shouldPersistVideoTimeElapsed", () => {
  it("persists for non-playing events", () => {
    expect(
      shouldPersistVideoTimeElapsed({
        event: "pause",
        nextTimeElapsed: 5,
        currentTimeElapsed: 4,
        currentSection: "video",
      }),
    ).toBe(true);
  });

  it("persists playing events when the elapsed threshold is met on video", () => {
    expect(
      shouldPersistVideoTimeElapsed({
        event: "playing",
        nextTimeElapsed: 21,
        currentTimeElapsed: 10,
        currentSection: "video",
      }),
    ).toBe(true);
  });

  it("does not persist playing events before the threshold or outside video", () => {
    expect(
      shouldPersistVideoTimeElapsed({
        event: "playing",
        nextTimeElapsed: 20,
        currentTimeElapsed: 10,
        currentSection: "video",
      }),
    ).toBe(false);
    expect(
      shouldPersistVideoTimeElapsed({
        event: "playing",
        nextTimeElapsed: 21,
        currentTimeElapsed: 10,
        currentSection: "intro",
      }),
    ).toBe(false);
  });
});
