import {
  lessonDataFixture,
  programmeFieldsFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import programmeListing, {
  getTransformedProgrammeData,
} from "./programmeListing.query";

const programmeListingResponse = [
  {
    lesson_data: lessonDataFixture(),
    programme_fields: programmeFieldsFixture(),
    is_legacy: false,
    programme_slug: "programme-slug",
  },
];

describe("programmeListing()", () => {
  test("throws a not found error if programme is not found", async () => {
    await expect(async () => {
      await programmeListing({
        ...sdk,
        programmeListing: jest.fn(() => Promise.resolve({ programmes: [] })),
      })({
        keyStageSlug: "key-stage-slug",
        subjectSlug: "subject-slug",
        isLegacy: false,
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await programmeListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        programmeListing: jest.fn(() =>
          Promise.resolve({
            programmes: [
              {
                lesson_data: {
                  key_stage: "key-stage",
                  lesson_id: 4,
                  lesson_uid: "lesson-uid",
                },
              },
            ],
          }),
        ),
      })({
        keyStageSlug: "key-stage-slug",
        subjectSlug: "subject-slug",
        isLegacy: false,
      });
    }).rejects.toThrow(`slug`);
  });
  test("etTransformedProgrammeData returns the correct transformed programme data", async () => {
    const firstProgramme = programmeListingResponse[0];
    if (!firstProgramme) throw new Error("No first programme");
    const transformedProgrammes = getTransformedProgrammeData(
      programmeListingResponse,
      firstProgramme,
    );

    expect(transformedProgrammes).toEqual({
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      legacy: false,
      programmes: [
        {
          examBoardDisplayOrder: 0,
          examBoardSlug: null,
          examBoardTitle: null,
          programmeSlug: "programme-slug",
          subjectTitle: "subject-description",
          tierDisplayOrder: null,
          tierSlug: null,
          tierTitle: null,
        },
      ],
      subjectSlug: "maths",
      subjectTitle: "Maths",
    });
  });
});
