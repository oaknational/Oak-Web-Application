import { FC } from "react";

import { Heading, HeadingTag, LI, UL } from "../Typography";
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
        <Flex $mr={[8, 0]} $mb={[0, 8]} $height={[56, 72]} $width={[56, 72]}>
          <SubjectIcon subjectSlug={subjectSlug} $ma={"auto"} />
        </Flex>
        <Flex $mh={[0, 12]} $alignItems={"center"} $minHeight={[0, 72]}>
          <Heading
            $textAlign={"center"}
            $font={["heading-6", "heading-5"]}
            tag={titleTag}
          >
            {subject.new?.subjectTitle || subject.old?.subjectTitle}
          </Heading>
        </Flex>
      </Flex>
      <UL
        $display={"flex"}
        $pb={12}
        $ph={12}
        $gap={12}
        $width={"100%"}
        $reset={true}
      >
        {subject.old && (
          <LI $flex={1} $display={"flex"}>
            <CountCard
              isNew={false}
              keyStageSlug={keyStageSlug}
              keyStageTitle={keyStageTitle}
              {...subject.old}
            />
          </LI>
        )}
        {subject.new && (
          <LI $flex={1} $display={"flex"}>
            <CountCard
              isNew={true}
              keyStageTitle={keyStageTitle}
              keyStageSlug={keyStageSlug}
              {...subject.new}
            />
          </LI>
        )}
      </UL>
    </Card>
  );
};

export default SubjectCardDouble;
