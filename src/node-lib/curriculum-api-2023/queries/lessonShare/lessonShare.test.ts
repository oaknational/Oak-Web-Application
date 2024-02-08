import sdk from "../../sdk";

import lessonShare from "./lessonShare.query";

describe("lessonShare()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await lessonShare({
        ...sdk,
        lessonShare: jest.fn(() => Promise.resolve({ share: [] })),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonShare({
        ...sdk,
        lessonShare: jest.fn(() =>
          Promise.resolve({
            share: [
              {
                programmeSlug: "biology-secondary-ks4",
                keyStageSlug: "ks4",
                keyStageTitle: "Key stage 4",
                lessonSlug: "prokaryotic-and-eukaryotic-cells-b9qqye",
                lessonTitle: "Prokaryotic and Eukaryotic Cells",
                subjectTitle: "Biology",
                subjectSlug: "biology",
                themeSlug: null,
                themeTitle: null,
                unitSlug: "cells-biology-3p8njnj",
                unitTitle: "Cell biology",
              },
            ],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`shareableResources`);
  });
});
