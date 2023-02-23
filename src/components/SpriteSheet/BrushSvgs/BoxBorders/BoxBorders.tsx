import { FC } from "react";

import { ZIndex } from "../../../../styles/utils/zIndex";
import Box from "../../../Box";
import Svg from "../../../Svg";
import { OakColorName } from "../../../../styles/theme/types";

export const gapPositionMap = {
  rightTop: "90%",
  bottomRight: "90%",
  bottomRightCorner: "99%",
} as const;

export type GapPosition = keyof typeof gapPositionMap;

const getBorderHeight = (gapPosition: GapPosition | undefined) => {
  if (gapPosition === "rightTop") return gapPositionMap.rightTop;
  if (gapPosition === "bottomRightCorner")
    return gapPositionMap.bottomRightCorner;
  return "100%";
};

const getBorderWidth = (gapPosition: GapPosition | undefined) => {
  if (gapPosition === "bottomRight") return gapPositionMap.bottomRight;
  if (gapPosition === "bottomRightCorner")
    return gapPositionMap.bottomRightCorner;
  return "100%";
};

export type BoxBordersProps = {
  gapPosition?: GapPosition;
  $zIndex?: ZIndex;
  hideTop?: boolean;
  hideBottom?: boolean;
  $color?: OakColorName;
};

const Top: FC = (props) => {
  return (
    <symbol
      id="svg-sprite-box-border-top"
      viewBox="0 0 365.46 2.75"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="M364.83 0C351.89 1.06-.66.73 0 .25v2.5c2.3.01 5.32-.13 5.57-.08 47.1.16 120.24-.07 166.75-.03 69.38-.05 120.46-.12 189.56-.12-.05-.23 1.93.16 3.58.23V.25c-.05.25-.37-.27-.63-.25Z"
      />
      <path
        fill="currentColor"
        d="M149.42 1.02c.27-.16 3.18-.2 2.26.09-.19.04-2.5.15-2.26-.09ZM56.54.97c.55.12-2.9.98-3.24.15.32.41 3.27-.18 3.24-.15ZM9.35 1.59C7.97 1.63 7.02.97 6.81.96c-.43-.19 7.92.37 2.54.63ZM16.35 2.38c-.62-.35-1.11-.15-1.75-.43-.73-.27 3.56.47 1.75.43ZM24.26 1.7c-2.35 0-2.12-.47.23-.53 2.68-.01 1.7.53-.23.53ZM28.1 1.31c-2.03 0-1.83-.27.16-.34 1.97.07 1.83.34-.16.34ZM36.92 1.59c-3.21-.17-5.82-.65-2.64-.82h.08c3.18.17 5.76.65 2.56.82ZM42.59 1.17c-4.18 0-.39-.28 1.02-.17 2.41.11 2.04.17-1.02.17ZM46.37 2.3c-2.79.08 1.35-.33 1.34-.12-.18.04-.77.12-1.34.12ZM52.8 2.1c-.98 0-2.05-.06-2.38-.17 1.13-.23 7.26.26 2.38.17ZM58.28 1.64c-.64.06-1.52.06-1.89.06-2.06-.28 4.19-.29 1.89-.06ZM65.09 1.4c-.4.03-2.69.44-3.72.48-4.46.08 6.98-.83 3.72-.48ZM72.66 1.73c-1.98.35-1.23.02.7-.26 1.91-.3 1.43-.12-.7.26ZM85.21 1.47c-.77 0-1.69-.03-2.01-.07-.37-.19 6.48 0 2.01.07ZM96.76 1.4c-.77 0-2.15-.04-3.06-.08-4.81-.23 4.86-.07 3.06.08ZM107.94 1.61c-3.21-.28.14-.46 1.48-.19 2.05.37 1.35.43-1.48.19ZM114.99 1.79c-2.3.1.24-.22.72-.08 0 0-.32.08-.72.08ZM117.51 1.68c-.87-.13.01-.55.54-.47.77.08.26.55-.54.47ZM120.1 1.61c-.14-.19 1.25-.42 1.38-.32.27.08-1.02.4-1.38.32ZM124.56 2.44c-1.17-.02.1-.15.36-.12.56.08.43.12-.36.12ZM146.75 2.35c-.42 0-.43-.2 0-.18.43-.02.42.18 0 .18ZM149.83 2.11c-3.61-.03-.33-.41.96-.36 2.38.15 1.77.36-.96.36ZM154.5 1.82c-.54 0-1.55-.62-1.28-.65.44-.14 2.79.67 1.28.65ZM156.94 2.42c-.26.03-.5.03-.57 0-.4-.24 1.45-.08.57 0ZM169.55 2.35c-.9 0-1.67-.11-1.67-.11.05-.33 6 .04 1.67.11ZM175.38 1.82c-.86 0-2.06-.07-2.6-.1-.96-.25 7.83-.03 2.6.1ZM192.55 2.28c-3.37 0 .38-.25 1.77 0h-1.77ZM193.35 1.72c-5.94-.1-.12-.22 1.6-.08 2.54.06.44.02-1.6.08ZM224.25 1.82h-5.04c-5.16-.75 14.75.03 5.04 0ZM255.57 1.97c-.89.1-1.94.2-2.56.1-.91-.44 7.73-.88 2.56-.1ZM259.32 1.54c-.95 0-2.54-.26-.97-.46 5.44-.41 10.89.41.97.46Z"
      />
    </symbol>
  );
};
const Right: FC = (props) => {
  return (
    <symbol
      id="svg-sprite-box-border-right"
      viewBox="0 0 2.89 330.09"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2.7 2.21c-.12-.76.36-2.63-1.15-2.13C.77.03-.13.13.01.85c.18 14.09.05 309.32.1 328.06 0 .15.3 1.07.28 1.18h2.5C2.85 303.49 2.6 17.84 2.7 2.21Z"
      />
      <path
        fill="currentColor"
        d="M1.87 1.07s.09.4.09 1.21c.11 3.3-.51-1.31-.09-1.21ZM1.25 44.05c-.47-.05-.49-1.38-.04-1.78.85-.76.2 1.8.04 1.78ZM.91 1.65c.08 2.14.7 4.95-.31 2.59-.13-.84.18-5.42.31-2.59ZM1.05 65.78c-.47-.05.11-8.31.56-9.46.4-1.07-.4 9.48-.56 9.46ZM1.76 54.4c-.47-.05-.76-.69.03-.65 1.14.07.13.67-.03.65Z"
      />
    </symbol>
  );
};
const Bottom: FC = (props) => {
  return (
    <symbol
      id="svg-sprite-box-border-bottom"
      viewBox="0 0 365.46 2.75"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="M364.83 0C351.89 1.06-.66.73 0 .25v2.5c2.3.01 5.32-.13 5.57-.08 47.1.16 120.24-.07 166.75-.03 69.38-.05 120.46-.12 189.56-.12-.05-.23 1.93.16 3.58.23V.25c-.05.25-.37-.27-.63-.25Z"
      />
      <path
        fill="currentColor"
        d="M149.42 1.02c.27-.16 3.18-.2 2.26.09-.19.04-2.5.15-2.26-.09ZM56.54.97c.55.12-2.9.98-3.24.15.32.41 3.27-.18 3.24-.15ZM9.35 1.59C7.97 1.63 7.02.97 6.81.96c-.43-.19 7.92.37 2.54.63ZM16.35 2.38c-.62-.35-1.11-.15-1.75-.43-.73-.27 3.56.47 1.75.43ZM24.26 1.7c-2.35 0-2.12-.47.23-.53 2.68-.01 1.7.53-.23.53ZM28.1 1.31c-2.03 0-1.83-.27.16-.34 1.97.07 1.83.34-.16.34ZM36.92 1.59c-3.21-.17-5.82-.65-2.64-.82h.08c3.18.17 5.76.65 2.56.82ZM42.59 1.17c-4.18 0-.39-.28 1.02-.17 2.41.11 2.04.17-1.02.17ZM46.37 2.3c-2.79.08 1.35-.33 1.34-.12-.18.04-.77.12-1.34.12ZM52.8 2.1c-.98 0-2.05-.06-2.38-.17 1.13-.23 7.26.26 2.38.17ZM58.28 1.64c-.64.06-1.52.06-1.89.06-2.06-.28 4.19-.29 1.89-.06ZM65.09 1.4c-.4.03-2.69.44-3.72.48-4.46.08 6.98-.83 3.72-.48ZM72.66 1.73c-1.98.35-1.23.02.7-.26 1.91-.3 1.43-.12-.7.26ZM85.21 1.47c-.77 0-1.69-.03-2.01-.07-.37-.19 6.48 0 2.01.07ZM96.76 1.4c-.77 0-2.15-.04-3.06-.08-4.81-.23 4.86-.07 3.06.08ZM107.94 1.61c-3.21-.28.14-.46 1.48-.19 2.05.37 1.35.43-1.48.19ZM114.99 1.79c-2.3.1.24-.22.72-.08 0 0-.32.08-.72.08ZM117.51 1.68c-.87-.13.01-.55.54-.47.77.08.26.55-.54.47ZM120.1 1.61c-.14-.19 1.25-.42 1.38-.32.27.08-1.02.4-1.38.32ZM124.56 2.44c-1.17-.02.1-.15.36-.12.56.08.43.12-.36.12ZM146.75 2.35c-.42 0-.43-.2 0-.18.43-.02.42.18 0 .18ZM149.83 2.11c-3.61-.03-.33-.41.96-.36 2.38.15 1.77.36-.96.36ZM154.5 1.82c-.54 0-1.55-.62-1.28-.65.44-.14 2.79.67 1.28.65ZM156.94 2.42c-.26.03-.5.03-.57 0-.4-.24 1.45-.08.57 0ZM169.55 2.35c-.9 0-1.67-.11-1.67-.11.05-.33 6 .04 1.67.11ZM175.38 1.82c-.86 0-2.06-.07-2.6-.1-.96-.25 7.83-.03 2.6.1ZM192.55 2.28c-3.37 0 .38-.25 1.77 0h-1.77ZM193.35 1.72c-5.94-.1-.12-.22 1.6-.08 2.54.06.44.02-1.6.08ZM224.25 1.82h-5.04c-5.16-.75 14.75.03 5.04 0ZM255.57 1.97c-.89.1-1.94.2-2.56.1-.91-.44 7.73-.88 2.56-.1ZM259.32 1.54c-.95 0-2.54-.26-.97-.46 5.44-.41 10.89.41.97.46Z"
      />
    </symbol>
  );
};

const Left: FC = (props) => {
  return (
    <symbol
      id="svg-sprite-box-border-left"
      viewBox="0 0 2.72 359.41"
      preserveAspectRatio="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="M2.56 26.03c-.14-7.28.05-12.58 0-18.65C2.48 3.63 2.28.24 2.51 0H.02c.13 3.41 1.04 10.2.02 14.63-.1 9.52.02 311.42-.03 344.78h2.5c-.87-4.14.68-328.77.05-333.38Z"
      />
      <path
        fill="currentColor"
        d="M1.78 73.31c-.48-1.02.43-5.62.43-4.84.01.69.38 4.88-.43 4.84ZM1.56 142.12c1.14.07.13.67-.03.65-.47-.05-.76-.69.03-.65ZM1.65 196.21c.23.4.13 2.4.07 2.59-.36-1.73-.51-3.36-.07-2.59ZM2.48 27.51c0 .49 0 1.87-.11 3.12-.37 6.22-.42-1.85.11-3.12ZM2.01 65.86c.39.51.58 1.99-.23 1.95-.48-1.02-.25-2.56.23-1.95ZM1.02 132.42c-.47-.05-.49-1.39-.04-1.78.85-.76.2 1.8.04 1.78ZM.79 5.27c.07-1.81.65 1.18.59 5.76C1.27 17.8.69 6.25.79 5.27ZM.33 47.73c-.33-1.44.48-7.29.21-2.86-.12.57-.13 5.57-.21 2.86ZM.96 94.76c.28.95-.15 5.38-.31 5.36-.47-.05.08-6.12.31-5.36ZM1.23 100.12c-.07.9-.41 1.95-.58 1.95-.47-.05.64-2.73.58-1.95ZM1.38 144.69c.4-1.07-.4 9.48-.56 9.46-.47-.05.12-8.31.56-9.46ZM1.24 197.97c.23.4.13 2.4.07 2.59-.36-1.73-.51-3.36-.07-2.59ZM1.81 209.98c-.36-1.74-.84-7.52-.52-8.14l.5-1.57c.25.43.05 9.87.02 9.71ZM1.85 158.2c-.47-.05-.11-4.72.13-3.97.33 1.09.03 3.99-.13 3.97Z"
      />
    </symbol>
  );
};

export const svgSymbols = {
  Top,
  Right,
  Bottom,
  Left,
};

/**
 * Presentational component just for the brush-stroke borders. This is a single
 * component which renders four spans, one for each side of the border.
 *
 * ## Usage
 * Just drop this component inside a Card or other relatively positioned
 * container, and it will act as a visual border around that component. gapPosition, hideTop and
 * hideBottom props are available.
 *
 * ## Note
 * Importantly, the SVGs for the border should have `preserveAspectRatio="none"`,
 * which allows them to be stretched whilst still preserving the effect of being
 * a painted or drawn line.
 */
const BoxBorders: FC<BoxBordersProps> = (props) => {
  const { gapPosition } = props;
  return (
    <Box aria-hidden="true" data-testid="brush-borders">
      {!props.hideTop && (
        <Svg
          name="box-border-top"
          {...props}
          $cover
          $height={3}
          $bottom={"unset"}
        />
      )}
      <Svg
        name="box-border-right"
        {...props}
        $cover
        $width={3}
        $top={"unset"}
        $left={"unset"}
        $bottom={gapPosition === "bottomRightCorner" ? "5%" : undefined}
        $height={getBorderHeight(gapPosition)}
      />
      {!props.hideBottom && (
        <Svg
          name="box-border-bottom"
          {...props}
          $cover
          $height={3}
          $top={"unset"}
          $width={getBorderWidth(gapPosition)}
        />
      )}
      <Svg
        name="box-border-left"
        {...props}
        $cover
        $width={3}
        $right={"unset"}
      />
    </Box>
  );
};

export default BoxBorders;
