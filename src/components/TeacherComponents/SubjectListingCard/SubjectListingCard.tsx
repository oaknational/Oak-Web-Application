import { FC } from "react";
import { OakHeading, OakHeadingTag } from "@oaknational/oak-components";

import SubjectIcon from "@/components/SharedComponents/SubjectIcon";
import { Subjects } from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import SubjectListingCardDoubleCountCard from "@/components/TeacherComponents/SubjectListingCardCountCard";
import Card, { CardProps } from "@/components/SharedComponents/Card";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export type SubjectListingCardProps = Omit<CardProps, "children"> & {
  titleTag?: OakHeadingTag;
} & {
  subject: Subjects[number];
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
  return (
    <Card
      $flexDirection={"column"}
      $alignItems="stretch"
      $background={"lavender50"}
      $pa={[0, 0]}
      $borderRadius={4}
    >
      <Flex
        $position={"relative"}
        $flexDirection={["row", "column"]}
        $alignItems={"center"}
        $mb={[12, 0]}
        $ml={[12, 0]}
        $mt={[12, 12]}
      >
        <Flex
          $mr={[8, 0]}
          $mb={[0, 8]}
          $height={[56, 72]}
          $width={[56, 72]}
          $minWidth={[56, 72]}
        >
          <SubjectIcon subjectSlug={subjectSlug} $ma={"auto"} />
        </Flex>
        <Flex
          $mh={[0, 12]}
          $alignItems={["start", "center"]}
          $minHeight={[0, 72]}
        >
          <OakHeading
            $textAlign={["start", "center"]}
            $font={"heading-6"}
            tag={titleTag}
          >
            {subject.data.subjectTitle || subject.data.subjectTitle}
          </OakHeading>
        </Flex>
      </Flex>
      <Flex role={"list"} $pb={12} $ph={12} $gap={12} $width={"100%"}>
        <Flex role={"listitem"} $flex={1}>
          <SubjectListingCardDoubleCountCard
            isLegacyLesson={!subject.hasNewContent}
            keyStageSlug={keyStageSlug}
            keyStageTitle={keyStageTitle}
            {...subject.data}
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default SubjectListingCard;
