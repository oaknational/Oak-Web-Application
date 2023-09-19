import { forwardRef, MouseEventHandler } from "react";
import styled, { css, useTheme } from "styled-components";

import { ResponsiveValues } from "../../styles/utils/responsive";
import typography, { FontVariant } from "../../styles/utils/typography";
import UnstyledButton, { UnstyledButtonProps } from "../UnstyledButton";
import CMSImage from "../CMSImage/CMSImage";
import Flex from "../Flex/Flex";
import Box from "../Box/Box";
import TagPromotional from "../TagPromotional";
import BrushUnderline from "../NewButton.tsx/NewBrushUndeline";
import { CommonButtonProps, HTMLButtonProps } from "../Button/common";
import Illustration from "../Illustration/Illustration";

import ButtonLabel from "./NewButtonLabelWithScreenReaderTitle";
import {
  newIconFocusUnderline,
  NewIconFocusUnderline,
} from "./NewFocusUndeline";

import { IllustrationSlug } from "@/image-data";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { OpacityProps } from "@/styles/utils/opacity";
import { MarginProps } from "@/styles/utils/spacing";

export type HomePageNavTabImageButtonProps = CommonButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  htmlButtonProps?: HTMLButtonProps;
  $font?: ResponsiveValues<FontVariant>;
  disabled?: boolean;
  title?: string;
  imageSlug: IllustrationSlug;
  isCurrent?: boolean;
  isNew?: boolean;
};

export type HomePageNavTabImageButtonStylesProps = OpacityProps &
  MarginProps & {
    disabled?: boolean;
    $focusStyles?: [];
    $hoverStyles?: string[];
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
      color: ${getColorByName("oakGrey4")};

      :hover ${ButtonLabel} {
        text-decoration: underline;
        color: ${getColorByName("oakGrey6")};
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
    imageSlug,
    isCurrent,
    title,
    isNew,
  } = props;

  const defaultTitle =
    ariaLabel ?? (labelSuffixA11y && `${label} ${labelSuffixA11y}`) ?? label;
  const noneNulltitle = title ?? htmlButtonProps.title ?? defaultTitle;
  const theme = useTheme();
  const underlineColor = theme.buttonFocusUnderlineColors["black"] || "black";

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
        <Flex $width={96} $height={96} $justifyContent={"center"}>
          {" "}
          <Illustration
            slug={imageSlug}
            noCrop
            $height={"100%"}
            $width={"auto"}
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
            {isNew && (
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
