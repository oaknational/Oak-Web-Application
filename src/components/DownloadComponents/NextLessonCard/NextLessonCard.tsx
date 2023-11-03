import { FC } from "react";

import Flex from "@/components/Flex";
import Card from "@/components/Card";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Heading from "@/components/Typography/Heading";

type NextLessonCardProps = {
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  lessonTitle: string;
};

const NextLessonCard: FC<NextLessonCardProps> = ({
  programmeSlug,
  unitSlug,
  lessonSlug,
  lessonTitle,
}) => {
  return (
    <Card $background={"aqua50"} $borderRadius={4} $width={420} $height={160}>
      <Flex
        $flexDirection={"column"}
        $pa={24}
        $height={[110, 200, 110]}
        $width={[300, 200, 360]}
      >
        <Heading tag="h3" $font={"heading-6"}>
          {lessonTitle}
        </Heading>
        <Flex $flexDirection={"row"} $mt={"auto"} $gap={24}>
          <ButtonAsLink
            page={"lesson-overview"}
            programmeSlug={programmeSlug}
            unitSlug={unitSlug}
            lessonSlug={lessonSlug}
            variant={"buttonStyledAsLink"}
            icon="chevron-right"
            $iconPosition="trailing"
            iconBackground="aqua50"
            label="See lesson"
          />

          <ButtonAsLink
            page={"lesson-downloads"}
            programmeSlug={programmeSlug}
            unitSlug={unitSlug}
            lessonSlug={lessonSlug}
            variant={"buttonStyledAsLink"}
            icon="chevron-right"
            $iconPosition="trailing"
            label="Download resources"
            $background={"aqua50"}
            iconBackground="aqua50"
          />
        </Flex>
      </Flex>
    </Card>
  );
};

export default NextLessonCard;
