import unitListingFixture from "../../node-lib/curriculum-api-2023/fixtures/unitListing.fixture";

import { UnitListingPageData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

export const subjectUnits: UnitListingPageData["units"] =
  unitListingFixture().units;
