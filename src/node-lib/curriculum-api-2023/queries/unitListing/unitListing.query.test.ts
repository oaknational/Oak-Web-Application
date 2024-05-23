import {
  lessonDataFixture,
  programmeFieldsFixture,
  unitDataFixture,
  unitvariantFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk, { getBatchedRequests } from "../../sdk";

import unitListing from "./unitListing.query";

const mockBatched = getBatchedRequests as jest.Mock;

jest.mock("../../sdk", () => {
  return {
    ...jest.requireActual("../../sdk"),
    tiers: jest.fn(() =>
      Promise.resolve({
        tiers: [
          {
            programme_fields: programmeFieldsFixture({
              overrides: {
                tier: "foundation",
                tier_slug: "foundation",
                tier_description: "Foundation",
              },
            }),
            programme_slug: "subject-phase-ks-foundation",
          },
          {
            programme_fields: programmeFieldsFixture({
              overrides: {
                tier: "higher",
                tier_slug: "higher",
                tier_description: "Higher",
              },
            }),
            programme_slug: "subject-phase-ks-higher",
          },
        ],
      }),
    ),
    getBatchedRequests: jest.fn(() => Promise.resolve([])),
    unitListing: jest.fn(() =>
      Promise.resolve({
        units: [
          {
            is_legacy: false,
            lesson_data: lessonDataFixture(),
            lesson_slug: "lesson-slug",
            null_unitvariant: unitvariantFixture(),
            programme_fields: programmeFieldsFixture({
              overrides: {
                tier: "foundation",
                tier_slug: "foundation",
                tier_description: "Foundation",
                tier_display_order: 1,
              },
            }),
            programme_slug: "programme-slug",
            supplementary_data: { unit_order: 1, order_in_unit: 1 },
            unit_data: unitDataFixture({ overrides: { unit_id: 1 } }),
            unit_slug: "unit-slug",
          },
          {
            is_legacy: false,
            lesson_data: lessonDataFixture({
              overrides: { deprecated_fields: { expired: true } },
            }),
            lesson_slug: "lesson-slug",
            null_unitvariant: unitvariantFixture(),
            programme_fields: programmeFieldsFixture({
              overrides: {
                tier: "foundation",
                tier_slug: "foundation",
                tier_description: "Foundation",
                tier_display_order: 1,
              },
            }),
            programme_slug: "programme-slug",
            supplementary_data: { unit_order: 1, order_in_unit: 1 },
            unit_data: unitDataFixture({ overrides: { unit_id: 1 } }),
            unit_slug: "unit-slug",
          },
        ],
      }),
    ),
  };
});

describe("unitListing()", () => {
  test("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await unitListing({
        ...sdk,
        unitListing: jest.fn(() => Promise.resolve({ units: [] })),
      })({
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("returns the correct data", async () => {
    mockBatched.mockResolvedValueOnce(
      Promise.resolve([
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme1", theme_title: "Theme 1" }],
                unit_id: 1,
              },
            ],
          },
        },
      ]),
    );

    const res = await unitListing(sdk)({ programmeSlug: "programme-slug" });
    expect(res).toEqual({
      programmeSlug: "programme-slug",
      keyStageSlug: "ks1",
      keyStageTitle: "Key Stage 1",
      examBoardSlug: null,
      examBoardTitle: null,
      subjectSlug: "maths",
      subjectTitle: "Maths",
      tierSlug: "foundation",
      tiers: [
        {
          tierSlug: "foundation",
          tierTitle: "Foundation",
          tierProgrammeSlug: "subject-phase-ks-foundation",
          tierOrder: null,
        },
        {
          tierSlug: "higher",
          tierTitle: "Higher",
          tierProgrammeSlug: "subject-phase-ks-higher",
          tierOrder: null,
        },
      ],
      units: [
        [
          {
            slug: "unit-slug",
            title: "unit-title",
            nullTitle: "unit-title",
            programmeSlug: "programme-slug",
            keyStageSlug: "ks1",
            keyStageTitle: "Key Stage 1",
            subjectSlug: "maths",
            subjectTitle: "Maths",
            lessonCount: 2,
            unitStudyOrder: 1,
            expired: false,
            expiredLessonCount: 1,
            yearTitle: "Year 1",
            yearOrder: 1,
            cohort: "2023-2024",
            learningThemes: [{ themeTitle: "Theme 1", themeSlug: "theme1" }],
          },
        ],
      ],
      learningThemes: [{ themeTitle: "Theme 1", themeSlug: "theme1" }],
      hasNewContent: true,
    });
  });
});
