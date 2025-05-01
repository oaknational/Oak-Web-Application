import sdk from "../../sdk";

import specialistLessonListingQuery from "./specialistLessonListing.query";
import { SpecialistLessonListingDataSchema } from "./specialistLessonListing.schema";

jest.mock("../../sdk", () => {
  return {
    specialistLessonListing: jest.fn(() =>
      Promise.resolve({
        specialistLessonListing: [
          {
            unit_slug: "staying-safe-al-5556",
            programme_slug: "independent-living-applying-learning",
            combined_programme_fields: {
              subject: "Staying safe",
              subject_slug: "staying-safe",
              developmentstage: "Applying learning",
              developmentstage_slug: "applying-learning",
              developmentstage_display_order: 3,
            },
            lesson_slug: "staying-safe-al-5556",
            lesson_title: "Staying safe",
            expired: false,
            pupil_lesson_outcome: "Pupils will be able to stay safe",
            worksheet_url: "https://www.example.com",
            video_mux_playback_id: "123",
            video_title: "Staying safe",
            starter_quiz: 1,
            exit_quiz: 1,
            contains_copyright_content: false,
            unit_title: "Staying safe",
            order_in_unit: 2,
            isUnpublished: false,
          },
          {
            unit_slug: "staying-safe-al-5556",
            programme_slug: "independent-living-applying-learning",
            combined_programme_fields: {
              subject: "Staying safe",
              subject_slug: "staying-safe",
              developmentstage: "Applying learning",
              developmentstage_slug: "applying-learning",
              developmentstage_display_order: 3,
            },
            lesson_slug: "first-lesson",
            lesson_title: "Staying safe",
            expired: false,
            pupil_lesson_outcome: "Pupils will be able to stay safe",
            worksheet_url: "https://www.example.com",
            video_mux_playback_id: "123",
            video_title: "Staying safe",
            starter_quiz: 1,
            exit_quiz: 1,
            contains_copyright_content: false,
            unit_title: "Staying safe",
            order_in_unit: 1,
            isUnpublished: false,
          },
        ],
      }),
    ),
  };
});

describe("specialist programme listing", () => {
  test("it runs", async () => {
    const res = await specialistLessonListingQuery(sdk)({
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });

    expect(res).toBeDefined();
  });
  test("it throws an error if no lessons are found", async () => {
    await expect(
      async () =>
        await specialistLessonListingQuery({
          ...sdk,
          specialistLessonListing: jest.fn(() =>
            Promise.resolve({
              specialistLessonListing: [],
            }),
          ),
        })({
          unitSlug: "blah",
          programmeSlug: "fake-programme",
        }),
    ).rejects.toThrow("curriculum-api/not-found");
  });
  test("it returns data in the shape of the specialist lesson listing schema", async () => {
    const res = await specialistLessonListingQuery(sdk)({
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });
    expect(SpecialistLessonListingDataSchema.parse(res)).toEqual(res);
  });
  test("it sorts lessons according to orderInUnit", async () => {
    const res = await specialistLessonListingQuery(sdk)({
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });
    expect(res.lessons[0]?.lessonSlug).toBe("first-lesson");
  });
});
