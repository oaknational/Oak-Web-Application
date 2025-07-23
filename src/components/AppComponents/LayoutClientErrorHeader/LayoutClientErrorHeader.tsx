import { FC } from "react";

import LayoutFixedHeader from "@/components/AppComponents/LayoutFixedHeader";
import Logo from "@/components/AppComponents/Logo";
import OwaLink from "@/components/SharedComponents/OwaLink";

/**
 * We need a simple client-side error header which doesn't use context so that
 * the error boundary can be as high up the tree as possible.
 */
const LayoutClientErrorHeader: FC = () => {
  return (
    <LayoutFixedHeader $background={"mint50"}>
      <OwaLink page="home">
        <Logo variant="with text" height={48} width={104} />
      </OwaLink>
    </LayoutFixedHeader>
  );
};

export default LayoutClientErrorHeader;
