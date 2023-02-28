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
