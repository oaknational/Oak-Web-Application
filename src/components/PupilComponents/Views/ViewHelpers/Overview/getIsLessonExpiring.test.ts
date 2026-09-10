import { getIsLessonExpiring } from "./getIsLessonExpiring";

describe("getIsLessonExpiring", () => {
  it.each([
    [{ expirationDate: "2026-01-01", displayExpiringBanner: false }, true],
    [{ expirationDate: null, displayExpiringBanner: true }, true],
    [{ expirationDate: null, displayExpiringBanner: false }, false],
    [{ expirationDate: null, displayExpiringBanner: undefined }, false],
  ] as const)("returns %s for %s", (args, expected) => {
    expect(getIsLessonExpiring(args)).toBe(expected);
  });
});
