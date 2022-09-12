import { FC } from "react";
import styled from "styled-components";

import color, { ColorProps } from "../../styles/utils/color";
import display, { DisplayProps } from "../../styles/utils/display";
import getSvgId, { SvgName } from "../SpriteSheet/getSvgId";

const StyledSvg = styled.svg`
  ${color}
  ${display}
`;
type SvgProps = DisplayProps &
  ColorProps & {
    name: SvgName;
    className?: string;
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
