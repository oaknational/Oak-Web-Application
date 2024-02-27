import { FC } from "react";
import {
  OakHeading,
  OakLI,
  OakP,
  OakOL,
  OakFlex,
} from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";
import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { Lesson } from "@/components/CurriculumComponents/UnitModal/UnitModal";
import { Thread } from "@/components/CurriculumComponents/UnitsTab/UnitsTab";
import CurriculumUnitDetailsAccordion from "@/components/CurriculumComponents/CurriculumUnitDetailsAccordion";

export type CurriculumUnitDetailsProps = {
  unitTitle?: string;
  threads: Thread[];
  lessons: Lesson[] | null | undefined;
  priorUnitDescription: string | null;
  futureUnitDescription: string | null;
  priorUnitTitle: string | null;
  futureUnitTitle: string | null;
};

export const CurriculumUnitDetails: FC<CurriculumUnitDetailsProps> = ({
  threads,
  lessons,
  priorUnitDescription,
  futureUnitDescription,
  priorUnitTitle,
  futureUnitTitle,
}) => {
  const threadTitleSet = new Set<string>(threads.map((thread) => thread.title));

  const lessonTitleSet = new Set<string>(
    lessons?.map((lesson) => lesson.title),
  );

  const uniqueThreadsArray = Array.from(threadTitleSet);
  const uniqueLessonTitlesArray = Array.from(lessonTitleSet);
  const numberOfLessons = uniqueLessonTitlesArray.length;

  const lessonsInUnit = `${uniqueLessonTitlesArray.length} ${
    numberOfLessons === 1 ? "lesson" : "lessons"
  }`;

  return (
    <OakFlex
      $flexDirection={"column"}
      $width={"100%"}
      $mb="space-between-m"
      data-testid="curriculum-unit-details"
    >
      <OakP $mb="space-between-m2" $font={"body-2"}>
        {lessonsInUnit}
      </OakP>

      {uniqueThreadsArray.length >= 1 && (
        <Box $mb={[24, 32]}>
          <OakHeading tag="h3" $font={"heading-6"} $mb="space-between-ssx">
            Threads
          </OakHeading>
          <OakFlex
            $flexDirection={["column", "row"]}
            $flexWrap={"wrap"}
            $gap="all-spacing-2"
            $alignItems={"flex-start"}
          >
            {uniqueThreadsArray.map((thread) => (
              <TagFunctional
                key={thread}
                text={thread}
                color={"grey"}
                data-testid="thread-tag"
              />
            ))}
          </OakFlex>
        </Box>
      )}
      <OakFlex $flexDirection={"column"}>
        {numberOfLessons >= 1 && (
          <CurriculumUnitDetailsAccordion title="Lessons in unit">
            <OakOL $mt="space-between-none" data-testid="lesson-title-list">
              {lessons &&
                uniqueLessonTitlesArray?.map((lesson) => {
                  return <OakLI key={lesson}>{lesson}</OakLI>;
                })}
            </OakOL>
          </CurriculumUnitDetailsAccordion>
        )}

        {priorUnitDescription && (
          <CurriculumUnitDetailsAccordion title="Previous unit description">
            <OakP $mb="space-between-xs" $font={"body-2-bold"}>
              {priorUnitTitle}
            </OakP>
            <OakP $mb="space-between-xs" $font={"body-2"}>
              {priorUnitDescription}
            </OakP>
          </CurriculumUnitDetailsAccordion>
        )}

        {futureUnitDescription && (
          <CurriculumUnitDetailsAccordion
            title="Following unit description"
            lastAccordion={true}
          >
            <OakP $mb="space-between-xs" $font={"body-2-bold"}>
              {futureUnitTitle}
            </OakP>
            <OakP $mb="space-between-xs" $font={"body-2"}>
              {futureUnitDescription}
            </OakP>
          </CurriculumUnitDetailsAccordion>
        )}
      </OakFlex>
    </OakFlex>
  );
};
