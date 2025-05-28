import { OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";
import { PortableTextBlock } from "@portabletext/types";

import { CurricSEOAccordion } from "../CurricSEOAccordion/CurricSEOAccordion";

import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";

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
  if (!subject) {
    throw new Error("Subject prop is required for CurricVisualiserLayout");
  }

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
            subject={subject}
          />
        )}
      </OakFlex>
    </OakFlex>
  );
}
