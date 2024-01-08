import { FC } from "react";

import { SubjectListingPageProps } from "../../pages/teachers/key-stages/[keyStageSlug]/subjects";
import SubjectCardDouble from "../SubjectCardDouble/SubjectCardDouble";
import { GridList } from "../SharedComponents/Typography/UL";
import { GridAreaListItem } from "../SharedComponents/Typography/LI";

import { Heading } from "@/components/SharedComponents/Typography";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Flex from "@/components/SharedComponents/Flex";

const SubjectListingPage: FC<SubjectListingPageProps> = (props) => {
  const { subjects, keyStageSlug, keyStageTitle } = props;

  return (
    <Flex $flexDirection={"column"}>
      <MaxWidth $maxWidth={[480, 840, 1280]} $ph={[12]}>
        <Heading $font={"heading-3"} tag={"h1"} $mt={[32, 40]} $mb={40}>
          {`${keyStageTitle} subjects`}
        </Heading>
        <GridList $rg={16} $cg={16} $gridAutoRows={"1fr"} $mb={72}>
          {subjects.map((subject, i) => {
            return (
              <GridAreaListItem
                key={`subject-list-item-${subject.subjectSlug}-${i}`}
                $colSpan={[12, 6, 3]}
              >
                <SubjectCardDouble
                  subject={subject}
                  subjectSlug={subject.subjectSlug}
                  keyStageSlug={keyStageSlug}
                  keyStageTitle={keyStageTitle}
                />
              </GridAreaListItem>
            );
          })}
        </GridList>
      </MaxWidth>
    </Flex>
  );
};

export default SubjectListingPage;
