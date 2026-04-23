import { FC } from "react";
import { OakLink } from "@oaknational/oak-components";

import LayoutFixedHeader from "@/components/AppComponents/LayoutFixedHeader";
import Logo from "@/components/AppComponents/Logo";
import { resolveOakHref } from "@/common-lib/urls";

/**
 * We need a simple client-side error header which doesn't use context so that
 * the error boundary can be as high up the tree as possible.
 */
const LayoutClientErrorHeader: FC = () => {
  return (
    <LayoutFixedHeader $background={"bg-decorative1-subdued"}>
      <OakLink href={resolveOakHref({ page: "home" })}>
        <Logo variant="with text" height={48} width={104} />
      </OakLink>
    </LayoutFixedHeader>
  );
};

export default LayoutClientErrorHeader;
