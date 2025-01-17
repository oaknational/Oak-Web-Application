import { forwardRef, MouseEventHandler } from "react";
import styled, { css, useTheme } from "styled-components";
import { OakFlex } from "@oaknational/oak-components";

import HopePageTabButtonLabelWithScreenReaderTitle from "@/components/GenericPagesComponents/HopePageTabButtonLabelWithScreenReaderTitle";
import {
  newIconFocusUnderline,
  HomePageTabFocusUnderline,
} from "@/components/GenericPagesComponents/HomePageTabFocusUnderline";
import HomePageTabBrushUnderline from "@/components/GenericPagesComponents/HomePageTabBrushUnderline";
import { IllustrationSlug } from "@/image-data";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { OpacityProps } from "@/styles/utils/opacity";
import { MarginProps } from "@/styles/utils/spacing";
import { ResponsiveValues } from "@/styles/utils/responsive";
import typography, { FontVariant } from "@/styles/utils/typography";
import UnstyledButton, {
  UnstyledButtonProps,
} from "@/components/SharedComponents/UnstyledButton";
import CMSImage from "@/components/SharedComponents/CMSImage/CMSImage";
import TagPromotional from "@/components/SharedComponents/TagPromotional";
import {
  ButtonHoverStyle,
  CommonButtonProps,
  HTMLButtonProps,
} from "@/components/SharedComponents/Button/common";
import Illustration from "@/components/SharedComponents/Illustration/Illustration";

export type HomePageNavTabImageButtonProps = CommonButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  htmlButtonProps?: HTMLButtonProps;
  $font?: ResponsiveValues<FontVariant>;
  disabled?: boolean;
  title?: string;
  activeImageSlug: IllustrationSlug;
  passiveImageSlug: IllustrationSlug;
  isCurrent?: boolean;
  showNewIcon?: boolean;
};

export type HomePageNavTabImageButtonStylesProps = OpacityProps &
  MarginProps & {
    disabled?: boolean;
    $focusStyles?: [];
    $hoverStyles?: ButtonHoverStyle[];
    "aria-disabled"?: boolean;
    isCurrent?: boolean;
  };

const StyledCMSImage = styled(CMSImage)`
  opacity: 1;
`;

const buttonStyles = css<HomePageNavTabImageButtonStylesProps>`
  ${(props) =>
    !props.isCurrent &&
    css`
      color: ${getColorByName("grey60")};

      :hover ${HopePageTabButtonLabelWithScreenReaderTitle} {
        text-decoration: underline;
        color: ${getColorByName("black")};
      }

      ${StyledCMSImage} {
        opacity: 0.7;
      }
      :hover ${StyledCMSImage} {
        opacity: 1;
      }
    `}
`;

const StyledButton = styled(UnstyledButton)<
  HomePageNavTabImageButtonStylesProps & UnstyledButtonProps
>`
  :focus {
    outline: none;
  }

  ${buttonStyles}
  ${typography}
  ${newIconFocusUnderline}
  @media(max-width: 750px) {
    width: 25%;
  }
`;
const HomePageTabImageButton = forwardRef<
  HTMLButtonElement,
  HomePageNavTabImageButtonProps
>((props, ref) => {
  const {
    onClick,
    label,
    labelSuffixA11y = props.showNewIcon ? "(New)" : undefined,
    "aria-label": ariaLabel,
    htmlButtonProps = {},
    disabled,
    activeImageSlug,
    passiveImageSlug,
    isCurrent,
    title,
    showNewIcon,
  } = props;

  const defaultTitle =
    ariaLabel ?? (labelSuffixA11y && `${label} ${labelSuffixA11y}`) ?? label;
  const noneNulltitle = title ?? htmlButtonProps.title ?? defaultTitle;
  const theme = useTheme();
  const underlineColor = theme.buttonFocusUnderlineColors["black"] || "black";
  const imageSlug = isCurrent ? activeImageSlug : passiveImageSlug;

  return (
    <StyledButton
      ref={ref}
      {...htmlButtonProps}
      title={noneNulltitle}
      aria-label={defaultTitle}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      aria-disabled={disabled}
      isCurrent={isCurrent}
      aria-current={isCurrent ? "page" : undefined}
      disabled={disabled}
      role="link"
    >
      <OakFlex $flexDirection={"column"} $alignItems={"center"}>
        <OakFlex
          $width={["all-spacing-9", "all-spacing-14", "all-spacing-14"]}
          $height={["all-spacing-9", "all-spacing-14", "all-spacing-14"]}
          $justifyContent={"center"}
        >
          <Illustration
            slug={imageSlug}
            noCrop
            $height={"100%"}
            $width={"auto"}
            data-testid={imageSlug}
          />
        </OakFlex>
        <OakFlex $position={"relative"} $minWidth={0}>
          <OakFlex $alignItems={"center"} $minHeight="all-spacing-9">
            <HopePageTabButtonLabelWithScreenReaderTitle
              $font={["body-3-bold", "heading-7"]}
              labelSuffixA11y={label}
              $whiteSpace={"normal"}
              $textAlign={"center"}
            >
              {label}
            </HopePageTabButtonLabelWithScreenReaderTitle>
            {showNewIcon && (
              <TagPromotional
                size={"small"}
                $ml={3}
                $display={["none", "flex"]}
              />
            )}
          </OakFlex>
          {isCurrent && <HomePageTabBrushUnderline name="horizontal-rule" />}
          <HomePageTabFocusUnderline
            $color={underlineColor}
            data-testid={`${defaultTitle} underline`}
          />
        </OakFlex>
      </OakFlex>
    </StyledButton>
  );
});

export default HomePageTabImageButton;
