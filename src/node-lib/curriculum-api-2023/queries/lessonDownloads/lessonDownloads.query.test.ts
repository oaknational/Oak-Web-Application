import sdk from "../../sdk";

import lessonDownloads from "./lessonDownloads.query";

describe("lessonDownloads()", () => {
  test("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await lessonDownloads({
        ...sdk,
        lessonDownloads: jest.fn(() => Promise.resolve({ downloads: [] })),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  test("first downloads is returned if multiple lessons in response", async () => {
    const unit = await lessonDownloads({
      ...sdk,
      lessonDownloads: jest.fn(() =>
        Promise.resolve({
          downloads: [
            {
              programmeSlug: "programme-slug-0",
              unitSlug: "unit-slug",
              lessonSlug: "lesson-slug",
              lessonTitle: "lesson-title",
              unitTitle: "unit-title",
              subjectSlug: "subject-slug",
              subjectTitle: "subject-title",
              keyStageSlug: "key-stage-slug",
              keyStageTitle: "key-stage-title",
              downloads: [],
            },
            {
              programmeSlug: "programme-slug-1",
              lessonSlug: "lesson-slug",
              lessonTitle: "lesson-title",
              unitSlug: "unit-slug",
              unitTitle: "unit-title",
              subjectSlug: "subject-slug",
              subjectTitle: "subject-title",
              keyStageSlug: "key-stage-slug",
              keyStageTitle: "key-stage-title",
              downloads: [],
            },
          ],
        }),
      ),
    })({
      programmeSlug: "programme-slug",
      unitSlug: "unit-slug",
      lessonSlug: "lesson-slug",
    });
    expect(unit.programmeSlug).toEqual("programme-slug-0");
  });
  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonDownloads({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonDownloads: jest.fn(() =>
          Promise.resolve({
            downloads: [
              {
                programmeSlug: "programme-slug",
                unitTitle: "unit-title",
                subjectSlug: "subject-slug",
                subjectTitle: "subject-title",
                keyStageSlug: "key-stage-slug",
                keyStageTitle: "key-stage-title",
                downloads: [],
              },
            ],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`unitSlug`);
  });
});
