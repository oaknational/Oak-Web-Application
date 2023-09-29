import { FC } from "react";
import styled from "styled-components";

import Box, { BoxProps } from "../Box";
import Svg from "../Svg";

type Thickness = 1 | 2 | 3 | 4 | 8;

const HrLine = styled(Svg)<HrProps>`
  mask-position: center;
  height: ${(props) => props.thickness}px;
`;

type HrProps = BoxProps & {
  thickness?: Thickness;
};

const Hr: FC<HrProps> = (props) => {
  const { thickness, ...boxProps } = props;
  return (
    <Box
      $width="100%"
      role="separator"
      aria-hidden="true"
      data-testid="hr"
      {...boxProps}
    >
      <HrLine name="horizontal-rule" thickness={thickness} />
    </Box>
  );
};

/**
 * Hr (Horizontal rule) is an svg , which takes thickness, color and margin props.
 */
Hr.defaultProps = {
  $display: "flex",
  $color: "black",
  $mv: 24,
  thickness: 3,
};

export default Hr;
