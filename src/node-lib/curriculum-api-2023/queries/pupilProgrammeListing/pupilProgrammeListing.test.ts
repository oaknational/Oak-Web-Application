import { syntheticProgrammesByYearFixture } from "@oaknational/oak-curriculum-schema";

import { pupilProgrammeListingQuery } from "./pupilProgrammeListing.query";

import { PupilProgrammeListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilUnitListing()", () => {
  const s = syntheticProgrammesByYearFixture();
  const pupilProgrammeListingFixture = {
    programme_slug: s.programme_slug,
    programme_fields: s.programme_fields,
    year_slug: s.year_slug,
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
    });
    expect(res[0]?.programmeSlug).toEqual("maths-primary-year-1");
    expect(res[0]?.programmeFields?.phase).toEqual("primary");
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
    });
  });
});
