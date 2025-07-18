import {
  OakBasicAccordion,
  OakBox,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import {
  formatSubjectName,
  getPhase,
} from "../helpers/seoTextHelpers/seoText.helpers";
import { convertSubjectToSlug } from "../helpers/convertSubjectToSlug";
import { getSubjectPhaseSlug } from "../helpers/getSubjectPhaseSlug";

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
  examBoardSlug?: string | null;
  keystageSlug: string;
  parentSubject?: string | null;
  programmeSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  unitTitle: string;
  yearTitle: string;
}) => {
  const linkSubject = parentSubject
    ? convertSubjectToSlug(parentSubject)
    : subjectSlug;

  const hideCurriculumLink =
    subjectSlug === "rshe-pshe" || subjectSlug === "financial-education";

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
        <OakP $font="body-1" $textAlign="left" $mb="space-between-ssx">
          slide decks, worksheet PDFs, quizzes and lesson overviews. You can
          select individual lessons from: {unitTitle} unit and download the
          resources you need, or download the entire unit now. See every unit
          listed in our{" "}
          {hideCurriculumLink ? (
            `${getPhase(yearTitle)} ${formatSubjectName(subjectTitle)} curriculum`
          ) : (
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
            </OakLink>
          )}{" "}
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
