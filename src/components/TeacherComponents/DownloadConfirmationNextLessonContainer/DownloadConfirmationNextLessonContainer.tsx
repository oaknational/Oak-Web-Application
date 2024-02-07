import React, { FC } from "react";
import { OakSpan, OakHeading } from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex";
import DownloadConfirmationNextLessonCard from "@/components/TeacherComponents/DownloadConfirmationNextLessonCard";
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
      <OakHeading
        tag={"h3"}
        $font={["heading-6", "heading-5"]}
        $mb={["space-between-m2", "space-between-l"]}
      >
        More lessons in: <OakSpan $color={"blue"}>{`${unitTitle}`}</OakSpan>
      </OakHeading>
      {nextLessons && (
        <Flex $flexDirection={["column", "row"]} $gap={16}>
          {nextLessons.map((lesson: NextLesson) => {
            return (
              <DownloadConfirmationNextLessonCard
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
