import { hasValidSharedVariant } from "./validateSharedVariant";

describe("hasValidSharedVariant", () => {
  it("returns true when the shared variant slug exists", () => {
    expect(
      hasValidSharedVariant({
        params: {
          variant: "exit-quiz-only",
        },
      }),
    ).toBe(true);
  });

  it("returns false when the shared variant slug does not exist", () => {
    expect(
      hasValidSharedVariant({
        params: {
          variant: "blah",
        },
      }),
    ).toBe(false);
  });

  it("returns false when there is no shared variant route param", () => {
    expect(
      hasValidSharedVariant({
        params: undefined,
      }),
    ).toBe(false);
  });
});
