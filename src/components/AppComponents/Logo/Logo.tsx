import { FC } from "react";
import styled from "styled-components";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";
import { LogoSvg } from "@/svgs/logo";
import { LogoWithTextSvg } from "@/svgs/logo-wth-text";

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
      {props.variant === "with text" ? <LogoWithTextSvg /> : <LogoSvg />}
    </LogoWrapper>
  );
};

export default Logo;
