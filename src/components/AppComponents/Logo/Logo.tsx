import { FC } from "react";
import styled from "styled-components";

import { InlineSpriteSvg } from "@/components/GenericPagesComponents/InlineSpriteSheet";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";

type LogoProps = {
  width: number;
  height: number;
  variant: "with text" | "without text";
};

const LogoWrapper = styled.div<LogoProps>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
`;

const Logo: FC<LogoProps> = (props) => {
  return (
    <LogoWrapper {...props}>
      <ScreenReaderOnly>Oak National Academy</ScreenReaderOnly>
      {/* <InlineSpriteSvg
        name={props.variant === "with text" ? "logo-with-text" : "logo"}
      /> */}
    </LogoWrapper>
  );
};

export default Logo;
