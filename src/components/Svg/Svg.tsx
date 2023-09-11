import { FC } from "react";
import styled from "styled-components";

import { box, BoxProps } from "../Box";
import getSvgId, { SvgName } from "../SpriteSheet/getSvgId";
import { OakColorName } from "../../styles/theme/types";

const StyledSvg = styled.svg<BoxProps>`
  ${box};
  transition: all 0.3s ease;
`;
export type SvgProps = BoxProps & {
  name: SvgName;
  className?: string;
  hideOnMobileH?: boolean;
  hideOnMobileV?: boolean;
  color?: OakColorName;
  filter?: string;
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
      <use xlinkHref={`/images/sprite/sprite.svg#${getSvgId(props)}`} />
    </StyledSvg>
  );
};

export default Svg;
