import { lessonContentFixture } from "@oaknational/oak-curriculum-schema";

import teacherPreviewLessonQuery from "./teacherPreviewLesson.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("teacherPreviewLesson()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await teacherPreviewLessonQuery({
        ...sdk,
        teachersPreviewLesson: jest.fn(() =>
          Promise.resolve({ browseData: [], content: [] }),
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
          content: [
            {
              ..._lessonContentFixture,
              geo_restricted: _lessonContentFixture.geo_restricted
                ? "true"
                : "false",
              login_required: _lessonContentFixture.login_required
                ? "true"
                : "false",
            },
          ],
        }),
      ),
    })({
      lessonSlug: _lessonContentFixture.lesson_slug,
    });

    expect(lesson.lessonSlug).toEqual(_lessonContentFixture.lesson_slug);
    expect(lesson.lessonId).toEqual(_lessonContentFixture.lesson_id);
    expect(lesson.lessonTitle).toEqual(_lessonContentFixture.lesson_title);
  });
});
