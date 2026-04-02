import { FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakHeadingTag,
  OakIcon,
} from "@oaknational/oak-components";

import { SubjectPathwayArray } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import SubjectListingCardDoubleCountCard from "@/components/TeacherComponents/SubjectListingCardCountCard";
import SubjectListingCardCountCardWithPathways from "@/components/TeacherComponents/SubjectListingCardCountCardWithPathways";
import Card from "@/components/SharedComponents/Card";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";
import { OakColorName } from "@/styles/theme";

export type SubjectListingCardProps = {
  titleTag?: OakHeadingTag;
  subject: SubjectPathwayArray;
  subjectSlug: string;
  keyStageSlug: string;
  keyStageTitle: string;
  $background?: OakColorName;
};

const SubjectListingCard: FC<SubjectListingCardProps> = ({
  titleTag = "h2",
  subject,
  keyStageSlug,
  keyStageTitle,
  subjectSlug,
  $background = "lavender50",
}) => {
  const hasPathways = (subject: SubjectPathwayArray) =>
    !!subject?.[0]?.data.pathwaySlug;

  return (
    <Card
      $flexDirection={"column"}
      $alignItems="stretch"
      $background={$background}
      $pa={[0, 0]}
      $borderRadius={4}
    >
      <OakFlex
        $position={"relative"}
        $flexDirection={["row", "column"]}
        $alignItems={"center"}
        $mb={["spacing-12", "spacing-0"]}
        $ml={["spacing-12", "spacing-0"]}
        $mt="spacing-12"
        $flexGrow={1}
        $justifyContent={["flex-start", "center"]}
      >
        <OakFlex
          $mr={["spacing-8", "spacing-0"]}
          $mb={["spacing-0", "spacing-8"]}
          $height={["spacing-56", "spacing-80"]}
          $width={["spacing-56", "spacing-80"]}
          $minWidth={["spacing-56", "spacing-80"]}
        >
          <OakIcon
            iconName={getValidSubjectIconName(subjectSlug)}
            $width={"100%"}
            $height={"100%"}
            alt=""
          />
        </OakFlex>
        <OakFlex
          $mh={["spacing-0", "spacing-12"]}
          $alignItems={["start", "center"]}
          $minHeight={["spacing-0", "spacing-64"]}
        >
          <OakHeading
            $textAlign={["start", "center"]}
            $font={"heading-6"}
            tag={titleTag}
          >
            {subject?.[0]?.data.subjectTitle}
          </OakHeading>
        </OakFlex>
      </OakFlex>
      <OakFlex
        role={"list"}
        $pb="spacing-12"
        $ph="spacing-12"
        $gap="spacing-12"
        $width={"100%"}
      >
        <OakFlex role={"listitem"} $flexGrow={1}>
          {!hasPathways(subject) && subject.length === 1 && subject[0] && (
            <SubjectListingCardDoubleCountCard
              isLegacyLesson={!subject?.[0]?.hasNewContent}
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
              {...subject[0].data}
            />
          )}
          {hasPathways(subject) && subject.length >= 1 && (
            <SubjectListingCardCountCardWithPathways
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
              subjectPathwaysArray={subject}
            />
          )}
        </OakFlex>
      </OakFlex>
    </Card>
  );
};

export default SubjectListingCard;
