import styled from "styled-components";

import { zIndexMap } from "../../styles/utils/zIndex";

export const CardLink = styled.a`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: ${zIndexMap.inFront};
  }
`;

export default CardLink;
