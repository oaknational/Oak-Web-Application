import { syntheticUnitvariantLessonsByKsFixture } from "@oaknational/oak-curriculum-schema";

import canonicalLessonOverview from "./canonicalLessonOverview.query";
import { canonicalLessonHubPathwaySchema } from "./canonicalLessonOverview.schema";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("lessonOverview()", () => {
  test("returns canonical lesson data and queries by lesson slug only", async () => {
    const browseData = [
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: "unit-slug-test-1",
          programme_slug: "programme-slug-test-1",
          programme_slug_by_year: ["programme-slug-test-1"],
        },
      }),
      syntheticUnitvariantLessonsByKsFixture({
        overrides: {
          lesson_slug: "lesson-slug-test",
          unit_slug: "unit-slug-test-2",
          programme_slug: "programme-slug-test-2",
          programme_slug_by_year: ["programme-slug-test-2"],
        },
      }),
    ];
    const lessonOverviewMock = jest.fn(() => Promise.resolve({ browseData }));

    const result = await canonicalLessonOverview({
      ...sdk,
      canonicalLessonOverview: lessonOverviewMock,
    })({ lessonSlug: "lesson-slug-test" });

    expect(lessonOverviewMock).toHaveBeenCalledWith({
      lessonSlug: "lesson-slug-test",
    });
    expect(result.lessonTitle).toBe(browseData[0]?.lesson_data.title);
    expect(result.subjectSlug).toBe(
      browseData[0]?.programme_fields.subject_slug,
    );
    expect(result.pathways).toHaveLength(2);
    result.pathways.forEach((pathway) => {
      expect(canonicalLessonHubPathwaySchema.safeParse(pathway).success).toBe(
        true,
      );
    });
  });

  test("throws a not found error if no eligible browse data is found", async () => {
    await expect(
      canonicalLessonOverview({
        ...sdk,
        canonicalLessonOverview: jest.fn(() =>
          Promise.resolve({ browseData: [] }),
        ),
      })({ lessonSlug: "lesson-slug-test" }),
    ).rejects.toThrow("Resource not found");
  });
});
