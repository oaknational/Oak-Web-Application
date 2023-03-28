import { FC } from "react";
import styled from "styled-components";

import LogoSvg from "../../image-data/generated/logo-with-text.svg";

type LogoProps = {
  width: number;
  height: number;
};

const LogoWrapper = styled.div<LogoProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const Logo: FC<LogoProps> = (props) => {
  return (
    <LogoWrapper {...props}>
      <LogoSvg />
    </LogoWrapper>
  );
};

export default Logo;
