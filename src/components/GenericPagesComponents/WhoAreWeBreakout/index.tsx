import { OakFlex, OakImage, OakP } from "@oaknational/oak-components";
import styled from "styled-components";

const CustomFlex = styled(OakFlex)`
  flex-direction: row;

  @media (max-width: 1212px) {
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
    <CustomFlex $background={"bg-decorative1-main"} $mh={"auto"}>
      <OakFlex
        $flexGrow={1}
        $background={"bg-decorative1-subdued"}
        $minWidth={["100%", "spacing-640", "spacing-640"]}
        $aspectRatio={"4/3"}
      >
        <OakImage $objectFit={"cover"} alt={imageAlt} src={imageUrl} />
      </OakFlex>
      <OakFlex
        $flexShrink={1}
        $ph={["spacing-16", "spacing-16", "spacing-80"]}
        $pv={["spacing-56", "spacing-40", "spacing-40"]}
        $alignItems={"center"}
      >
        <OakP
          $font={["heading-light-7", "heading-light-5"]}
          $color="text-primary"
        >
          {content}
        </OakP>
      </OakFlex>
    </CustomFlex>
  );
}
