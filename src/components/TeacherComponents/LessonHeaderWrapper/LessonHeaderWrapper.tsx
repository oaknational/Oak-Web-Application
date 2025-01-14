import { FC } from "react";
import { OakHandDrawnHR, OakBox } from "@oaknational/oak-components";

import Breadcrumbs, {
  Breadcrumb,
} from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";
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
        <OakBox $mt={["space-between-s", "space-between-m"]}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </OakBox>
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
