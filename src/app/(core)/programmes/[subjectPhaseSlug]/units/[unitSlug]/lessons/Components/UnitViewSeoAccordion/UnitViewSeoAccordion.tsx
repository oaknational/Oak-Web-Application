import {
  OakBasicAccordion,
  OakFlex,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";

export interface UnitViewSeoAccordionProps {
  examBoardTitle?: string;
  yearGroup: string;
  keyStage: string;
  unitTitle: string;
  subjectTitle: string;
  phaseSlug: string;
  subjectPhaseSlug: string;
}

export const UnitViewSeoAccordion = ({
  examBoardTitle,
  yearGroup,
  keyStage,
  unitTitle,
  subjectTitle,
  phaseSlug,
  subjectPhaseSlug,
}: UnitViewSeoAccordionProps) => {
  const examBoardText = examBoardTitle ? `${examBoardTitle} ` : "";

  return (
    <OakBasicAccordion
      id={"units-seo-accordion"}
      header={`Explore this ${examBoardText}${yearGroup} ${keyStage} unit to find free lesson teaching resources, including...`}
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
              page: "curriculum-overview",
              subjectPhaseSlug,
            })}
          >
            {examBoardText}
            {phaseSlug} {subjectTitle} curriculum
          </OakLink>{" "}
          and discover more of our teaching resources for{" "}
          <OakLink
            href={resolveOakHref({
              page: "curriculum-units",
              subjectPhaseSlug,
            })}
          >
            {examBoardText} {phaseSlug} {subjectTitle} programmes
          </OakLink>
          .
        </OakP>
      </OakFlex>
    </OakBasicAccordion>
  );
};
