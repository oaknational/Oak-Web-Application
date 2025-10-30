import {
  OakHeading,
  OakLI,
  OakP,
  OakOL,
  OakFlex,
  OakBox,
  OakUL,
} from "@oaknational/oak-components";

import { TagFunctional } from "@/components/SharedComponents/TagFunctional";
import CurricUnitDetailsAccordion from "@/components/CurriculumComponents/CurricUnitDetailsAccordion";
import { Unit, UnitOption } from "@/utils/curriculum/types";
import { ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { ENABLE_PRIOR_KNOWLEDGE_REQUIREMENTS } from "@/utils/curriculum/constants";
import { priorKnowledgeRequirementsEnabled } from "@/utils/curriculum/features";

export type CurricUnitDetailsProps = {
  unit: Unit;
  unitOption?: UnitOption;
  isUnitDescriptionEnabled: boolean;
  handleUnitOverviewExploredAnalytics: (
    componentType: ComponentTypeValueType,
  ) => void;
};

export default function CurricUnitDetails({
  unit,
  unitOption,
  isUnitDescriptionEnabled,
  handleUnitOverviewExploredAnalytics,
}: Readonly<CurricUnitDetailsProps>) {
  const threads = unit.threads;
  const priorKnowledgeRequirements = unit.prior_knowledge_requirements;
  const {
    lessons,
    connection_prior_unit_description: priorUnitDescription,
    connection_future_unit_description: futureUnitDescription,
    connection_prior_unit_title: priorUnitTitle,
    connection_future_unit_title: futureUnitTitle,
    why_this_why_now: whyThisWhyNow,
    description,
  } = unitOption ?? unit;

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

  const shouldDisplayPriorKnowledge =
    ENABLE_PRIOR_KNOWLEDGE_REQUIREMENTS &&
    priorKnowledgeRequirementsEnabled(unit) &&
    priorKnowledgeRequirements &&
    priorKnowledgeRequirements.length > 0;

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
                    data-testid="ac_threads_tag"
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
                <OakP data-testid="ac_description">{description}</OakP>
              </OakBox>
            )}

            {whyThisWhyNow && (
              <CurricUnitDetailsAccordion
                title="Why this why now"
                handleUnitOverviewExploredAnalytics={
                  handleUnitOverviewExploredAnalytics
                }
              >
                <OakP
                  data-testid="ac_wtwn"
                  $mb="space-between-s"
                  $font={"body-2"}
                >
                  {whyThisWhyNow}
                </OakP>
              </CurricUnitDetailsAccordion>
            )}
          </>
        )}

        {numberOfLessons >= 1 && (
          <CurricUnitDetailsAccordion
            title="Lessons in unit"
            lastAccordion={
              isUnitDescriptionEnabled && !shouldDisplayPriorKnowledge
            }
            handleUnitOverviewExploredAnalytics={
              handleUnitOverviewExploredAnalytics
            }
          >
            <OakOL $mt="space-between-none" data-testid="lesson-title-list">
              {lessons &&
                uniqueLessonTitlesArray?.map((lesson) => {
                  return (
                    <OakLI data-testid="ac_lessons_lesson" key={lesson}>
                      {lesson}
                    </OakLI>
                  );
                })}
            </OakOL>
          </CurricUnitDetailsAccordion>
        )}

        {shouldDisplayPriorKnowledge && (
          <CurricUnitDetailsAccordion
            title="Prior knowledge requirements"
            lastAccordion={isUnitDescriptionEnabled}
            handleUnitOverviewExploredAnalytics={
              handleUnitOverviewExploredAnalytics
            }
          >
            <OakUL $mb="space-between-s" $font={"body-2"}>
              {priorKnowledgeRequirements.map((text, index) => {
                return <OakLI key={index}>{text}</OakLI>;
              })}
            </OakUL>
          </CurricUnitDetailsAccordion>
        )}

        {!isUnitDescriptionEnabled && (
          <>
            {priorUnitDescription && (
              <CurricUnitDetailsAccordion
                title="Previous unit description"
                handleUnitOverviewExploredAnalytics={
                  handleUnitOverviewExploredAnalytics
                }
              >
                <OakP
                  data-testid="ac_prior_title"
                  $mb="space-between-xs"
                  $font={"body-2-bold"}
                >
                  {priorUnitTitle}
                </OakP>
                <OakP $mb="space-between-xs" $font={"body-2"}>
                  {priorUnitDescription}
                </OakP>
              </CurricUnitDetailsAccordion>
            )}

            {futureUnitDescription && (
              <CurricUnitDetailsAccordion
                title="Following unit description"
                handleUnitOverviewExploredAnalytics={
                  handleUnitOverviewExploredAnalytics
                }
                lastAccordion={true}
              >
                <OakP
                  data-testid="ac_future_title"
                  $mb="space-between-xs"
                  $font={"body-2-bold"}
                >
                  {futureUnitTitle}
                </OakP>
                <OakP $mb="space-between-xs" $font={"body-2"}>
                  {futureUnitDescription}
                </OakP>
              </CurricUnitDetailsAccordion>
            )}
          </>
        )}
      </OakFlex>
    </OakFlex>
  );
}
