import { SpecialistLessonDownloadRawFixture } from "../../fixtures/specialistLessonDownloads.fixture";
import sdk from "../../sdk";
import { lessonDownloadsListSchema } from "../../shared.schema";

import {
  constructDownloadsArray,
  specialistLessonDownloadQuery,
} from "./specialistLessonDownload.query";
import { SpecialistLessonDownloadSchema } from "./specialistLessonDownload.schema";

const mockGetLessonDownloadResourcesExistence = jest.fn(() =>
  Promise.resolve({
    resources: [
      ["presentation", { exists: true }],
      ["intro-quiz-questions", { exists: true }],
      ["intro-quiz-answers", { exists: true }],
      ["exit-quiz-questions", { exists: true }],
      ["exit-quiz-answers", { exists: true }],
      ["worksheet-pdf", { exists: true }],
      ["worksheet-pptx", { exists: true }],
      ["supplementary-pdf", { exists: true }],
      ["supplementary-docx", { exists: true }],
      ["lesson-guide-pdf", { exists: true }],
    ],
  }),
);

jest.mock(
  "@/components/SharedComponents/helpers/downloadAndShareHelpers/getDownloadResourcesExistence",
  () => ({
    getLessonDownloadResourcesExistence: () =>
      mockGetLessonDownloadResourcesExistence(),
  }),
);

jest.mock("../../sdk", () => {
  return {
    specialistLessonDownloads: jest.fn(() =>
      Promise.resolve({
        specialistLessonDownloads: [SpecialistLessonDownloadRawFixture()],
        restrictions: [],
      }),
    ),
  };
});

describe("specialistLessonDownload.query", () => {
  it("runs", async () => {
    const res = await specialistLessonDownloadQuery(sdk)({
      lessonSlug: "online-safety-c5gk8r",
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });

    expect(res).toBeDefined();
  });
  it("throws an error if no lesson downloads are found", async () => {
    await expect(
      async () =>
        await specialistLessonDownloadQuery({
          ...sdk,
          specialistLessonDownloads: jest.fn(() =>
            Promise.resolve({
              specialistLessonDownloads: [],
              restrictions: [],
            }),
          ),
        })({
          lessonSlug: "blah",
          unitSlug: "blah",
          programmeSlug: "fake-programme",
        }),
    ).rejects.toThrow("curriculum-api/not-found");
  });
  it("returns data in the shape of the specialist lesson download schema", async () => {
    const res = await specialistLessonDownloadQuery(sdk)({
      lessonSlug: "online-safety-c5gk8r",
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });
    expect(SpecialistLessonDownloadSchema.parse(res)).toEqual(res);
  });
});

describe("constructDownloadsArray", () => {
  it("returns an array of downloads", async () => {
    const res = await constructDownloadsArray(
      SpecialistLessonDownloadRawFixture(),
      "test-slug",
    );
    expect(res.length).toBe(7);
    expect(lessonDownloadsListSchema.parse(res)).toEqual(res);
  });
  it("returns slide deck as forbidden", async () => {
    const res = await constructDownloadsArray(
      SpecialistLessonDownloadRawFixture({
        contains_copyright_content: true,
      }),
      "test-slug",
    );

    const slidedeck = res.find((d) => d.type === "presentation");
    if (!slidedeck) throw new Error("Slide deck not found");
    expect(slidedeck.forbidden).toBe(true);
  });
  it("returns exists false when no downloads", async () => {
    const res = await constructDownloadsArray(
      SpecialistLessonDownloadRawFixture({
        worksheet_asset_object: null,
        presentation_url: null,
        starter_quiz_asset_object: null,
        exit_quiz_asset_object: null,
      }),
      "test-slug",
    );

    res.forEach((d) => {
      expect(d.exists).toBe(false);
    });
  });
});
