import {
  OakBasicAccordion,
  OakFlex,
  OakLink,
  OakLI,
  OakP,
  OakUL,
} from "@oaknational/oak-components";

import { resolveOakHref } from "@/common-lib/urls";
import { keystageYearMappings } from "@/utils/curriculum/keystage";
import { getKeystagesFromPhase } from "@/fixtures/curriculum/unit";

export const UnitViewSeoAccordion = ({
  examBoardTitle,

  yearGroup,
  keyStage,
  unitTitle,
  subjectTitle,
  phaseSlug,
  subjectPhaseSlug,
}: {
  examBoardTitle?: string;
  yearGroup: string;
  keyStage: string;
  unitTitle: string;
  subjectTitle: string;
  phaseSlug: string;
  subjectPhaseSlug: string;
}) => {
  const examBoardText = examBoardTitle ? `${examBoardTitle} ` : "";

  // Generate keystages and years based on phase
  const getPhaseContent = (phase: string) => {
    const result: { title: string; href: string }[] = [];
    const keystages = getKeystagesFromPhase(phase);
    keystages.forEach((ks) => {
      const years =
        keystageYearMappings[ks as keyof typeof keystageYearMappings];
      const baseHref = resolveOakHref({
        page: "teacher-programme",
        subjectPhaseSlug,
        tab: "units",
      });
      result.push({
        title: ks.toUpperCase(),
        href: `${baseHref}?keystages=${ks}`,
      });
      if (years) {
        years.forEach((year) => {
          result.push({
            title: `Year ${year}`,
            href: `${baseHref}?years=${year}`,
          });
        });
      }
    });

    return result;
  };

  const phaseContent = getPhaseContent(phaseSlug);

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
          , covering:
        </OakP>
        <OakUL>
          {phaseContent.map((item) => (
            <OakLI key={item.title}>
              <OakLink href={item.href}>
                {item.title} {subjectTitle}
              </OakLink>
            </OakLI>
          ))}
        </OakUL>
      </OakFlex>
    </OakBasicAccordion>
  );
};
