import { OakFlex, OakImage, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

const CustomFlex = styled(OakFlex)`
  flex-direction: row;

  @media (max-width: 920px) {
    flex-direction: column;
  }
`;

export type WhoAreWeBreakoutProps = {
  content: string;
  imageUrl: string;
  imageAlt: string;
};
export function WhoAreWeBreakout({
  content,
  imageUrl,
  imageAlt,
}: Readonly<WhoAreWeBreakoutProps>) {
  return (
    <CustomFlex $background={"mint"} $mh={"auto"}>
      <OakFlex
        $flexGrow={1}
        $background={"mint110"}
        $minWidth={["100%", "all-spacing-21", "all-spacing-22"]}
        $aspectRatio={"4/3"}
      >
        <OakImage $objectFit={"cover"} alt={imageAlt} src={imageUrl} />
      </OakFlex>
      <OakFlex
        $flexShrink={1}
        $ph={["inner-padding-m", "inner-padding-xl8", "inner-padding-xl8"]}
        $pv={["inner-padding-xl5", "inner-padding-xl8", "inner-padding-xl8"]}
        $alignItems={"center"}
      >
        <OakP $font={["heading-light-7", "heading-light-5", "heading-light-5"]}>
          {content}
        </OakP>
      </OakFlex>
    </CustomFlex>
  );
}
