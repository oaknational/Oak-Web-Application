import React, { FC } from "react";

import Flex from "@/components/Flex";
import Heading from "@/components/Typography/Heading";
import NextLessonCard from "@/components/DownloadComponents/NextLessonCard/NextLessonCard";
import { Span } from "@/components/Typography";

type NextLessonContainerProps = {
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
  futureLessons: string[];
  unitTitle?: string;
};

const NextLessonContainer: FC<NextLessonContainerProps> = ({
  programmeSlug,
  unitSlug,
  lessonSlug,
  futureLessons,
  unitTitle,
}) => {
  return (
    <Flex $flexDirection={"column"} $width={"100%"}>
      <Heading tag={"h3"} $font={["heading-6", "heading-5"]} $mb={[32, 48]}>
        More lessons in: <Span $color={"blue"}>{`${unitTitle}`}</Span>
      </Heading>
      <Flex
        $flexDirection={["column", "row"]}
        $gap={[8, 12, 16]}
        $justifyContent={"space-between"}
      >
        {futureLessons.map((lesson, i) => {
          if (i < 3) {
            return (
              <NextLessonCard
                programmeSlug={programmeSlug}
                unitSlug={unitSlug}
                lessonSlug={lessonSlug}
                lessonTitle={lesson}
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

export default NextLessonContainer;
