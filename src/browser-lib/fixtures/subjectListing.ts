import { SubjectListingData } from "../../node-lib/curriculum-api";
import subjectListingFixture from "../../node-lib/curriculum-api/fixtures/subjectListing.fixture";

export const subjects: SubjectListingData["subjects"] =
  subjectListingFixture().subjects;
