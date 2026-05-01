import {
  OakBasicAccordion,
  OakFlex,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

export interface UnitViewSeoAccordionProps {
  examBoardTitle?: string;
  yearGroupTitle: string;
  unitTitle: string;
  subjectTitle: string;
  phaseTitle: string;
  subjectPhaseSlug: string;
}

export const UnitViewSeoAccordion = ({
  examBoardTitle,
  yearGroupTitle,
  unitTitle,
  subjectTitle,
  phaseTitle,
  subjectPhaseSlug,
}: UnitViewSeoAccordionProps) => {
  const examBoardText = examBoardTitle ? `${examBoardTitle} ` : "";

  return (
    <OakBasicAccordion
      $bt="border-solid-s"
      $bb="border-solid-s"
      $borderColor="border-neutral-lighter"
      id={"units-seo-accordion"}
      header={
        <OakP $textAlign={"start"}>
          Explore this {examBoardText}
          {yearGroupTitle.toLocaleLowerCase()}{" "}
          {subjectTitle.toLocaleLowerCase()} unit to find free lesson teaching
          resources, including...
        </OakP>
      }
    >
      <OakFlex $flexDirection="column" $gap="spacing-16">
        <OakP>
          slide decks, worksheet PDFs, quizzes and lesson overviews. You can
          select individual lessons from the {unitTitle} unit and download the
          resources you need, or download the entire unit now.
        </OakP>
        <OakP>
          See every unit listed in our{" "}
          <OakLink
            href={resolveOakHref({
              page: "teacher-programme",
              subjectPhaseSlug,
              tab: "overview",
            })}
          >
            {examBoardText}
            {phaseTitle.toLocaleLowerCase()} {subjectTitle.toLocaleLowerCase()}{" "}
            curriculum
          </OakLink>{" "}
          and discover more of our teaching resources for{" "}
          <OakLink
            href={resolveOakHref({
              page: "teacher-programme",
              subjectPhaseSlug,
              tab: "units",
            })}
          >
            {examBoardText} {phaseTitle.toLocaleLowerCase()}{" "}
            {subjectTitle.toLocaleLowerCase()} programmes
          </OakLink>
          .
        </OakP>
      </OakFlex>
    </OakBasicAccordion>
  );
};
