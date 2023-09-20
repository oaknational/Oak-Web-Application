import sdk from "../../sdk";

import lessonDownloadsCanonical from "./lessonDownloadsCanonical.query";

describe("lessonDownloadsCanonical()", () => {
  test("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await lessonDownloadsCanonical({
        ...sdk,
        lessonDownloadsCanonical: jest.fn(() =>
          Promise.resolve({ lessonDownloadsCanonical: [] }),
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
          lessonDownloadsCanonical: [
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
      lessonSlug: "lesson-slug",
    });
    expect(pathways).toEqual([
      {
        programmeSlug: "programme-slug-0",
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        subjectSlug: "subject-slug",
        subjectTitle: "subject-title",
        keyStageSlug: "key-stage-slug",
        keyStageTitle: "key-stage-title",
      },
      {
        programmeSlug: "programme-slug-1",
        unitSlug: "unit-slug",
        unitTitle: "unit-title",
        subjectSlug: "subject-slug",
        subjectTitle: "subject-title",
        keyStageSlug: "key-stage-slug",
        keyStageTitle: "key-stage-title",
      },
    ]);
  });
  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonDownloadsCanonical({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonDownloadsCanonical: jest.fn(() =>
          Promise.resolve({
            lessonDownloadsCanonical: [
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
        lessonSlug: "lesson-slug",
      });
    }).rejects.toThrow(`unitSlug`);
  });
});
