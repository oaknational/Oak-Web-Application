import { FC, MouseEventHandler } from "react";
import styled, { css } from "styled-components";

import UnstyledButton from "../../UnstyledButton";
import Flex from "../../Flex";
import Icon, { IconName } from "../../Icon";
import Box from "../../Box";
import { DoubleButtonBorders } from "../../SpriteSheet/BrushSvgs/ButtonBorders/DoubleButtonBorders";
import ButtonLabel from "../ButtonLabel";

import { Spinner } from "./Spinner";

type LoadingButtonProps = {
  isLoading: boolean;
  text: string;
  loadingText: string;
  icon: IconName;
  disabled: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const FocusDoubleBorder = styled(DoubleButtonBorders)``;

const StyledButton = styled(UnstyledButton)`
  height: 56px;
  min-width: 200px;
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
      background-color: ${props.disabled ? "#808080" : "black"};
      cursor: ${props.disabled ? "not-allowed" : "pointer"};
      :hover:not(:focus) ${ButtonLabel} {
        text-decoration: ${props.disabled ? "none" : "underline"};
      }
    `;
  }}
`;

const LoadingButton: FC<LoadingButtonProps> = (props) => {
  const disabled = props.isLoading || props.disabled;

  return (
    <StyledButton
      disabled={disabled}
      onClick={disabled ? (e) => e.preventDefault : props.onClick}
      aria-disabled={disabled}
      aria-label={props.text}
    >
      <Flex $gap={8} $justifyContent="center">
        <ButtonLabel $color="white">
          {props.isLoading ? props.loadingText : props.text}
        </ButtonLabel>
        {props.isLoading ? (
          <Box $height={24}>
            <Spinner />
          </Box>
        ) : (
          <Icon name={props.icon} $color="white" />
        )}
      </Flex>
      <FocusDoubleBorder background={disabled ? "grey6" : "black"} />
    </StyledButton>
  );
};

export default LoadingButton;
