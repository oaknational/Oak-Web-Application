import { FC } from "react";
import styled from "styled-components";

import Svg from "../Svg";

import Heading, { HeadingProps } from "./Heading";

const BrushUnderline = styled(Svg)`
  position: absolute;
  mask-position: center;
  height: 4px;
`;

const HeadingWrapper = styled.div`
  width: fit-content;
  position: relative;
`;

const UnderlinedHeading: FC<HeadingProps> = (props) => {
  return (
    <HeadingWrapper>
      <Heading {...props} />
      <BrushUnderline name="horizontal-rule" />
    </HeadingWrapper>
  );
};

export default UnderlinedHeading;
