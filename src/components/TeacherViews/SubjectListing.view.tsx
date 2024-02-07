import { FC } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import { SubjectListingPageProps } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import SubjectListingCardDouble from "@/components/TeacherComponents/SubjectListingCardDouble";
import { GridList } from "@/components/SharedComponents/Typography/UL.deprecated";
import { GridAreaListItem } from "@/components/SharedComponents/Typography/LI.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";

const SubjectListingPage: FC<SubjectListingPageProps> = (props) => {
  const { subjects, keyStageSlug, keyStageTitle } = props;

  return (
    <OakFlex $flexDirection={"column"}>
      <MaxWidth $maxWidth={[480, 840, 1280]} $ph={[12]}>
        <OakHeading
          $font={"heading-3"}
          tag={"h1"}
          $mt={["space-between-m2", "space-between-l"]}
          $mb="space-between-l"
        >
          {`${keyStageTitle} subjects`}
        </OakHeading>
        <GridList $rg={16} $cg={16} $gridAutoRows={"1fr"} $mb={72}>
          {subjects.map((subject, i) => {
            return (
              <GridAreaListItem
                key={`subject-list-item-${subject.subjectSlug}-${i}`}
                $colSpan={[12, 6, 3]}
              >
                <SubjectListingCardDouble
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
    </OakFlex>
  );
};

export default SubjectListingPage;
