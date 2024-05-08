import { toSentenceCase, filterOutCoreTier } from "./index";

describe("toSentenceCase", () => {
  test("converts first character to uppercase and the rest to lowercase", () => {
    expect(toSentenceCase("hello world")).toBe("Hello world");
  });

  test("handles all-uppercase strings", () => {
    expect(toSentenceCase("HELLO WORLD")).toBe("Hello world");
  });

  test("handles all-lowercase strings", () => {
    expect(toSentenceCase("hello world")).toBe("Hello world");
  });

  test("handles empty string", () => {
    expect(toSentenceCase("")).toBe("");
  });

  test("handles strings with non-alphabetic characters", () => {
    expect(toSentenceCase("123 hello!")).toBe("123 hello!");
  });
});

describe("filterOutCoreTier", () => {
  const sampleTiers = [
    {
      tierSlug: "core",
      tierTitle: "Core",
      tierProgrammeSlug: "maths-ks4-core",
    },
    {
      tierSlug: "foundation",
      tierTitle: "Foundation",
      tierProgrammeSlug: "maths-ks4-foundation",
    },
    {
      tierSlug: "higher",
      tierTitle: "Higher",
      tierProgrammeSlug: "maths-ks4-higher",
    },
  ];

  test("returns all tiers when subject and key stage are in the hasCoreTier set", () => {
    expect(filterOutCoreTier(true, "maths", "ks4", sampleTiers)).toEqual(
      sampleTiers,
    );
  });

  test('filters out "core" tier when not in the hasCoreTier set', () => {
    expect(
      filterOutCoreTier(false, "combined-science", "ks4", sampleTiers),
    ).toEqual([
      {
        tierSlug: "foundation",
        tierTitle: "Foundation",
        tierProgrammeSlug: "maths-ks4-foundation",
      },
      {
        tierSlug: "higher",
        tierTitle: "Higher",
        tierProgrammeSlug: "maths-ks4-higher",
      },
    ]);
  });

  test("returns null for null arguments", () => {
    expect(filterOutCoreTier(false, null, null, null)).toBeNull();
  });
});
