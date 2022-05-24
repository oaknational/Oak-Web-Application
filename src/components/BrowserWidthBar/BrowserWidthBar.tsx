import { FC } from "react";
import styled from "styled-components";

import background from "../../styles/utils/background";
import Flex, { FlexProps } from "../Flex";

const FlexWithFullWidthPseudo = styled(Flex)`
  position: relative;

  ::before {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    right: 0;
    width: 100vw;
    ${background}
  }
`;

type BrowserWidthBarProps = FlexProps;
const BrowserWidthBar: FC<BrowserWidthBarProps> = (props) => {
  const { background } = props;
  return (
    <FlexWithFullWidthPseudo background={background}>
      <Flex {...props} position="relative" />
    </FlexWithFullWidthPseudo>
  );
};

export default BrowserWidthBar;
