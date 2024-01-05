import { forwardRef, MouseEventHandler } from "react";
import styled, { css, useTheme } from "styled-components";

import ButtonLabel from "../NewButtonLabelWithScreenReaderTitle";
import {
  newIconFocusUnderline,
  NewIconFocusUnderline,
} from "../NewFocusUndeline";
import BrushUnderline from "../NewBrushUndeline";

import { IllustrationSlug } from "@/image-data";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { OpacityProps } from "@/styles/utils/opacity";
import { MarginProps } from "@/styles/utils/spacing";
import { ResponsiveValues } from "@/styles/utils/responsive";
import typography, { FontVariant } from "@/styles/utils/typography";
import UnstyledButton, {
  UnstyledButtonProps,
} from "@/components/UnstyledButton";
import CMSImage from "@/components/SharedComponents/CMSImage/CMSImage";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import TagPromotional from "@/components/TagPromotional";
import {
  ButtonHoverStyle,
  CommonButtonProps,
  HTMLButtonProps,
} from "@/components/SharedComponents/Button/common";
import Illustration from "@/components/Illustration/Illustration";

export type HomePageNavTabImageButtonProps = CommonButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  htmlButtonProps?: HTMLButtonProps;
  $font?: ResponsiveValues<FontVariant>;
  disabled?: boolean;
  title?: string;
  activeImageSlug: IllustrationSlug;
  passiveImageSlug: IllustrationSlug;
  isCurrent?: boolean;
  isLegacyLesson?: boolean;
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

      :hover ${ButtonLabel} {
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
    labelSuffixA11y,
    "aria-label": ariaLabel,
    htmlButtonProps = {},
    disabled,
    activeImageSlug,
    passiveImageSlug,
    isCurrent,
    title,
    isLegacyLesson,
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
      disabled={disabled}
    >
      <Flex $flexDirection={"column"} $alignItems={"center"}>
        <Flex
          $width={[50, 96, 96]}
          $height={[50, 96, 96]}
          $justifyContent={"center"}
        >
          <Illustration
            slug={imageSlug}
            noCrop
            $height={"100%"}
            $width={"auto"}
            data-testid={imageSlug}
          />
        </Flex>
        <Box $display={"flex"} $position={"relative"} $minWidth={0}>
          <Flex $alignItems={"center"} $minHeight={44}>
            <ButtonLabel
              $font={["body-3-bold", "heading-7"]}
              labelSuffixA11y={label}
              $whiteSpace={"normal"}
              $textAlign={"center"}
            >
              {label}
            </ButtonLabel>
            {!isLegacyLesson && (
              <TagPromotional
                size={"small"}
                $ml={3}
                $display={["none", "flex"]}
              />
            )}
          </Flex>
          {isCurrent && <BrushUnderline name="horizontal-rule" />}
          <NewIconFocusUnderline
            $color={underlineColor}
            data-testid={`${defaultTitle} underline`}
          />
        </Box>
      </Flex>
    </StyledButton>
  );
});

export default HomePageTabImageButton;
