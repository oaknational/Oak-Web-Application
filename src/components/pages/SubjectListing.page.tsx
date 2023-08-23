import { FC } from "react";

import { SubjectListingPageProps } from "../../pages/beta/[viewType]/key-stages/[keyStageSlug]/subjects";
import Flex from "../Flex";
import MaxWidth from "../MaxWidth/MaxWidth";
import SubjectCardList from "../SubjectCardList/SubjectCardList";
import { Heading } from "../Typography";

const SubjectListingPage: FC<SubjectListingPageProps> = (props) => {
  const { subjects, subjectsUnavailable, keyStageSlug, keyStageTitle } = props;

  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $ph={[12]} $maxWidth={[480, 840, 1280]}>
        <Heading $font={"heading-5"} tag={"h2"} $mt={[24, 40]} $mb={30}>
          All subjects
        </Heading>
        <SubjectCardList
          subjects={subjects}
          keyStageSlug={keyStageSlug}
          keyStageTitle={keyStageTitle}
          isAvailable={true}
        />
        {subjectsUnavailable && subjectsUnavailable.length > 0 && (
          <>
            <Heading $font={"heading-7"} tag={"h6"} $mv={16}>
              Coming soon
            </Heading>
            <SubjectCardList
              subjects={subjectsUnavailable}
              isAvailable={false}
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
            />
          </>
        )}
      </MaxWidth>
    </Flex>
  );
};

export default SubjectListingPage;
