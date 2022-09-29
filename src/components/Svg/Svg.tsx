import { FC } from "react";
import styled from "styled-components";

import { box, BoxProps } from "../Box";
import getSvgId, { SvgName } from "../SpriteSheet/getSvgId";

const StyledSvg = styled.svg<BoxProps>`
  ${box};
  transition: all 0.3s ease;
`;
export type SvgProps = BoxProps & {
  name: SvgName;
  className?: string;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
};
const Svg: FC<SvgProps> = (props) => {
  return (
    <StyledSvg
      aria-hidden={true}
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
