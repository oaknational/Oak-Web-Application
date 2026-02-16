import { OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";
import { PortableTextBlock } from "@portabletext/types";

import CurricSEOAccordion from "@/components/CurriculumComponents/CurricSEOAccordion";

const CurriculumVisualiserLayoutLeft = styled(OakFlex)`
  min-width: 296px;
  width: 296px;
`;

type CurriculumVisualiserLayoutProps = {
  filters: React.ReactNode;
  units: React.ReactNode;
  curriculumSeoText?: PortableTextBlock[];
  subjectTitle: string;
};

export function CurricVisualiserLayout({
  filters,
  units,
  curriculumSeoText,
  subjectTitle,
}: Readonly<CurriculumVisualiserLayoutProps>) {
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
          <CurricSEOAccordion
            curriculumSeoText={curriculumSeoText}
            subjectTitle={subjectTitle}
          />
        )}
      </OakFlex>
    </OakFlex>
  );
}
