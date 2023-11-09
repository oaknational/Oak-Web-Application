import React, { FC } from "react";

import Flex from "@/components/Flex";
import Heading from "@/components/Typography/Heading";
import NextLessonCard from "@/components/DownloadComponents/NextLessonCard/NextLessonCard";
import { Span } from "@/components/Typography";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";

type NextLessonContainerProps = {
  programmeSlug: string;
  unitSlug: string;
  nextLessons: NextLesson[];
  unitTitle?: string;
};

const NextLessonContainer: FC<NextLessonContainerProps> = ({
  programmeSlug,
  unitSlug,
  nextLessons,
  unitTitle,
}) => {
  return (
    <Flex $flexDirection={"column"} $width={"100%"}>
      <Heading tag={"h3"} $font={["heading-6", "heading-5"]} $mb={[32, 48]}>
        More lessons in: <Span $color={"blue"}>{`${unitTitle}`}</Span>
      </Heading>
      {nextLessons && (
        <Flex $flexDirection={["column", "row"]} $gap={[8, 12, 16]}>
          {nextLessons.map((lesson: NextLesson) => {
            return (
              <NextLessonCard
                programmeSlug={programmeSlug}
                unitSlug={unitSlug}
                lessonSlug={lesson.lessonSlug}
                lessonTitle={lesson.lessonTitle}
                key={lesson.lessonSlug}
              />
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};

export default NextLessonContainer;
