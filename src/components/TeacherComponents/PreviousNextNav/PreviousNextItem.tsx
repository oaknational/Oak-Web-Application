import {
  OakBox,
  OakFlex,
  OakFlexProps,
  OakFocusIndicator,
  OakIcon,
  OakIconName,
  OakTypography,
  parseColor,
} from "@oaknational/oak-components";
import styled from "styled-components";
import Link from "next/link";

import { PreviousNextNavProps } from "./PreviousNextNav";

type PreviousNextItemProps = Pick<
  PreviousNextNavProps,
  "backgroundColorLevel" | "navItemType"
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
    $backgroundColorLevel: PreviousNextItemProps["backgroundColorLevel"];
  }
>`
  &:hover {
    background: ${(props) =>
      parseColor(`bg-decorative${props.$backgroundColorLevel}-very-subdued`)};
    border-color: ${(props) =>
      parseColor(`border-decorative${props.$backgroundColorLevel}-stronger`)};
    .previous-next-item-link {
      color: ${parseColor("text-subdued")};
      text-decoration: underline;
    }
    .item-icon {
      background: ${parseColor("bg-btn-secondary-hover")};
    }
  }
`;

export default function PreviousNextItem({
  index,
  title,
  navItemType,
  href,
  navDirection,
  backgroundColorLevel,
}: Readonly<PreviousNextItemProps>) {
  return (
    <OakFocusIndicator $borderRadius={"border-radius-l"} $minHeight={"100%"}>
      <StyledFlexContainer
        $borderRadius={"border-radius-l"}
        $borderColor={"border-neutral-lighter"}
        $ba={"border-solid-m"}
        $flexDirection={"column"}
        $pa={"spacing-24"}
        $gap={"spacing-12"}
        $backgroundColorLevel={backgroundColorLevel}
        as={Link}
        href={href}
        $color={"text-primary"}
        rel={navDirection}
        $minHeight={"100%"}
      >
        {Boolean(index) && (
          <OakFlex
            $borderRadius={"border-radius-circle"}
            $font={"heading-7"}
            $pa={"spacing-12"}
            $background={
              backgroundColorLevel === 1
                ? "bg-decorative1-main"
                : `bg-decorative${backgroundColorLevel}-subdued`
            }
            $justifyContent={"center"}
            $alignItems={"center"}
            $width={"spacing-32"}
            $height={"spacing-32"}
            data-testid="nav-item-index"
          >
            {index}
          </OakFlex>
        )}
        <OakTypography $font={"body-3-bold"} $mb={"spacing-12"}>
          {title}
        </OakTypography>
        <OakFlex
          $mt={"auto"}
          $justifyContent={navDirection === "next" ? "flex-end" : "flex-start"}
          $alignItems={"center"}
          $gap={"spacing-12"}
        >
          {navDirection === "prev" && <ItemIcon iconName="arrow-left" />}
          <OakTypography
            className="previous-next-item-link"
            $font={"heading-7"}
          >
            {navDirection === "prev" ? "Previous" : "Next"} {navItemType}
          </OakTypography>
          {navDirection === "next" && <ItemIcon iconName="arrow-right" />}
        </OakFlex>
      </StyledFlexContainer>
    </OakFocusIndicator>
  );
}

const ItemIcon = ({ iconName }: { iconName: OakIconName }) => {
  return (
    <OakBox
      $borderColor={"border-primary"}
      $borderRadius={"border-radius-circle"}
      $ba="border-solid-l"
    >
      <OakIcon
        iconName={iconName}
        $width={"spacing-24"}
        $height={"spacing-24"}
        $background={"bg-primary"}
        $borderRadius={"border-radius-circle"}
        className="item-icon"
      />
    </OakBox>
  );
};
