import { FC } from "react";

import Flex from "@/components/Flex";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Heading from "@/components/Typography/Heading";
import Box from "@/components/Box";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

type NextLessonCardProps = {
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  unitTitle: string;
  onwardContentSelected: TrackFns["onwardContentSelected"];
};

const NextLessonCard: FC<NextLessonCardProps> = ({
  programmeSlug,
  unitSlug,
  unitTitle,
  lessonSlug,
  lessonTitle,
  onwardContentSelected,
}) => {
  return (
    <Box
      $background={"aqua50"}
      $borderRadius={4}
      $width={"100%"}
      $minWidth={[340, 200, 340]}
      $maxWidth={["100%", "100%", "50%"]}
      $minHeight={[160, 120, 160]}
      data-testid={`next-lesson-card`}
    >
      <Flex
        $pa={[16, 16, 24]}
        $flexDirection={"column"}
        $minHeight={[160, 120, 160]}
        $height={"100%"}
        $position={"relative"}
        $justifyContent={"space-between"}
        $wordWrap={"break-word"}
        $gap={16}
      >
        <Heading tag="h3" $font={"heading-6"} $mb={[16, "auto"]}>
          {lessonTitle}
        </Heading>

        <Flex
          $flexDirection={["column", "row", "row"]}
          $alignItems={["flex-start"]}
          // $justifyContent={"space-between"}
          $flexWrap={"wrap"}
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
            onClick={() => {
              onwardContentSelected({
                lessonName: lessonTitle,
                lessonSlug: lessonSlug,
                unitSlug: unitSlug,
                unitName: unitTitle,
                onwardIntent: "view-lesson",
              });
            }}
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
            onClick={() => {
              onwardContentSelected({
                lessonName: lessonTitle,
                lessonSlug: lessonSlug,
                unitSlug: unitSlug,
                unitName: unitTitle,
                onwardIntent: "download-lesson-resources",
              });
            }}
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default NextLessonCard;
