import unitListingFixture from "../../node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

export const subjectUnits: UnitListingData["units"] =
  unitListingFixture().units;
