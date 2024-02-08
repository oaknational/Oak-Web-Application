import { FC } from "react";

import { Hr } from "@/components/SharedComponents/Typography";
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

export interface LessonHeaderWrapperProps {
  children?: React.ReactNode;
  breadcrumbs: Breadcrumb[];
  background: OakColorName;
}

export const LessonHeaderWrapper: FC<LessonHeaderWrapperProps> = (props) => {
  const { children, breadcrumbs, background } = props;

  return (
    <Flex $flexGrow={1} $background={background}>
      <MaxWidth $ph={12} $mb={[32, 56]}>
        <Box $mt={[20, 22]}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </Box>
        <Hr $color={"white"} $mt={20} $mb={[24, 28]} />
        {children}
      </MaxWidth>
    </Flex>
  );
};
