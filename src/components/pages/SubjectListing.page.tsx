import { FC } from "react";

import useTrackPageView from "../../hooks/useTrackPageView";
import { TeachersKeyStageSubjectsData } from "../../node-lib/curriculum-api";
import Flex from "../Flex";
import MaxWidth from "../MaxWidth/MaxWidth";
import SubjectCardList from "../SubjectCardList/SubjectCardList";
import { Heading } from "../Typography";

type SubjectListingProps = {
  subjects: TeachersKeyStageSubjectsData["subjects"];
};

const SubjectListingPage: FC<SubjectListingProps> = (props) => {
  const { subjects } = props;

  const availableSubjects = subjects.filter((subject) => subject.lessonCount);
  const unavailableSubjects = subjects.filter(
    (subject) => !subject.lessonCount
  );

  useTrackPageView({ pageName: "Subject Listing" });

  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $ph={[12]} $maxWidth={[480, 840, 1280]}>
        <Flex $pv={20} $font={"body-2"}>
          {availableSubjects.length} subjects
        </Flex>
        <Heading $font={"heading-5"} tag={"h5"} $mb={30}>
          All subjects
        </Heading>
        <SubjectCardList subjects={availableSubjects} />
        {unavailableSubjects.length > 0 && (
          <>
            <Heading $font={"heading-7"} tag={"h6"} $mv={16}>
              Coming soon
            </Heading>
            <SubjectCardList subjects={unavailableSubjects} />
          </>
        )}
      </MaxWidth>
    </Flex>
  );
};

export default SubjectListingPage;
