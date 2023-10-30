import React, { MouseEventHandler } from "react";
import styled, { css } from "styled-components";

import UnstyledButton from "../UnstyledButton";
import ButtonBorders from "../SpriteSheet/BrushSvgs/ButtonBorders";
import Flex from "../Flex";
import Icon from "../Icon";
import Box from "../Box";

import ButtonLabel from "./ButtonLabel";

type DownloadButtonProps = {
  isLoading: boolean;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

const StyledButton = styled(UnstyledButton)`
  height: 56px;
  width: 204px;
  padding: 10px 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  position: relative;
  text-decoration: none;
  ${(props) => {
    return css`
      background-color: ${props.disabled ? "#ccc" : "black"};
      cursor: ${props.disabled ? "not-allowed" : "pointer"};
    `;
  }}
`;

const ButtonLabelWithHover = styled(ButtonLabel)`
  :hover {
    text-decoration: underline;
  }
`;

const Spinner = styled.span`
    width: 21px;
    height: 21px;
    border: 3px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    }
    @keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const DownloadButton = (props: DownloadButtonProps) => {
  const disabled = props.isLoading;
  return (
    <StyledButton
      disabled={disabled}
      onClick={disabled ? (e) => e.preventDefault : props.onClick}
      aria-disabled={disabled}
      aria-label={"Download button"}
    >
      <Flex $gap={8} $justifyContent="center">
        <ButtonLabelWithHover $color="white">
          {props.isLoading ? "Downloading..." : "Download .zip"}
        </ButtonLabelWithHover>
        {props.isLoading ? (
          <Box $height={24}>
            <Spinner />
          </Box>
        ) : (
          <Icon name="download" $color="white" />
        )}
      </Flex>
      <ButtonBorders background={disabled ? "grey3" : "black"} />
    </StyledButton>
  );
};

export default DownloadButton;
