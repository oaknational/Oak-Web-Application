import { FC } from "react";
import styled from "styled-components";

import ButtonAsLink from "../../Button/ButtonAsLink";

export type CardButtonProps = {
  buttonLabel: string;
  buttonHref: string;
};

const CardButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const CardButtonAsLink = styled(ButtonAsLink)`
  width: calc(100% - 48px);
  margin-bottom: 24px;
`;

const CardButton: FC<CardButtonProps> = ({ buttonLabel, buttonHref }) => {
  return (
    <CardButtonWrapper>
      <CardButtonAsLink label={buttonLabel} href={buttonHref} />
    </CardButtonWrapper>
  );
};

export default CardButton;
