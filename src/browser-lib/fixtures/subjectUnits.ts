import { UnitListingData } from "../../node-lib/curriculum-api";
import unitListingFixture from "../../node-lib/curriculum-api/fixtures/unitListing.fixture";

export const subjectUnits: UnitListingData["units"] =
  unitListingFixture().units;
