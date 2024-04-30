import { syntheticProgrammesByYearFixture } from "@oaknational/oak-curriculum-schema";

import { pupilProgrammeListingQuery } from "./pupilProgrammeListing.query";

import { PupilProgrammeListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilUnitListing()", () => {
  const s = syntheticProgrammesByYearFixture();
  const pupilProgrammeListingFixture = {
    programme_slug: s.programme_slug,
    combined_programme_fields: s.combined_programme_fields,
    base_programme_fields: s.base_programme_fields,
  };

  it("it returns the correct data", async () => {
    const res = await pupilProgrammeListingQuery({
      ...sdk,
      pupilProgrammeListing: jest.fn(
        () =>
          Promise.resolve({
            data: [pupilProgrammeListingFixture],
          }) as Promise<PupilProgrammeListingQuery>, // Add the correct return type
      ),
    })({
      baseSlug: "maths-primary-year-1",
      isLegacy: false,
    });
    expect(res[0]?.programmeSlug).toEqual("maths-primary-year-1");
    expect(res[0]?.combinedProgrammeFields?.phase).toEqual("primary");
  });

  it("throws if data is not returned", async () => {
    await expect(
      pupilProgrammeListingQuery({
        ...sdk,
        pupilProgrammeListing: jest.fn(
          () =>
            Promise.resolve({
              data: [],
            }) as Promise<PupilProgrammeListingQuery>, // Add the correct return type
        ),
      })({
        baseSlug: "unknown-slug",
        isLegacy: false,
      }),
    ).rejects.toThrow("Resource not found");
  });

  it("defaults to legacy programmes", async () => {
    const mock = jest.fn(
      () =>
        Promise.resolve({
          data: [pupilProgrammeListingFixture],
        }) as Promise<PupilProgrammeListingQuery>, // Add the correct return type
    );

    await pupilProgrammeListingQuery({
      ...sdk,
      pupilProgrammeListing: mock,
    })({
      baseSlug: "maths-primary-year-1",
    });

    expect(mock).toHaveBeenCalledWith({
      baseSlug: "maths-primary-year-1",
      isLegacy: true,
    });
  });
});
