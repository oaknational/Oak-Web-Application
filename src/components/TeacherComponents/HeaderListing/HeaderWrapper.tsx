import { FC } from "react";
import { OakHandDrawnHR } from "@oaknational/oak-components";

import Breadcrumbs, {
  Breadcrumb,
} from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { OakColorName } from "@/styles/theme";

/**
 * This is a wrapper for the headers on the lesson overview and listing pages.
 *
 */

export interface HeaderWrapperProps {
  children?: React.ReactNode;
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
}

export const HeaderWrapper: FC<HeaderWrapperProps> = (props) => {
  const { children, breadcrumbs, background } = props;

  return (
    <Flex $ph={12} $flexGrow={1} $background={background}>
      <MaxWidth $mb={[32, 56]}>
        <Box $mt={[20, 22]}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Box>
        <OakHandDrawnHR
          hrColor={"white"}
          $mt={"space-between-s"}
          $mb={"space-between-m"}
          $height={"all-spacing-1"}
        />
        {children}
      </MaxWidth>
    </Flex>
  );
};
