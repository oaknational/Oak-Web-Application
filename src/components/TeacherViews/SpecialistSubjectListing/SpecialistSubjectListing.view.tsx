import { FC } from "react";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { Heading, P } from "@/components/SharedComponents/Typography";

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

const SpecialistSubjectRow = (props: {
  heading: string;
  summary: string;
  subjects: Array<SpecialistSubject>;
}) => {
  return (
    <Flex>
      <Flex>
        <Heading tag="h3" $font="heading-3">
          {props.heading}
        </Heading>
        <P>{props.summary}</P>
      </Flex>
      <Flex>
        {props.subjects.map((subject) => (
          <Box data-testid={`${props.heading.toLowerCase()}-subject-card`}>
            {subject.subjectTitle}
          </Box>
        ))}
      </Flex>
    </Flex>
  );
};

const SpecialistSubjectListingPage: FC<SpecialistSubjectListingPageData> = (
  props,
) => {
  const { specialist, therapies } = props;

  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $maxWidth={[480, 840, 1280]} $ph={[12]}>
        <Heading $font={"heading-1"} tag={"h1"} $mt={[32, 40]} $mb={40}>
          Specialist & Therapies
        </Heading>
        <SpecialistSubjectRow
          subjects={specialist}
          heading="Specialist"
          summary="Our Specialist curriculum helps you to support learning around three stages; early development, building understanding and applying learning, as well as creative arts and physical development."
        />
        <SpecialistSubjectRow
          subjects={therapies}
          heading="Therapies"
          summary="These resources provide tools for delivering support across four therapeutic streams. Choose the best starting point or approach to meet your pupils' developmental needs."
        />
      </MaxWidth>
    </Flex>
  );
};

export default SpecialistSubjectListingPage;
