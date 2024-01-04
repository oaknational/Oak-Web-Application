import { FC, MouseEventHandler } from "react";
import styled, { css } from "styled-components";
import Link from "next/link";

import UnstyledButton from "../../../UnstyledButton";
import Icon, { IconName } from "../../../Icon";
import { DoubleButtonBorders } from "../../../SpriteSheet/BrushSvgs/ButtonBorders/DoubleButtonBorders";
import ButtonLabel from "../ButtonLabel";

import { Spinner } from "./Spinner";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { OakColorName } from "@/styles/theme";

type LoadingButtonProps = {
  isLoading: boolean;
  text: string;
  loadingText?: string;
  icon: IconName;
  disabled: boolean;
  success?: boolean;
  ariaLabel?: string;
  onClick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
} & (
  | {
      type: "button";
    }
  | { type: "link"; href: string; external: boolean }
);

const FocusDoubleBorder = styled(DoubleButtonBorders)``;

const StyledButton = styled(UnstyledButton)`
  height: 56px;
  width: max-content;
  padding: 10px 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  position: relative;
  text-decoration: none;
  border-radius: 5px;
  &:focus {
    & ${FocusDoubleBorder} {
      display: block;
    }
  }
  ${(props) => {
    return css`
      background-color: ${props["aria-disabled"]
        ? "#808080"
        : getColorByName(props.color as OakColorName)};
      cursor: ${props["aria-disabled"] ? "not-allowed" : "pointer"};
      :hover:not(:focus) ${ButtonLabel} {
        text-decoration: ${props["aria-disabled"] ? "none" : "underline"};
      }
    `;
  }}
`;

const StyledLink = styled(Link)`
  height: 56px;
  width: max-content;
  padding: 10px 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  position: relative;
  text-decoration: none;
  border-radius: 5px;
  &:focus {
    & ${FocusDoubleBorder} {
      display: block;
    }
  }
  ${(props) => {
    return css`
      background-color: ${props["aria-disabled"]
        ? "#808080"
        : getColorByName(props.color as OakColorName)};
      cursor: ${props["aria-disabled"] ? "not-allowed" : "pointer"};
      :hover:not(:focus) ${ButtonLabel} {
        text-decoration: ${props["aria-disabled"] ? "none" : "underline"};
      }
    `;
  }}
`;

const ButtonContent: FC<LoadingButtonProps> = (props) => {
  const disabled = props.isLoading || props.disabled;
  return (
    <>
      <Flex $gap={8} $justifyContent="center">
        <ButtonLabel $color="white">
          {props.isLoading ? props.loadingText : props.text}
        </ButtonLabel>
        {props.isLoading ? (
          <Box $height={24}>
            <Spinner />
          </Box>
        ) : (
          <Icon name={props.success ? "tick" : props.icon} $color="white" />
        )}
      </Flex>
      <FocusDoubleBorder
        background={disabled ? "grey50" : props.success ? "oakGreen" : "black"}
      />
    </>
  );
};

/**
 * Loading button with an optional success state
 * Can be a link or a button
 */

const LoadingButton: FC<LoadingButtonProps> = (props) => {
  const disabled = props.isLoading || props.disabled;

  const onClick: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement> = (
    e,
  ) => (disabled ? e.preventDefault() : props.onClick(e));

  return props.type === "button" ? (
    <StyledButton
      onClick={props.onClick}
      aria-disabled={disabled}
      aria-label={props.ariaLabel ?? props.text}
      color={props.success ? "oakGreen" : "black"}
    >
      <ButtonContent {...props} />
    </StyledButton>
  ) : (
    <StyledLink
      href={props.href}
      aria-disabled={disabled}
      aria-label={props.ariaLabel ?? props.text}
      target={props.external ? "_blank" : undefined}
      color={props.success ? "oakGreen" : "black"}
      onClick={onClick}
    >
      <ButtonContent {...props} />
    </StyledLink>
  );
};

export default LoadingButton;
