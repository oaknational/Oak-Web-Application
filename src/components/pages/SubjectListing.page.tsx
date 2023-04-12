import { FC } from "react";

import useTrackPageView from "../../hooks/useTrackPageView";
import {
  ProgrammeProps,
  ProgrammesArray,
  SubjectByProgramme,
} from "../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";
import Flex from "../Flex";
import MaxWidth from "../MaxWidth/MaxWidth";
import SubjectCardList from "../SubjectCardList/SubjectCardList";
import { Heading } from "../Typography";

export const getProgrammesBySubjectValues = (
  programmes: SubjectByProgramme
): ProgrammesArray[] => {
  return Object.values(programmes);
};

const SubjectListingPage: FC<ProgrammeProps> = (props) => {
  const { programmesBySubjectAvailable, programmesBySubjectUnavailable } =
    props;

  const subjectsAvailableValues = getProgrammesBySubjectValues(
    programmesBySubjectAvailable
  );
  const subjectsUnavailableValues = getProgrammesBySubjectValues(
    programmesBySubjectUnavailable
  );

  useTrackPageView({ pageName: "Subject Listing" });

  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $ph={[12]} $maxWidth={[480, 840, 1280]}>
        <Flex $pv={20} $font={"body-2"}>
          {subjectsAvailableValues.length} subjects
        </Flex>
        <Heading $font={"heading-5"} tag={"h5"} $mb={30}>
          All subjects
        </Heading>
        <SubjectCardList
          subjects={subjectsAvailableValues}
          isAvailable={true}
        />
        {subjectsUnavailableValues.length > 0 && (
          <>
            <Heading $font={"heading-7"} tag={"h6"} $mv={16}>
              Coming soon
            </Heading>
            <SubjectCardList
              subjects={subjectsUnavailableValues}
              isAvailable={false}
            />
          </>
        )}
      </MaxWidth>
    </Flex>
  );
};

export default SubjectListingPage;
