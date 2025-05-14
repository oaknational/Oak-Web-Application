import { OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";

const LayoutLeft = styled(OakFlex)`
  min-width: 296px;
  width: 296px;
`;

type CurricVisualiserLayoutProps = {
  filters: React.ReactNode;
  units: React.ReactNode;
};
export function CurricVisualiserLayout({
  filters,
  units,
}: CurricVisualiserLayoutProps) {
  return (
    <OakFlex>
      <LayoutLeft
        data-test-id="filter-sidebar"
        $flexDirection={"column"}
        $display={["none", "block"]}
      >
        {filters}
      </LayoutLeft>
      <OakFlex $flexGrow={1}>{units}</OakFlex>
    </OakFlex>
  );
}
