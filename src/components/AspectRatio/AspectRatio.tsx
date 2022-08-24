import { FC } from "react";
import styled from "styled-components";

import responsive, { ResponsiveValues } from "../../styles/utils/responsive";

// Constraining ratio for 1 consistency and 2 option to move to static css
export type Ratio = "1:1" | "3:2" | "16:9";
export type AspectRatios = ResponsiveValues<Ratio>;
const ratioPercentageMap: Record<Ratio, number> = {
  "16:9": 56.25,
  "3:2": 66.66,
  "1:1": 100,
};
const ratioToPercentage = (ratio?: Ratio | null) =>
  ratio ? `${ratioPercentageMap[ratio]}%` : undefined;

const AspectRatioOuter = styled.div<{ ratio: AspectRatios }>`
  width: 100%;
  height: 0;
  position: relative;
  ${responsive("padding-top", (props) => props.ratio, ratioToPercentage)}
`;
const AspectRatioInner = styled.div`
  display: flex;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  top: 0;
`;

type AspectRatioProps = {
  ratio: AspectRatios;
};
/**
 *
 * AspectRatio provides a container of fixed aspect ratio
 *
 * ## Usage
 * Use this component when you want to ensure a box has a certain aspect ratio.
 * Wrap with component with position: relative and a width or min-width
 * The 'ratio' prop is repsonsive, so you can pass an array e.g. ["3:2", "16:9"]
 * which will result in different aspect ratios on different screen widths.
 * For an example usage, see the CardImage component.
 */
const AspectRatio: FC<AspectRatioProps> = (props) => {
  const { children, ratio, ...htmlAttrs } = props;
  return (
    <AspectRatioOuter ratio={ratio} {...htmlAttrs}>
      <AspectRatioInner>{children}</AspectRatioInner>
    </AspectRatioOuter>
  );
};

export default AspectRatio;
