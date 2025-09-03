import { OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";
import { PortableTextBlock } from "@portabletext/types";

import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import CurricSEOAccordion from "@/components/CurriculumComponents/CurricSEOAccordion";

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
