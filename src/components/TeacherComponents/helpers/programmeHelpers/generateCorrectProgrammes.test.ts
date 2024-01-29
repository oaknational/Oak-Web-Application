import {
  generateCorrectProgrammes,
  generateProgrammeListing,
} from "./generateCorrectProgrammes";

import {
  mathsKs4Full,
  physicsKs4Full,
  combinedScienceKs4Full,
  ks4MathsFullProgrammeListing,
  ks4CombinedScienceFullProgrammeListing,
  mathsKs4New,
} from "@/node-lib/curriculum-api-2023/fixtures/programmes.fixture";

describe("generateCorrectProgrammes", () => {
  it("returns the same programmes when they are not in target subjects", () => {
    const result = generateCorrectProgrammes(physicsKs4Full, false);

    expect(result).toEqual(physicsKs4Full);
  });
  it("removes false Maths programmes from the list for non-legacy prgorammes", () => {
    const result = generateCorrectProgrammes(mathsKs4Full, false);

    expect(result.length).toEqual(2);
    expect(result.find((p) => p.tierSlug === "core")).toBeUndefined();
  });
  it("does not remove Maths programmes from the list for legacy", () => {
    const result = generateCorrectProgrammes(mathsKs4Full, true);

    expect(result).toEqual(mathsKs4Full);
  });
  it("removes Combined Science programmes from the list for legacy ", () => {
    const result = generateCorrectProgrammes(combinedScienceKs4Full, true);
    expect(result.length).toEqual(2);
    result.every((programme) => expect(programme.examBoardSlug).toBeNull());
  });
});

describe("generateLegacyProgrammeListing", () => {
  it("returns legacy data with programmes transformed", () => {
    const result = generateProgrammeListing(
      ks4CombinedScienceFullProgrammeListing,
      true,
    );
    expect(result?.programmes.length).toEqual(2);
  });
  it("does not transforms legacy subject slug", () => {
    const result = generateProgrammeListing(
      ks4CombinedScienceFullProgrammeListing,
      true,
    );
    expect(result.subjectSlug).toEqual("combined-science-l");
  });
  it("transforms new programme listings", () => {
    const result = generateProgrammeListing(
      ks4MathsFullProgrammeListing,
      false,
    );
    expect(result.programmes).toEqual(mathsKs4New);
  });
  it("transforms legacy programme slug", () => {
    const result = generateProgrammeListing(ks4MathsFullProgrammeListing, true);
    result.programmes.every((p) => expect(p.programmeSlug).toContain("-l"));
    expect(result.programmes).toEqual(mathsKs4Full);
  });
});
