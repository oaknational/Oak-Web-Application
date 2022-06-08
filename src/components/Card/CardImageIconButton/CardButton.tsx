import styled from "styled-components";

import getColor from "../../../styles/themeHelpers/getColor";
import ButtonAsLink from "../../Button/ButtonAsLink";

const CardButton = styled(ButtonAsLink)`
  width: 100%;
  background: ${getColor("grey8")};
`;

export default CardButton;
