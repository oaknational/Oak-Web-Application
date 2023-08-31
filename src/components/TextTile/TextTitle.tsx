import { FC } from "react";
import styled from "styled-components";

import Flex, { FlexProps } from "../Flex";
import Svg from "../Svg";

import { zIndexMap } from "@/styles/utils/zIndex";
import getColorByName from "@/styles/themeHelpers/getColorByName";

export type TextTileProps = {
  children: React.ReactNode;
} & FlexProps;

const TileFocusUnderline = styled(Svg)`
  display: none;
  position: absolute;
  bottom: -4px;
  left: -2px;
  right: 0;
  height: 4px;
  color: ${getColorByName("lemon")};
  filter: drop-shadow(2px 2px 0 rgb(0 0 0));
  z-index: ${zIndexMap.inFront};
  outline: none;
`;
const TextTileWrap = styled(Flex)`
  &:focus-within ${TileFocusUnderline} {
    display: inline;
  }
`;

const TextTile: FC<TextTileProps> = (
  { children, $background = "white" },
  flexProps
) => {
  return (
    <TextTileWrap
      $background={$background}
      $flexDirection={"column"}
      $position={"relative"}
      $flex={1}
      $borderRadius={4}
      $outline={"none"}
      {...flexProps}
    >
      {children}
      <TileFocusUnderline name="underline-1" $color={"pupilsLightGreen"} />
    </TextTileWrap>
  );
};

export default TextTile;
