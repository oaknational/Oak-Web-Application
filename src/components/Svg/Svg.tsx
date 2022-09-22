import { FC } from "react";
import styled from "styled-components";

import { box, BoxProps } from "../Box";
import getSvgId, { SvgName } from "../SpriteSheet/getSvgId";
import { OakColorName } from "../../styles/theme/types";

const StyledSvg = styled.svg<BoxProps>`
  ${box}
`;
export type SvgProps = BoxProps & {
  name: SvgName;
  className?: string;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
  color?: OakColorName;
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
