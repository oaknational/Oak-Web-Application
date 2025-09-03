import {
  programmeFieldsFixture,
  unitDataFixture,
  syntheticUnitvariantsWithLessonIdsByKsFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import unitListing from "./unitListing.query";
import { UnitSnake } from "./unitListing.schema";

const rawFixture = ({
  overrides,
}: {
  overrides: Partial<UnitSnake>;
}): UnitSnake => {
  const unitSnake =
    syntheticUnitvariantsWithLessonIdsByKsFixture() as UnitSnake;

  delete (unitSnake as { base_slug?: string }).base_slug;
  delete (unitSnake as { null_unitvariant_id?: string }).null_unitvariant_id;
  delete (unitSnake as { programme_slug_by_year?: string })
    .programme_slug_by_year;

  return { ...unitSnake, ...overrides };
};

jest.mock("../../sdk", () => {
  return {
    ...jest.requireActual("../../sdk"),
    unitListing: jest.fn(() =>
      Promise.resolve({
        units: [
          rawFixture({
            overrides: {
              is_legacy: false,
              programme_fields: programmeFieldsFixture({
                overrides: {
                  tier: "foundation",
                  tier_slug: "foundation",
                  tier_description: "Foundation",
                  tier_display_order: 1,
                },
              }),
              programme_slug: "subject-phase-ks-foundation",
              unit_data: unitDataFixture({
                overrides: {
                  unit_id: 1,
                  subjectcategories: null,
                  title: "unit-title-1",
                },
              }),
              unit_slug: "unit-slug-1",
              supplementary_data: { unit_order: 1 },
              actions: {
                related_subject_slugs: ["physics"],
              },
            },
          }),
          rawFixture({
            overrides: {
              is_legacy: false,
              programme_fields: programmeFieldsFixture({
                overrides: {
                  tier: "foundation",
                  tier_slug: "foundation",
                  tier_description: "Foundation",
                  tier_display_order: 1,
                },
              }),
              programme_slug: "subject-phase-ks-foundation",
              supplementary_data: { unit_order: 2 },
              unit_data: unitDataFixture({
                overrides: {
                  unit_id: 1,
                  subjectcategories: ["Physics"],
                  title: "unit-title-2",
                },
              }),
              threads: [
                {
                  thread_id: 1,
                  thread_slug: "theme1",
                  thread_title: "Theme 1",
                },
              ],
              unit_slug: "unit-slug-2",
            },
          }),
        ],
      }),
    ),
  };
});

describe("unitListing()", () => {
  test("returns null if no unit is found", async () => {
    const res = await unitListing({
      ...sdk,
      unitListing: jest.fn(() => Promise.resolve({ units: [] })),
    })({
      programmeSlug: "programme-slug",
    });
    expect(res).toBeNull();
  });

  test("returns the correct data", async () => {
    const res = await unitListing(sdk)({
      programmeSlug: "subject-phase-ks-foundation",
    });

    expect(res).toEqual({
      programmeSlug: "subject-phase-ks-foundation",
      keyStageSlug: "ks1",
      keyStageTitle: "Key Stage 1",
      pathwayTitle: null,
      pathwaySlug: null,
      examBoardSlug: null,
      examBoardTitle: null,
      subjectSlug: "maths",
      subjectTitle: "Maths",
      subjectParent: "Maths",
      tierSlug: "foundation",
      phase: "primary",
      yearGroups: [{ yearTitle: "Year 1", yearSlug: "year-1", year: "1" }],
      hasCycle2Content: false,
      subjectCategories: [
        {
          label: "Physics",
          iconName: "subject-physics",
          slug: "physics",
        },
      ],
      tiers: [
        {
          tierSlug: "foundation",
          tierTitle: "Foundation",
          tierProgrammeSlug: "subject-phase-ks-foundation",
          tierOrder: 1,
        },
        {
          tierSlug: "higher",
          tierTitle: "Higher",
          tierProgrammeSlug: "subject-phase-ks-higher",
          tierOrder: 2,
        },
      ],
      units: [
        [
          {
            slug: "unit-slug-1",
            title: "unit-title-1",
            nullTitle: "unit-title-1",
            programmeSlug: "subject-phase-ks-foundation",
            keyStageSlug: "ks1",
            keyStageTitle: "Key Stage 1",
            subjectSlug: "maths",
            subjectTitle: "Maths",
            lessonCount: 1,
            unitStudyOrder: 1,
            expired: false,
            expiredLessonCount: 0,
            groupUnitsAs: null,
            unpublishedLessonCount: 0,
            isOptionalityUnit: false,
            yearTitle: "Year 1",
            yearSlug: "year-1",
            year: "1",
            yearOrder: 1,
            cohort: "2023-2024",
            subjectCategories: null,
            learningThemes: null,
            actions: {
              relatedSubjectSlugs: ["physics"],
            },
          },
        ],
        [
          {
            slug: "unit-slug-2",
            title: "unit-title-2",
            nullTitle: "unit-title-2",
            programmeSlug: "subject-phase-ks-foundation",
            keyStageSlug: "ks1",
            keyStageTitle: "Key Stage 1",
            subjectSlug: "maths",
            subjectTitle: "Maths",
            lessonCount: 1,
            unitStudyOrder: 2,
            expired: false,
            expiredLessonCount: 0,
            groupUnitsAs: null,
            unpublishedLessonCount: 0,
            isOptionalityUnit: false,
            yearTitle: "Year 1",
            yearSlug: "year-1",
            year: "1",
            yearOrder: 1,
            actions: undefined,
            cohort: "2023-2024",
            subjectCategories: [{ label: "Physics", slug: "physics" }],
            learningThemes: [{ themeTitle: "Theme 1", themeSlug: "theme1" }],
          },
        ],
      ],
      learningThemes: [{ themeTitle: "Theme 1", themeSlug: "theme1" }],
      hasNewContent: true,
      relatedSubjects: ["physics"],
    });
  });
});
