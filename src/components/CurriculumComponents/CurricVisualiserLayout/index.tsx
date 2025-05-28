import { OakFlex, OakBox, OakHandDrawnHR } from "@oaknational/oak-components";
import styled from "styled-components";
import { PortableText } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";

import { OakBasicAccordion, OakHeading, OakP } from "@/styles/oakThemeApp";
import { basePortableTextComponents } from "@/components/SharedComponents/PortableText";
import {
  subjectTitleWithCase,
  truncatePortableTextBlock,
} from "@/utils/curriculum/formatting";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import useMediaQuery from "@/hooks/useMediaQuery";

const CurriculumVisualiserLayoutLeft = styled(OakFlex)`
  min-width: 296px;
  width: 296px;
`;

type CurriculumVisualiserLayoutProps = {
  filters: React.ReactNode;
  units: React.ReactNode;
  curriculumSeoText?: PortableTextBlock[];
  subject: SubjectPhasePickerData["subjects"][number];
};

export function CurricVisualiserLayout({
  filters,
  units,
  curriculumSeoText,
  subject,
}: CurriculumVisualiserLayoutProps) {
  const isMobile = useMediaQuery("mobile");

  if (!subject) {
    throw new Error("Subject prop is required for CurricVisualiserLayout");
  }

  const displaySubjectTitle = subjectTitleWithCase(subject.title);

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
                  How to plan your {displaySubjectTitle} curriculum with Oak
                </OakHeading>
              }
              subheading={
                <>
                  <br />
                  <OakP $font={["body-2", "body-1"]} $textAlign="left">
                    {truncatePortableTextBlock(
                      curriculumSeoText,
                      truncationLength,
                    )}
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
