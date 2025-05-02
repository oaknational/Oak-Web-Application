import sdk from "../../sdk";

import { specialistLessonShareQuery } from "./specialistLessonShare.query";
import { specialistLessonShareSchema } from "./specialistLessonShare.schema";

jest.mock("../../sdk", () => ({
  specialistLessonShare: jest.fn(({ lessonSlug }) =>
    Promise.resolve({
      specialistLessonShare: [
        {
          lesson_slug: "online-safety-c5gk8r",
          lesson_title: "Online Safety",
          unit_title: "Staying Safe",
          unit_slug: "staying-safe-al-5556",
          expired: false,
          worksheet_url: "https://www.example.com",
          starter_quiz: "https://www.example.com",
          exit_quiz: "https://www.example.com",
          video_mux_playback_id: "123",
          presentation_url: "https://www.example.com",
          synthetic_programme_slug: "independent-living-applying-learning",
          combined_programme_fields: {
            subject_slug: "independent-living",
            subject: "Independent Living",
          },
          lesson_release_date:
            lessonSlug === "online-safety-c5gk8r"
              ? "2023-01-01T00:00:00.000Z"
              : null,
        },
      ],
    }),
  ),
}));

describe("specialistLessonShare.query", () => {
  it("runs", async () => {
    const res = await specialistLessonShareQuery(sdk)({
      lessonSlug: "online-safety-c5gk8r",
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });

    expect(res).toBeDefined();
  });
  it("runs when there is a release date is null", () => {
    expect(
      specialistLessonShareQuery(sdk)({
        lessonSlug: "online-safety-c5gk8r-no-release-date",
        unitSlug: "staying-safe-al-5556",
        programmeSlug: "independent-living-applying-learning",
      }),
    ).resolves.not.toThrow();
  });
  it("throws an error if no lesson is found", async () => {
    await expect(
      async () =>
        await specialistLessonShareQuery({
          ...sdk,
          specialistLessonShare: jest.fn(() =>
            Promise.resolve({
              specialistLessonShare: [],
            }),
          ),
        })({
          lessonSlug: "blah",
          unitSlug: "blah",
          programmeSlug: "fake-programme",
        }),
    ).rejects.toThrow("curriculum-api/not-found");
  });
  it("returns data in the shape of the specialist lesson share schema", async () => {
    const res = await specialistLessonShareQuery(sdk)({
      lessonSlug: "online-safety-c5gk8r",
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });

    expect(specialistLessonShareSchema.parse(res)).toEqual(res);
  });
});
