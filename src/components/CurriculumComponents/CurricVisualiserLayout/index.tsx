import { OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";

const CurriculumVisualiserLayoutLeft = styled(OakFlex)`
  min-width: 296px;
  width: 296px;
`;

type CurriculumVisualiserLayoutProps = {
  filters: React.ReactNode;
  units: React.ReactNode;
};
export function CurricVisualiserLayout({
  filters,
  units,
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
      <OakFlex $flexGrow={1}>{units}</OakFlex>
    </OakFlex>
  );
}
