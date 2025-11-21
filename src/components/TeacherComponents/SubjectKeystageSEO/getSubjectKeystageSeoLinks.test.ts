import { getSubjectKeystageSeoLinks } from "./getSubjectKeystageSeoLinks";

import subjectListingFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";

const subjects = subjectListingFixture().subjects;
const subjectsWithoutProgrammesOrPathways = subjects.filter(
  (s) =>
    s.length === 1 &&
    s[0].data.programmeCount === 1 &&
    s[0].data.pathwaySlug === null,
);
const subjectsWithProgrammes = subjects.filter(
  (s) => s.length === 1 && s[0].data.programmeCount > 1,
);
const subjectsWithPathways = subjects.filter(
  (s) => s[0].data.pathwaySlug !== null,
);

describe("getSubjectKeystageSeoLinks", () => {
  it("generates unit links correctly for programmes without pathways", () => {
    const result = getSubjectKeystageSeoLinks(
      subjectsWithoutProgrammesOrPathways,
      "ks4",
    );
    for (const link of result) {
      expect(link.href).toContain("/units");
    }
  });
  it("generates programme links for subjects with multiple programmes", () => {
    const result = getSubjectKeystageSeoLinks(subjectsWithProgrammes, "ks4");
    for (const link of result) {
      expect(link.href).toContain("/programmes");
      expect(link.href).not.toContain("/units");
    }
  });
  it("generates multiple links for subjects with pathways", () => {
    const result = getSubjectKeystageSeoLinks(subjectsWithPathways, "ks4");
    expect(result[0]?.label).toContain("(GCSE)");
    expect(result[1]?.label).toContain("(Core)");
  });
});
