import { FC } from "react";
import styled from "styled-components";
import { OakSvg } from "@oaknational/oak-components";

import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";
import { zIndexMap } from "@/styles/utils/zIndex";
import getColorByName from "@/styles/themeHelpers/getColorByName";

export type SubjectListingTextTile = {
  children: React.ReactNode;
} & FlexProps;

const TileFocusUnderline = styled(OakSvg)`
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

const SubjectListingTextTile: FC<SubjectListingTextTile> = (
  { children, $background = "white" },
  flexProps,
) => {
  return (
    <TextTileWrap
      $background={$background}
      $flexDirection={"column"}
      $position={"relative"}
      $flex={1}
      $borderRadius={4}
      $outline={"none"}
      $width={"100%"}
      {...flexProps}
    >
      {children}
      <TileFocusUnderline
        name="underline"
        $color={"mint50"}
        $width={"100%"}
        $height={"100%"}
        $position={"relative"}
      />
    </TextTileWrap>
  );
};

export default SubjectListingTextTile;
