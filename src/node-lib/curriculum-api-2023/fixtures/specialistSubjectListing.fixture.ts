import { SpecialistSubjectListingPageData } from "@/node-lib/curriculum-api-2023/queries/specialistSubjectListing/specialistSubjectListing.schema";

export const specialistSubjectListingFixture2023 = (
  partial?: Partial<SpecialistSubjectListingPageData>,
): SpecialistSubjectListingPageData => {
  return {
    therapies: [
      {
        subjectSlug: "physical-therapy",
        subjectTitle: "Physical Therapy",
        unitCount: 1,
        lessonCount: 1,
        programmeCount: 1,
      },
      {
        subjectSlug: "sensory-integration",
        subjectTitle: "Sensor Integration",
        unitCount: 1,
        lessonCount: 1,
        programmeCount: 1,
      },
    ],
    specialist: [
      {
        subjectSlug: "numeracy",
        subjectTitle: "Numeracy",
        unitCount: 5,
        lessonCount: 10,
        programmeCount: 3,
      },
      {
        subjectSlug: "creative-arts",
        subjectTitle: "Creative Arts",
        unitCount: 10,
        lessonCount: 12,
        programmeCount: 3,
      },
    ],
    ...partial,
  };
};
