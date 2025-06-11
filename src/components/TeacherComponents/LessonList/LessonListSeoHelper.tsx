import {
  formatSubjectName,
  getPhase,
} from "../helpers/seoTextHelpers/seoText.helpers";
import { convertSubjectToSlug } from "../helpers/convertSubjectToSlug";
import { getSubjectPhaseSlug } from "../helpers/getSubjectPhaseSlug";

import { OakBasicAccordion, OakBox, OakLink, OakP } from "@/styles/oakThemeApp";
import { resolveOakHref } from "@/common-lib/urls";

export const LessonListSeoHelper = ({
  examBoardSlug,
  keystageSlug,
  parentSubject,
  programmeSlug,
  subjectSlug,
  subjectTitle,
  unitTitle,
  yearTitle,
}: {
  examBoardSlug?: string | null | undefined;
  keystageSlug: string;
  parentSubject?: string | null | undefined;
  programmeSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  unitTitle: string;
  yearTitle: string;
}) => {
  const linkSubject = parentSubject
    ? convertSubjectToSlug(parentSubject)
    : subjectSlug;

  return (
    <OakBox $mb="space-between-xxl">
      <OakBasicAccordion
        header={
          <OakP $font="body-1" $textAlign="left">
            Explore this {yearTitle.toLowerCase()}{" "}
            {formatSubjectName(subjectTitle)} unit to find free lesson teaching
            resources, including...
          </OakP>
        }
        initialOpen={false}
        id="lesson-list-seo"
        data-testid="lesson-list-seo-accordion"
        $bt="border-solid-s"
        $bb="border-solid-s"
        $borderColor="border-neutral-lighter"
        $alignItems="flex-start"
      >
        <OakP $font="body-1" $textAlign="left">
          slide decks, worksheet PDFs, quizzes and lesson overviews. You can
          select individual lessons from the {unitTitle} unit and download the
          resources you need, or download the entire unit now. See every unit
          listed in our{" "}
          <OakLink
            href={resolveOakHref({
              page: "curriculum-units",
              subjectPhaseSlug: getSubjectPhaseSlug({
                subject: linkSubject,
                phaseSlug: getPhase(yearTitle),
                examBoardSlug,
              }),
            })}
          >
            {getPhase(yearTitle)} {formatSubjectName(subjectTitle)} curriculum
          </OakLink>{" "}
          and discover more of our teaching resources for{" "}
          <OakLink
            href={resolveOakHref({
              page: "unit-index",
              programmeSlug,
            })}
          >
            {keystageSlug.toUpperCase()}.
          </OakLink>{" "}
        </OakP>
      </OakBasicAccordion>
    </OakBox>
  );
};
