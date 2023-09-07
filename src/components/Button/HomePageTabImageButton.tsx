import { forwardRef, MouseEventHandler } from "react";
import styled, { useTheme } from "styled-components";

import { ResponsiveValues } from "../../styles/utils/responsive";
import typography, { FontVariant } from "../../styles/utils/typography";
import UnstyledButton, { UnstyledButtonProps } from "../UnstyledButton";
import CMSImage from "../CMSImage/CMSImage";
import Flex from "../Flex/Flex";
import Box from "../Box/Box";
import Svg from "../Svg/Svg";
import TagPromotional from "../TagPromotional/TagPromotional";

import ButtonLabel from "./NewButtonLabelWithScreenReaderTitle";
import {
  newIconFocusUnderline,
  NewIconFocusUnderline,
} from "./NewFocusUndeline";
import { CommonButtonProps, HTMLButtonProps } from "./common";

import { getIllustrationAsset, IllustrationSlug } from "@/image-data";

export type ButtonProps = CommonButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  htmlButtonProps?: HTMLButtonProps;
  $font?: ResponsiveValues<FontVariant>;
  disabled?: boolean;
  title: string;
  imageSlug: IllustrationSlug;
  isCurrent?: boolean;
  isNew?: boolean;
};

const BrushUnderline = styled(Svg)`
  position: absolute;
  mask-position: center;
  height: 8px;
  top: 100%;
`;

const StyledButton = styled(UnstyledButton)<UnstyledButtonProps>`
  :focus {
    outline: none;
  }

  ${typography}
  ${newIconFocusUnderline}
`;
const HomePageTabImageButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
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
    const asset = getIllustrationAsset(imageSlug);
    const theme = useTheme();
    const underlineColor = theme.buttonFocusUnderlineColors["black"] || "black";

    return (
      <StyledButton
        ref={ref}
        {...htmlButtonProps}
        title={title ?? htmlButtonProps.title ?? defaultTitle}
        aria-label={ariaLabel}
        onClick={disabled ? (e) => e.preventDefault() : onClick}
        aria-disabled={disabled}
      >
        <Flex $flexDirection={"column"} $alignItems={"center"}>
          {" "}
          <Flex $width={96} $height={96}>
            {" "}
            <CMSImage image={{ asset }} noCrop />
          </Flex>
          <Box $display={"flex"} $position={"relative"} $minWidth={0}>
            <Flex $alignItems={"center"} $minHeight={44}>
              <ButtonLabel $font={"heading-7"} labelSuffixA11y={label}>
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
  },
);

export default HomePageTabImageButton;
