import { FC } from "react";
import styled from "styled-components";

import { InlineSpriteSvg } from "../InlineSpriteSheet";
import ScreenReaderOnly from "../ScreenReaderOnly";

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
      <ScreenReaderOnly>Oak National Academy</ScreenReaderOnly>
      <InlineSpriteSvg name="logo-with-text" />
    </LogoWrapper>
  );
};

export default Logo;
