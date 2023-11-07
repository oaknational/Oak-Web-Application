import React, { FC } from "react";

import Flex from "@/components/Flex";
import ButtonAsLink from "@/components/Button/ButtonAsLink";
import Heading from "@/components/Typography/Heading";
import NextLessonCard from "@/components/DownloadComponents/NextLessonCard/NextLessonCard";

type ConfirmationContainerProps = {
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  futureLessons: string[];
};

const ConfirmationContainer: FC<ConfirmationContainerProps> = ({
  programmeSlug,
  unitSlug,
  lessonSlug,
  lessonTitle,
  futureLessons,
}) => {
  return (
    <Flex $flexDirection={"column"} $mb={80} $mt={56}>
      <Flex $flexDirection={"row"} $mb={48}>
        <Heading tag={"h3"} $font={"heading-5"}>
          More lessons in:
        </Heading>
        <ButtonAsLink
          page={"lesson-overview"}
          programmeSlug={programmeSlug}
          unitSlug={unitSlug}
          lessonSlug={lessonSlug}
          variant={"buttonStyledAsLink"}
          label={lessonTitle}
          size="large"
          $font={"heading-5"}
        />
      </Flex>
      <Flex $flexDirection={"row"} $gap={16}>
        {futureLessons.map((lesson, i) => {
          if (i < 3) {
            return (
              <NextLessonCard
                programmeSlug={programmeSlug}
                unitSlug={unitSlug}
                lessonSlug={lessonSlug}
                lessonTitle={lessonTitle}
                key={lesson}
              />
            );
          } else {
            return null;
          }
        })}
      </Flex>
    </Flex>
  );
};

export default ConfirmationContainer;
