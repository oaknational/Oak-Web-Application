import { FC } from "react";

import SpecialistSubjectCardSection from "./Card/SpecialistSubjectCardList";

import Flex from "@/components/SharedComponents/Flex";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { Heading } from "@/components/SharedComponents/Typography";

export type SpecialistSubject = {
  subjectSlug: string;
  subjectTitle: string;
  unitCount: number;
  lessonCount: number;
  programmeSlug: string;
  programmeCount: number;
};

export type SpecialistSubjectListingPageData = {
  therapies: Array<SpecialistSubject>;
  specialist: Array<SpecialistSubject>;
};

const SpecialistSubjectListingPage: FC<SpecialistSubjectListingPageData> = (
  props,
) => {
  const { specialist, therapies } = props;

  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $maxWidth={[480, 840, 1280]} $ph={[12]}>
        <Heading $font={"heading-1"} tag={"h1"} $mt={[32, 56]} $mb={[48, 56]}>
          Specialist & Therapies
        </Heading>
        <Flex $flexDirection="column" $gap={[24, 48]}>
          <SpecialistSubjectCardSection
            subjects={specialist}
            heading="Specialist"
            summary="Our Specialist curriculum helps you to support learning around three stages; early development, building understanding and applying learning, as well as creative arts and physical development."
          />
          <SpecialistSubjectCardSection
            subjects={therapies}
            heading="Therapies"
            summary="These resources provide tools for delivering support across four therapeutic streams. Choose the best starting point or approach to meet your pupils' developmental needs."
          />
        </Flex>
      </MaxWidth>
    </Flex>
  );
};

export default SpecialistSubjectListingPage;
