import { FC } from "react";
import { OakHeading, OakFlex, OakMaxWidth } from "@oaknational/oak-components";

import SpecialistSubjectCardSection from "@/components/TeacherComponents/SpecialistSubjectListingCardSection/SpecialistSubjectListingCardSection";
import { SpecialistSubjectListingPageData } from "@/node-lib/curriculum-api-2023/queries/specialistSubjectListing/specialistSubjectListing.schema";

const SpecialistSubjectListing: FC<SpecialistSubjectListingPageData> = (
  props,
) => {
  const { specialist, therapies } = props;
  return (
    <OakFlex $flexDirection={"column"} $mv="spacing-56">
      <OakMaxWidth
        $maxWidth={["spacing-480", "spacing-960", "spacing-1280"]}
        $ph="spacing-12"
      >
        <OakHeading
          $font={"heading-1"}
          tag={"h1"}
          $mt={["spacing-32", "spacing-56"]}
          $mb={["spacing-48", "spacing-56"]}
        >
          Specialist and therapies
        </OakHeading>
        <OakFlex $flexDirection="column" $gap={["spacing-24", "spacing-48"]}>
          <SpecialistSubjectCardSection
            subjects={specialist}
            heading="Specialist"
            summary="Our specialist curriculum helps you to support learning around three stages; early development, building understanding and applying learning, as well as creative arts and physical development."
          />
          <SpecialistSubjectCardSection
            subjects={therapies}
            heading="Therapies"
            summary="These resources provide tools for delivering support across four therapeutic streams. Choose the best starting point or approach to meet your pupils' developmental needs."
          />
        </OakFlex>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default SpecialistSubjectListing;
