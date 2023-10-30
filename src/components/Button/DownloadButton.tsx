import React from "react";
import styled from "styled-components";

import UnstyledButton from "../UnstyledButton";
import ButtonBorders from "../SpriteSheet/BrushSvgs/ButtonBorders";
import Flex from "../Flex";
import Icon from "../Icon";
import Box from "../Box";

import ButtonLabel from "./ButtonLabel";

type DownloadButtonProps = {
  isLoading: boolean;
};

const StyledButton = styled(UnstyledButton)`
  background-color: black;
  height: 56px;
  width: 204px;
  padding: 10px 24px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  position: relative;
  text-decoration: none;
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
  return (
    <StyledButton>
      <Flex $gap={8} $justifyContent="center">
        <ButtonLabel $color="white">
          {props.isLoading ? "Downloading..." : "Download .zip"}
        </ButtonLabel>
        {props.isLoading ? (
          <Box $height={24}>
            <Spinner />
          </Box>
        ) : (
          <Icon name="download" $color="white" />
        )}
      </Flex>
      <ButtonBorders background="black" />
    </StyledButton>
  );
};

export default DownloadButton;
