import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import { getAllLearningThemes } from "./getAllLearningThemes";
import { getThreadsForUnit } from "./getThreadsForUnit";

import { getBatchedRequests } from "@/node-lib/curriculum-api-2023/sdk";

const mockBatched = getBatchedRequests as jest.Mock;

jest.mock("../../../sdk", () => {
  return {
    ...jest.requireActual("../../../sdk"),
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
  };
});
describe("unit listing threads", () => {
  test("getAllLearningThemes returns themes in alphabetical order", () => {
    const res = getAllLearningThemes([
      [
        {
          slug: "unit-slug",
          title: "unit-title",
          nullTitle: "unit-title",
          programmeSlug: "programme-slug",
          keyStageSlug: "key-stage-slug",
          themeSlug: null,
          themeTitle: null,
          quizCount: null,
          subjectSlug: "subject-slug",
          subjectTitle: "subject-title",
          keyStageTitle: "key-stage-title",
          yearTitle: "year-title",
          yearOrder: 1,
          unitStudyOrder: 1,
          cohort: "cohort",
          lessonCount: 1,
          expired: false,
          expiredLessonCount: 1,
          learningThemes: [
            { themeSlug: "b theme", themeTitle: "B Theme" },
            { themeSlug: "a theme", themeTitle: "A Theme" },
            { themeSlug: "c theme", themeTitle: "C Theme" },
          ],
        },
      ],
    ]);

    expect(res).toEqual([
      { themeSlug: "a theme", themeTitle: "A Theme" },
      { themeSlug: "b theme", themeTitle: "B Theme" },
      { themeSlug: "c theme", themeTitle: "C Theme" },
    ]);
  });
  test("getThreadsForUnit returns correct threads ", async () => {
    mockBatched.mockResolvedValue(
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
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme2", theme_title: "Theme 2" }],
                unit_id: 2,
              },
            ],
          },
        },
      ]),
    );
    const res = await getThreadsForUnit(["1", "2"]);

    expect(res[1]).toEqual([{ themeSlug: "theme1", themeTitle: "Theme 1" }]);
    expect(res[2]).toEqual([{ themeSlug: "theme2", themeTitle: "Theme 2" }]);
  });
  test("getThreadsForUnit groups threads by unit", async () => {
    mockBatched.mockResolvedValue(
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
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme2", theme_title: "Theme 2" }],
                unit_id: 2,
              },
            ],
          },
        },
        {
          data: {
            threads: [
              {
                threads: [{ theme_slug: "theme2", theme_title: "Theme 2" }],
                unit_id: 2,
              },
            ],
          },
        },
      ]),
    );

    const res = await getThreadsForUnit(["1", "2"]);
    expect(res[1]).toHaveLength(1);
    expect(res[2]).toHaveLength(2);
  });
});
