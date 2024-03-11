import { SpecialistLessonDownloadRawFixture } from "../../fixtures/specialistLessonDownloads.fixture";
import sdk from "../../sdk";
import { lessonDownloadsListSchema } from "../../shared.schema";

import {
  constructDownloadsArray,
  specialistLessonDownloadQuery,
} from "./specialistLessonDownload.query";
import { SpecialistLessonDownloadSchema } from "./specialistLessonDownload.schema";

jest.mock("../../sdk", () => {
  return {
    specialistLessonDownloads: jest.fn(() =>
      Promise.resolve({
        specialistLessonDownloads: [SpecialistLessonDownloadRawFixture()],
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
  it("returns an array of downloads", () => {
    const res = constructDownloadsArray(SpecialistLessonDownloadRawFixture());
    expect(res.length).toBe(7);
    expect(lessonDownloadsListSchema.parse(res)).toEqual(res);
  });
  it("returns slide deck as forbidden", () => {
    const res = constructDownloadsArray(
      SpecialistLessonDownloadRawFixture({
        contains_copyright_content: true,
      }),
    );

    const slidedeck = res.find((d) => d.type === "presentation");
    if (!slidedeck) throw new Error("Slide deck not found");
    expect(slidedeck.forbidden).toBe(true);
  });
});
