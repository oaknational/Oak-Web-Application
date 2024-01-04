import { FC } from "react";

import Breadcrumbs, { Breadcrumb } from "../Breadcrumbs";
import { Hr } from "../Typography";

import Box from "@/components/SharedComponents/Box";
import Flex from "@/components/SharedComponents/Flex";
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
        <Hr $color={"white"} $mt={20} $mb={[24, 28]} />
        {children}
      </MaxWidth>
    </Flex>
  );
};
