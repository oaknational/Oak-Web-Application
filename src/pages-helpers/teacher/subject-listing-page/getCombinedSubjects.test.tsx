import { getCombinedSubjects } from "./getCombinedSubjects";

import { subjectListingFixture2023 } from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";

describe("getCombinedSubjects", () => {
  test("it returns subjects in the correct format", () => {
    const result = getCombinedSubjects(
      subjectListingFixture2023(),
      "biology",
      false,
    );
    expect(result).toEqual([
      {
        isNew: true,
        lessonCount: 23,
        programmeCount: 1,
        programmeSlug: "biology-secondary-ks4",
        subjectSlug: "biology",
        subjectTitle: "Biology",
        unitCount: 4,
        pathwaySlug: null,
        pathwayTitle: null,
      },
    ]);
  });
  test("it returns old subjects in the correct format", () => {
    const result = getCombinedSubjects(
      subjectListingFixture2023(),
      "music",
      false,
    );
    expect(result).toEqual([
      {
        isNew: false,
        lessonCount: 23,
        programmeCount: 1,
        unitCount: 4,
        programmeSlug: "music-secondary-ks4-l",
        subjectSlug: "music",
        subjectTitle: "Music",
        pathwaySlug: null,
        pathwayTitle: null,
      },
    ]);
  });
  test("it combines old and new", () => {
    const result = getCombinedSubjects(
      subjectListingFixture2023(),
      "chemistry",
      false,
    );
    expect(result).toEqual([
      {
        isNew: true,
        lessonCount: 28,
        programmeCount: 2,
        programmeSlug: "chemistry-secondary-ks4",
        subjectSlug: "chemistry",
        subjectTitle: "Chemistry",
        unitCount: 6,
        pathwaySlug: null,
        pathwayTitle: null,
      },
    ]);
  });

  test("it combines old and new for programmes with pathways", () => {
    const result = getCombinedSubjects(
      subjectListingFixture2023(),
      "citizenship",
      false,
    );
    expect(result).toEqual([
      {
        isNew: true,
        lessonCount: 2,
        programmeCount: 1,
        programmeSlug: "citizenship-secondary-ks4-core",
        subjectSlug: "citizenship",
        subjectTitle: "Citizenship",
        unitCount: 4,
        pathwaySlug: "core",
        pathwayTitle: "Core",
      },
      {
        isNew: true,
        lessonCount: 8,
        programmeCount: 1,
        programmeSlug: "citizenship-secondary-ks4-gcse",
        subjectSlug: "citizenship",
        subjectTitle: "Citizenship",
        unitCount: 8,
        pathwaySlug: "gcse",
        pathwayTitle: "GCSE",
      },
    ]);
  });
});
