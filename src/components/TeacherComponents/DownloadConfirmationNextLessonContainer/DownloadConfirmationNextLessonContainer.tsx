import React, { FC } from "react";
import { OakSpan, OakHeading, OakFlex } from "@oaknational/oak-components";

import DownloadConfirmationNextLessonCard from "@/components/TeacherComponents/DownloadConfirmationNextLessonCard";
import { NextLesson } from "@/node-lib/curriculum-api-2023/queries/lessonDownloads/lessonDownloads.schema";
import { OnwardContentSelectedProperties } from "@/browser-lib/avo/Avo";

type DownloadConfirmationNextLessonContainerProps = {
  programmeSlug: string;
  unitSlug: string;
  nextLessons: NextLesson[];
  unitTitle: string;
  onwardContentSelected: (
    properties: Omit<
      OnwardContentSelectedProperties,
      "lessonReleaseDate" | "lessonReleaseCohort"
    >,
  ) => void;
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
    <OakFlex $flexDirection={"column"} $width={"100%"}>
      <OakHeading
        tag={"h3"}
        $font={["heading-6", "heading-5"]}
        $mb={["space-between-m2", "space-between-l"]}
      >
        More lessons in: <OakSpan $color={"blue"}>{`${unitTitle}`}</OakSpan>
      </OakHeading>
      {nextLessons && (
        <OakFlex $flexDirection={["column", "row"]} $gap="all-spacing-4">
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
        </OakFlex>
      )}
    </OakFlex>
  );
};

export default DownloadConfirmationNextLessonContainer;
