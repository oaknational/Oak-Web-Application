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
      <OakMaxWidth $ph={"spacing-12"} $mb={"spacing-24"}>
        <OakBox $mt={["spacing-16", "spacing-24"]}>
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </OakBox>
        <OakHandDrawnHR
          hrColor={"bg-primary"}
          $mt={"spacing-16"}
          $mb={"spacing-24"}
          $height={"spacing-4"}
        />
        {children}
      </OakMaxWidth>
    </OakFlex>
  );
};
