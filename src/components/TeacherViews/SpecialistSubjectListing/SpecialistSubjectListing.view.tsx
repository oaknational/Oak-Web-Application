import { FC } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import SpecialistSubjectCardSection from "@/components/TeacherComponents/SpecialistSubjectListingCardSection/SpecialistSubjectListingCardSection";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { SpecialistSubjectListingPageData } from "@/node-lib/curriculum-api-2023/queries/specialistSubjectListing/specialistSubjectListing.schema";

const SpecialistSubjectListing: FC<SpecialistSubjectListingPageData> = (
  props,
) => {
  const { specialist, therapies } = props;
  return (
    <OakFlex $flexDirection={"column"} $mv="space-between-xl">
      <MaxWidth $maxWidth={[480, 840, 1280]} $ph={[12]}>
        <OakHeading
          $font={"heading-1"}
          tag={"h1"}
          $mt={["space-between-m2", "space-between-xl"]}
          $mb={["space-between-l", "space-between-xl"]}
        >
          Specialist and therapies
        </OakHeading>
        <OakFlex
          $flexDirection="column"
          $gap={["all-spacing-6", "all-spacing-9"]}
        >
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
      </MaxWidth>
    </OakFlex>
  );
};

export default SpecialistSubjectListing;
