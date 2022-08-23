import { FC } from "react";
import styled from "styled-components";

import { OakColorName } from "../../styles/theme";
import color from "../../styles/utils/color";
import getSvgId, { SvgName } from "../SpriteSheet/getSvgId";

const StyledSvg = styled.svg`
  ${color}
`;
type SvgProps = {
  name: SvgName;
  className?: string;
  $color?: OakColorName;
};
const Svg: FC<SvgProps> = (props) => {
  return (
    <StyledSvg
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      {...props}
    >
      <use xlinkHref={`#${getSvgId(props)}`} />
    </StyledSvg>
  );
};

export default Svg;
