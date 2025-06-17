import { lessonContentFixture } from "@oaknational/oak-curriculum-schema";

import teacherPreviewLessonQuery from "./teacherPreviewLesson.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";

describe("teacherPreviewLesson()", () => {
  const browseFixtureData = {
    ...lessonBrowseDataFixture({
      lessonSlug: "lesson-slug",
    }),
    disablePupilShare: true,
  };
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await teacherPreviewLessonQuery({
        ...sdk,
        teachersPreviewLesson: jest.fn(() =>
          Promise.resolve({ browseData: [], content: [], unitData: [] }),
        ),
      })({
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("it returns the lesson if found", async () => {
    const _lessonContentFixture = lessonContentFixture();
    const lesson = await teacherPreviewLessonQuery({
      ...sdk,
      teachersPreviewLesson: jest.fn(() =>
        Promise.resolve({
          browseData: [browseFixtureData],
          content: [
            {
              ..._lessonContentFixture,
              starter_quiz: null,
              geo_restricted: null,
              login_required: null,
              phonics_outcome: "phonics-outcome",
              lesson_guide_asset_object_url: "lesson-guide-url",
            },
          ],
          unitData: [
            {
              lesson_count: 1,
              supplementary_data: {
                unit_order: 16,
                static_lesson_list: [
                  {
                    slug: "lesson-slug-test",
                    order: 1,
                    title: "Lesson Tile",
                    _state: "published",
                    lesson_uid: "test-uid",
                  },
                ],
              },
            },
          ],
        }),
      ),
    })({
      lessonSlug: _lessonContentFixture.lesson_slug,
    });
    expect(lesson.lessonSlug).toEqual(_lessonContentFixture.lesson_slug);
    expect(lesson.lessonTitle).toEqual(_lessonContentFixture.lesson_title);
    expect(lesson.lessonGuideUrl).toEqual("lesson-guide-url");
    expect(lesson.phonicsOutcome).toEqual("phonics-outcome");
    expect(lesson.unitTotalLessonCount).toEqual(1);
  });
});
