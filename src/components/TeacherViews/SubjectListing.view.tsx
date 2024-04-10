import { FC } from "react";
import { OakHeading, OakFlex } from "@oaknational/oak-components";

import OwaLink from "../SharedComponents/OwaLink";

import { SubjectListingPageProps } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import SubjectListingCardDouble from "@/components/TeacherComponents/SubjectListingCardDouble";
import { GridList } from "@/components/SharedComponents/Typography/UL.deprecated";
import { GridAreaListItem } from "@/components/SharedComponents/Typography/LI.deprecated";
import { P } from "@/components/SharedComponents/Typography";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Flex from "@/components/SharedComponents/Flex.deprecated";

const SubjectListingPage: FC<SubjectListingPageProps> = (props) => {
  const { subjects, keyStageSlug, keyStageTitle } = props;

  const isEyfs = keyStageSlug === "early-years-foundation-stage";
  const sentenceCaseKeyStageTitle =
    keyStageTitle.charAt(0).toUpperCase() +
    keyStageTitle.slice(1).toLowerCase();

  const title = isEyfs
    ? `EYFS areas of learning`
    : `${sentenceCaseKeyStageTitle} subjects`;

  return (
    <OakFlex $flexDirection={"column"}>
      <MaxWidth $maxWidth={[480, 840, 1280]} $ph={[12]}>
        <Flex
          $flexDirection="column"
          $gap={16}
          $mb={isEyfs ? 26 : 40}
          $maxWidth={960}
        >
          <OakHeading
            $font={"heading-3"}
            tag={"h1"}
            $mt={["space-between-m2", "space-between-l"]}
          >
            {title}
          </OakHeading>
          {isEyfs && (
            <P $font="heading-light-7">
              These teaching resources were made during the pandemic for parents
              to use at home with their children. Now they are used by teachers
              as inspiration for their own lesson planning. Learn about the
              evolution of our EYFS curriculum and how to use it in your
              classroom. Visit our blog to learn more{" "}
              <OwaLink
                href="https://www.thenational.academy/blog/oaks-approach-to-eyfs"
                aria-label="eyfs-at-oak-blog"
                page={null}
              >
                here
              </OwaLink>
              .
            </P>
          )}
        </Flex>
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
                  keyStageTitle={sentenceCaseKeyStageTitle}
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
