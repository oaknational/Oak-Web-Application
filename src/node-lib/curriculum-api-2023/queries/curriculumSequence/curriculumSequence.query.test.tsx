import sdk from "../../sdk";

import curriculumSequenceQuery from "./curriculumSequence.query";

import { createUnit } from "@/fixtures/curriculum/unit";

describe("curriculum sequence query", () => {
  test("throws params incorrect error if slugs are blank", async () => {
    await expect(async () => {
      await curriculumSequenceQuery({
        ...sdk,
        curriculumSequence: jest.fn(() => Promise.resolve({ units: [] })),
      })({
        subjectSlug: "",
        phaseSlug: "",
        ks4OptionSlug: null,
      });
    }).rejects.toThrow(`The params provided are incorrect`);
  });

  test("throws resource not found error if no rows are returned", async () => {
    await expect(async () => {
      await curriculumSequenceQuery({
        ...sdk,
        curriculumSequence: jest.fn(() => Promise.resolve({ units: [] })),
      })({
        subjectSlug: "english",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("includes core pathway by default for non-examboard ks4 options", async () => {
    const curriculumSequenceMock = jest.fn(() =>
      Promise.resolve({
        units: [
          createUnit({
            slug: "unit-1",
            pathway_slug: "gcse",
          }),
        ],
      }),
    );

    await curriculumSequenceQuery({
      ...sdk,
      curriculumSequence: curriculumSequenceMock,
    })({
      subjectSlug: "english",
      phaseSlug: "secondary",
      ks4OptionSlug: "gcse",
    });

    expect(curriculumSequenceMock).toHaveBeenCalledWith({
      where: expect.objectContaining({
        _and: expect.arrayContaining([
          {
            _or: expect.arrayContaining([
              { pathway_slug: { _eq: "gcse" } },
              { pathway_slug: { _eq: "core" } },
              { pathway_slug: { _is_null: true } },
            ]),
          },
        ]),
      }),
    });
  });

  test("excludes core pathway when excludeCoreUnits is true", async () => {
    const curriculumSequenceMock = jest.fn(() =>
      Promise.resolve({
        units: [
          createUnit({
            slug: "unit-1",
            pathway_slug: "gcse",
          }),
        ],
      }),
    );

    await curriculumSequenceQuery({
      ...sdk,
      curriculumSequence: curriculumSequenceMock,
    })({
      subjectSlug: "english",
      phaseSlug: "secondary",
      ks4OptionSlug: "gcse",
      excludeCoreUnits: true,
    });

    expect(curriculumSequenceMock).toHaveBeenCalledWith({
      where: expect.objectContaining({
        _and: expect.arrayContaining([
          {
            _or: [
              { pathway_slug: { _eq: "gcse" } },
              { pathway_slug: { _is_null: true } },
            ],
          },
        ]),
      }),
    });
  });

  test("excludes core pathway for examboard queries when excludeCoreUnits is true", async () => {
    const curriculumSequenceMock = jest.fn(() =>
      Promise.resolve({
        units: [
          createUnit({
            slug: "unit-1",
            examboard_slug: "aqa",
          }),
        ],
      }),
    );

    await curriculumSequenceQuery({
      ...sdk,
      curriculumSequence: curriculumSequenceMock,
    })({
      subjectSlug: "english",
      phaseSlug: "secondary",
      ks4OptionSlug: "aqa",
      excludeCoreUnits: true,
    });

    expect(curriculumSequenceMock).toHaveBeenCalledWith({
      where: expect.objectContaining({
        _and: expect.arrayContaining([
          {
            _and: expect.arrayContaining([
              {
                _or: [
                  { pathway_slug: { _neq: "core" } },
                  { pathway_slug: { _is_null: true } },
                ],
              },
            ]),
          },
        ]),
      }),
    });
  });
});
