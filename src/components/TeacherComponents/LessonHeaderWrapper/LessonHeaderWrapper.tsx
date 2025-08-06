import { FC } from "react";
import {
  OakFlex,
  OakMaxWidth,
  OakHandDrawnHR,
  OakBox,
  OakColorToken,
} from "@oaknational/oak-components";

import Breadcrumbs, {
  Breadcrumb,
} from "@/components/SharedComponents/Breadcrumbs/Breadcrumbs";

/**
 * This is a wrapper for the headers on the lesson overview and listing pages.
 *
 */

export interface LessonHeaderWrapperProps {
  children?: React.ReactNode;
  breadcrumbs: Breadcrumb[];
  background: OakColorToken;
}

export const LessonHeaderWrapper: FC<LessonHeaderWrapperProps> = (props) => {
  const { children, breadcrumbs, background } = props;

  return (
    <OakFlex $flexGrow={1} $background={background}>
      <OakMaxWidth
        $ph={"inner-padding-s"}
        $mb={["space-between-m2", "space-between-xl"]}
      >
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
      </OakMaxWidth>
    </OakFlex>
  );
};
