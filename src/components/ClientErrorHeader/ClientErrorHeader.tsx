import { FC } from "react";
import { useTheme } from "styled-components";

import FixedHeader from "../Header";
import Logo from "../Logo";
import OakLink from "../OakLink";

/**
 * We need a simple client-side error header which doesn't use context so that
 * the error boundary can be as high up the tree as possible.
 */
const ClientErrorHeader: FC = () => {
  const theme = useTheme();

  return (
    <FixedHeader $background={theme.header.background}>
      <OakLink page="home">
        <Logo variant="with text" height={48} width={104} />
      </OakLink>
    </FixedHeader>
  );
};

export default ClientErrorHeader;
