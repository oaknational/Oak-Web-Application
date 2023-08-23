import { FC } from "react";

import { Heading, HeadingTag } from "../Typography";
import Flex from "../Flex";
import Card, { CardProps } from "../Card";
import SubjectIcon from "../SubjectIcon";
import { Subjects } from "../../pages/beta/[viewType]/key-stages/[keyStageSlug]/subjects";

import CountCard from "./CountCard";

export type SubjectCardDoubleProps = Omit<CardProps, "children"> & {
  titleTag?: HeadingTag;
} & {
  subject: Subjects[number];
  subjectSlug: string;
  keyStageSlug: string;
  keyStageTitle: string;
};

const SubjectCardDouble: FC<SubjectCardDoubleProps> = ({
  titleTag = "h3",
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
        $mb={[12, 32]}
        $ml={[12, 0]}
        $mt={[12, 32]}
      >
        <Flex $mr={[8, 0]} $mb={[0, 8]} $height={[56, 72]} $width={[56, 72]}>
          <SubjectIcon subjectSlug={subjectSlug} $ma={"auto"} />
        </Flex>
        <Heading
          $textAlign={"center"}
          $font={["heading-6", "heading-5"]}
          tag={titleTag}
          id={"subject-title"}
        >
          {subject.new?.subjectTitle || subject.old?.subjectTitle}
        </Heading>
      </Flex>
      <Flex $pb={12} $ph={12} $gap={12} $width={"100%"}>
        {subject.old && (
          <CountCard
            isNew={false}
            keyStageSlug={keyStageSlug}
            keyStageTitle={keyStageTitle}
            {...subject.old}
          />
        )}
        {subject.new && (
          <CountCard
            isNew={true}
            keyStageTitle={keyStageTitle}
            keyStageSlug={keyStageSlug}
            {...subject.new}
          />
        )}
      </Flex>
    </Card>
  );
};

export default SubjectCardDouble;
