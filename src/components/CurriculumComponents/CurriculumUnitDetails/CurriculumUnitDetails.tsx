import { FC } from "react";
import {
  OakHeading,
  OakLI,
  OakP,
  OakOL,
  OakFlex,
  OakBox,
} from "@oaknational/oak-components";

import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import { Lesson } from "@/components/CurriculumComponents/UnitModal/UnitModal";
import CurriculumUnitDetailsAccordion from "@/components/CurriculumComponents/CurriculumUnitDetailsAccordion";
import { Thread } from "@/utils/curriculum/types";

export type CurriculumUnitDetailsProps = {
  unitTitle?: string;
  threads: Thread[];
  lessons: Lesson[] | null | undefined;
  priorUnitDescription: string | null;
  futureUnitDescription: string | null;
  priorUnitTitle: string | null;
  futureUnitTitle: string | null;
  whyThisWhyNow: string | null;
  description: string | null;
  cycle: string;
};

export const CurriculumUnitDetails: FC<CurriculumUnitDetailsProps> = ({
  threads,
  lessons,
  priorUnitDescription,
  futureUnitDescription,
  priorUnitTitle,
  futureUnitTitle,
  whyThisWhyNow,
  description,
  cycle,
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
        <OakBox $mb={["space-between-m", "space-between-m2"]}>
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
                color={"lavender"}
                data-testid="thread-tag"
              />
            ))}
          </OakFlex>
        </OakBox>
      )}
      <OakFlex $flexDirection={"column"}>
        {cycle === "2" && (
          <>
            {description && (
              <OakBox $mb={"space-between-m2"}>
                <OakHeading
                  tag="h3"
                  $font={"heading-6"}
                  $mb="space-between-ssx"
                >
                  Description
                </OakHeading>
                <OakP>{description}</OakP>
              </OakBox>
            )}

            {whyThisWhyNow && (
              <CurriculumUnitDetailsAccordion title="Why this why now">
                <OakP $mb="space-between-xs" $font={"body-2"}>
                  {whyThisWhyNow}
                </OakP>
              </CurriculumUnitDetailsAccordion>
            )}
          </>
        )}

        {numberOfLessons >= 1 && (
          <CurriculumUnitDetailsAccordion
            title="Lessons in unit"
            lastAccordion={cycle === "2"}
          >
            <OakOL $mt="space-between-none" data-testid="lesson-title-list">
              {lessons &&
                uniqueLessonTitlesArray?.map((lesson) => {
                  return <OakLI key={lesson}>{lesson}</OakLI>;
                })}
            </OakOL>
          </CurriculumUnitDetailsAccordion>
        )}

        {cycle === "1" && (
          <>
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
          </>
        )}
      </OakFlex>
    </OakFlex>
  );
};
