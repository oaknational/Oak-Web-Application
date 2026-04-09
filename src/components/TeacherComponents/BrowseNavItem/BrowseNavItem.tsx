import {
  OakFlex,
  OakFlexProps,
  OakFocusIndicator,
  OakTertiaryInvertedButton,
  OakTypography,
  parseColor,
} from "@oaknational/oak-components";
import styled from "styled-components";

type BrowseNavItemProps = {
  /**
   * The level of the decorative background colour to be used. Defaults to transparent.
   */
  backgroundColorLevel: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * The type of resource to be navigated
   */
  browseItem: "lesson" | "unit";
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
  linkHref: string;
  /**
   * Optional index of the browse item to be displayed along with the title
   */
  index?: string;
};

const StyledFlexContainer = styled(OakFlex)<
  OakFlexProps & {
    backgroundColorLevel: BrowseNavItemProps["backgroundColorLevel"];
  }
>`
  &:hover {
    background: ${(props) =>
      parseColor(`bg-decorative${props.backgroundColorLevel}-very-subdued`)};
    border-color: ${(props) =>
      parseColor(`border-decorative${props.backgroundColorLevel}-stronger`)};
  }
`;

export default function BrowseNavItem({
  index,
  title,
  browseItem,
  linkHref,
  navDirection,
  backgroundColorLevel,
}: Readonly<BrowseNavItemProps>) {
  return (
    <OakFocusIndicator $width={"spacing-360"} $borderRadius={"border-radius-l"}>
      <StyledFlexContainer
        $borderRadius={"border-radius-l"}
        $borderColor={"border-neutral-lighter"}
        $ba={"border-solid-m"}
        $flexDirection={"column"}
        $pa={"spacing-24"}
        $gap={"spacing-12"}
        $width={"spacing-360"}
        backgroundColorLevel={backgroundColorLevel}
      >
        {index && (
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
        <OakTypography $font={"body-3"} $color={"text-primary"}>
          {title}
        </OakTypography>
        <OakFlex
          $mt={"spacing-12"}
          $justifyContent={navDirection === "next" ? "flex-end" : "flex-start"}
        >
          <OakTertiaryInvertedButton
            element="a"
            href={linkHref}
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
