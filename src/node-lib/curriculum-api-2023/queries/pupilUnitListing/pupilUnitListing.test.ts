import { syntheticUnitvariantsWithLessonIdsFixture } from "@oaknational/oak-curriculum-schema";

import { pupilUnitListingQuery } from "./pupilUnitListing.query";

import { PupilUnitListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

describe("pupilUnitListing()", () => {
  test("it returns the units if found", async () => {
    const units = await pupilUnitListingQuery({
      ...sdk,
      pupilUnitListing: jest.fn(
        () =>
          Promise.resolve({
            browseData: [syntheticUnitvariantsWithLessonIdsFixture()],
          }) as Promise<PupilUnitListingQuery>, // Add the correct return type
      ),
    })({
      baseSlug: "test",
    });

    expect(units[0]?.unitSlug).toEqual("unit-slug");
  });
});
