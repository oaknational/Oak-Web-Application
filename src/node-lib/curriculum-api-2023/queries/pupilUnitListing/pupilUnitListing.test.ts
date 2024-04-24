import {
  programmeFieldsFixture,
  syntheticUnitvariantsWithLessonIds,
  unitDataFixture,
  unitvariantFixture,
} from "@oaknational/oak-curriculum-schema";

import { pupilUnitListingQuery } from "./pupilUnitListing.query";

import { PupilUnitListingQuery } from "@/node-lib/curriculum-api-2023/generated/sdk";
import sdk from "@/node-lib/curriculum-api-2023/sdk";

export const syntheticUnitvariantsWithLessonIdsFixture = ({
  overrides = {},
}: {
  overrides?: Partial<syntheticUnitvariantsWithLessonIds>;
} = {}): syntheticUnitvariantsWithLessonIds => ({
  unit_slug: "unit-slug",
  programme_slug: "programme-slug",
  is_legacy: false,
  lesson_count: 1,
  unit_data: unitDataFixture(),
  null_unitvariant: unitvariantFixture(),
  programme_fields: programmeFieldsFixture(),
  supplementary_data: {
    unit_order: 1,
  },
  ...overrides,
});

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
      programmeSlug: "test",
    });

    expect(units[0]?.unitSlug).toEqual("unit-slug");
  });
});
