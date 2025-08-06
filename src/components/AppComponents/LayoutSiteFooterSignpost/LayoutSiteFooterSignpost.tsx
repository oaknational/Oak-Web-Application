import React, { FC } from "react";
import { OakHeading, OakP, OakBox } from "@oaknational/oak-components";

import OwaLink from "@/components/SharedComponents/OwaLink";

const LayoutSiteFooterSignpost: FC = () => {
  return (
    <OakBox>
      <OakHeading tag={"h2"} $font={"heading-7"} $mb="space-between-m">
        Teachers - early access
      </OakHeading>
      <OakP $font={["body-2", "body-1"]}>
        You're using our new area for teachers, currently under development and
        testing. To contact us with questions or feedback use our feedback tool
        at the bottom right corner of the screen (look for the question mark) or
        email{" "}
        <OwaLink $isInline page={null} href={"mailto:help@thenational.academy"}>
          help@thenational.academy
        </OwaLink>
      </OakP>
    </OakBox>
  );
};

export default LayoutSiteFooterSignpost;
