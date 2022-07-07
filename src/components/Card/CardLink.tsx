import styled from "styled-components";

export const CardLink = styled.a`
  ::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &:focus-within {
    outline: 5px auto -webkit-focus-ring-color;
  }
`;

export default CardLink;
