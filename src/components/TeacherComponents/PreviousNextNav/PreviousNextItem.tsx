import {
  OakFlex,
  OakFlexProps,
  OakFocusIndicator,
  OakTertiaryInvertedButton,
  OakTypography,
  parseColor,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { PreviousNextNavProps } from "./PreviousNextNav";

type PreviousNextItemProps = Pick<
  PreviousNextNavProps,
  "backgroundColorLevel" | "browseItem"
> & {
  /**
   * Whether the browse item is previous or next in the current sequence
   */
  navDirection: "prev" | "next";
  /**
   * The title of the browse item being linked to
   */
  title: string;
  /**
   * Link for the browse item to navigate to
   */
  href: string;
  /**
   * Optional index of the browse item to be displayed along with the title
   */
  index?: number;
};

const StyledFlexContainer = styled(OakFlex)<
  OakFlexProps & {
    backgroundColorLevel: PreviousNextItemProps["backgroundColorLevel"];
  }
>`
  &:hover {
    background: ${(props) =>
      parseColor(`bg-decorative${props.backgroundColorLevel}-very-subdued`)};
    border-color: ${(props) =>
      parseColor(`border-decorative${props.backgroundColorLevel}-stronger`)};
  }
`;

export default function PreviousNextItem({
  index,
  title,
  browseItem,
  href,
  navDirection,
  backgroundColorLevel,
}: Readonly<PreviousNextItemProps>) {
  return (
    <OakFocusIndicator $borderRadius={"border-radius-l"}>
      <StyledFlexContainer
        $borderRadius={"border-radius-l"}
        $borderColor={"border-neutral-lighter"}
        $ba={"border-solid-m"}
        $flexDirection={"column"}
        $pa={"spacing-24"}
        $gap={"spacing-12"}
        backgroundColorLevel={backgroundColorLevel}
      >
        {Boolean(index) && (
          <OakFlex
            $borderRadius={"border-radius-circle"}
            $font={"heading-7"}
            $pa={"spacing-12"}
            $background={`bg-decorative${backgroundColorLevel}-subdued`}
            $justifyContent={"center"}
            $alignItems={"center"}
            $width={"spacing-32"}
            $height={"spacing-32"}
          >
            {index}
          </OakFlex>
        )}
        <OakTypography $font={"body-3-bold"} $color={"text-primary"}>
          {title}
        </OakTypography>
        <OakFlex
          $mt={"spacing-12"}
          $justifyContent={navDirection === "next" ? "flex-end" : "flex-start"}
        >
          <OakTertiaryInvertedButton
            element="a"
            href={href}
            iconName={navDirection === "next" ? "arrow-right" : "arrow-left"}
            isTrailingIcon={navDirection === "next"}
          >
            {navDirection === "prev" ? "Previous" : "Next"} {browseItem}
          </OakTertiaryInvertedButton>
        </OakFlex>
      </StyledFlexContainer>
    </OakFocusIndicator>
  );
}
