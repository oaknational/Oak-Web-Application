import { FC } from "react";

import Flex from "@/components/Flex";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Heading from "@/components/Typography/Heading";
import Box from "@/components/Box";

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
    <Box
      $background={"aqua50"}
      $borderRadius={4}
      $width={[340, 240, 420]}
      $minHeight={[160, 270, 160]}
    >
      <Flex
        $pa={[16, 16, 24]}
        $flexDirection={"column"}
        $minHeight={[160, 270, 160]}
        $position={"relative"}
        $justifyContent={"space-between"}
        $wordWrap={"break-word"}
        $gap={16}
      >
        <Heading tag="h3" $font={"heading-6"} $mb={[16, "auto"]}>
          {lessonTitle}
        </Heading>

        <Flex
          $flexDirection={["column", "column", "row"]}
          $alignItems={["flex-start"]}
          $gap={24}
        >
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
            size="small"
            data-testid="see-lesson-link"
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
            size="small"
            $font={"heading-7"}
            data-testid="download-resources-link"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default NextLessonCard;
