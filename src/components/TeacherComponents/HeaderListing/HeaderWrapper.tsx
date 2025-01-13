import { FC } from "react";
import { OakMaxWidth } from "@oaknational/oak-components";

import { Hr } from "@/components/SharedComponents/Typography";
import Breadcrumbs, {
  Breadcrumb,
} from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex.deprecated";
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
      <OakMaxWidth $mb={["space-between-m2", "space-between-xl"]}>
        <Box $mt={[20, 22]}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Box>
        <Hr $color={"white"} $mt={20} $mb={[24, 28]} />
        {children}
      </OakMaxWidth>
    </Flex>
  );
};
