import React, { FC } from "react";

import Flex from "@/components/SharedComponents/Flex";
import Heading from "@/components/SharedComponents/Typography/Heading";
import NextLessonCard from "@/components/DownloadAndShareComponents/NextLessonCard";
import { Span } from "@/components/SharedComponents/Typography";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

type DownloadConfirmationNextLessonContainerProps = {
  programmeSlug: string;
  unitSlug: string;
  nextLessons: NextLesson[];
  unitTitle: string;
  onwardContentSelected: TrackFns["onwardContentSelected"];
};

const DownloadConfirmationNextLessonContainer: FC<
  DownloadConfirmationNextLessonContainerProps
> = ({
  programmeSlug,
  unitSlug,
  nextLessons,
  unitTitle,
  onwardContentSelected,
}) => {
  return (
    <Flex $flexDirection={"column"} $width={"100%"}>
      <Heading tag={"h3"} $font={["heading-6", "heading-5"]} $mb={[32, 48]}>
        More lessons in: <Span $color={"blue"}>{`${unitTitle}`}</Span>
      </Heading>
      {nextLessons && (
        <Flex $flexDirection={["column", "row"]} $gap={16}>
          {nextLessons.map((lesson: NextLesson) => {
            return (
              <NextLessonCard
                programmeSlug={programmeSlug}
                unitSlug={unitSlug}
                unitTitle={unitTitle}
                lessonSlug={lesson.lessonSlug}
                lessonTitle={lesson.lessonTitle}
                key={lesson.lessonSlug}
                onwardContentSelected={onwardContentSelected}
              />
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};

export default DownloadConfirmationNextLessonContainer;
