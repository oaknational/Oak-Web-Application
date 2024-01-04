import { FC } from "react";
import styled from "styled-components";

import background from "../../styles/utils/background";
import Flex, { FlexProps } from "../SharedComponents/Flex";

const Root = styled(Flex)`
  position: relative;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  right: 0;
  width: 100vw;
  ${background}
`;

type BrowserWidthBarProps = FlexProps;
const BrowserWidthBar: FC<BrowserWidthBarProps> = (props) => {
  const { $background } = props;
  return (
    <Root>
      <Background $background={$background} />
      <Flex
        $position="relative"
        $flexDirection="column"
        $flexGrow={1}
        {...props}
      />
    </Root>
  );
};

export default BrowserWidthBar;
