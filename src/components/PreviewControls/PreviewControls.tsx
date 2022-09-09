import { FC } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import ButtonAsLink from "../Button/ButtonAsLink";

const PreviewWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
`;

const PreviewControls: FC = () => {
  const router = useRouter();

  return (
    <PreviewWrapper>
      <span>Preview mode enabled</span>

      <ButtonAsLink
        label="Exit preview"
        href={`/api/exit-preview${router.asPath}`}
        size="tiny"
        $ml={24}
      />
    </PreviewWrapper>
  );
};

export default PreviewControls;
