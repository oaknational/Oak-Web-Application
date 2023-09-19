import { FC } from "react";

import Box from "../Box/Box";

import { OakColorName } from "@/styles/theme/types";

type ColorPair = [OakColorName, OakColorName];

export const COLOR_OPTIONS: Record<string, ColorPair> = {
  lavender: ["lavender30", "lavender50"],
  pink: ["pink30", "pink50"],
  aqua: ["aqua30", "aqua50"],
  mint: ["mint30", "mint50"],
  lemon: ["lemon30", "lemon50"],
  grey: ["grey2", "grey4"],
};

type ColorOptionKey = keyof typeof COLOR_OPTIONS;

type TagFunctionalProps = {
  $background?: ColorOptionKey;
  children?: React.ReactNode;
};

const TagFunctional: FC<TagFunctionalProps> = ({
  $background = "lavender",
  children,
}) => {
  const colorPair = COLOR_OPTIONS[$background] as ColorPair;
  return (
    <Box
      $display={"inline-block"}
      $background={colorPair[0]}
      $ba={1}
      $borderColor={colorPair[1]}
      $borderRadius={4}
      $borderStyle={"solid"}
      $color={"oakGrey5"}
      $font={"heading-light-7"}
      $ph={8}
      $pv={4}
      $position={"relative"}
      $zIndex={"inFront"}
      $width={"fit-content"}
    >
      {children}
    </Box>
  );
};

export default TagFunctional;
