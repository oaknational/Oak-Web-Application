import { orderUnits } from "./orderUnits";

import {
  unitListingFixture,
  swimmingUnitListingFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

const swimmingUnits = swimmingUnitListingFixture().units;
const mixedUnits = [...unitListingFixture().units, ...swimmingUnits];

describe("orderUnits", () => {
  test("should order units with swimming units at the front", () => {
    const result = orderUnits(mixedUnits);

    expect(result[0]).toEqual(swimmingUnits[0]);
  });
});
