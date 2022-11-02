import { FC } from "react";
import styled from "styled-components";

import responsive, { ResponsiveValues } from "../../styles/utils/responsive";

export const ASPECT_RATIOS = ["7:8", "2:3", "1:1", "3:2", "16:9"] as const;
// Constraining ratio for 1 consistency and 2 option to move to static css
export type Ratio = typeof ASPECT_RATIOS[number];
export type AspectRatios = ResponsiveValues<Ratio>;
const ratioPercentageMap: Record<Ratio, number> = {
  "16:9": 56.25,
  "3:2": 66.66,
  "1:1": 100,
  "2:3": 150,
  "7:8": 114,
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
  children?: React.ReactNode;
  ratio: AspectRatios;
};
/**
 *
 * AspectRatio provides a container of fixed aspect ratio
 *
 * ## Usage
 * Use this component when you want to ensure a box has a certain aspect ratio.
 * Wrap with component with <code>position: relative</code> and a width or min-width
 * The 'ratio' prop is responsive, so you can pass an array e.g. <code>["3:2", "16:9"]</code>
 * which will result in different aspect ratios on different screen widths.
 * For an example usage, see the <code>CardImage</code> component.
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
