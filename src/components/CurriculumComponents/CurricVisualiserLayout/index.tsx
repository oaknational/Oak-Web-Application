import { OakFlex, OakBox, OakHandDrawnHR } from "@oaknational/oak-components";
import styled from "styled-components";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

import { OakBasicAccordion, OakHeading , OakP } from "@/styles/oakThemeApp";
import { basePortableTextComponents } from "@/components/SharedComponents/PortableText";
import { buildPageTitle } from "@/utils/curriculum/formatting";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import useMediaQuery from "@/hooks/useMediaQuery";

function truncateText(text: string, maxLength: number = 100): string {
  text = text.trim();
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }

  return text;
}

const CurriculumVisualiserLayoutLeft = styled(OakFlex)`
  min-width: 296px;
  width: 296px;
`;

type CurriculumVisualiserLayoutProps = {
  filters: React.ReactNode;
  units: React.ReactNode;
  curriculumSeoText?: PortableTextBlock[];
  slugs: CurriculumSelectionSlugs;
  curriculumPhaseOptions: SubjectPhasePickerData;
  keyStages: string[];
};

export function CurricVisualiserLayout({
  filters,
  units,
  curriculumSeoText,
  slugs,
  curriculumPhaseOptions,
  keyStages,
}: CurriculumVisualiserLayoutProps) {
  const isMobile = useMediaQuery("mobile");

  const subject = curriculumPhaseOptions.subjects.find(
    (subject) => subject.slug === slugs.subjectSlug,
  );
  const phase = subject?.phases.find((phase) => phase.slug === slugs.phaseSlug);

  if (!subject || !phase) {
    throw new Error("Subject or phase not found");
  }

  const pageTitle = buildPageTitle(keyStages, subject, phase);

  const subjectTitle = pageTitle
    .replace(/^KS\d+(?:\s*&\s*KS\d+)*\s+/, "")
    .replace(/\s+curriculum$/, "");

  const accordionString = `Use this ${pageTitle.replace("&", "and")} plan to explore our sequences developed by leading subject experts`;

  const truncationLength = isMobile ? 40 : 100;

  return (
    <OakFlex>
      <CurriculumVisualiserLayoutLeft
        data-test-id="filter-sidebar"
        $flexDirection={"column"}
        $display={["none", "block"]}
      >
        {filters}
      </CurriculumVisualiserLayoutLeft>
      <OakFlex $flexGrow={1} $flexDirection="column">
        {units}
        {curriculumSeoText && (
          <OakBox $ph={["inner-padding-s", "inner-padding-none"]}>
            <OakHandDrawnHR
              hrColor={"grey40"}
              $mv={"space-between-sssx"}
              $height={"all-spacing-05"}
            />
            <OakBasicAccordion
              header={
                <OakHeading $font="heading-5" tag="h3" $textAlign="left">
                  How to plan your {subjectTitle} curriculum with Oak
                </OakHeading>
              }
              subheading={
                <>
                  <br />
                  <OakP $font={["body-2", "body-1"]} $textAlign="left">
                    {truncateText(accordionString, truncationLength)}
                  </OakP>
                </>
              }
              initialOpen={false}
              id="curriculum-seo-accordion"
            >
              <OakBox $mt="space-between-m">
                <PortableText
                  value={curriculumSeoText}
                  components={basePortableTextComponents}
                />
              </OakBox>
            </OakBasicAccordion>
            <OakHandDrawnHR
              hrColor={"grey40"}
              $mt={"space-between-sssx"}
              $height={"all-spacing-05"}
            />
          </OakBox>
        )}
      </OakFlex>
    </OakFlex>
  );
}
