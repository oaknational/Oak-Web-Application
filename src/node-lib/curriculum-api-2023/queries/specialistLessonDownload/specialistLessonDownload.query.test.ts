import sdk from "../../sdk";
import { lessonDownloadsListSchema } from "../../shared.schema";

import {
  constructDownloadsArray,
  specialistLessonDownloadQuery,
} from "./specialistLessonDownload.query";
import { SpecialistLessonDownloadSchema } from "./specialistLessonDownload.schema";

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
          specialistLessonListing: jest.fn(() =>
            Promise.resolve({
              specialistLessonListing: [],
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

const mockLessonDownload = {
  lesson_title: "Online safety",
  combined_programme_fields: {
    subject: "Independent Living",
    subject_slug: "independent-living",
    developmentstage: "Applying learning",
    developmentstage_slug: "applying-learning",
  },
  unit_title: "Staying Safe - AL",
  expired: null,
  contains_copyright_content: false,
  exit_quiz: null,
  starter_quiz: null,
  pupil_lesson_outcome: "In this lesson, we will learn about...",
  worksheet_asset_object: {
    google_drive: {
      id: "test_id",
      url: "https://docs.google.com/presentation/d/test_id/",
    },
    google_drive_downloadable_version: {
      id: "test_id",
      url: "https://docs.google.com/presentation/d/test_id/",
    },
  },
  worksheet_url: "https://docs.google.com/presentation/d/test_id",
  video_mux_playback_id: null,
  video_title: null,
  exit_quiz_asset_object: null,
  presentation_url: "https://docs.google.com/presentation/d/test_id",
  slidedeck_asset_object: {
    google_drive: {
      id: "test_id",
      url: "https://docs.google.com/presentation/d/test_id",
    },
  },
  starter_quiz_asset_object: null,
};

describe("constructDownloadsArray", () => {
  it("returns an array of downloads", () => {
    const res = constructDownloadsArray(mockLessonDownload);
    expect(res.length).toBe(7);
    expect(lessonDownloadsListSchema.parse(res)).toEqual(res);
  });
  it("returns slide deck as forbidden", () => {
    const res = constructDownloadsArray({
      ...mockLessonDownload,
      contains_copyright_content: true,
    });

    const slidedeck = res.find((d) => d.type === "presentation");
    if (!slidedeck) throw new Error("Slide deck not found");
    expect(slidedeck.forbidden).toBe(true);
  });
});
