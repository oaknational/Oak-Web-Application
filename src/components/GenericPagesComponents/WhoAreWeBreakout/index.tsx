import { OakFlex, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

const CustomFlex = styled(OakFlex)`
  flex-direction: row;

  @media (max-width: 1020px) {
    flex-direction: column;
  }
`;

export function WhoAreWeBreakout() {
  return (
    <CustomFlex $background={"mint"} $flexDirection={["column", "row", "row"]}>
      <OakFlex
        $flexGrow={1}
        $background={"mint110"}
        $height="all-spacing-20"
        $aspectRatio={"4/3"}
      />
      <OakFlex
        $flexShrink={1}
        $ph={"inner-padding-xl8"}
        $pv={"inner-padding-xl3"}
        $alignItems={"center"}
      >
        <OakP $font={"heading-light-5"}>
          We’re Oak, your trusted planning partner for great teaching. Our free,
          adaptable resources evolve with education to give teachers and schools
          the latest tools to deliver inspiring lessons, save time and improve
          pupil outcomes.
        </OakP>
      </OakFlex>
    </CustomFlex>
  );
}
