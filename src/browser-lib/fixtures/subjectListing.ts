import subjectListingFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";
import { SubjectListingPageProps } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";

export const subjects: SubjectListingPageProps["subjects"] =
  subjectListingFixture().subjects;
