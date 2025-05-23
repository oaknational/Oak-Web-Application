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
import CurriculumUnitDetailsAccordion from "@/components/CurriculumComponents/CurriculumUnitDetailsAccordion";
import { Thread, Lesson } from "@/utils/curriculum/types";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";

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
  isUnitDescriptionEnabled: boolean;
  handleUnitOverviewExploredAnalytics: (
    componentType: ComponentTypeValueType,
  ) => void;
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
  isUnitDescriptionEnabled,
  handleUnitOverviewExploredAnalytics,
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
            <ul style={{ display: "contents" }}>
              {uniqueThreadsArray.map((thread) => (
                <li key={thread} style={{ display: "contents" }}>
                  <TagFunctional
                    key={thread}
                    text={thread}
                    color={"lavender"}
                    data-testid="thread-tag"
                  />
                </li>
              ))}
            </ul>
          </OakFlex>
        </OakBox>
      )}
      <OakFlex $flexDirection={"column"}>
        {isUnitDescriptionEnabled && (
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
              <CurriculumUnitDetailsAccordion
                title="Why this why now"
                handleUnitOverviewExploredAnalytics={
                  handleUnitOverviewExploredAnalytics
                }
              >
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
            lastAccordion={isUnitDescriptionEnabled}
            handleUnitOverviewExploredAnalytics={
              handleUnitOverviewExploredAnalytics
            }
          >
            <OakOL $mt="space-between-none" data-testid="lesson-title-list">
              {lessons &&
                uniqueLessonTitlesArray?.map((lesson) => {
                  return <OakLI key={lesson}>{lesson}</OakLI>;
                })}
            </OakOL>
          </CurriculumUnitDetailsAccordion>
        )}

        {!isUnitDescriptionEnabled && (
          <>
            {priorUnitDescription && (
              <CurriculumUnitDetailsAccordion
                title="Previous unit description"
                handleUnitOverviewExploredAnalytics={
                  handleUnitOverviewExploredAnalytics
                }
              >
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
                handleUnitOverviewExploredAnalytics={
                  handleUnitOverviewExploredAnalytics
                }
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
