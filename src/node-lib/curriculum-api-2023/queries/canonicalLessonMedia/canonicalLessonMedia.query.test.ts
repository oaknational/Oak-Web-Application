import {
  mediaClipsFixture,
  syntheticUnitvariantLessonsByKsFixture,
} from "@oaknational/oak-curriculum-schema";

import canonicalLessonMediaQuery from "./canonicalLessonMedia.query";

import sdk from "@/node-lib/curriculum-api-2023/sdk";

const base = syntheticUnitvariantLessonsByKsFixture();
const lesson = syntheticUnitvariantLessonsByKsFixture({
  overrides: {
    lesson_slug: "lesson-slug",
    programme_slug: "science-aqa",
    unit_slug: "forces",
    programme_fields: {
      ...base.programme_fields,
      subject_slug: "science",
      subject: "Science",
      keystage_slug: "ks4",
      examboard: "AQA",
      examboard_slug: "aqa",
      tier_description: "Foundation",
      tier_slug: "foundation",
      year_description: "Year 10",
      optionality: undefined,
    },
    lesson_data: {
      ...base.lesson_data,
      title: "Forces",
      media_clips: mediaClipsFixture().media_clips,
    },
    unit_data: { ...base.unit_data, title: "Forces and motion" },
  },
});

describe("canonicalLessonMedia()", () => {
  it("queries by lesson slug and returns only hub metadata for every variant", async () => {
    const browseData = [
      lesson,
      {
        ...lesson,
        programme_slug: "science-edexcel",
        programme_fields: {
          ...lesson.programme_fields,
          examboard: "Edexcel",
          examboard_slug: "edexcel",
          tier_description: "Higher",
          tier_slug: "higher",
        },
      },
    ];
    const query = jest.fn(async () => ({ browseData }));

    const result = await canonicalLessonMediaQuery({
      ...sdk,
      canonicalLessonMedia: query,
    })({ lessonSlug: "lesson-slug" });

    expect(query).toHaveBeenCalledWith({ lessonSlug: "lesson-slug" });
    expect(result).toEqual({
      lessonTitle: "Forces",
      subjectSlug: "science",
      pathways: [
        {
          programmeSlug: "science-aqa",
          unitSlug: "forces",
          unitTitle: "Forces and motion",
          subjectSlug: "science",
          subjectTitle: "Science",
          keyStageSlug: "ks4",
          examBoardTitle: "AQA",
          tierTitle: "Foundation",
          yearGroupTitle: "Year 10",
          pathwayTitle: null,
        },
        {
          programmeSlug: "science-edexcel",
          unitSlug: "forces",
          unitTitle: "Forces and motion",
          subjectSlug: "science",
          subjectTitle: "Science",
          keyStageSlug: "ks4",
          examBoardTitle: "Edexcel",
          tierTitle: "Higher",
          yearGroupTitle: "Year 10",
          pathwayTitle: null,
        },
      ],
    });
  });

  it("filters excluded and media-less variants before selecting metadata and applying overrides", async () => {
    const browseData = [
      { ...lesson, actions: { exclusions: ["teacher"] } },
      {
        ...lesson,
        lesson_data: { ...lesson.lesson_data, media_clips: null },
      },
      {
        ...lesson,
        actions: {
          programme_field_overrides: {
            subject_slug: "physics",
            subject: "Physics",
            optionality: "Physics forces",
          },
        },
      },
    ];

    const result = await canonicalLessonMediaQuery({
      ...sdk,
      canonicalLessonMedia: jest.fn(async () => ({ browseData })),
    })({ lessonSlug: "lesson-slug" });

    expect(result.subjectSlug).toBe("physics");
    expect(result.pathways).toHaveLength(1);
    expect(result.pathways[0]).toEqual(
      expect.objectContaining({
        subjectSlug: "physics",
        subjectTitle: "Physics",
        unitTitle: "Physics forces",
      }),
    );
  });

  it.each([
    { name: "no lessons", browseData: [] },
    {
      name: "teacher exclusions",
      browseData: [{ ...lesson, actions: { exclusions: ["teacher"] } }],
    },
    {
      name: "media query exclusions",
      browseData: [
        { ...lesson, actions: { exclusions: ["lessonMediaClipsQuery"] } },
      ],
    },
    {
      name: "no media",
      browseData: [
        {
          ...lesson,
          lesson_data: { ...lesson.lesson_data, media_clips: null },
        },
      ],
    },
  ])("returns not found for $name", async ({ browseData }) => {
    await expect(
      canonicalLessonMediaQuery({
        ...sdk,
        canonicalLessonMedia: jest.fn(async () => ({ browseData })),
      })({ lessonSlug: "lesson-slug" }),
    ).rejects.toThrow("Resource not found");
  });

  it("rejects malformed hub data rather than casting it to the response type", async () => {
    await expect(
      canonicalLessonMediaQuery({
        ...sdk,
        canonicalLessonMedia: jest.fn(async () => ({
          browseData: [
            {
              ...lesson,
              lesson_data: { ...lesson.lesson_data, title: null },
            },
          ],
        })),
      })({ lessonSlug: "lesson-slug" }),
    ).rejects.toThrow();
  });
});
