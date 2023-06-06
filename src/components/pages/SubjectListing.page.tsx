import { FC } from "react";

import { ProgrammeProps } from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";
import Flex from "../Flex";
import MaxWidth from "../MaxWidth/MaxWidth";
import SubjectCardList from "../SubjectCardList/SubjectCardList";
import { Heading } from "../Typography";

const SubjectListingPage: FC<ProgrammeProps> = (props) => {
  const { programmesBySubjectAvailable, programmesBySubjectUnavailable } =
    props;

  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $ph={[12]} $maxWidth={[480, 840, 1280]}>
        <Flex $pt={20} $font={"body-2"}>
          {programmesBySubjectAvailable.length} subjects
        </Flex>
        <Heading $font={"heading-5"} tag={"h2"} $mt={[32, 64]} $mb={30}>
          All subjects
        </Heading>
        <SubjectCardList
          subjects={programmesBySubjectAvailable}
          isAvailable={true}
        />
        {programmesBySubjectUnavailable.length > 0 && (
          <>
            <Heading $font={"heading-7"} tag={"h6"} $mv={16}>
              Coming soon
            </Heading>
            <SubjectCardList
              subjects={programmesBySubjectUnavailable}
              isAvailable={false}
            />
          </>
        )}
      </MaxWidth>
    </Flex>
  );
};

export default SubjectListingPage;
