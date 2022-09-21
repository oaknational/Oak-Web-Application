import { FC } from "react";
import styled from "styled-components";

import spacing from "../../styles/utils/spacing";
import Box, { BoxProps } from "../Box";
import Svg from "../Svg";

export const svgSymbols = {
  Hr: () => (
    <symbol id="svg-sprite-hr" viewBox="0 0 848 6" preserveAspectRatio="none">
      <path
        d="M847.973 3.78942C835.895 4.36162 823.067 4.48438 809.704 4.49971C721.247 4.60325 632.978 4.74449 544.617 4.8022C452.622 4.86667 360.66 4.83406 268.666 4.88521C198.375 4.92456 128.019 5.04772 57.6961 5.08712C44.6625 5.0674 31.7338 4.97036 19.0965 4.79743C7.72585 4.66449 0.755802 3.96791 2.03109 3.27503C2.49698 3.02151 2.59646 2.76673 2.32824 2.51358C1.7924 2.27432 1.02637 2.03757 0.0339629 1.8045C6.74684 1.69705 13.571 1.62077 20.4456 1.57634C71.9727 1.47106 123.596 1.2895 175.057 1.3232C229.109 1.3597 283.133 1.23456 337.154 1.18931C460.741 1.08642 584.317 0.996224 707.882 0.918732C738.368 0.902015 768.789 1.01097 799.21 1.08568C807.077 1.109 814.863 1.17862 822.457 1.29356C839.228 1.54011 847.21 2.19868 847.698 3.25161C847.6 3.42109 847.819 3.57666 847.973 3.78942ZM32.9064 4.52638L32.9086 4.39703L23.81 4.41394C23.8091 4.4653 23.8082 4.51666 23.8074 4.56993L32.9064 4.52638ZM31.8997 2.38063C27.7497 3.07505 27.7498 3.07504 34.6689 3.03555C33.9144 2.8163 32.9703 2.5974 32.0578 2.38033L31.8997 2.38063ZM253.745 1.68484L254.41 1.5904L238.614 1.61976L238.612 1.71297L253.745 1.68484ZM259 2.90963L259.473 2.97152L267.845 2.95596L267.846 2.89319L259 2.90963ZM18.0721 1.81853L17.5334 1.92415L29.3805 1.90213L29.3823 1.79751L18.0721 1.81853Z"
        fill="currentColor"
      />
    </symbol>
  ),
};

type BorderWidth = 1 | 2 | 3 | 4;

const HrLine = styled(Svg)<HrProps>`
  mask-position: center;
  height: ${(props) => props.thickness}px;
  ${spacing}
`;

type HrProps = BoxProps & {
  thickness?: BorderWidth;
};

const Hr: FC<HrProps> = (props) => {
  return (
    <Box role="separator" aria-hidden="true" data-testid="hr">
      <HrLine name="hr" {...props} />
    </Box>
  );
};

/**
 * Hr (Horizontal rule) is a svg , which takes thicknes, color and margin props.
 */
Hr.defaultProps = {
  $color: "black",
  $mv: 24,
  thickness: 3,
};

export default Hr;
