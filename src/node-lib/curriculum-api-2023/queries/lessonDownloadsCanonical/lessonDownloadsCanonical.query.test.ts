import { syntheticUnitvariantLessonsFixture } from "@oaknational/oak-curriculum-schema";
import { ZodError } from "zod";

import sdk from "../../sdk";

import lessonDownloadsCanonical from "./lessonDownloadsCanonical.query";

const downloadAssetsFixture = {
  has_slide_deck_asset_object: true,
  has_worksheet_asset_object: true,
  has_supplementary_asset_object: true,
  has_worksheet_answers_asset_object: true,
  has_worksheet_google_drive_downloadable_version: true,
  starter_quiz: [],
  exit_quiz: [],
  is_legacy: true,
};

describe("lessonDownloadsCanonical()", () => {
  test("throws a not found error if no download assets are found", async () => {
    await expect(async () => {
      await lessonDownloadsCanonical({
        ...sdk,
        lessonDownloadsCanonical: jest.fn(() =>
          Promise.resolve({
            download_assets: [],
            lessons_details: [syntheticUnitvariantLessonsFixture()],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("throws a not found error if no lessons_details are found", async () => {
    await expect(async () => {
      await lessonDownloadsCanonical({
        ...sdk,
        lessonDownloadsCanonical: jest.fn(() =>
          Promise.resolve({
            download_assets: [downloadAssetsFixture],
            lessons_details: [],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("both pathways returned if multiple lessons in response", async () => {
    const { pathways } = await lessonDownloadsCanonical({
      ...sdk,
      lessonDownloadsCanonical: jest.fn(() =>
        Promise.resolve({
          download_assets: [
            {
              has_slide_deck_asset_object: true,
              has_worksheet_asset_object: true,
              has_supplementary_asset_object: true,
              has_worksheet_answers_asset_object: true,
              has_worksheet_google_drive_downloadable_version: true,
              starter_quiz: [],
              exit_quiz: [],
              is_legacy: true,
            },
          ],
          lessons_details: [
            syntheticUnitvariantLessonsFixture(),
            syntheticUnitvariantLessonsFixture({
              overrides: {
                supplementary_data: { unit_order: 2, order_in_unit: 2 },
                programme_fields: {
                  tier: "higher",
                  tier_id: null,
                  tier_slug: "higher",
                  tier_description: "Higher",
                  tier_display_order: null,
                  examboard: "AQA",
                  examboard_id: null,
                  examboard_slug: "aqa",
                  examboard_description:
                    "Assessment and Qualifications Alliance",
                  examboard_display_order: null,
                  year: "1",
                  year_slug: "year-10",
                  year_id: 1,
                  year_description: "Year 10",
                  year_display_order: 1,
                  keystage: "KS4",
                  keystage_id: 1,
                  keystage_slug: "ks4",
                  keystage_description: "Key Stage 4",
                  keystage_display_order: 1,
                  phase: "secondary",
                  phase_id: 0,
                  phase_slug: "secondary",
                  phase_description: "Secondary",
                  phase_display_order: 1,
                  subject: "Maths",
                  subject_id: 1,
                  subject_slug: "maths",
                  subject_description: "subject-description",
                  subject_display_order: 1,
                },
              },
            }),
          ],
        }),
      ),
    })({
      lessonSlug: "lesson-slug",
    });

    expect(pathways).toEqual([
      {
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        keyStageSlug: "ks1",
        keyStageTitle: "Key Stage 1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        lessonCohort: "2023-2024",
        examBoardSlug: null,
        examBoardTitle: null,
        tierSlug: null,
        tierTitle: null,
      },
      {
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        lessonCohort: "2023-2024",
        examBoardSlug: "aqa",
        examBoardTitle: "AQA",
        tierSlug: "higher",
        tierTitle: "Higher",
      },
    ]);
  });
  test("throws a Zod error if the response is invalid", async () => {
    try {
      await lessonDownloadsCanonical({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonDownloadsCanonical: jest.fn(() =>
          Promise.resolve({
            download_assets: [
              {
                has_worksheet_asset_object: true,
                has_supplementary_asset_object: true,
                has_worksheet_answers_asset_object: true,
                has_worksheet_google_drive_downloadable_version: true,
                starter_quiz: [],
                exit_quiz: [],
                is_legacy: true,
              },
            ],
            lessons_details: [syntheticUnitvariantLessonsFixture()],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    } catch (error: unknown) {
      const typedError = error as ZodError;
      expect(typedError.errors).toEqual([
        {
          code: "invalid_type",
          expected: "boolean",
          message: "Required",
          path: ["has_slide_deck_asset_object"],
          received: "undefined",
        },
      ]);
    }
  });
});
