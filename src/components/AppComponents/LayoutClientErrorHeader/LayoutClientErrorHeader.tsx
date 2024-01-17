import { FC } from "react";
import { useTheme } from "styled-components";

import LayoutFixedHeader from "@/components/AppComponents/LayoutFixedHeader";
import Logo from "@/components/AppComponents/Logo";
import OakLink from "@/components/SharedComponents/OakLink";

/**
 * We need a simple client-side error header which doesn't use context so that
 * the error boundary can be as high up the tree as possible.
 */
const LayoutClientErrorHeader: FC = () => {
  const theme = useTheme();

  return (
    <LayoutFixedHeader $background={theme.header.background}>
      <OakLink page="home">
        <Logo variant="with text" height={48} width={104} />
      </OakLink>
    </LayoutFixedHeader>
  );
};

export default LayoutClientErrorHeader;
