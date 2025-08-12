import { FC, MouseEventHandler } from "react";
import styled, { css } from "styled-components";
import Link from "next/link";
import {
  OakFlex,
  OakIcon,
  OakIconName,
  OakBox,
} from "@oaknational/oak-components";

import { Spinner } from "./Spinner";

import UnstyledButton from "@/components/SharedComponents/UnstyledButton";
import { DoubleButtonBorders } from "@/components/SharedComponents/SpriteSheet/BrushSvgs/ButtonBorders/DoubleButtonBorders";
import ButtonLabel from "@/components/SharedComponents/Button/ButtonLabel";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { OakColorName } from "@/styles/theme";

type LoadingButtonProps = {
  isLoading: boolean;
  text: string;
  loadingText?: string;
  icon: OakIconName;
  disabled: boolean;
  success?: boolean;
  ariaLabel?: string;
  ariaLive?: "off" | "polite" | "assertive";
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
      &:hover:not(:focus) ${ButtonLabel} {
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
      &:hover:not(:focus) ${ButtonLabel} {
        text-decoration: ${props["aria-disabled"] ? "none" : "underline"};
      }
    `;
  }}
`;

const ButtonContent: FC<LoadingButtonProps> = (props) => {
  const disabled = props.isLoading || props.disabled;
  return (
    <>
      <OakFlex $gap="all-spacing-2" $justifyContent="center">
        <ButtonLabel aria-live={props.ariaLive || "off"} $color="white">
          {props.isLoading ? props.loadingText : props.text}
        </ButtonLabel>
        {props.isLoading ? (
          <OakBox $height={"all-spacing-6"}>
            <Spinner />
          </OakBox>
        ) : (
          <OakIcon
            iconName={props.success ? "tick" : props.icon}
            $colorFilter="white"
            width={"24"}
            height={"24"}
            $width={"all-spacing-6"}
            $height={"all-spacing-6"}
          />
        )}
      </OakFlex>
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
  const ariaLive = props.ariaLive ?? "off";

  return props.type === "button" ? (
    <StyledButton
      onClick={props.onClick}
      aria-disabled={disabled}
      aria-label={props.ariaLabel ?? props.text}
      color={props.success ? "oakGreen" : "black"}
      data-testid="loadingButton"
      aria-live={ariaLive}
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
      aria-live={ariaLive}
    >
      <ButtonContent {...props} />
    </StyledLink>
  );
};

export default LoadingButton;
