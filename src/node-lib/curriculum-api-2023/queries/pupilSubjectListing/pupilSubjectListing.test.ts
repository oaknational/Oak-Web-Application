import { syntheticProgrammesByYearFixture } from "@oaknational/oak-curriculum-schema";

import { pupilSubjectListingQuery } from "./pupilSubjectListing.query";

import { PupilSubjectListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilSubjectListing()", () => {
  const s = syntheticProgrammesByYearFixture();
  const pupilProgrammeListingFixtureEBs = {
    programme_slug: s.programme_slug,
    programme_fields: s.programme_fields,
    year_slug: s.year_slug,
    base_slug: s.base_slug,
    is_legacy: s.is_legacy,
  };

  it("it returns the correct data", async () => {
    const res = await pupilSubjectListingQuery({
      ...sdk,
      pupilSubjectListing: jest.fn(
        () =>
          Promise.resolve({
            data: [pupilProgrammeListingFixtureEBs],
          }) as Promise<PupilSubjectListingQuery>, // Add the correct return type
      ),
    })({
      yearSlug: "year-1",
    });
    expect(res.curriculumData[0]?.programmeSlug).toEqual(
      "maths-primary-year-1",
    );
    expect(res.curriculumData[0]?.programmeFields.phase).toEqual("primary");
  });

  it("throws if data is not returned", async () => {
    await expect(
      pupilSubjectListingQuery({
        ...sdk,
        pupilSubjectListing: jest.fn(
          () =>
            Promise.resolve({
              data: [],
              subjectFeatures: [],
            }) as Promise<PupilSubjectListingQuery>, // Add the correct return type
        ),
      })({
        yearSlug: "unknown-slug",
      }),
    ).rejects.toThrow("Resource not found");
  });

  it("defaults to legacy programmes", async () => {
    const mock = jest.fn(
      () =>
        Promise.resolve({
          data: [pupilProgrammeListingFixtureEBs],
        }) as Promise<PupilSubjectListingQuery>, // Add the correct return type
    );

    await pupilSubjectListingQuery({
      ...sdk,
      pupilSubjectListing: mock,
    })({
      yearSlug: "maths-primary-year-1",
    });

    expect(mock).toHaveBeenCalledWith({
      yearSlug: "maths-primary-year-1",
    });
  });
});
