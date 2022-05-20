import { FC } from "react";
import styled from "styled-components";

const StyledSiteFooter = styled.footer`
  padding: 12px;
  width: 100%;
`;

const SiteFooter: FC = () => {
  return (
    <StyledSiteFooter>
      © Oak National Academy {new Date().getFullYear()}
    </StyledSiteFooter>
  );
};

export default SiteFooter;
