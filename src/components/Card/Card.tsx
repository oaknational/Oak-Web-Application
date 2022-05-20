import styled from "styled-components";

import spacing from "../../styles/utils/spacing";

const Card = styled.div`
  ${spacing}
  height: 250px;
  border-radius: 12px;
`;

Card.defaultProps = {
  pa: 24,
};

export default Card;
