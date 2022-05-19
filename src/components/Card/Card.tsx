import { FC } from "react";
import styled from "styled-components";

const StyledCard = styled.div`
  height: 250px;
  border-radius: 12px;
  padding: 24px;
`;

const Card: FC = ({ children }) => {
  return <StyledCard>{children}</StyledCard>;
};

export default Card;
