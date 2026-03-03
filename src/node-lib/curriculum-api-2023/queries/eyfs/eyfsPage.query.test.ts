import {
  lessonDataFixture,
  programmeFieldsFixture,
  unitDataFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import eyfsPageQuery from "./eyfsPage.query";

describe("eyfs page query", () => {
  it("throws a not found error if no lessons are found", async () => {
    await expect(async () => {
      await eyfsPageQuery({
        ...sdk,
        eyfsPage: jest.fn(() => Promise.resolve({ lessons: [], subjects: [] })),
      })({
        subjectSlug: "slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });
  it("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await eyfsPageQuery({
        ...sdk,
        eyfsPage: jest.fn(() =>
          Promise.resolve({
            lessons: [
              {
                programme_slug: "programme-slug",
                lesson_slug: null,
                lesson_data: lessonDataFixture(),
                programme_fields: programmeFieldsFixture(),
                unit_data: unitDataFixture(),
                features: {},
                order_in_unit: 1,
              },
            ],
            subjects: [],
          }),
        ),
      })({
        subjectSlug: "maths",
      });
    }).rejects.toThrow("lesson_slug");
  });
  it("populates lessons with video data", async () => {
    const response = await eyfsPageQuery({
      ...sdk,
      eyfsPage: jest.fn(() =>
        Promise.resolve({
          lessons: [
            {
              programme_slug: "programme-slug",
              lesson_slug: "lesson-slug",
              lesson_data: lessonDataFixture({ overrides: { video_id: 123 } }),
              programme_fields: programmeFieldsFixture(),
              unit_data: unitDataFixture({ overrides: { slug: "unit-slug" } }),
              unit_slug: "unit-slug",
              features: {},
              order_in_unit: 1,
            },
          ],
          subjects: [],
        }),
      ),
      eyfsVideos: jest.fn(() =>
        Promise.resolve({
          videos: [
            {
              video_mux_playback_id: "test-playback_id",
              video_id: 123,
              video_title: "video title",
            },
          ],
        }),
      ),
    })({
      subjectSlug: "maths",
    });

    const lesson = response.units["unit-slug"]?.lessons[0];
    expect(lesson?.video.muxPlaybackId).toBe("test-playback_id");
  });
});
