import { forwardRef, MouseEventHandler } from "react";
import styled, { css, useTheme } from "styled-components";

import { ResponsiveValues } from "../../styles/utils/responsive";
import typography, { FontVariant } from "../../styles/utils/typography";
import UnstyledButton, { UnstyledButtonProps } from "../UnstyledButton";
import CMSImage from "../CMSImage/CMSImage";
import Flex from "../Flex/Flex";
import Box from "../Box/Box";
import TagPromotional from "../TagPromotional/TagPromotional";

import ButtonLabel, {
  ButtonLabelSpan,
} from "./NewButtonLabelWithScreenReaderTitle";
import {
  newIconFocusUnderline,
  NewIconFocusUnderline,
} from "./NewFocusUndeline";
import { CommonButtonProps, HTMLButtonProps } from "./common";
import BrushUnderline from "./NewBrushUndeline";

import { getIllustrationAsset, IllustrationSlug } from "@/image-data";
import getColorByName from "@/styles/themeHelpers/getColorByName";

export type HomePageNavTabImageButtonProps = CommonButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  htmlButtonProps?: HTMLButtonProps;
  $font?: ResponsiveValues<FontVariant>;
  disabled?: boolean;
  title: string;
  imageSlug: IllustrationSlug;
  isCurrent?: boolean;
  isNew?: boolean;
};

const buttonLabel = css`
  :hover ${ButtonLabelSpan} {
    text-decoration: underline;
    color: ${getColorByName("grey4")};
  }
`;

const StyledButton = styled(UnstyledButton)<UnstyledButtonProps>`
  :focus {
    outline: none;
  }

  ${buttonLabel}
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
    title,
    imageSlug,
    isCurrent,
    isNew,
  } = props;

  const defaultTitle =
    ariaLabel ?? (labelSuffixA11y && `${label} ${labelSuffixA11y}`) ?? label;
  const noneNulltitle = title ?? htmlButtonProps.title ?? defaultTitle;
  const asset = getIllustrationAsset(imageSlug);
  const theme = useTheme();
  const underlineColor = theme.buttonFocusUnderlineColors["black"] || "black";

  return (
    <StyledButton
      ref={ref}
      {...htmlButtonProps}
      title={noneNulltitle}
      aria-label={ariaLabel}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      aria-disabled={disabled}
    >
      <Flex
        $flexDirection={"column"}
        $alignItems={"center"}
        $opacity={isCurrent ? 1 : 0.5}
      >
        <Flex $width={96} $height={96}>
          {" "}
          <CMSImage image={{ asset }} noCrop />
        </Flex>
        <Box $display={"flex"} $position={"relative"} $minWidth={0}>
          <Flex $alignItems={"center"} $minHeight={44}>
            <ButtonLabel
              $font={["body-3", "heading-7"]}
              labelSuffixA11y={label}
              $color={isCurrent ? "black" : "grey6"}
              $opacity={1}
            >
              {label}
            </ButtonLabel>
            {isNew && <TagPromotional size={"small"} $ml={3} />}
          </Flex>
          {isCurrent && <BrushUnderline name="horizontal-rule" />}
          <NewIconFocusUnderline $color={underlineColor} />
        </Box>
      </Flex>
    </StyledButton>
  );
});

export default HomePageTabImageButton;
