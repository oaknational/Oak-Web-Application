import {
  lessonDataFixture,
  programmeFieldsFixture,
} from "@oaknational/oak-curriculum-schema";

import sdk from "../../sdk";

import programmeListing, {
  getTransformedProgrammeData,
} from "./programmeListing.query";
import { programmeListingSchema } from "./programmeListing.schema";

const programmeListingResponse = [
  {
    lesson_data: lessonDataFixture(),
    programme_fields: {
      ...programmeFieldsFixture(),
      examboard_display_order: 2,
    },
    is_legacy: false,
    programme_slug: "programme-slug",
  },
  {
    lesson_data: lessonDataFixture(),
    programme_fields: {
      ...programmeFieldsFixture(),
      examboard_display_order: 1,
    },
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
  test("it returns data in the correct shape", async () => {
    const res = await programmeListing({
      ...sdk,
      programmeListing: jest.fn(() =>
        Promise.resolve({
          programmes: programmeListingResponse,
        }),
      ),
    })({
      keyStageSlug: "ks1",
      subjectSlug: "maths",
      isLegacy: false,
    });

    expect(programmeListingSchema.parse(res)).toEqual({
      keyStageSlug: "ks1",
      keyStageTitle: "Key Stage 1",
      pathwayTitle: null,
      programmes: [
        {
          examBoardDisplayOrder: 1,
          examBoardSlug: null,
          examBoardTitle: null,
          programmeSlug: "programme-slug",
          subjectTitle: "Maths",
          tierDisplayOrder: null,
          tierSlug: null,
          tierTitle: null,
          pathwayDisplayOrder: null,
          pathwaySlug: null,
          pathwayTitle: null,
        },
        {
          examBoardDisplayOrder: 2,
          examBoardSlug: null,
          examBoardTitle: null,
          programmeSlug: "programme-slug",
          subjectTitle: "Maths",
          tierDisplayOrder: null,
          tierSlug: null,
          tierTitle: null,
          pathwayDisplayOrder: null,
          pathwaySlug: null,
          pathwayTitle: null,
        },
      ],
      subjectSlug: "maths",
      subjectTitle: "Maths",
    });
  });
  test("it sorts by exam board order", async () => {
    const res = await programmeListing({
      ...sdk,
      programmeListing: jest.fn(() =>
        Promise.resolve({
          programmes: programmeListingResponse,
        }),
      ),
    })({
      keyStageSlug: "ks1",
      subjectSlug: "maths",
      isLegacy: false,
    });

    expect(res.programmes[0]?.examBoardDisplayOrder).toBe(1);
    expect(res.programmes[1]?.examBoardDisplayOrder).toBe(2);
  });
  test("getTransformedProgrammeData returns the correct transformed programme data", async () => {
    const firstProgramme = programmeListingResponse[0]?.programme_fields;
    if (!firstProgramme) throw new Error("No first programme");
    const transformedProgrammes = getTransformedProgrammeData(
      programmeListingResponse,
      firstProgramme,
    );

    expect(transformedProgrammes).toEqual({
      keyStageSlug: "ks1",
      keyStageTitle: "Key Stage 1",
      pathwayTitle: null,
      legacy: false,
      programmes: [
        {
          examBoardDisplayOrder: 1,
          examBoardSlug: null,
          examBoardTitle: null,
          programmeSlug: "programme-slug",
          subjectTitle: "Maths",
          tierDisplayOrder: null,
          tierSlug: null,
          tierTitle: null,
          pathwayDisplayOrder: null,
          pathwaySlug: null,
          pathwayTitle: null,
        },
        {
          examBoardDisplayOrder: 2,
          examBoardSlug: null,
          examBoardTitle: null,
          programmeSlug: "programme-slug",
          subjectTitle: "Maths",
          tierDisplayOrder: null,
          tierSlug: null,
          tierTitle: null,
          pathwayDisplayOrder: null,
          pathwaySlug: null,
          pathwayTitle: null,
        },
      ],
      subjectSlug: "maths",
      subjectTitle: "Maths",
    });
  });
});
