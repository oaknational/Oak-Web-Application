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
import Card, { CardProps } from "@/components/SharedComponents/Card";
import { getValidSubjectIconName } from "@/utils/getValidSubjectIconName";

export type SubjectListingCardProps = Omit<CardProps, "children"> & {
  titleTag?: OakHeadingTag;
} & {
  subject: SubjectPathwayArray;
  subjectSlug: string;
  keyStageSlug: string;
  keyStageTitle: string;
};

const SubjectListingCard: FC<SubjectListingCardProps> = ({
  titleTag = "h2",
  subject,
  keyStageSlug,
  keyStageTitle,
  subjectSlug,
}) => {
  const hasPathways = (subject: SubjectPathwayArray) =>
    !!subject?.[0]?.data.pathwaySlug;

  return (
    <Card
      $flexDirection={"column"}
      $alignItems="stretch"
      $background={"lavender50"}
      $pa={[0, 0]}
      $borderRadius={4}
    >
      <OakFlex
        $position={"relative"}
        $flexDirection={["row", "column"]}
        $alignItems={"center"}
        $mb={["space-between-xs", "space-between-none"]}
        $ml={["space-between-xs", "space-between-none"]}
        $mt="space-between-xs"
        $flexGrow={1}
        $justifyContent={["flex-start", "center"]}
      >
        <OakFlex
          $mr={["space-between-ssx", "space-between-none"]}
          $mb={["space-between-none", "space-between-ssx"]}
          $height={["all-spacing-10", "all-spacing-13"]}
          $width={["all-spacing-10", "all-spacing-13"]}
          $minWidth={["all-spacing-10", "all-spacing-13"]}
        >
          <OakIcon
            iconName={getValidSubjectIconName(subjectSlug)}
            $width={"100%"}
            $height={"100%"}
            alt=""
          />
        </OakFlex>
        <OakFlex
          $mh={["space-between-none", "space-between-xs"]}
          $alignItems={["start", "center"]}
          $minHeight={["all-spacing-0", "all-spacing-11"]}
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
        $pb="inner-padding-s"
        $ph="inner-padding-s"
        $gap="space-between-xs"
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
