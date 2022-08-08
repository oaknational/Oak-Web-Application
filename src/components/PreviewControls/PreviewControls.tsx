import { FC } from "react";
import styled from "styled-components";

import ButtonAsLink from "../Button/ButtonAsLink";

const PreviewWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
`;

const PreviewControls: FC = () => {
  return (
    <PreviewWrapper>
      <span>Preview mode enabled</span>

      <ButtonAsLink
        label="Exit preview"
        href="/api/exit-preview"
        size="tiny"
        $ml={[8]}
      />
    </PreviewWrapper>
  );
};

export default PreviewControls;
